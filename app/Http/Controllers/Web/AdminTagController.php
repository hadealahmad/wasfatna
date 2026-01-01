<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminTagController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 100);

        $query = Tag::withCount('recipes');

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

        $tags = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Dashboard/Tags/Index', [
            'tags' => $tags->through(fn($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'recipes_count' => $t->recipes_count,
            ]),
            'filters' => $request->only(['search', 'sort_by', 'sort_dir', 'per_page']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|unique:tags,name|max:50',
        ]);

        Tag::create(['name' => $request->name]);

        return back()->with('success', 'تم إنشاء الوسم بنجاح');
    }

    public function update(Request $request, Tag $tag): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:tags,name,' . $tag->id,
        ]);

        $tag->update(['name' => $request->name]);

        return back()->with('success', 'تم تحديث الوسم بنجاح');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->recipes()->detach();
        $tag->delete();

        return back()->with('success', 'تم حذف الوسم بنجاح');
    }

    public function bulkActions(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tags,id',
            'action' => 'required|in:delete',
        ]);

        if ($request->action === 'delete') {
            $tags = Tag::whereIn('id', $request->ids)->get();
            foreach ($tags as $tag) {
                $tag->recipes()->detach();
                $tag->delete();
            }
        }

        return back()->with('success', 'تم تنفيذ الإجراء بنجاح');
    }
}
