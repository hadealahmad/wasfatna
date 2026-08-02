# {{ $recipe->name }}

> {{ $recipe->description ?? 'تعلم طريقة عمل ' . $recipe->name . ' من المطبخ السوري. اكتشف المكونات والخطوات بالتفصيل.' }}

- **المدينة / المنطقة**: {{ $recipe->city?->name ?? 'غير محدد' }}
- **مستوى الصعوبة**: {{ $recipe->difficulty }}
- **عدد الوجبات**: {{ $recipe->servings ?? 'غير محدد' }}
- **كاتب الوصفة**: {{ $recipe->author_name }}
- **الوسوم**: {{ $recipe->tags->pluck('name')->implode(', ') }}
- **الرابط الأصلي للموقع**: {{ $baseUrl }}/recipes/{{ $recipe->slug }}

---

## المكونات

@php
    $ingredients = $recipe->ingredients;
    $groups = [];
    if (is_array($ingredients) || $ingredients instanceof \Illuminate\Support\Collection) {
        foreach($ingredients as $item) {
            $gName = $item->pivot->group ?? 'المكونات';
            $groups[$gName][] = trim(($item->pivot->amount ?? '') . ' ' . ($item->pivot->unit ?? '') . ' ' . $item->name . ' ' . ($item->pivot->ingredient_descriptor ?? ''));
        }
    }
@endphp
@foreach($groups as $groupName => $items)
### {{ $groupName }}
@foreach($items as $item)
- {{ $item }}
@endforeach
@endforeach

---

## طريقة التحضير

@php
    $steps = $recipe->steps;
@endphp
@if(is_array($steps))
@foreach($steps as $stepGroup)
@if(is_array($stepGroup) && isset($stepGroup['items']))
@if(!empty($stepGroup['name']))
### {{ $stepGroup['name'] }}
@endif
@foreach($stepGroup['items'] as $index => $stepItem)
{{ $index + 1 }}. {{ is_array($stepItem) ? ($stepItem['text'] ?? $stepItem['name'] ?? '') : $stepItem }}
@endforeach
@elseif(is_string($stepGroup))
1. {{ $stepGroup }}
@endif
@endforeach
@endif
