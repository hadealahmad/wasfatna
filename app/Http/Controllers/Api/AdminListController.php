<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RecipeList;
use Illuminate\Http\Request;

class AdminListController extends Controller
{
    public function index(Request $request)
    {
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

        $lists = $query->paginate($request->input('per_page', 20));
        return response()->json($lists);
    }

    public function pending()
    {
        $lists = RecipeList::where('status', 'review')
            ->with('user')
            ->withCount('recipes')
            ->orderBy('updated_at', 'asc')
            ->paginate(15);
            
        return response()->json($lists);
    }

    public function approve($id)
    {
        $list = RecipeList::findOrFail($id);
        
        $list->status = 'approved';
        $list->is_public = true;
        $list->save();
        
        return response()->json(['message' => 'تم نشر القائمة']);
    }

    public function reject(Request $request, $id)
    {
        $list = RecipeList::findOrFail($id);
        
        $list->status = 'rejected';
        // $list->rejection_reason = $request->input('reason'); 
        $list->save();
        
        return response()->json(['message' => 'تم رفض القائمة']);
    }
    
    public function bulkAction(Request $request)
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
                return response()->json(['message' => 'تم حذف القوائم المحددة']);
            
            case 'approve':
                RecipeList::whereIn('id', $ids)->update(['status' => 'approved', 'is_public' => true]);
                return response()->json(['message' => 'تم نشر القوائم المحددة']);
                
            case 'reject':
                RecipeList::whereIn('id', $ids)->update(['status' => 'rejected']);
                return response()->json(['message' => 'تم رفض القوائم المحددة']);
                
            case 'unpublish':
                 RecipeList::whereIn('id', $ids)->update(['status' => 'private', 'is_public' => false]); // Or 'review'? 'private' seems safer for unpublish
                 return response()->json(['message' => 'تم إلغاء نشر القوائم المحددة']);
        }
        
        return response()->json(['error' => 'Invalid action'], 400);
    }
}
