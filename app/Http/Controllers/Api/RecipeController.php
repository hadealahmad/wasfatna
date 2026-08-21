<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Recipe;
use App\Models\RecipeRevision;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    public function __construct(
        private ImageService $imageService
    ) {}

    /**
     * List approved recipes with pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Recipe::approved()
            ->with(['city', 'user', 'anonymousAuthor', 'tags']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhereHas('city', fn ($c) => $c->where('name', 'LIKE', "%{$search}%"));
            });
        }

        // Filter by city
        if ($request->filled('city')) {
            $query->where('city_id', $request->city);
        }

        // Filter by difficulty
        if ($request->filled('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        // Filter by tags
        if ($request->filled('tags')) {
            $tags = is_array($request->tags) ? $request->tags : [$request->tags];
            $query->whereHas('tags', function ($q) use ($tags) {
                $q->whereIn('slug', $tags);
            });
        }

        $recipes = $query->latest()->paginate(12);

        return response()->json([
            'recipes' => $recipes->getCollection()->map(fn ($r) => $this->formatRecipeCard($r))->values(),
            'pagination' => [
                'current_page' => $recipes->currentPage(),
                'last_page' => $recipes->lastPage(),
                'total' => $recipes->total(),
            ],
        ]);
    }

    /**
     * Get a single recipe by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $recipe = Recipe::where('slug', $slug)
            ->with(['city', 'user', 'anonymousAuthor', 'ingredients', 'tags'])
            ->firstOrFail();

        // Check visibility
        if (! $recipe->isApproved()) {
            $user = request()->user('sanctum');
            $canView = $user && ($user->id === $recipe->user_id || $user->canApproveRecipes());

            if (! $canView) {
                // If not authorized to see pending, check if it was approved (it wasn't, so 404)
                abort(404);
            }
        }

        // Get similar recipes by name
        $similarByName = $recipe->getSimilarByName();

        // Get similar recipes by ingredients
        $similarByIngredients = $recipe->getSimilarByIngredients();

        return response()->json([
            'recipe' => $this->formatRecipeFull($recipe),
            'has_variations' => $similarByName->count() > 0,
            'variations_count' => $similarByName->count(),
            'similar_recipes' => $similarByIngredients->map(fn ($r) => $this->formatRecipeCard($r)),
        ]);
    }

    /**
     * Get all variations of a recipe by name.
     */
    public function variations(string $slug): JsonResponse
    {
        $recipe = Recipe::where('slug', $slug)->firstOrFail();

        // Check visibility if not approved
        if (! $recipe->isApproved()) {
            $user = request()->user('sanctum');
            $canView = $user && ($user->id === $recipe->user_id || $user->canApproveRecipes());

            if (! $canView) {
                abort(404);
            }
        }

        $variations = Recipe::where('name', $recipe->name)
            ->approved()
            ->with(['city', 'user', 'anonymousAuthor'])
            ->get();

        return response()->json([
            'dish_name' => $recipe->name,
            'recipes' => $variations->map(fn ($r) => $this->formatRecipeCard($r)),
        ]);
    }

    /**
     * Store a new recipe (user must be authenticated).
     */
    public function store(Request $request): JsonResponse
    {
        $this->decodeJsonFields($request);

        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:10240', // 10MB max input
            'time_needed' => 'nullable|array',
            'servings' => 'nullable|string|max:100',
            'city_id' => 'nullable|exists:cities,id',
            'ingredients' => 'required|array',
            'steps' => 'required|array',
            'difficulty' => 'required|in:سهلة جداً,سهلة,متوسطة,صعبة,صعبة جداً',
            'is_anonymous' => 'boolean',
            'anonymous_author_id' => 'nullable|exists:anonymous_authors,id',
            'user_id' => 'nullable|exists:users,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $user = $request->user();
        $imagePath = null;

        // Process image
        if ($request->hasFile('image')) {
            $result = $this->imageService->processAndStore($request->file('image'));
            if (! $result['success']) {
                return response()->json(['error' => $result['error']], 422);
            }
            $imagePath = $result['path'];
        }

        // Determine status based on user role
        $status = $user->canApproveRecipes() ? 'approved' : 'pending';
        $approvedBy = $user->canApproveRecipes() ? $user->id : null;
        $approvedAt = $user->canApproveRecipes() ? now() : null;

        // Handle manual anonymous author (Admin only)
        $anonymousAuthorId = $request->anonymous_author_id;
        $isAnonymous = $request->is_anonymous ?? false;
        $userId = ($user->canApproveRecipes() && $request->filled('user_id')) ? $request->user_id : $user->id;

        if ($user->canApproveRecipes() && $request->filled('manual_author_name')) {
            $author = \App\Models\AnonymousAuthor::firstOrCreate(
                ['name' => $request->manual_author_name]
            );
            $anonymousAuthorId = $author->id;
            $isAnonymous = true;
            $userId = null;
        } elseif ($isAnonymous) {
            $userId = null;
        }

        $recipe = Recipe::create([
            'name' => $request->name,
            'image_path' => $imagePath,
            'time_needed' => $request->time_needed,
            'servings' => $request->servings,
            'city_id' => $request->city_id,
            'user_id' => $userId,
            'anonymous_author_id' => $anonymousAuthorId,
            'is_anonymous' => $isAnonymous,
            // 'ingredients' => $request->ingredients, // REMOVED: Stored in pivot table
            'steps' => $request->steps,
            'difficulty' => $request->difficulty,
        ]);
        // Moderation fields are privileged — set explicitly, not via mass assignment
        $recipe->forceFill([
            'status' => $status,
            'approved_by' => $approvedBy,
            'approved_at' => $approvedAt,
        ])->save();

        // Link ingredients with structured data
        $this->syncIngredients($recipe, $request->ingredients);

        // Sync tags
        if ($request->has('tags')) {
            $this->syncTags($recipe, $request->tags);
        }

        // Save initial revision
        $this->saveRevision($recipe, $user->id, 'Initial creation');

        return response()->json([
            'recipe' => $this->formatRecipeFull($recipe),
            'message' => $status === 'approved'
                ? 'تم نشر الوصفة'
                : 'تم إرسال الوصفة للمراجعة',
        ], 201);
    }

    /**
     * Update a recipe.
     */
    public function update(Request $request, Recipe $recipe): JsonResponse
    {
        $this->decodeJsonFields($request);

        $user = $request->user();

        // Check ownership or permission
        if ($recipe->user_id !== $user->id && ! $user->canApproveRecipes()) {
            return response()->json(['error' => 'غير مصرح'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'image' => 'nullable|image|max:10240', // 10MB max input
            'time_needed' => 'nullable|array',
            'servings' => 'nullable|string|max:100',
            'city_id' => 'nullable|exists:cities,id',
            'ingredients' => 'sometimes|array',
            'steps' => 'sometimes|array',
            'difficulty' => 'sometimes|in:سهلة جداً,سهلة,متوسطة,صعبة,صعبة جداً',
            'user_id' => 'nullable|exists:users,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $data = $request->only([
            'name', 'time_needed', 'servings', 'city_id',
            'steps', 'difficulty',
            // 'ingredients' is handled separately via pivot
        ]);

        if ($user->canApproveRecipes()) {
            if ($request->filled('manual_author_name')) {
                $author = \App\Models\AnonymousAuthor::firstOrCreate(
                    ['name' => $request->manual_author_name]
                );
                $data['anonymous_author_id'] = $author->id;
                $data['is_anonymous'] = true;
                $data['user_id'] = null;
            } elseif ($request->filled('user_id')) {
                $data['user_id'] = $request->user_id;
                $data['is_anonymous'] = false;
                $data['anonymous_author_id'] = null;
            }
        }

        // Process new image
        if ($request->hasFile('image')) {
            // Delete old image
            if ($recipe->image_path) {
                $this->imageService->delete($recipe->image_path);
            }

            $result = $this->imageService->processAndStore($request->file('image'));
            if (! $result['success']) {
                return response()->json(['error' => $result['error']], 422);
            }
            $data['image_path'] = $result['path'];
        }

        // Check if needs reapproval (regular users editing approved recipes)
        if ($recipe->isApproved() && ! $user->canApproveRecipes()) {
            $recipe->forceFill([
                'needs_reapproval' => true,
                'status' => 'pending',
            ])->save();
        }

        $recipe->update($data);

        // Update ingredients if changed
        if ($request->has('ingredients')) {
            $this->syncIngredients($recipe, $request->ingredients);
        }

        // Sync tags
        if ($request->has('tags')) {
            $this->syncTags($recipe, $request->tags);
        }

        // Save revision
        $this->saveRevision($recipe, $user->id, 'Update');

        return response()->json([
            'recipe' => $this->formatRecipeFull($recipe),
            'message' => $recipe->needs_reapproval
                ? 'تم تعديل الوصفة وإرسالها للمراجعة مجدداً'
                : 'تم تحديث الوصفة',
        ]);
    }

    /**
     * Delete a recipe (admin only).
     */
    public function destroy(Request $request, Recipe $recipe): JsonResponse
    {
        $user = $request->user();

        if (! $user->canDeleteRecipes()) {
            return response()->json(['error' => 'غير مصرح بالحذف'], 403);
        }

        // Delete image
        if ($recipe->image_path) {
            $this->imageService->delete($recipe->image_path);
        }

        $recipe->delete();

        return response()->json([
            'message' => 'تم حذف الوصفة',
        ]);
    }

    /**
     * Unpublish a user's own recipe.
     */
    public function unpublish(Request $request, Recipe $recipe): JsonResponse
    {
        $user = $request->user();

        if ($recipe->user_id !== $user->id) {
            return response()->json(['error' => 'غير مصرح'], 403);
        }

        $recipe->forceFill(['status' => 'unpublished'])->save();

        return response()->json([
            'message' => 'تم إلغاء نشر الوصفة',
            'recipe' => $this->formatRecipeFull($recipe->fresh()),
        ]);
    }

    /**
     * Get user's own recipes.
     */
    public function myRecipes(Request $request): JsonResponse
    {
        $recipes = Recipe::where('user_id', $request->user()->id)
            ->with(['city'])
            ->latest()
            ->paginate(12);

        return response()->json([
            'recipes' => $recipes->getCollection()->map(fn ($r) => [
                ...$this->formatRecipeCard($r),
                'status' => $r->status,
                'needs_reapproval' => $r->needs_reapproval,
            ])->values(),
            'pagination' => [
                'current_page' => $recipes->currentPage(),
                'last_page' => $recipes->lastPage(),
                'total' => $recipes->total(),
            ],
        ]);
    }

    /**
     * Get revision history for a recipe.
     */
    public function history(Request $request, Recipe $recipe): JsonResponse
    {
        $user = $request->user();

        // Check permission (owner or admin/moderator)
        if ($recipe->user_id !== $user->id && ! $user->canApproveRecipes()) {
            return response()->json(['error' => 'غير مصرح'], 403);
        }

        $revisions = $recipe->revisions()
            ->with(['user:id,name'])
            ->latest()
            ->get()
            ->map(function ($rev) {
                return [
                    'id' => $rev->id,
                    'user_name' => $rev->user ? ($rev->user->display_name ?? $rev->user->name) : 'Unknown',
                    'change_summary' => $rev->change_summary,
                    'created_at' => $rev->created_at,
                    'content' => $rev->content,
                    'is_auto_save' => false, // Placeholder if we add auto-save later
                ];
            });

        return response()->json([
            'revisions' => $revisions,
        ]);
    }

    /**
     * Clear revision history for a recipe.
     */
    public function clearHistory(Request $request, Recipe $recipe): JsonResponse
    {
        $user = $request->user();

        // Check permission (owner only? or admin too? Let's say owner or admin)
        if ($recipe->user_id !== $user->id && ! $user->canDeleteRecipes()) {
            return response()->json(['error' => 'غير مصرح'], 403);
        }

        $recipe->revisions()->delete();

        return response()->json([
            'message' => 'تم مسح سجل التعديلات',
        ]);
    }

    /**
     * Save a revision snapshot.
     */
    private function saveRevision(Recipe $recipe, ?int $userId, string $summary): void
    {
        // Load relationships to include in snapshot
        $recipe->load(['ingredients', 'tags', 'city', 'anonymousAuthor']);

        // Create snapshot data
        $snapshot = $this->formatRecipeFull($recipe);

        RecipeRevision::create([
            'recipe_id' => $recipe->id,
            'user_id' => $userId,
            'content' => $snapshot,
            'change_summary' => $summary,
        ]);
    }

    /**
     * Decode JSON fields from request if they are strings.
     */
    private function decodeJsonFields(Request $request): void
    {
        $fields = ['ingredients', 'steps', 'time_needed', 'tags'];
        $data = [];

        foreach ($fields as $field) {
            if ($request->has($field) && is_string($request->$field)) {
                $decoded = json_decode($request->$field, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $data[$field] = $decoded;
                }
            }
        }

        if (! empty($data)) {
            $request->merge($data);
        }
    }

    /**
     * Sync ingredients with detailed pivot data.
     * Supports both grouped (assoc array) and flat lists.
     */
    private function syncIngredients(Recipe $recipe, array $ingredients): void
    {
        app(\App\Services\IngredientSyncService::class)->sync($recipe, $ingredients);
    }

    /**
     * Sync tags for the recipe.
     */
    private function syncTags(Recipe $recipe, array $tags): void
    {
        $tagIds = [];
        foreach ($tags as $tagName) {
            $tag = \App\Models\Tag::firstOrCreate(
                ['name' => $tagName]
            );
            $tagIds[] = $tag->id;
        }
        $recipe->tags()->sync($tagIds);
    }

    /**
     * Format ingredients for display (returns separate fields).
     */
    private function formatIngredientsForDisplay($ingredients)
    {
        return $ingredients->map(function ($ingredient) {
            return [
                'name' => $ingredient->name,
                'amount' => $ingredient->pivot->amount,
                'unit' => $ingredient->pivot->unit,
                'descriptor' => $ingredient->pivot->ingredient_descriptor,
                'group' => $ingredient->pivot->group,
            ];
        })->values();
    }

    /**
     * Format recipe for card display.
     */
    private function formatRecipeCard(Recipe $recipe): array
    {
        return [
            'id' => $recipe->id,
            'name' => $recipe->name,
            'slug' => $recipe->slug,
            'image_url' => $recipe->image_path
                ? asset('storage/'.$recipe->image_path)
                : null,
            'city' => $recipe->city?->name,
            'city_slug' => $recipe->city?->slug,
            'time_needed' => $recipe->time_needed,
            'difficulty' => $recipe->difficulty,
            'author_name' => $recipe->author_name,
            'tags' => $recipe->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug]),
        ];
    }

    /**
     * Format recipe for full display.
     */
    private function formatRecipeFull(Recipe $recipe): array
    {
        return [
            ...$this->formatRecipeCard($recipe),
            'servings' => $recipe->servings,
            'ingredients' => $this->formatIngredientsForDisplay($recipe->ingredients),
            'steps' => $recipe->steps,
            'is_anonymous' => $recipe->is_anonymous,
            'user' => $recipe->user ? [
                'id' => $recipe->user->id,
                'name' => $recipe->user->display_name ?? $recipe->user->name,
                'avatar' => $recipe->user->avatar,
            ] : null,
            'created_at' => $recipe->created_at,
            'updated_at' => $recipe->updated_at,
            'status' => $recipe->status,
        ];
    }
}
