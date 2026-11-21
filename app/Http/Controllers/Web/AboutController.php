<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /** The GitHub repository whose contributors the About page credits. */
    private const REPO = 'hadealahmad/wasfatna';

    /** Maximum number of community recipe contributors displayed on the About page. */
    private const MAX_COMMUNITY_CONTRIBUTORS = 24;

    public function index(): Response
    {
        $community = $this->communityStats();

        return Inertia::render('About', [
            'contributors' => $this->contributors(),
            'communityContributors' => $community['contributors'],
            'stats' => $community['stats'],
        ]);
    }

    /**
     * Fetch the repository's GitHub contributors, excluding bots.
     *
     * Cached for an hour: the list changes slowly and the unauthenticated
     * GitHub API allows only 60 calls an hour, so one call serves every visit.
     * Any failure (offline, rate limited) yields an empty list and the page
     * simply omits the section.
     *
     * @return list<array{login: string, avatar: string, url: string, contributions: int}>
     */
    private function contributors(): array
    {
        return Cache::remember('github:contributors:'.self::REPO, 3600, function (): array {
            try {
                $response = Http::withHeaders([
                    'Accept' => 'application/vnd.github+json',
                    'User-Agent' => 'wasfatna',
                ])->timeout(8)->get('https://api.github.com/repos/'.self::REPO.'/contributors', [
                    'per_page' => 100,
                    'anon' => 0,
                ]);

                if (! $response->ok()) {
                    return [];
                }

                $payload = $response->json();

                if (! is_array($payload)) {
                    return [];
                }

                return collect($payload)
                    ->filter(fn ($contributor) => is_array($contributor)
                        && ($contributor['type'] ?? 'User') === 'User'
                        && ! empty($contributor['login'])
                        && ! str_ends_with((string) $contributor['login'], '[bot]'))
                    ->map(fn (array $contributor) => [
                        'login' => (string) $contributor['login'],
                        'avatar' => (string) ($contributor['avatar_url'] ?? ''),
                        'url' => (string) ($contributor['html_url'] ?? ''),
                        'contributions' => (int) ($contributor['contributions'] ?? 0),
                    ])
                    ->values()
                    ->all();
            } catch (\Throwable $e) {
                Log::warning('GitHub contributors fetch failed', ['error' => $e->getMessage()]);

                return [];
            }
        });
    }

    /**
     * Compute top community recipe contributors and approved-recipe totals.
     *
     * Excludes banned accounts and anonymous-attributed recipes so every
     * profile shown links to an active community cook.
     *
     * @return array{
     *     contributors: list<array{id: int, name: string, avatar_url: ?string, recipes_count: int}>,
     *     stats: array{approved_recipes: int, contributing_cooks: int}
     * }
     */
    private function communityStats(): array
    {
        return Cache::remember('about:community-stats', 3600, function (): array {
            $approvedOwnedScope = fn ($query) => $query
                ->where('status', 'approved')
                ->where('is_anonymous', false);

            $contributors = User::query()
                ->where('is_banned', false)
                ->whereHas('recipes', $approvedOwnedScope)
                ->withCount(['recipes as approved_recipes_count' => $approvedOwnedScope])
                ->orderByDesc('approved_recipes_count')
                ->orderBy('id')
                ->limit(self::MAX_COMMUNITY_CONTRIBUTORS)
                ->get(['id', 'name', 'display_name', 'avatar'])
                ->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->display_name,
                    'avatar_url' => $user->avatar_url,
                    'recipes_count' => (int) $user->approved_recipes_count,
                ])
                ->values()
                ->all();

            $approvedRecipesCount = Recipe::query()
                ->where('status', 'approved')
                ->count();

            $contributingCooksCount = User::query()
                ->where('is_banned', false)
                ->whereHas('recipes', $approvedOwnedScope)
                ->count();

            return [
                'contributors' => $contributors,
                'stats' => [
                    'approved_recipes' => $approvedRecipesCount,
                    'contributing_cooks' => $contributingCooksCount,
                ],
            ];
        });
    }
}
