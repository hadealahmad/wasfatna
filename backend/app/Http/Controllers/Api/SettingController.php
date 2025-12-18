<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        // Return key-value pairs
        $settings = Setting::pluck('value', 'key')->map(function ($value, $key) {
            if ($key === 'randomizer_tags' && $value) {
                return json_decode($value, true);
            }
            return $value;
        });
        return response()->json($settings);
    }

    public function update(Request $request)
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

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
