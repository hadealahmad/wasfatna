<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Get list of tags (public).
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = \App\Models\Tag::query();

        if ($request->filled('query')) {
            $query->where('name', 'LIKE', "%{$request->query('query')}%");
        }

        $tags = $query->orderBy('name')->take(50)->get();

        return response()->json($tags);
    }

    /**
     * Get list of tags for admin (paginated, sortable).
     */
    public function adminIndex(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = \App\Models\Tag::withCount('recipes');

        if ($request->filled('search')) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }

        $sortColumn = $request->input('sort_by', 'recipes_count');
        $sortDirection = $request->input('sort_dir', 'desc');
        $allowedSorts = ['name', 'recipes_count', 'created_at'];

        if (in_array($sortColumn, $allowedSorts)) {
             $query->orderBy($sortColumn, $sortDirection);
        } else {
             $query->orderBy('recipes_count', 'desc');
        }

        $perPage = $request->input('per_page', 20);
        $tags = $query->paginate($perPage);

        return response()->json([
            'tags' => $tags->items(),
            'pagination' => [
                'current_page' => $tags->currentPage(),
                'last_page' => $tags->lastPage(),
                'total' => $tags->total(),
                'per_page' => $tags->perPage(),
            ],
        ]);
    }

    /**
     * Store a newly created tag.
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'name' => 'required|string|unique:tags,name|max:50',
        ]);

        $tag = \App\Models\Tag::create([
            'name' => $request->name,
        ]);

        return response()->json($tag, 201);
    }

    /**
     * Update the specified tag.
     */
    public function update(Request $request, \App\Models\Tag $tag): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:tags,name,' . $tag->id,
        ]);

        $tag->update([
            'name' => $request->name,
        ]);

        return response()->json($tag);
    }

    /**
     * Remove the specified tag from storage.
     */
    public function destroy(\App\Models\Tag $tag): \Illuminate\Http\JsonResponse
    {
        // Pivot table should handle cascade or we can detach.
        // Assuming cascade on delete for pivot, but to be safe:
        $tag->recipes()->detach();
        $tag->delete();

        return response()->json(null, 204);
    }

    /**
     * Bulk delete tags.
     */
    public function bulkDestroy(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tags,id',
        ]);

        $tags = \App\Models\Tag::whereIn('id', $request->ids)->get();

        foreach ($tags as $tag) {
            $tag->recipes()->detach();
            $tag->delete();
        }

        return response()->json(['message' => 'تم حذف الوسوم المحددة']);
    }
}
