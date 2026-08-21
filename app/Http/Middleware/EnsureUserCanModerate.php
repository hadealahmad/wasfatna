<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanModerate
{
    /**
     * Handle an incoming request.
     * Allows admins and moderators.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->canApproveRecipes()) {
            // API clients get JSON; web (Inertia) requests get a friendly redirect
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'غير مصرح. يجب أن تكون مشرفاً أو مسؤولاً.',
                ], 403);
            }

            return redirect()->route('home')
                ->with('error', 'غير مصرح. يجب أن تكون مشرفاً أو مسؤولاً.');
        }

        return $next($request);
    }
}
