<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Recipe;
use App\Models\RecipeList;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    public function index()
    {
        $xml = Cache::remember('sitemap_xml', 3600, function () {
            $baseUrl = rtrim(config('app.url', 'https://food.syrian.zone'), '/');

            $staticPaths = [
                ['path' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
                ['path' => '/recipes', 'priority' => '0.9', 'changefreq' => 'daily'],
                ['path' => '/cities', 'priority' => '0.8', 'changefreq' => 'weekly'],
                ['path' => '/lists', 'priority' => '0.7', 'changefreq' => 'weekly'],
                ['path' => '/meal-plans/browse', 'priority' => '0.7', 'changefreq' => 'weekly'],
                ['path' => '/about', 'priority' => '0.6', 'changefreq' => 'monthly'],
                ['path' => '/privacy', 'priority' => '0.3', 'changefreq' => 'yearly'],
                ['path' => '/terms', 'priority' => '0.3', 'changefreq' => 'yearly'],
            ];

            $recipes = Recipe::where('status', 'approved')
                ->select('slug', 'updated_at')
                ->latest('updated_at')
                ->get();

            $cities = City::select('slug', 'updated_at')->get();

            $lists = RecipeList::query()
                ->where('is_public', true)
                ->where('status', 'approved')
                ->select('id', 'updated_at')
                ->latest('updated_at')
                ->get();

            $approvedOwnedScope = fn ($q) => $q
                ->where('status', 'approved')
                ->where('is_anonymous', false);

            $users = User::query()
                ->where('is_banned', false)
                ->whereHas('recipes', $approvedOwnedScope)
                ->select('id', 'updated_at')
                ->get();

            $lines = [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ];

            foreach ($staticPaths as $static) {
                $loc = htmlspecialchars($baseUrl.$static['path'], ENT_XML1);
                $lines[] = '  <url>';
                $lines[] = "    <loc>{$loc}</loc>";
                $lines[] = "    <changefreq>{$static['changefreq']}</changefreq>";
                $lines[] = "    <priority>{$static['priority']}</priority>";
                $lines[] = '  </url>';
            }

            foreach ($cities as $city) {
                $loc = htmlspecialchars($baseUrl.'/cities/'.rawurlencode($city->slug), ENT_XML1);
                $lastmod = ($city->updated_at ?? now())->toAtomString();
                $lines[] = '  <url>';
                $lines[] = "    <loc>{$loc}</loc>";
                $lines[] = "    <lastmod>{$lastmod}</lastmod>";
                $lines[] = '    <changefreq>weekly</changefreq>';
                $lines[] = '    <priority>0.8</priority>';
                $lines[] = '  </url>';
            }

            foreach ($recipes as $recipe) {
                $loc = htmlspecialchars($baseUrl.'/recipes/'.rawurlencode($recipe->slug), ENT_XML1);
                $lastmod = ($recipe->updated_at ?? now())->toAtomString();
                $lines[] = '  <url>';
                $lines[] = "    <loc>{$loc}</loc>";
                $lines[] = "    <lastmod>{$lastmod}</lastmod>";
                $lines[] = '    <changefreq>monthly</changefreq>';
                $lines[] = '    <priority>0.8</priority>';
                $lines[] = '  </url>';
            }

            foreach ($lists as $list) {
                $loc = htmlspecialchars($baseUrl.'/lists/'.$list->id, ENT_XML1);
                $lastmod = ($list->updated_at ?? now())->toAtomString();
                $lines[] = '  <url>';
                $lines[] = "    <loc>{$loc}</loc>";
                $lines[] = "    <lastmod>{$lastmod}</lastmod>";
                $lines[] = '    <changefreq>weekly</changefreq>';
                $lines[] = '    <priority>0.6</priority>';
                $lines[] = '  </url>';
            }

            foreach ($users as $user) {
                $loc = htmlspecialchars($baseUrl.'/users/'.$user->id, ENT_XML1);
                $lastmod = ($user->updated_at ?? now())->toAtomString();
                $lines[] = '  <url>';
                $lines[] = "    <loc>{$loc}</loc>";
                $lines[] = "    <lastmod>{$lastmod}</lastmod>";
                $lines[] = '    <changefreq>weekly</changefreq>';
                $lines[] = '    <priority>0.5</priority>';
                $lines[] = '  </url>';
            }

            $lines[] = '</urlset>';

            return implode("\n", $lines);
        });

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
