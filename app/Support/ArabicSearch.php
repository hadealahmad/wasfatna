<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;

/**
 * Normalises Arabic text variants (hamza forms, ta marbuta, alif maqsura,
 * diacritics and tatweel) so searches match regardless of spelling variant.
 *
 * Mirrors `resources/js/lib/arabic.ts` on the client.
 */
final class ArabicSearch
{
    /**
     * Fold `$text` to its canonical search form: lowercase, trimmed, without
     * diacritics/tatweel, and with unified Arabic letter variants.
     */
    public static function fold(string $text): string
    {
        $folded = mb_strtolower(trim($text));
        if ($folded === '') {
            return '';
        }

        // Strip Arabic diacritics (harakat/tashkeel) and tatweel.
        $folded = (string) preg_replace('/[\x{064B}-\x{065F}\x{0670}\x{0640}]/u', '', $folded);

        // Unify hamza, ta marbuta, and alif maqsura variants.
        $folded = str_replace(
            ['أ', 'إ', 'آ', 'ٱ', 'ة', 'ى', 'ؤ', 'ئ'],
            ['ا', 'ا', 'ا', 'ا', 'ه', 'ي', 'و', 'ي'],
            $folded,
        );

        $folded = str_replace(["'", '`', '’', '‘'], '', $folded);
        $folded = (string) preg_replace('/[\-‐‑‒–—―]/u', ' ', $folded);

        return (string) preg_replace('/\s+/u', ' ', $folded);
    }

    /**
     * Build a portable SQL expression (SQLite & MySQL) that folds a column's
     * Arabic spelling variants and common diacritics for LIKE comparisons.
     */
    public static function sqlFoldExpression(string $column): string
    {
        // Basic safeguard: only allow simple column/table.column identifiers.
        if (! preg_match('/^[a-zA-Z0-9_.]+$/', $column)) {
            throw new \InvalidArgumentException("Invalid column identifier: {$column}");
        }

        $expr = "LOWER({$column})";

        $stripChars = ['َ', 'ً', 'ُ', 'ٌ', 'ِ', 'ٍ', 'ْ', 'ّ', 'ٰ', 'ـ'];
        foreach ($stripChars as $char) {
            $expr = "REPLACE({$expr}, '{$char}', '')";
        }

        $foldMap = [
            'أ' => 'ا',
            'إ' => 'ا',
            'آ' => 'ا',
            'ٱ' => 'ا',
            'ة' => 'ه',
            'ى' => 'ي',
            'ؤ' => 'و',
            'ئ' => 'ي',
        ];
        foreach ($foldMap as $from => $to) {
            $expr = "REPLACE({$expr}, '{$from}', '{$to}')";
        }

        return $expr;
    }

    /**
     * Apply a case- and Arabic-variant-insensitive LIKE condition on `$column`.
     */
    public static function whereLikeFolded(Builder $query, string $column, string $search, bool $or = false): void
    {
        $raw = trim($search);
        if ($raw === '') {
            return;
        }

        $folded = self::fold($raw);
        $rawLike = '%'.addcslashes(mb_strtolower($raw), '%_\\').'%';
        $foldLike = '%'.addcslashes($folded === '' ? mb_strtolower($raw) : $folded, '%_\\').'%';
        $foldedExpr = self::sqlFoldExpression($column);

        $method = $or ? 'orWhere' : 'where';
        $query->{$method}(function (Builder $sub) use ($column, $rawLike, $foldedExpr, $foldLike) {
            $sub->whereRaw("LOWER({$column}) LIKE ?", [$rawLike])
                ->orWhereRaw("{$foldedExpr} LIKE ?", [$foldLike]);
        });
    }
}
