<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Setting;
use App\Models\Tag;
use Illuminate\Support\Facades\Http;

class AdminRecipeController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 100);

        $query = Recipe::with(['city', 'user', 'anonymousAuthor', 'approver', 'tags'])
            ->withCount('tags');

        // Filter by status
        if ($request->filled('status')) {
            $statuses = is_array($request->status) ? $request->status : explode(',', $request->status);
            
            $query->where(function ($q) use ($statuses) {
                $q->whereIn('status', $statuses);
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
        
        $allowedSorts = ['name', 'created_at', 'status', 'approved_at', 'tags_count'];
        if (in_array($sortColumn, $allowedSorts)) {
            $query->orderBy($sortColumn, $sortDirection);
        } else {
            $query->latest();
        }

        $recipes = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Dashboard/Recipes/Index', [
            'recipes' => $recipes->through(fn($r) => $this->formatAdminRecipe($r)),
            'filters' => $request->only(['status', 'search', 'sort_by', 'sort_dir', 'per_page']),
        ]);
    }

    public function bulkActions(Request $request): RedirectResponse
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
                    if (!$request->user()->isAdmin()) {
                        return back()->with('error', 'غير مصرح لك بحذف الوصفات');
                    }
                    Recipe::whereIn('id', $ids)->delete();
                    break;

                case 'publish':
                    Recipe::whereIn('id', $ids)->update([
                        'status' => 'approved',
                        'approved_by' => $request->user()->id,
                        'approved_at' => now(),
                        'needs_reapproval' => false,
                        'rejection_reason' => null,
                    ]);
                    break;

                case 'unpublish':
                    Recipe::whereIn('id', $ids)->update(['status' => 'unpublished']);
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
                     break;
            }

            return back()->with('success', 'تم تنفيذ الإجراء بنجاح');
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء تنفيذ الإجراء');
        }
    }

    public function bulkTag(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:recipes,id'
        ]);

        $apiKey = Setting::find('gemini_api_key')?->value;
        if (!$apiKey) {
            return back()->with('error', 'Gemini API Key not configured');
        }
        
        $model = trim(Setting::find('gemini_model')?->value ?? 'gemini-1.5-flash');

        $recipes = Recipe::with(['ingredients', 'tags'])->whereIn('id', $request->ids)->get();
        $existingTags = Tag::pluck('name')->toArray();
        $existingTagsStr = implode(', ', $existingTags);

        $successCount = 0;
        $errors = [];

        foreach ($recipes as $recipe) {
            try {
                $ingredientsText = $recipe->ingredients->map(function($i) {
                    return $i->pivot->amount . ' ' . $i->pivot->unit . ' ' . $i->name;
                })->join(', ');

                $prompt = "
                Analyze these recipe details and suggest relevant tags ONLY from the provided list.
                
                Recipe Name: {$recipe->name}
                Ingredients: $ingredientsText
                Existing Tags: $existingTagsStr
                
                Return JSON: { \"tags\": [\"tag1\", \"tag2\"] }
                Pre-existing tags for this recipe: " . $recipe->tags->pluck('name')->join(', ') . "
                Keep existing valid tags and add new ones if missing.
                NO markdown. JSON only.
                ";

                $response = Http::withHeaders(['Content-Type' => 'application/json'])
                    ->post("https://genergenerativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ]
                ]);

                if ($response->successful()) {
                    $generated = $response->json();
                    $txt = $generated['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
                    $clean = str_replace(['```json', '```'], '', $txt);
                    $data = json_decode($clean, true);
                    
                    if (isset($data['tags']) && is_array($data['tags'])) {
                        $tagIds = Tag::whereIn('name', $data['tags'])->pluck('id');
                        $recipe->tags()->sync($tagIds);
                        $successCount++;
                    }
                } else {
                    $errors[] = "Failed ID {$recipe->id}: " . $response->status();
                }

                sleep(1); 
            } catch (\Exception $e) {
                $errors[] = "Error ID {$recipe->id}: " . $e->getMessage();
            }
        }

        if (count($errors) > 0) {
            return back()->with('warning', "تم تحديث {$successCount} وصفات، مع وجود " . count($errors) . " أخطاء.");
        }

        return back()->with('success', "تم تحديث وسوم {$successCount} وصفات بنجاح.");
    }

    public function reject(Request $request, Recipe $recipe): RedirectResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $recipe->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        return back()->with('success', 'تم رفض الوصفة');
    }

    public function approve(Request $request, Recipe $recipe): \Illuminate\Http\JsonResponse
    {
        $recipe->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'needs_reapproval' => false,
            'rejection_reason' => null,
        ]);

        return response()->json(['success' => true, 'message' => 'تم نشر الوصفة بنجاح']);
    }

    public function unpublish(Request $request, Recipe $recipe): \Illuminate\Http\JsonResponse
    {
        $recipe->update([
            'status' => 'unpublished',
        ]);

        return response()->json(['success' => true, 'message' => 'تم إلغاء نشر الوصفة']);
    }

    private function formatAdminRecipe(Recipe $recipe): array
    {
        return [
            'id' => $recipe->id,
            'name' => $recipe->name,
            'slug' => $recipe->slug,
            'image_url' => $recipe->image_url,
            'status' => $recipe->status,
            'needs_reapproval' => $recipe->needs_reapproval,
            'rejection_reason' => $recipe->rejection_reason,
            'tags_count' => $recipe->tags_count ?? $recipe->tags->count(),
            'created_at' => $recipe->created_at->toISOString(),
            'approved_at' => $recipe->approved_at?->toISOString(),
            'user' => $recipe->user ? [
                'id' => $recipe->user->id,
                'name' => $recipe->user->name,
                'avatar' => $recipe->user->avatar_url,
            ] : null,
            'city' => $recipe->city ? [
                'id' => $recipe->city->id,
                'name' => $recipe->city->name,
                'slug' => $recipe->city->slug,
            ] : null,
            'approver' => $recipe->approver ? [
                'id' => $recipe->approver->id,
                'name' => $recipe->approver->name,
            ] : null,
            'tags' => $recipe->tags->map(fn($t) => ['id' => $t->id, 'name' => $t->name]),
        ];
    }
}
