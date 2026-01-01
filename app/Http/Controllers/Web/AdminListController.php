<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\RecipeList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminListController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 100);

        $query = RecipeList::with('user')->withCount('recipes');

        if ($request->filled('status')) {
            $statuses = explode(',', $request->status);
            $query->whereIn('status', $statuses);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->search}%")
                  ->orWhereHas('user', function($u) use ($request) {
                      $u->where('name', 'LIKE', "%{$request->search}%");
                  });
            });
        }
        
        $sortColumn = $request->input('sort_by', 'updated_at');
        $sortDirection = $request->input('sort_dir', 'desc');
        $allowedSorts = ['name', 'updated_at', 'created_at', 'status', 'recipes_count'];
        
        if (in_array($sortColumn, $allowedSorts)) {
             $query->orderBy($sortColumn, $sortDirection);
        } else {
             $query->latest('updated_at');
        }

        $lists = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Dashboard/Lists/Index', [
            'lists' => $lists->through(fn($l) => [
                'id' => $l->id,
                'name' => $l->name,
                'status' => $l->status,
                'is_public' => $l->is_public,
                'updated_at' => $l->updated_at,
                'user' => $l->user ? [
                    'id' => $l->user->id,
                    'name' => $l->user->name,
                ] : null,
                'recipes_count' => $l->recipes_count,
            ]),
            'filters' => $request->only(['status', 'search', 'sort_by', 'sort_dir', 'per_page']),
        ]);
    }

    public function bulkActions(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:recipe_lists,id',
            'action' => 'required|in:delete,approve,reject,unpublish',
        ]);
        
        $ids = $request->ids;
        $action = $request->action;
        
        switch ($action) {
            case 'delete':
                RecipeList::whereIn('id', $ids)->delete();
                break;
            
            case 'approve':
                RecipeList::whereIn('id', $ids)->update(['status' => 'approved', 'is_public' => true]);
                break;
                
            case 'reject':
                RecipeList::whereIn('id', $ids)->update(['status' => 'rejected']);
                break;
                
            case 'unpublish':
                 RecipeList::whereIn('id', $ids)->update(['status' => 'private', 'is_public' => false]);
                 break;
        }
        
        return back()->with('success', 'تم تنفيذ الإجراء بنجاح');
    }

    public function destroy(RecipeList $list): RedirectResponse
    {
        $list->delete();
        return back()->with('success', 'تم حذف القائمة بنجاح');
    }

    public function update(Request $request, RecipeList $list): RedirectResponse
    {
         $request->validate([
            'status' => 'required|in:approved,rejected,private,review',
        ]);

        $updateData = ['status' => $request->status];
        if ($request->status === 'approved') {
            $updateData['is_public'] = true;
        } elseif ($request->status === 'private' || $request->status === 'review' || $request->status === 'rejected') {
            $updateData['is_public'] = false;
        }

        $list->update($updateData);

        return back()->with('success', 'تم تحديث حالة القائمة');
    }
}
