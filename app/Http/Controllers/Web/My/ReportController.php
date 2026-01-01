<?php

namespace App\Http\Controllers\Web\My;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $reports = Report::where('user_id', Auth::id())
            ->with(['reportable'])
            ->latest()
            ->paginate(10);

        return Inertia::render('My/Reports/Index', [
            'reports' => $reports,
        ]);
    }
}
