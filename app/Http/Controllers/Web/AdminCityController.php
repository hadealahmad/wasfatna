<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminCityController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 100);

        $query = City::withCount('recipes');

        if ($request->filled('search')) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }
        
        $sortColumn = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_dir', 'asc');
        $allowedSorts = ['name', 'recipes_count', 'created_at'];

        if (in_array($sortColumn, $allowedSorts)) {
             $query->orderBy($sortColumn, $sortDirection);
        } else {
             $query->orderBy('name', 'asc');
        }

        $cities = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Dashboard/Cities/Index', [
            'cities' => $cities->through(fn($c) => $this->formatAdminCity($c)),
            'filters' => $request->only(['search', 'sort_by', 'sort_dir', 'per_page']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:cities,name',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['name', 'description']);
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('cities', 'public');
        }

        City::create($data);

        return back()->with('success', 'تم إنشاء المدينة بنجاح');
    }

    public function update(Request $request, City $city): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:cities,name,' . $city->id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['name', 'description']);
        
        if ($city->name !== $request->name) {
            $data['slug'] = Str::slug($request->name);
        }

        if ($request->hasFile('image')) {
            if ($city->image_path) {
                Storage::disk('public')->delete($city->image_path);
            }
            $data['image_path'] = $request->file('image')->store('cities', 'public');
        }

        $city->update($data);

        return back()->with('success', 'تم تحديث المدينة بنجاح');
    }

    public function destroy(City $city): RedirectResponse
    {
        if ($city->image_path) {
            Storage::disk('public')->delete($city->image_path);
        }
        
        // Note: Laravel usually handles relationship constraints. 
        // If recipes belong to city, we might need to null them out or set to default.
        // Assuming there's a default city or nullable foreign key.
        $city->delete();

        return back()->with('success', 'تم حذف المدينة بنجاح');
    }

    public function bulkActions(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:cities,id',
            'action' => 'required|in:delete',
        ]);

        $ids = $request->ids;

        try {
            if ($request->action === 'delete') {
                $cities = City::whereIn('id', $ids)->get();
                foreach ($cities as $city) {
                    if ($city->image_path) {
                        Storage::disk('public')->delete($city->image_path);
                    }
                    $city->delete();
                }
            }

            return back()->with('success', 'تم تنفيذ الإجراء بنجاح');
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء تنفيذ الإجراء');
        }
    }

    private function formatAdminCity(City $city): array
    {
        return [
            'id' => $city->id,
            'name' => $city->name,
            'slug' => $city->slug,
            'description' => $city->description,
            'image_url' => $city->image_url,
            'recipes_count' => $city->recipes_count ?? 0,
            'created_at' => $city->created_at->toISOString(),
        ];
    }
}
