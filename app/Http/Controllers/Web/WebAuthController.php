<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class WebAuthController extends Controller
{
    public function login(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->getId())->first();

            if (! $user) {
                $existingUser = User::where('email', $googleUser->getEmail())->first();

                if ($existingUser) {
                    // Only link when both Google email and existing local email are verified,
                    // otherwise this would allow pre-hijacking the existing account.
                    $emailVerified = $googleUser->user['email_verified'] ?? false;
                    if (! $emailVerified || $existingUser->email_verified_at === null) {
                        return redirect()->route('login')->with('error', 'لم يتم تأكيد بريدك الإلكتروني، لا يمكن ربط الحساب.');
                    }
                    $existingUser->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $existingUser->avatar ?? $googleUser->getAvatar(),
                    ]);
                    $user = $existingUser;
                } else {
                    $user = new User([
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                    ]);
                    $user->forceFill(['email_verified_at' => now()])->save();
                }
            }

            if ($user->is_banned) {
                return redirect()->route('login')->with('error', 'تم حظر حسابك: '.$user->ban_reason);
            }

            Auth::login($user, true);

            return redirect()->intended(route('dashboard.index'));
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'فشل تسجيل الدخول: '.$e->getMessage());
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
