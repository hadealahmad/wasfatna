<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    /**
     * Redirect to Google OAuth.
     */
    public function redirectToGoogle(): JsonResponse
    {
        $url = Socialite::driver('google')
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    /**
     * Handle Google OAuth callback.
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->user();

            // Find or create user
            $user = User::where('google_id', $googleUser->getId())->first();

            if (!$user) {
                // Check if email already exists (linked to different auth method)
                $existingUser = User::where('email', $googleUser->getEmail())->first();
                
                if ($existingUser) {
                    // Link Google account to existing user
                    $existingUser->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $existingUser->avatar ?? $googleUser->getAvatar(),
                    ]);
                    $user = $existingUser;
                } else {
                    // Create new user
                    $user = User::create([
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                        'email_verified_at' => now(),
                    ]);
                }
            } else {
                // Update avatar if changed
                $user->update([
                    'avatar' => $googleUser->getAvatar(),
                ]);
            }

            // Check if user is banned
            if ($user->is_banned) {
                return response()->json([
                    'error' => 'تم حظر حسابك',
                    'reason' => $user->ban_reason,
                ], 403);
            }

            // Create token
            $token = $user->createToken('auth-token')->plainTextToken;

            $userData = $this->formatUser($user);

            if ($request->wantsJson()) {
                return response()->json([
                    'user' => $userData,
                    'token' => $token,
                ]);
            }

            // Redirect to frontend
            $frontendUrl = config('services.frontend_url');
            $query = http_build_query([
                'token' => $token,
                'user' => json_encode($userData),
            ]);

            return redirect("$frontendUrl/auth/callback?$query");
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'فشل في تسجيل الدخول: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get current authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->formatUser($request->user()),
        ]);
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'display_name' => 'nullable|string|max:255',
        ]);

        $user = $request->user();
        $user->update([
            'display_name' => $request->display_name,
        ]);

        return response()->json([
            'user' => $this->formatUser($user),
            'message' => 'تم تحديث الملف الشخصي',
        ]);
    }

    /**
     * Request account deletion.
     */
    public function requestDeletion(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->update([
            'deletion_requested' => true,
            'deletion_requested_at' => now(),
        ]);

        return response()->json([
            'message' => 'تم إرسال طلب حذف الحساب. سيتم مراجعته من قبل المسؤول.',
        ]);
    }

    /**
     * Cancel account deletion request.
     */
    public function cancelDeletion(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->update([
            'deletion_requested' => false,
            'deletion_requested_at' => null,
        ]);

        return response()->json([
            'message' => 'تم إلغاء طلب حذف الحساب.',
        ]);
    }

    /**
     * Logout user.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'تم تسجيل الخروج',
        ]);
    }

    /**
     * Format user for API response.
     */
    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'display_name' => $user->display_name ?? $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'role' => $user->role,
            'deletion_requested' => $user->deletion_requested,
            'created_at' => $user->created_at,
        ];
    }
}
