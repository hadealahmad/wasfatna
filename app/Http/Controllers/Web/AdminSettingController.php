<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\City;
use App\Models\Tag;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\ImportController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class AdminSettingController extends Controller
{
    public function index(Request $request): Response
    {
        // Get settings
        $settings = Setting::pluck('value', 'key')->map(function ($value, $key) {
            if ($key === 'randomizer_tags' && $value) {
                return json_decode($value, true);
            }
            return $value;
        })->toArray();

        // Ensure default values
        $settings['gemini_api_key'] = $settings['gemini_api_key'] ?? '';
        $settings['gemini_model'] = $settings['gemini_model'] ?? 'gemini-1.5-flash';
        $settings['default_city_id'] = $settings['default_city_id'] ?? '';
        $settings['randomizer_tags'] = $settings['randomizer_tags'] ?? [];

        // Get cities for dropdown
        $cities = City::select('id', 'name')->orderBy('name')->get();

        // Get tags for multi-select
        $tags = Tag::select('id', 'name')->orderBy('name')->get();

        // Get AI models if API key is set
        $aiModels = [];
        if (!empty($settings['gemini_api_key'])) {
            try {
                $aiController = app(AiController::class);
                $modelsRes = $aiController->getModels();
                if ($modelsRes->getStatusCode() === 200) {
                    $aiModels = $modelsRes->getData()->models;
                }
            } catch (\Exception $e) {
                // Ignore errors fetching models
            }
        }

        return Inertia::render('Dashboard/Settings/Index', [
            'settings' => $settings,
            'cities' => $cities,
            'tags' => $tags,
            'aiModels' => $aiModels,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'gemini_api_key' => 'nullable|string',
            'gemini_model' => 'nullable|string',
            'default_city_id' => 'nullable|exists:cities,id',
            'randomizer_tags' => 'nullable|array',
            'randomizer_tags.*' => 'integer|exists:tags,id',
        ]);

        foreach ($data as $key => $value) {
            if (!is_null($value)) {
                $storedValue = is_array($value) ? json_encode($value) : $value;
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $storedValue]
                );
            }
        }

        return back()->with('success', 'تم تحديث الإعدادات بنجاح');
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'recipes' => 'required|array|min:1',
        ]);

        try {
            $importController = app(ImportController::class);
            $response = $importController->importRecipes($request);
            
            $data = $response->getData();
            
            return back()->with('importResult', [
                'message' => $data->message,
                'results' => $data->results,
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['import' => 'فشل الاستيراد: ' . $e->getMessage()]);
        }
    }
}
