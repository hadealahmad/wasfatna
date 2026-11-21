<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  UtensilsCrossed,
  BookmarkCheck,
  RotateCcw,
  Trash2,
  Plus,
  Search,
  Sparkles,
} from 'lucide-vue-next';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import {
  formatPortionAr,
  getFoodById,
  MEAL_META,
  PORTION_STEPS,
  SYRIAN_FOODS,
  type MealEntry,
  type MealType,
  type SyrianFoodItem,
} from '@/data/syrianFoods';

type PantryFilter =
  | 'all'
  | 'recommended'
  | 'bread_carb'
  | 'dairy_dip'
  | 'cooked_protein'
  | 'veg_fruit'
  | 'treat_drink';

const props = defineProps<{
  activeMeal: MealType;
  entries: MealEntry[];
  selectedFoodId: string | null;
  hasBaseline: boolean;
  baselineDeltaCalories: number | null;
}>();

const emit = defineEmits<{
  (e: 'update-portion', payload: { foodId: string; portion: number }): void;
  (e: 'remove-food', foodId: string): void;
  (e: 'add-food', foodId: string): void;
  (e: 'select-food', foodId: string | null): void;
  (e: 'set-baseline'): void;
  (e: 'reset-baseline'): void;
}>();

const searchQuery = ref('');
const activeCategory = ref<PantryFilter>('recommended');
const entryCardRefs = ref<Record<string, HTMLElement | null>>({});

const pantryCategories: Array<{ id: PantryFilter; label: string }> = [
  { id: 'all', label: 'الكل' },
  { id: 'recommended', label: 'المقترح للوجبة' },
  { id: 'bread_carb', label: 'خبز ونشويات' },
  { id: 'dairy_dip', label: 'أجبان وفطور' },
  { id: 'cooked_protein', label: 'طبخ ومشاوي' },
  { id: 'veg_fruit', label: 'خضار وفواكه' },
  { id: 'treat_drink', label: 'حلويات ومشروبات' },
];

const mealMeta = computed(() => MEAL_META[props.activeMeal]);

