<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Recipe;
use App\Models\RecipeList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ReportController extends Controller
{
    /**
     * Display a listing of reports (Admin).
     */
    public function index(Request $request)
    {
        try {


            if (!Auth::check()) {
                \Illuminate\Support\Facades\Log::error('ReportController: User not logged in');
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            if (!Auth::user()->canApproveRecipes()) {
                \Illuminate\Support\Facades\Log::warning('ReportController: Unauthorized access attempt', ['user_id' => Auth::id()]);
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $query = Report::with(['user', 'reportable']);

            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            $reports = $query->latest()->paginate(20);

            return response()->json($reports);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('ReportController Index Error: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e->getTraceAsString());
            return response()->json(['message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created report in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reportable_id' => 'required|integer',
            'reportable_type' => 'required|string|in:recipe,list',
            'type' => 'required|string|in:content_issue,feedback',
            'message' => 'required|string|max:1000',
        ]);

        $modelClass = match ($validated['reportable_type']) {
            'recipe' => Recipe::class,
            'list' => RecipeList::class,
            default => null,
        };

        if (!$modelClass) {
            return response()->json(['message' => 'Invalid reportable type'], 422);
        }

        $reportable = $modelClass::find($validated['reportable_id']);

        if (!$reportable) {
            return response()->json(['message' => 'Content not found'], 404);
        }

        \Illuminate\Support\Facades\Log::info("Report store: ", $validated);
        \Illuminate\Support\Facades\Log::info("Model Class: " . $modelClass);

        $report = new Report();
        $report->user_id = Auth::id();
        $report->fill([
            'reportable_id' => $validated['reportable_id'],
            'reportable_type' => $modelClass,
            'type' => $validated['type'],
            'message' => $validated['message'],
            'status' => 'pending',
        ]);
        // Force manual override just in case fill failed
        $report->reportable_type = $modelClass;
        $report->reportable_id = $validated['reportable_id'];
        
        \Illuminate\Support\Facades\Log::info("Report before save: ", $report->toArray());
        
        $report->save();

        return response()->json($report, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        // Check if admin or owner
        if (Auth::id() !== $report->user_id && !Auth::user()->canApproveRecipes()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($report->load(['user', 'reportable']));
    }

    /**
     * Display the user's reports.
     */
    public function userIndex(Request $request)
    {
        $reports = Report::where('user_id', Auth::id())
            ->with('reportable')
            ->latest()
            ->paginate(20);

        return response()->json($reports);
    }

    /**
     * Update the specified resource in storage (Admin).
     */
    public function update(Request $request, Report $report)
    {
        if (!Auth::user()->canApproveRecipes()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'sometimes|string|in:pending,fixed,rejected',
            'admin_note' => 'sometimes|nullable|string',
            'admin_reply' => 'sometimes|nullable|string',
        ]);

        $report->update($validated);

        return response()->json($report);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        if (!Auth::user()->canDeleteRecipes()) { // Assuming delete permission is similar
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $report->delete();

        return response()->json(['message' => 'Report deleted']);
    }
    
    /**
     * Bulk action (Admin).
     */
    public function bulkAction(Request $request)
    {
        if (!Auth::user()->canApproveRecipes()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:reports,id',
            'action' => 'required|string|in:delete,status_update',
            'status' => 'required_if:action,status_update|in:pending,fixed,rejected',
        ]);
        
        if ($validated['action'] === 'delete') {
            if (!Auth::user()->canDeleteRecipes()) {
                return response()->json(['message' => 'Unauthorized to delete'], 403);
            }
            Report::whereIn('id', $validated['ids'])->delete();
        } elseif ($validated['action'] === 'status_update') {
            Report::whereIn('id', $validated['ids'])->update(['status' => $validated['status']]);
        }

        return response()->json(['message' => 'Bulk action completed']);
    }
}
