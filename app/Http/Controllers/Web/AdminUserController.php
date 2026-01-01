<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
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

        $users = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Dashboard/Users/Index', [
            'users' => $users->through(fn($u) => $this->formatAdminUser($u)),
            'filters' => $request->only(['role', 'search', 'sort_by', 'sort_dir', 'per_page']),
        ]);
    }

    public function bulkActions(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id',
            'action' => 'required|in:delete,ban,unban,change_role',
            'role' => 'required_if:action,change_role|string',
            'reason' => 'required_if:action,ban|string|max:500',
        ]);

        $ids = $request->ids;
        $action = $request->action;

        // Prevent performing actions on current user
        $ids = array_filter($ids, fn($id) => $id != $request->user()->id);
        
        if (empty($ids)) {
            return back()->with('error', 'لا يمكن تنفيذ الإجراء على هذا المستخدم');
        }

        try {
            switch ($action) {
                case 'delete':
                    User::whereIn('id', $ids)->delete();
                    break;

                case 'ban':
                    User::whereIn('id', $ids)->update([
                        'is_banned' => true,
                        'ban_reason' => $request->reason,
                    ]);
                    break;

                case 'unban':
                    User::whereIn('id', $ids)->update([
                        'is_banned' => false,
                        'ban_reason' => null,
                    ]);
                    break;
                
                case 'change_role':
                    User::whereIn('id', $ids)->update(['role' => $request->role]);
                    break;
            }

            return back()->with('success', 'تم تنفيذ الإجراء بنجاح');
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء تنفيذ الإجراء');
        }
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'لا يمكنك تغيير دورك الخاص');
        }

        $request->validate(['role' => 'required|string']);
        $user->update(['role' => $request->role]);

        return back()->with('success', 'تم تحديث الدور بنجاح');
    }

    public function ban(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'لا يمكنك حظر نفسك');
        }

        $request->validate(['reason' => 'required|string|max:500']);
        $user->update([
            'is_banned' => true,
            'ban_reason' => $request->reason,
        ]);

        return back()->with('success', 'تم حظر المستخدم');
    }

    public function unban(User $user): RedirectResponse
    {
        $user->update([
            'is_banned' => false,
            'ban_reason' => null,
        ]);

        return back()->with('success', 'تم إلغاء حظر المستخدم');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'لا يمكنك حذف نفسك');
        }

        $user->delete();

        return back()->with('success', 'تم حذف المستخدم');
    }

    private function formatAdminUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar_url,
            'is_banned' => $user->is_banned,
            'ban_reason' => $user->ban_reason,
            'deletion_requested' => $user->deletion_requested,
            'recipes_count' => $user->recipes_count ?? 0,
            'created_at' => $user->created_at->toISOString(),
        ];
    }
}
