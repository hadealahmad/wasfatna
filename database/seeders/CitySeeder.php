<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Seed the cities table with Syrian/Arab cities.
     */
    public function run(): void
    {
        $cities = [
            ['name' => 'دمشقية', 'slug' => 'damascus'],
            ['name' => 'حلبية', 'slug' => 'aleppo'],
            ['name' => 'حمصية', 'slug' => 'homs'],
            ['name' => 'حماوية', 'slug' => 'hama'],
            ['name' => 'لاذقانية', 'slug' => 'latakia'],
            ['name' => 'طرطوسية', 'slug' => 'tartous'],
            ['name' => 'درعاوية', 'slug' => 'daraa'],
            ['name' => 'ديرية', 'slug' => 'deir-ez-zor'],
            ['name' => 'رقاوية', 'slug' => 'raqqa'],
            ['name' => 'إدلبية', 'slug' => 'idlib'],
            ['name' => 'حسكاوية', 'slug' => 'hasakah'],
            ['name' => 'قامشلية', 'slug' => 'qamishli'],
            ['name' => 'عموم الساحل', 'slug' => 'coastal'],
            ['name' => 'سويداء', 'slug' => 'suwayda'],
            ['name' => 'قنيطرة', 'slug' => 'quneitra'],
            ['name' => 'ريف دمشق', 'slug' => 'rif-dimashq'],
            ['name' => 'تدمرية', 'slug' => 'palmyra'],
            ['name' => 'منبجية', 'slug' => 'manbij'],
            ['name' => 'جولانية', 'slug' => 'golan'],
            ['name' => 'مو لمدينة محددة/لأكثر من مدينة', 'slug' => 'general'],
        ];

        foreach ($cities as $city) {
            City::updateOrCreate(
                ['name' => $city['name']],
                ['slug' => $city['slug']]
            );
        }
    }
}
