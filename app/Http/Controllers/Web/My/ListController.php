<?php

namespace App\Http\Controllers\Web\My;

use App\Http\Controllers\Controller;
use App\Models\RecipeList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ListController extends Controller
{
    public function index()
    {
        $lists = RecipeList::where('user_id', Auth::id())
            ->withCount('recipes')
            ->latest()
            ->get();

        return Inertia::render('My/Lists/Index', [
            'lists' => $lists,
        ]);
    }

    public function create()
    {
        return Inertia::render('My/Lists/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:2048',
        ]);

        $list = new RecipeList($validated);
        $list->user_id = Auth::id();
        $list->slug = Str::slug($validated['name']).'-'.Str::random(6);
        // New lists start private as drafts; publishing goes through requestPublish → moderator review
        $list->is_public = false;
        $list->status = 'draft';

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('lists', 'public');
            $list->cover_image = $path;
        }

        $list->save();

        return redirect()->route('my.lists.index')->with('success', 'تم إنشاء القائمة بنجاح');
    }

    public function edit(RecipeList $list)
    {
        if ($list->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('My/Lists/Edit', [
            'list' => $list,
        ]);
    }

    public function update(Request $request, RecipeList $list)
    {
        if ($list->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:2048',
        ]);

        // Only already-approved lists may toggle public visibility directly;
        // everything else must go through requestPublish → moderator review.
        if ($list->status !== 'approved') {
            unset($validated['is_public']);
        }

        $list->fill($validated);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('lists', 'public');
            $list->cover_image = $path;
        }

        $list->save();

        return redirect()->route('my.lists.index')->with('success', 'تم تحديث القائمة بنجاح');
    }

    public function destroy(RecipeList $list)
    {
        if ($list->user_id !== Auth::id()) {
            abort(403);
        }

        $list->delete();

        return back()->with('success', 'تم حذف القائمة');
    }

    public function requestPublish(RecipeList $list)
    {
        if ($list->user_id !== Auth::id()) {
            abort(403);
        }

        // Validate list has required content
        if ($list->recipes()->count() < 1) {
            return back()->withErrors(['message' => 'يجب أن تحتوي القائمة على وصفة واحدة على الأقل']);
        }

        $list->status = 'review';
        $list->save();

        return back()->with('success', 'تم إرسال طلب النشر للمراجعة');
    }

    public function unpublish(RecipeList $list)
    {
        if ($list->user_id !== Auth::id()) {
            abort(403);
        }

        $list->is_public = false;
        $list->status = 'draft';
        $list->save();

        return back()->with('success', 'تم إلغاء نشر القائمة');
    }
}
