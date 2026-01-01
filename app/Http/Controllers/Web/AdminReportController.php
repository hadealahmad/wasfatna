<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class AdminReportController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 100);

        $query = Report::with(['user', 'reportable']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        $reports = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('Dashboard/Reports/Index', [
            'reports' => $reports->through(fn($r) => $this->formatAdminReport($r)),
            'filters' => $request->only(['status', 'type', 'per_page']),
        ]);
    }

    public function update(Request $request, Report $report): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,fixed,rejected',
            'admin_note' => 'nullable|string|max:1000',
            'admin_reply' => 'nullable|string|max:1000',
        ]);

        $report->update($validated);

        return back()->with('success', 'تم تحديث البلاغ بنجاح');
    }

    public function destroy(Report $report): RedirectResponse
    {
        $report->delete();

        return back()->with('success', 'تم حذف البلاغ بنجاح');
    }

    public function bulkActions(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:reports,id',
            'action' => 'required|in:delete,status_update',
            'status' => 'required_if:action,status_update|in:pending,fixed,rejected',
        ]);

        $ids = $request->ids;

        if ($request->action === 'delete') {
            Report::whereIn('id', $ids)->delete();
        } elseif ($request->action === 'status_update') {
            Report::whereIn('id', $ids)->update(['status' => $request->status]);
        }

        return back()->with('success', 'تم تنفيذ الإجراء بنجاح');
    }

    private function formatAdminReport(Report $report): array
    {
        return [
            'id' => $report->id,
            'user' => [
                'id' => $report->user->id,
                'name' => $report->user->name,
                'email' => $report->user->email,
                'avatar' => $report->user->avatar_url,
            ],
            'reportable_id' => $report->reportable_id,
            'reportable_type' => $report->reportable_type,
            'reportable' => $report->reportable ? [
                'id' => $report->reportable->id,
                'name' => $report->reportable->name ?? $report->reportable->title ?? 'محتوى غير معروف',
                'slug' => $report->reportable->slug ?? null,
            ] : null,
            'type' => $report->type,
            'message' => $report->message,
            'status' => $report->status,
            'admin_note' => $report->admin_note,
            'admin_reply' => $report->admin_reply,
            'created_at' => $report->created_at->toISOString(),
        ];
    }
}
