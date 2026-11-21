/**
 * Fold Arabic spelling variants people mix when typing (hamza forms,
 * ta marbuta, alif maqsura, waw/yaa hamza, diacritics and tatweel) so searches
 * match «احمد» against «أحمد» and «كبه» against «كبة».
 *
 * Mirrors `App\Support\ArabicSearch::fold()` on the server.
 */
export function normalizeArabic(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/['`’‘]/g, '')
    .replace(/[-‐‑‒–—―]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Tokenised Arabic-normalised search helper: every whitespace token in `query`
 * must appear somewhere across the combined `targets`.
 */
export function matchesArabicSearch(
  query: string,
  ...targets: Array<string | undefined | null>
): boolean {
  const normalizedQuery = normalizeArabic(query);
  if (!normalizedQuery) return true;

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const haystack = targets
    .filter(Boolean)
    .map((target) => normalizeArabic(String(target)))
    .join(' ');

  return tokens.every((token) => haystack.includes(token));
}
