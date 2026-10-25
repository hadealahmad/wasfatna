<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\Setting;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    public function process(Request $request)
    {
        $request->validate([
            'ingredients' => 'nullable|string',
            'steps' => 'nullable|string',
            'locale' => 'required|string|in:ar,en',
        ]);

        $apiKey = Setting::find('gemini_api_key')?->value;
        $model = trim(Setting::find('gemini_model')?->value ?? 'gemini-1.5-flash');

        if (! $apiKey) {
            return response()->json(['error' => 'Gemini API Key not configured'], 500);
        }

        $existingTags = Tag::pluck('name')->toArray();
        $ingredients = $request->ingredients;
        $steps = $request->steps;
        $locale = $request->locale;
        $prompt = "
            You are a culinary AI assistant.
            Analyze the following recipe ingredients and cleanup/reorganize them into a structured JSON format.
            Also reorganize the preparation steps into a clean list.
            Also suggest relevant tags from the provided list of existing tags.
            
            Existing Tags: ".implode(', ', $existingTags)."

            Input Ingredients:
            $ingredients

            Input Steps:
            $steps

            Instructions:
            1. Parse ingredients into a structured list of groups. If no explicit groups are present (e.g., 'Sauce', 'Dough'), use a single group named 'Main'.
            2. Each ingredient object must have: amount (string), unit (string), name (string), descriptor (string).
            3. Parse steps into a structured list of groups. If no explicit phases are present, use a single group named 'Main'.
            4. Suggest tags ONLY from the 'Existing Tags' list provided above. Do not invent new tags.
            5. Return ONLY valid JSON. No markdown, no emojis, no extra text.
            6. Language: Maintain the same language as the input (likely {$locale}).
            
            JSON Structure:
            {
                \"ingredientGroups\": [
                    {
                        \"name\": \"Group Name (e.g., Dough, Main)\",
                        \"items\": [
                            { \"amount\": \"...\", \"unit\": \"...\", \"name\": \"...\", \"descriptor\": \"...\" }
                        ]
                    }
                ],
                \"stepGroups\": [
                    {
                        \"name\": \"Group Name (e.g., Preparation, Main)\",
                        \"items\": [
                            \"Step 1...\",
                            \"Step 2...\"
                        ]
                    }
                ],
                \"tags\": [\"tag1\", \"tag2\"]
            }
            ";

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

            $response = Http::timeout(20)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($url, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'responseMimeType' => 'application/json',
                    ],
                ]);

            if ($response->failed()) {
                $errorData = $response->json();
                $errorMessage = $errorData['error']['message'] ?? $response->body();

                if ($response->status() === 429) {
                    return response()->json([
                        'error' => 'تم تجاوز حد الاستخدام (Quota Exceeded). يرجى اختيار نموذج آخر (مثل Gemini 1.5 Flash) أو الانتظار قليلاً.',
                    ], 429);
                }

                return response()->json(['error' => 'Gemini Error: '.$errorMessage], $response->status());
            }

            $responseData = $response->json();
            $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '';

            $jsonStr = str_replace(['```json', '```'], '', $generatedText);
            $json = json_decode($jsonStr, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['error' => 'Failed to parse AI response', 'raw' => $generatedText], 500);
            }

            return response()->json($json);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function bulkTag(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|max:20',
            'ids.*' => 'integer|exists:recipes,id',
        ]);

        $apiKey = Setting::find('gemini_api_key')?->value;
        if (! $apiKey) {
            return response()->json(['error' => 'Gemini API Key not configured'], 500);
        }

        $model = trim(Setting::find('gemini_model')?->value ?? 'gemini-1.5-flash');

        $recipes = Recipe::with(['ingredients', 'tags'])->whereIn('id', $request->ids)->get();
        $existingTags = Tag::pluck('name')->toArray();
        $existingTagsStr = implode(', ', $existingTags);

        $successCount = 0;
        $errors = [];

        foreach ($recipes as $recipe) {
            try {
                $ingredientsText = $recipe->ingredients->map(function ($i) {
                    return $i->pivot->amount.' '.$i->pivot->unit.' '.$i->name;
                })->join(', ');

                $prompt = "
                Analyze these recipe details and suggest relevant tags ONLY from the provided list.
                
                Recipe Name: {$recipe->name}
                Ingredients: $ingredientsText
                Existing Tags: $existingTagsStr
                
                Return JSON: { \"tags\": [\"tag1\", \"tag2\"] }
                Pre-existing tags for this recipe: ".$recipe->tags->pluck('name')->join(', ').'
                Keep existing valid tags and add new ones if missing.
                NO markdown. JSON only.
                ';

                $response = Http::timeout(15)
                    ->withHeaders(['Content-Type' => 'application/json'])
                    ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                        'contents' => [
                            ['parts' => [['text' => $prompt]]],
                        ],
                    ]);

                if ($response->successful()) {
                    $txt = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
                    $clean = str_replace(['```json', '```'], '', $txt);
                    $data = json_decode($clean, true);

                    if (isset($data['tags']) && is_array($data['tags'])) {
                        $tagIds = Tag::whereIn('name', $data['tags'])->pluck('id');
                        $recipe->tags()->sync($tagIds);
                        $successCount++;
                    }
                } else {
                    $errors[] = "Failed ID {$recipe->id}: ".$response->status();
                }
            } catch (\Exception $e) {
                $errors[] = "Error ID {$recipe->id}: ".$e->getMessage();
            }
        }

        return response()->json([
            'success_count' => $successCount,
            'total' => count($recipes),
            'errors' => $errors,
        ]);
    }

    public function fetchAvailableModels(?string $apiKey = null): array
    {
        $apiKey = $apiKey ?? Setting::find('gemini_api_key')?->value;
        if (! $apiKey) {
            return [];
        }

        return Cache::remember('gemini_available_models_'.md5((string) $apiKey), 3600, function () use ($apiKey) {
            $url = "https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}";
            $response = Http::timeout(5)->get($url);

            if ($response->failed()) {
                throw new \RuntimeException('Failed to fetch models: '.$response->body());
            }

            $models = $response->json()['models'] ?? [];

            $supportedModels = array_filter($models, function ($model) {
                return in_array('generateContent', $model['supportedGenerationMethods'] ?? []);
            });

            $formatted = array_map(function ($model) {
                $name = str_replace('models/', '', $model['name']);

                return [
                    'value' => $name,
                    'label' => $model['displayName']." ({$model['version']})",
                ];
            }, $supportedModels);

            return array_values($formatted);
        });
    }

    public function getModels()
    {
        $apiKey = Setting::find('gemini_api_key')?->value;
        if (! $apiKey) {
            return response()->json(['error' => 'API Key not set'], 400);
        }

        try {
            $models = $this->fetchAvailableModels($apiKey);

            return response()->json(['models' => $models]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
