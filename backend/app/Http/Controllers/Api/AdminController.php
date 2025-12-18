<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\User;
use App\Models\City;
use App\Models\AnonymousAuthor;
use App\Models\Ingredient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    /**
     * Dashboard statistics.
     */
    public function dashboard(): JsonResponse
    {
        return response()->json([
            'stats' => [
                'total_recipes' => Recipe::count(),
                'approved_recipes' => Recipe::approved()->count(),
                'pending_recipes' => Recipe::pending()->count(),
                'needs_reapproval' => Recipe::needsReapproval()->count(),
                'total_users' => User::count(),
                'active_users' => User::where('is_banned', false)->count(),
                'deletion_requests' => User::where('deletion_requested', true)->count(),
                'total_cities' => City::count(),
                'total_ingredients' => Ingredient::count(),
            ],
        ]);
    }

    // ==================== RECIPE MANAGEMENT ====================

    /**
     * List pending recipes for approval.
     */
    public function pendingRecipes(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 100); // Cap at 100

        $recipes = Recipe::pending()
            ->orWhere('needs_reapproval', true)
            ->with(['city', 'user', 'anonymousAuthor', 'tags'])
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'recipes' => $recipes->through(fn($r) => $this->formatAdminRecipe($r)),
            'pagination' => [
                'current_page' => $recipes->currentPage(),
                'last_page' => $recipes->lastPage(),
                'total' => $recipes->total(),
                'per_page' => $recipes->perPage(),
            ],
        ]);
    }

    /**
     * List all recipes for admin.
     */
    public function allRecipes(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 100);

        $query = Recipe::with(['city', 'user', 'anonymousAuthor', 'approver', 'tags'])
            ->withCount('tags');

        // Filter by status (can be comma-separated or array)
        if ($request->filled('status')) {
            $statuses = is_array($request->status) ? $request->status : explode(',', $request->status);
            
            $query->where(function ($q) use ($statuses) {
                $q->whereIn('status', $statuses);
                
                // Special case for "awaiting_approval" if we treat it as a status, 
                // but usually it's status=pending or needs_reapproval=true.
                // If the frontend sends 'pending', it matches status=pending.
                // If we want to include needs_reapproval when filtering for pending:
                if (in_array('pending', $statuses)) {
                    $q->orWhere('needs_reapproval', true);
                }
            });
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->search}%")
                  ->orWhereHas('user', function ($subQ) use ($request) {
                      $subQ->where('name', 'LIKE', "%{$request->search}%");
                  });
            });
        }

        // Sorting
        $sortColumn = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_dir', 'desc');
        
        // Allowable sort columns to prevent SQL injection
        $allowedSorts = ['name', 'created_at', 'status', 'approved_at', 'tags_count'];
        if (in_array($sortColumn, $allowedSorts)) {
            $query->orderBy($sortColumn, $sortDirection);
        } else {
            $query->latest();
        }

        $recipes = $query->paginate($perPage);

        return response()->json([
            'recipes' => $recipes->through(fn($r) => $this->formatAdminRecipe($r)),
            'pagination' => [
                'current_page' => $recipes->currentPage(),
                'last_page' => $recipes->lastPage(),
                'total' => $recipes->total(),
                'per_page' => $recipes->perPage(),
            ],
        ]);
    }

    /**
     * Approve a recipe.
     */
    public function approveRecipe(Request $request, Recipe $recipe): JsonResponse
    {
        $recipe->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'needs_reapproval' => false,
            'rejection_reason' => null,
        ]);

        return response()->json([
            'message' => 'تمت الموافقة على الوصفة',
            'recipe' => $this->formatAdminRecipe($recipe->fresh()),
        ]);
    }

    /**
     * Reject a recipe.
     */
    public function rejectRecipe(Request $request, Recipe $recipe): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $recipe->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        return response()->json([
            'message' => 'تم رفض الوصفة',
            'recipe' => $this->formatAdminRecipe($recipe->fresh()),
        ]);
    }

    /**
     * Unpublish a recipe (moderator can do this).
     */
    public function unpublishRecipe(Request $request, Recipe $recipe): JsonResponse
    {
        try {
            $recipe->update([
                'status' => 'unpublished',
            ]);

            return response()->json([
                'message' => 'تم إلغاء نشر الوصفة',
                'recipe' => $this->formatAdminRecipe($recipe->fresh(['user', 'city', 'anonymousAuthor', 'approver'])),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Unpublish error: ' . $e->getMessage());
            return response()->json([
                'error' => 'فشل إلغاء نشر الوصفة: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk actions for recipes.
     */
    public function bulkRecipeActions(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:recipes,id',
            'action' => 'required|in:delete,publish,unpublish,change_status',
            'status' => 'required_if:action,change_status|in:approved,unpublished,pending,rejected',
        ]);

        $ids = $request->ids;
        $action = $request->action;

        try {
            switch ($action) {
                case 'delete':
                    // check permission for delete? Admin only probably.
                    if (!$request->user()->isAdmin()) {
                        return response()->json(['error' => 'غير مصرح لك بحذف الوصفات'], 403);
                    }
                    Recipe::whereIn('id', $ids)->delete();
                    $message = 'تم حذف الوصفات المحددة';
                    break;

                case 'publish':
                    Recipe::whereIn('id', $ids)->update([
                        'status' => 'approved',
                        'approved_by' => $request->user()->id,
                        'approved_at' => now(),
                        'needs_reapproval' => false,
                        'rejection_reason' => null,
                    ]);
                    $message = 'تم نشر الوصفات المحددة';
                    break;

                case 'unpublish':
                    Recipe::whereIn('id', $ids)->update(['status' => 'unpublished']);
                    $message = 'تم إلغاء نشر الوصفات المحددة';
                    break;
                
                case 'change_status':
                     $updateData = ['status' => $request->status];
                     if ($request->status === 'approved') {
                         $updateData['approved_by'] = $request->user()->id;
                         $updateData['approved_at'] = now();
                         $updateData['needs_reapproval'] = false;
                         $updateData['rejection_reason'] = null;
                     }
                     Recipe::whereIn('id', $ids)->update($updateData);
                     $message = 'تم تغيير حالة الوصفات المحددة';
                     break;

                default:
                    return response()->json(['error' => 'إجراء غير معروف'], 400);
            }

            return response()->json(['message' => $message]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'حدث خطأ أثناء تنفيذ الإجراء: ' . $e->getMessage()], 500);
        }
    }

    // ==================== USER MANAGEMENT ====================

    /**
     * List all users.
     */
    public function users(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 100);

        $query = User::withCount('recipes');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->search}%")
                  ->orWhere('email', 'LIKE', "%{$request->search}%");
            });
        }
        
        $sortColumn = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_dir', 'desc');
        $allowedSorts = ['name', 'email', 'role', 'recipes_count', 'created_at'];

        if (in_array($sortColumn, $allowedSorts)) {
             $query->orderBy($sortColumn, $sortDirection);
        } else {
             $query->latest();
        }

        $users = $query->paginate($perPage);

        return response()->json([
            'users' => $users->through(fn($u) => $this->formatAdminUser($u)),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
                'per_page' => $users->perPage(),
            ],
        ]);
    }

    /**
     * Get users with deletion requests.
     */
    public function deletionRequests(): JsonResponse
    {
        $users = User::where('deletion_requested', true)
            ->withCount('recipes')
            ->latest('deletion_requested_at')
            ->get();

        return response()->json([
            'users' => $users->map(fn($u) => [
                ...$this->formatAdminUser($u),
                'deletion_requested_at' => $u->deletion_requested_at,
            ]),
        ]);
    }

    /**
     * Update user role.
     */
    public function updateUserRole(Request $request, User $user): JsonResponse
    {
        // Only admin can change roles
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'غير مصرح'], 403);
        }

        // Cannot demote superadmin
        if ($user->email === 'hade.alahmad1@gmail.com' && $request->role !== 'admin') {
            return response()->json(['error' => 'لا يمكن تقليل صلاحيات المشرف الرئيسي'], 403);
        }

        $request->validate([
            'role' => 'required|in:admin,moderator,user',
        ]);

        $user->update(['role' => $request->role]);

        return response()->json([
            'message' => 'تم تحديث صلاحيات المستخدم',
            'user' => $this->formatAdminUser($user->fresh()),
        ]);
    }

    /**
     * Ban a user.
     */
    public function banUser(Request $request, User $user): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'غير مصرح'], 403);
        }

        // Cannot ban other admins
        if ($user->isAdmin()) {
            return response()->json(['error' => 'لا يمكن حظر مسؤول'], 403);
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $user->update([
            'is_banned' => true,
            'ban_reason' => $request->reason,
            'banned_at' => now(),
        ]);

        // Revoke all tokens
        $user->tokens()->delete();

        return response()->json([
            'message' => 'تم حظر المستخدم',
            'user' => $this->formatAdminUser($user->fresh()),
        ]);
    }

    /**
     * Unban a user.
     */
    public function unbanUser(Request $request, User $user): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'غير مصرح'], 403);
        }

        $user->update([
            'is_banned' => false,
            'ban_reason' => null,
            'banned_at' => null,
        ]);

        return response()->json([
            'message' => 'تم إلغاء حظر المستخدم',
            'user' => $this->formatAdminUser($user->fresh()),
        ]);
    }

    /**
     * Approve user deletion and optionally transfer recipes.
     */
    public function deleteUser(Request $request, User $user): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'غير مصرح'], 403);
        }

        $request->validate([
            'transfer_to_user_id' => 'nullable|exists:users,id',
            'transfer_to_anonymous_id' => 'nullable|exists:anonymous_authors,id',
        ]);

        // Transfer recipes if specified
        if ($request->transfer_to_user_id) {
            $user->recipes()->update(['user_id' => $request->transfer_to_user_id]);
        } elseif ($request->transfer_to_anonymous_id) {
            $user->recipes()->update([
                'user_id' => null,
                'anonymous_author_id' => $request->transfer_to_anonymous_id,
                'is_anonymous' => true,
            ]);
        }

        // Delete tokens
        $user->tokens()->delete();

        // Delete user
        $user->delete();

        return response()->json([
            'message' => 'تم حذف المستخدم',
        ]);
    }

    // ==================== CITY MANAGEMENT ====================

    /**
     * List all cities for admin.
     */
    /**
     * List all cities for admin.
     */
    public function cities(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 100);

        $query = City::withCount(['approvedRecipes as recipes_count']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->search}%")
                  ->orWhere('description', 'LIKE', "%{$request->search}%");
            });
        }
        
        $sortColumn = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_dir', 'asc');
        $allowedSorts = ['name', 'recipes_count', 'slug']; // Description not usually sorted, but can be added

        if (in_array($sortColumn, $allowedSorts)) {
             $query->orderBy($sortColumn, $sortDirection);
        } else {
             $query->orderBy('name');
        }

        $cities = $query->paginate($perPage);

        return response()->json([
            'cities' => $cities->map(fn($city) => [
                'id' => $city->id,
                'name' => $city->name,
                'slug' => $city->slug,
                'description' => $city->description,
                'image_url' => $city->image_path ? asset('storage/' . $city->image_path) : null,
                'recipes_count' => $city->recipes_count,
            ])->values(),
            'pagination' => [
                'current_page' => $cities->currentPage(),
                'last_page' => $cities->lastPage(),
                'total' => $cities->total(),
                'per_page' => $cities->perPage(),
            ],
        ]);
    }

    /**
     * Create a city.
     */
    public function createCity(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:cities',
            'description' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('cities', 'public');
        }

        $city = City::create([
            'name' => $request->name,
            'description' => $request->description,
            'image_path' => $imagePath,
        ]);

        return response()->json([
            'message' => 'تم إنشاء المدينة',
            'city' => $city,
        ], 201);
    }

    /**
     * Update a city.
     */
    public function updateCity(Request $request, City $city): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|string|max:100|unique:cities,name,' . $city->id,
            'description' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['name', 'description']);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($city->image_path) {
                Storage::disk('public')->delete($city->image_path);
            }
            $data['image_path'] = $request->file('image')->store('cities', 'public');
        }

        $city->update($data);

        return response()->json([
            'message' => 'تم تحديث المدينة',
            'city' => $city,
        ]);
    }

    /**
     * Delete a city.
     */
    public function deleteCity(Request $request, City $city): JsonResponse
    {
        // Get default city from settings
        $defaultCityId = Setting::where('key', 'default_city_id')->value('value');

        if (!$defaultCityId) {
            return response()->json([
                'error' => 'يجب تحديد المدينة الافتراضية في الإعدادات قبل حذف أي مدينة',
            ], 422);
        }

        if ($city->id == $defaultCityId) {
            return response()->json([
                'error' => 'لا يمكن حذف المدينة الافتراضية',
            ], 422);
        }

        // Move recipes to default city
        $city->recipes()->update(['city_id' => $defaultCityId]);

        $city->delete();

        return response()->json([
            'message' => 'تم نقل الوصفات إلى المدينة الافتراضية وحذف المدينة',
        ]);
    }

    /**
     * Bulk actions for cities.
     */
    public function bulkCityActions(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:cities,id',
            'action' => 'required|in:delete',
        ]);

        $ids = $request->ids;
        $action = $request->action;

        if ($action === 'delete') {
             $defaultCityId = Setting::where('key', 'default_city_id')->value('value');

            if (!$defaultCityId) {
                return response()->json([
                    'error' => 'يجب تحديد المدينة الافتراضية في الإعدادات قبل حذف أي مدينة',
                ], 422);
            }

            // Ensure we are not deleting the default city
            if (in_array($defaultCityId, $ids)) {
                 return response()->json([
                    'error' => 'لا يمكن حذف المدينة الافتراضية ضمن عملية الحذف الجماعي',
                ], 422);
            }

            // Move recipes for all these cities
            Recipe::whereIn('city_id', $ids)->update(['city_id' => $defaultCityId]);

            City::whereIn('id', $ids)->delete();
            
            return response()->json(['message' => 'تم حذف المدن المحددة ونقل وصفاتها للمدينة الافتراضية']);
        }

        return response()->json(['error' => 'إجراء غير معروف'], 400);
    }

    // ==================== ANONYMOUS AUTHOR MANAGEMENT ====================

    /**
     * List anonymous authors.
     */
    public function anonymousAuthors(): JsonResponse
    {
        $authors = AnonymousAuthor::withCount('recipes')->get();

        return response()->json([
            'authors' => $authors->map(fn($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'bio' => $a->bio,
                'recipes_count' => $a->recipes_count,
            ]),
        ]);
    }

    /**
     * Create anonymous author.
     */
    public function createAnonymousAuthor(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'bio' => 'nullable|string|max:500',
        ]);

        $author = AnonymousAuthor::create([
            'name' => $request->name,
            'bio' => $request->bio,
        ]);

        return response()->json([
            'message' => 'تم إنشاء المؤلف',
            'author' => $author,
        ], 201);
    }

    // ==================== HELPER METHODS ====================

    private function formatAdminRecipe(Recipe $recipe): array
    {
        return [
            'id' => $recipe->id,
            'name' => $recipe->name,
            'slug' => $recipe->slug,
            'image_url' => $recipe->image_path ? asset('storage/' . $recipe->image_path) : null,
            'city' => $recipe->city?->name,
            'difficulty' => $recipe->difficulty,
            'status' => $recipe->status,
            'needs_reapproval' => $recipe->needs_reapproval,
            'rejection_reason' => $recipe->rejection_reason,
            'author_name' => $recipe->author_name,
            'user' => $recipe->user ? [
                'id' => $recipe->user->id,
                'name' => $recipe->user->name,
                'email' => $recipe->user->email,
                'avatar' => $recipe->user->avatar,
            ] : null,
            'approver' => $recipe->approver ? [
                'id' => $recipe->approver->id,
                'name' => $recipe->approver->name,
            ] : null,
            'approved_at' => $recipe->approved_at,
            'created_at' => $recipe->created_at,
            'tags' => $recipe->tags->map(fn($t) => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug]),
        ];
    }

    private function formatAdminUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'display_name' => $user->display_name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'role' => $user->role,
            'is_banned' => $user->is_banned,
            'ban_reason' => $user->ban_reason,
            'deletion_requested' => $user->deletion_requested,
            'recipes_count' => $user->recipes_count ?? 0,
            'created_at' => $user->created_at,
        ];
    }
}