const resolvedEntries = computed(() =>
  props.entries
    .map((entry) => {
      const food = getFoodById(entry.foodId);
      if (!food) return null;
      return {
        entry,
        food,
        calories: Math.round(food.calories * entry.portion),
        protein: Math.round(food.protein * entry.portion),
        carbs: Math.round(food.carbs * entry.portion),
        fat: Math.round(food.fat * entry.portion),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
);

const mealTotals = computed(() =>
  resolvedEntries.value.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
);

const onTableIds = computed(() => new Set(props.entries.map((e) => e.foodId)));

const filteredPantry = computed<SyrianFoodItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase();

  return SYRIAN_FOODS.filter((food) => {
    if (q) {
      const hay = `${food.nameAr} ${food.unitLabelAr}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    switch (activeCategory.value) {
      case 'all':
        return true;
      case 'recommended':
        return food.defaultMeals.includes(props.activeMeal);
      case 'cooked_protein':
        return food.category === 'cooked_dish' || food.category === 'protein';
      default:
        return food.category === activeCategory.value;
    }
  });
});

function setEntryRef(foodId: string, el: unknown) {
  if (el instanceof HTMLElement) {
    entryCardRefs.value[foodId] = el;
  } else {
    delete entryCardRefs.value[foodId];
  }
}

watch(
  () => props.selectedFoodId,
  async (foodId) => {
    if (!foodId) return;
    await nextTick();
    const target = entryCardRefs.value[foodId];
    if (!target || typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'nearest',
    });
  }
);
</script>

<template>
  <Card class="rounded-2xl py-5 gap-4">
    <CardHeader class="px-5 pb-0 space-y-3">
      <!-- Active Meal Title & Summary -->
      <div class="flex flex-wrap items-center justify-between gap-2">
        <CardTitle class="text-base sm:text-lg flex items-center gap-2">
          <span aria-hidden="true" class="text-xl">{{ mealMeta.emoji }}</span>
          <span>طاولة {{ mealMeta.titleAr }}</span>
          <Badge variant="secondary" class="text-xs tabular-nums">
            {{ resolvedEntries.length }} أطباق
          </Badge>
        </CardTitle>

        <div class="text-end">
          <p class="text-lg font-bold tabular-nums leading-none">
            {{ mealTotals.calories }}
            <span class="text-xs font-normal text-muted-foreground">سعرة</span>
          </p>
          <p class="text-xs text-muted-foreground tabular-nums mt-1">
            ب: {{ mealTotals.protein }}غ · ك: {{ mealTotals.carbs }}غ · د: {{ mealTotals.fat }}غ
          </p>
        </div>
      </div>

      <!-- Baseline Comparison Bar -->
      <div
        class="rounded-xl border border-border/80 bg-muted/40 p-2.5 flex flex-wrap items-center justify-between gap-2"
      >
        <div class="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            class="min-h-8 text-xs gap-1.5"
            @click="emit('set-baseline')"
          >
            <BookmarkCheck aria-hidden="true" class="size-3.5 text-primary" />
            <span>تثبيت كأكلي المعتاد</span>
          </Button>

          <Button
            v-if="hasBaseline"
            type="button"
            size="sm"
            variant="ghost"
            class="min-h-8 text-xs gap-1.5"
            @click="emit('reset-baseline')"
          >
            <RotateCcw aria-hidden="true" class="size-3.5" />
            <span>استرجاع المعتاد</span>
          </Button>
        </div>

        <div v-if="hasBaseline && baselineDeltaCalories !== null" class="text-xs font-semibold tabular-nums">
          <span class="text-muted-foreground font-normal">فرق عن أكلك المعتاد: </span>
          <span
            :class="
              baselineDeltaCalories < 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : baselineDeltaCalories > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-foreground'
            "
          >
            {{ baselineDeltaCalories > 0 ? `+${baselineDeltaCalories}` : baselineDeltaCalories }} سعرة
          </span>
        </div>
        <p v-else class="text-xs text-muted-foreground">
          ثبّت أكلك المعتاد لتجرب التقسيم وتشوف الفرق فوراً.
        </p>
      </div>
    </CardHeader>

    <CardContent class="px-5 space-y-5">
      <!-- Active Foods on This Meal Table -->
      <div class="space-y-2.5">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold flex items-center gap-1.5">
            <UtensilsCrossed aria-hidden="true" class="size-4 text-primary" />
            <span>الأطباق على الطاولة (قسّم الحصة بلمسة)</span>
          </h3>
        </div>

        <div
          v-if="resolvedEntries.length === 0"
          class="rounded-xl border border-dashed border-border p-6 text-center space-y-1.5 bg-muted/20"
        >
          <p class="text-sm font-medium">طاولة {{ mealMeta.titleAr }} فارغة حالياً</p>
          <p class="text-xs text-muted-foreground">
            أضف أطباقاً سورية من القائمة بالأسفل لتظهر فوراً على الطاولة ثلاثية الأبعاد.
          </p>
        </div>

        <ul v-else class="space-y-2.5" aria-label="الأطباق الموجودة على طاولة الوجبة">
          <li
            v-for="item in resolvedEntries"
            :key="item.entry.foodId"
            :ref="(el) => setEntryRef(item.entry.foodId, el)"
            :class="[
              'rounded-xl border p-3 space-y-2.5 transition-[border-color,background-color,box-shadow]',
              selectedFoodId === item.entry.foodId
                ? 'border-primary bg-primary/5 ring-2 ring-primary/25 shadow-xs'
                : 'border-border/80 bg-card hover:border-border',
            ]"
          >
            <!-- Food Header Row -->
            <div class="flex items-start justify-between gap-2">
              <button
                type="button"
                class="flex items-start gap-2.5 text-start flex-1 min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                @click="emit('select-food', item.entry.foodId)"
              >
                <span
                  aria-hidden="true"
                  class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-lg"
                >
                  {{ item.food.emoji }}
                </span>
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span class="text-sm font-semibold truncate">{{ item.food.nameAr }}</span>
                    <Badge variant="outline" class="text-xs px-1.5 py-0 tabular-nums">
                      ×{{ formatPortionAr(item.entry.portion) }}
                    </Badge>
                  </div>
                  <p class="text-xs text-muted-foreground truncate">
                    {{ item.food.unitLabelAr }}
                  </p>
                </div>
              </button>

              <div class="flex items-center gap-2 shrink-0">
                <div class="text-end">
                  <p class="text-sm font-bold tabular-nums">{{ item.calories }} سعرة</p>
                  <p class="text-xs text-muted-foreground tabular-nums">
                    ب{{ item.protein }} · ك{{ item.carbs }} · د{{ item.fat }}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  class="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  :aria-label="`حذف ${item.food.nameAr} من ${mealMeta.titleAr}`"
                  @click="emit('remove-food', item.entry.foodId)"
                >
                  <Trash2 aria-hidden="true" class="size-4" />
                </Button>
              </div>
            </div>

            <!-- One-Tap Partition Pills -->
            <div class="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-border/50">
              <span class="text-xs text-muted-foreground">تقسيم الحصة:</span>
              <div class="flex items-center gap-1 flex-wrap" role="group" :aria-label="`تقسيم حصة ${item.food.nameAr}`">
                <button
                  v-for="step in PORTION_STEPS"
                  :key="step"
                  type="button"
                  :aria-pressed="item.entry.portion === step"
                  :aria-label="`تحديد حصة ${item.food.nameAr} إلى ${formatPortionAr(step)}`"
                  :class="[
                    'min-w-9 min-h-8 px-2 rounded-lg border text-xs font-semibold tabular-nums transition-[color,background-color,border-color,transform] motion-safe:active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    item.entry.portion === step
                      ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                      : 'border-border bg-background hover:bg-accent text-foreground',
                  ]"
                  @click="emit('update-portion', { foodId: item.entry.foodId, portion: step })"
                >
                  {{ formatPortionAr(step) }}
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Syrian Food Pantry -->
      <div class="space-y-3 pt-4 border-t border-border">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-sm font-semibold flex items-center gap-1.5">
            <Sparkles aria-hidden="true" class="size-4 text-amber-500" />
            <span>أضف للسفرة (مطبخ سوري جاهز)</span>
          </h3>
          <span class="text-xs text-muted-foreground tabular-nums">
            {{ filteredPantry.length }} صنف
          </span>
        </div>

        <!-- Instant Arabic Search -->
        <div class="relative">
          <label for="syrian-pantry-search" class="sr-only">ابحث عن أكلة سورية</label>
          <Search
            aria-hidden="true"
            class="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          />
          <Input
            id="syrian-pantry-search"
            v-model="searchQuery"
            type="search"
            placeholder="ابحث عن أكلة... (خبز، فتة، كبة، شاورما، متة)"
            class="ps-9"
          />
        </div>

        <!-- Category Chips -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1" role="group" aria-label="تصنيفات الأطعمة السورية">
          <button
            v-for="cat in pantryCategories"
            :key="cat.id"
            type="button"
            :aria-pressed="activeCategory === cat.id"
            :class="[
              'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-[color,background-color,border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              activeCategory === cat.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background hover:bg-accent text-foreground',
            ]"
            @click="activeCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Quick-Add Grid -->
        <div
          v-if="filteredPantry.length === 0"
          class="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground"
        >
          ما لقينا أكلة بهذا الاسم — جرّب تصنيف "الكل" أو كلمة ثانية.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pe-1">
          <button
            v-for="food in filteredPantry"
            :key="food.id"
            type="button"
            class="group flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-background p-2.5 text-start hover:border-primary/50 hover:bg-accent/50 transition-[color,background-color,border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            @click="emit('add-food', food.id)"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span aria-hidden="true" class="text-lg shrink-0">{{ food.emoji }}</span>
              <div class="min-w-0">
                <p class="text-xs font-semibold truncate">{{ food.nameAr }}</p>
                <p class="text-xs text-muted-foreground truncate">{{ food.unitLabelAr }}</p>
              </div>
            </div>

            <div class="flex flex-col items-end shrink-0 gap-1">
              <span class="text-xs font-bold tabular-nums">{{ food.calories }}</span>
              <span
                :class="[
                  'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
                  onTableIds.has(food.id)
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors',
                ]"
              >
                <Plus aria-hidden="true" class="size-3" />
                <span>{{ onTableIds.has(food.id) ? 'زيادة' : 'أضف' }}</span>
              </span>
            </div>
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
