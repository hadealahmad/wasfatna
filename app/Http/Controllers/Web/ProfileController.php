<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
            'deletion_requested' => (bool) $request->user()->deletion_requested,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        $user->fill([
            'name' => $validated['name'],
            ...($request->has('display_name') ? ['display_name' => $validated['display_name']] : []),
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->save();

        return redirect()->route('profile.edit');
    }

    public function requestDeletion(Request $request)
    {
        $request->user()->forceFill([
            'deletion_requested' => true,
            'deletion_requested_at' => now(),
        ])->save();

        return redirect()->route('profile.edit')->with('success', 'تم إرسال طلب حذف الحساب. سيتم مراجعته من قبل المسؤول.');
    }

    public function cancelDeletion(Request $request)
    {
        $request->user()->forceFill([
            'deletion_requested' => false,
            'deletion_requested_at' => null,
        ])->save();

        return redirect()->route('profile.edit')->with('success', 'تم إلغاء طلب حذف الحساب.');
    }

    public function destroy(Request $request)
    {
        $user = $request->user();

        if ($user->password !== null) {
            $request->validate([
                'password' => ['required', 'current_password'],
            ]);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->header('Clear-Site-Data', '"cookies", "storage", "cache"');
    }
}
