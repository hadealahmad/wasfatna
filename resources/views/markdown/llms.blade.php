# {{ config('app.name', 'وصفاتنا') }} - Syrian Recipes Database

> {{ config('app.name', 'وصفاتنا') }} is a community database of authentic Syrian recipes categorized by cities and tags.

## Core Section & Indexes
- [الرئيسية]({{ $baseUrl }}/): الصفحة الرئيسية ومجتمع الطبخ السوري
- [المدن]({{ $baseUrl }}/cities): تصفح الوصفات السورية حسب المدينة والمنطقة
- [القوائم]({{ $baseUrl }}/lists): مجموعات الوصفات والمفضلات العامة
- [شو نطبخ؟]({{ $baseUrl }}/randomizer): أداة اقتراح الوصفات التفاعلية
- [خطط الوجبات]({{ $baseUrl }}/meal-plans/browse): التخطيط الأسبوعي للوجبات

## Syrian Regional Cuisines
@foreach($cities as $city)
- [وصفات {{ $city->name }}]({{ $baseUrl }}/cities/{{ $city->slug }}): {{ $city->recipes_count }} وصفة
@endforeach

## Recipes Catalog (Markdown Version)
@foreach($recipes as $recipe)
- [{{ $recipe->name }}]({{ $baseUrl }}/recipes/{{ $recipe->slug }}.md): {{ $recipe->description ? Str::limit($recipe->description, 100) : 'طريقة عمل ' . $recipe->name . ' من المطبخ السوري' }}
@endforeach
