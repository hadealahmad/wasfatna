# وصفاتنا (Wasfatna) - Full Recipe Catalog

> Full aggregated Markdown database of authentic Syrian recipes.

@foreach($recipes as $recipe)
---

# {{ $recipe->name }}

> {{ $recipe->description ?? 'طريقة عمل ' . $recipe->name . ' من المطبخ السوري' }}

@php
    $timeDisplay = null;
    if (!empty($recipe->time_needed)) {
        if (is_array($recipe->time_needed)) {
            $parts = [];
            if (!empty($recipe->time_needed['prep'])) {
                $parts[] = 'تحضير: ' . $recipe->time_needed['prep'] . ' دقيقة';
            }
            if (!empty($recipe->time_needed['cook'])) {
                $parts[] = 'طبخ: ' . $recipe->time_needed['cook'] . ' دقيقة';
            }
            if (!empty($recipe->time_needed['raw'])) {
                $parts[] = $recipe->time_needed['raw'];
            }
            if (empty($parts)) {
                foreach ($recipe->time_needed as $k => $v) {
                    if ($v) $parts[] = (is_string($k) ? "$k: " : '') . $v;
                }
            }
            $timeDisplay = implode(' | ', $parts);
        } else {
            $timeDisplay = (string) $recipe->time_needed;
        }
    }
@endphp
- **المدينة / المنطقة**: {{ $recipe->city?->name ?? 'غير محدد' }}
- **مستوى الصعوبة**: {{ $recipe->difficulty }}
@if($timeDisplay)
- **الوقت اللازم**: {{ $timeDisplay }}
@endif
- **عدد الوجبات**: {{ $recipe->servings ?? 'غير محدد' }}
- **كاتب الوصفة**: {{ $recipe->author_name }}
- **الوسوم**: {{ $recipe->tags->pluck('name')->implode(', ') }}
@if($recipe->image_url)
- **الصورة**: {{ $recipe->image_url }}
@endif
- **الرابط الأصلي**: {{ $baseUrl }}/recipes/{{ $recipe->slug }}

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

@if($recipe->steps && is_array($recipe->steps))
## طريقة التحضير

@foreach($recipe->steps as $groupKey => $stepGroup)
@if(is_array($stepGroup) && isset($stepGroup['items']) && is_array($stepGroup['items']))
@if(!empty($stepGroup['name']))
### {{ $stepGroup['name'] }}
@endif
@foreach($stepGroup['items'] as $index => $step)
{{ $index + 1 }}. {{ is_array($step) ? ($step['text'] ?? $step['name'] ?? '') : $step }}
@endforeach

@elseif(is_array($stepGroup))
@if(is_string($groupKey) && $groupKey !== '')
### {{ $groupKey }}
@endif
@foreach(array_values($stepGroup) as $index => $step)
@if(is_string($step))
{{ $index + 1 }}. {{ $step }}
@endif
@endforeach

@elseif(is_string($stepGroup))
{{ $loop->iteration }}. {{ $stepGroup }}
@endif
@endforeach
@endif

@endforeach
