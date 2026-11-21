<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Hand,
  Minus,
  MousePointerClick,
  Move3d,
  Plus,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wand2,
  X,
} from 'lucide-vue-next';
import {
  formatPortionAr,
  MEAL_META,
  PORTION_STEPS,
  SYRIAN_FOODS,
  type ActivityLevel,
  type CalorieProfileData,
  type GoalType,
  type MealsState,
  type MealType,
  type WeightTrend,
} from '@/data/syrianFoods';
import { analyzeCalorieProfile } from '@/lib/calorieEngine';

const props = defineProps<{
  initial: CalorieProfileData;
}>();

const emit = defineEmits<{
  (e: 'preview', payload: { meal: MealType | null; meals: MealsState }): void;
  (e: 'finish', profile: CalorieProfileData): void;
  (e: 'skip'): void;
}>();

type StepId =
  | 'welcome'
  | 'body'
  | 'activity'
  | 'trend'
  | 'goal'
  | 'breakfast'
  | 'lunch'
  | 'late_dinner'
  | 'controls';

const STEPS: StepId[] = [
  'welcome',
  'body',
  'activity',
  'trend',
  'goal',
  'breakfast',
  'lunch',
  'late_dinner',
  'controls',
];

const MEAL_STEPS: MealType[] = ['breakfast', 'lunch', 'late_dinner'];

function cloneDraft(source: CalorieProfileData): CalorieProfileData {
  return {
    ...source,
    meals: {
      breakfast: source.meals.breakfast.map((e) => ({ ...e })),
      lunch: source.meals.lunch.map((e) => ({ ...e })),
      late_dinner: source.meals.late_dinner.map((e) => ({ ...e })),
    },
    baseline_meals: null,
  };
}

const draft = ref<CalorieProfileData>(cloneDraft(props.initial));
const stepIndex = ref(0);
const showAllFoods = ref(false);
const headingRef = ref<HTMLElement | null>(null);

const step = computed<StepId>(() => STEPS[stepIndex.value]);
const isMealStep = computed(() => (MEAL_STEPS as string[]).includes(step.value));
const currentMeal = computed<MealType | null>(() =>
  isMealStep.value ? (step.value as MealType) : null
);
const progressPercent = computed(() => Math.round((stepIndex.value / (STEPS.length - 1)) * 100));
const analysis = computed(() => analyzeCalorieProfile(draft.value));

watch(
  [currentMeal, () => draft.value.meals],
  () => {
    emit('preview', { meal: currentMeal.value, meals: draft.value.meals });
  },
  { deep: true, immediate: true }
);

watch(stepIndex, async () => {
  showAllFoods.value = false;
  await nextTick();
  headingRef.value?.focus();
});

// ---- Body stats ----
type StatKey = 'age' | 'height_cm' | 'weight_kg';
const statFields: Array<{
  key: StatKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}> = [
  { key: 'age', label: 'العمر', unit: 'سنة', min: 12, max: 100, step: 1 },
  { key: 'height_cm', label: 'الطول', unit: 'سم', min: 100, max: 240, step: 1 },
  { key: 'weight_kg', label: 'الوزن', unit: 'كغ', min: 30, max: 250, step: 0.5 },
];

function setStat(key: StatKey, raw: number | string) {
  const field = statFields.find((f) => f.key === key);
  if (!field) return;
  const num = Number(raw);
  if (!Number.isFinite(num)) return;
  const clamped = Math.min(field.max, Math.max(field.min, num));
  const value = Math.round(clamped / field.step) * field.step;
  draft.value[key] = value;
}

function nudgeStat(key: StatKey, dir: 1 | -1) {
  const field = statFields.find((f) => f.key === key);
  if (!field) return;
  setStat(key, draft.value[key] + dir * field.step);
}

// ---- Choice cards ----
const activityOptions: Array<{ value: ActivityLevel; emoji: string; label: string; desc: string }> = [
  { value: 'sedentary', emoji: '🪑', label: 'قليل الحركة', desc: 'شغل مكتبي، مشي قليل' },
  { value: 'light', emoji: '🚶', label: 'حركة خفيفة', desc: 'مشي أو رياضة ١–٣ أيام' },
  { value: 'moderate', emoji: '🚴', label: 'متوسط', desc: 'رياضة ٣–٥ أيام بالأسبوع' },
  { value: 'active', emoji: '🏋️', label: 'نشيط', desc: 'شغل حركي أو رياضة يومية' },
  { value: 'very_active', emoji: '⚒️', label: 'نشيط جداً', desc: 'مجهود بدني عالي كل يوم' },
];

const trendOptions: Array<{ value: WeightTrend; icon: typeof Scale; label: string; desc: string; tone: string }> = [
  {
    value: 'losing',
    icon: TrendingDown,
    label: 'وزني عم ينزل',
    desc: 'آخر شهر الميزان عم ينقص',
    tone: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    value: 'maintaining',
    icon: Scale,
    label: 'وزني ثابت',
    desc: 'ما في تغيير واضح',
    tone: 'text-sky-600 dark:text-sky-400',
  },
  {
    value: 'gaining',
    icon: TrendingUp,
    label: 'وزني عم يزيد',
    desc: 'آخر شهر الميزان عم يطلع',
    tone: 'text-rose-600 dark:text-rose-400',
  },
];

const goalOptions: Array<{ value: GoalType; emoji: string; label: string; desc: string }> = [
  { value: 'lose', emoji: '🔥', label: 'بدي نزّل وزن', desc: 'عجز مريح بدون حرمان' },
  { value: 'maintain', emoji: '⚖️', label: 'بدي حافظ على وزني', desc: 'توازن يومي' },
  { value: 'gain', emoji: '💪', label: 'بدي زيد وزن', desc: 'فائض صحي وعضل' },
];

// ---- Meal picking ----
const mealFoods = computed(() => {
  const meal = currentMeal.value;
  if (!meal) return [];
  if (showAllFoods.value) return SYRIAN_FOODS;
  return SYRIAN_FOODS.filter((f) => f.defaultMeals.includes(meal));
});

function entryFor(foodId: string) {
  const meal = currentMeal.value;
  if (!meal) return undefined;
  return draft.value.meals[meal].find((e) => e.foodId === foodId);
}

function toggleFood(foodId: string) {
  const meal = currentMeal.value;
  if (!meal) return;
  const list = draft.value.meals[meal];
  const idx = list.findIndex((e) => e.foodId === foodId);
  if (idx === -1) list.push({ foodId, portion: 1 });
  else list.splice(idx, 1);
}

function stepPortion(foodId: string, dir: 1 | -1) {
  const entry = entryFor(foodId);
  if (!entry) return;
  const steps = PORTION_STEPS as readonly number[];
  const idx = steps.indexOf(entry.portion);
  const next = steps[Math.min(steps.length - 1, Math.max(0, (idx === -1 ? 3 : idx) + dir))];
  if (dir === -1 && idx === 0) {
    toggleFood(foodId);
    return;
  }
  entry.portion = next;
}

const mealCalories = computed(() => {
  const meal = currentMeal.value;
  return meal ? analysis.value.mealBreakdown[meal].calories : 0;
});

// ---- Navigation ----
function next() {
  if (stepIndex.value < STEPS.length - 1) {
    stepIndex.value += 1;
    return;
  }
  emit('finish', { ...draft.value, baseline_meals: null });
}

function back() {
  if (stepIndex.value > 0) stepIndex.value -= 1;
}

const nextLabel = computed(() => {
  if (step.value === 'welcome') return 'يلا نبلّش';
  if (step.value === 'controls') return 'افتح سفرتي';
  return 'التالي';
});

const statusUi = computed(() => {
  const a = analysis.value;
  const delta = Math.round(a.currentDailyCalories - a.calibratedTdee);
  if (a.status === 'deficit')
    return { label: `عجز ${Math.abs(delta)} سعرة/يوم`, cls: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/15' };
  if (a.status === 'surplus')
    return { label: `فائض ${Math.abs(delta)} سعرة/يوم`, cls: 'text-rose-700 dark:text-rose-300 bg-rose-500/15' };
  return { label: 'متوازن تقريباً', cls: 'text-sky-700 dark:text-sky-300 bg-sky-500/15' };
});

const controlTips = [
  { icon: MousePointerClick, title: 'اضغط على أي صحن', desc: 'بيطلعلك تحت محرّر الحصة: ¼ ، ½ ، رغيف كامل… أو احذفه.' },
  { icon: Move3d, title: 'اسحب لتدوير السفرة', desc: 'وعجلة الماوس أو أزرار + / − للتكبير والتصغير.' },
  { icon: Hand, title: 'لوحة التحكم', desc: 'من اللوحة الجانبية بتضيف أكلات، بتعدّل جسمك، وبتبدّل بين الوجبات.' },
  { icon: Wand2, title: 'المدرب الذكي', desc: 'بيقترح تقسيمات وبدائل شامية أخف بضغطة وحدة.' },
];

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('skip');
}
</script>

<template>
  <div
    class="absolute inset-0 z-50 flex items-end justify-center p-2 sm:p-4 lg:items-center lg:justify-start lg:p-6 transition-[background-color,backdrop-filter] duration-500"
    :class="isMealStep ? 'bg-black/10' : 'bg-black/35 backdrop-blur-[3px]'"
    @keydown="onKeydown"
  >
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="calorie-wizard-title"
      class="relative flex max-h-[min(92%,760px)] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/30 bg-background/92 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/88"
    >
      <!-- Progress -->
      <div class="flex items-center gap-3 px-5 pt-4">
        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            class="h-full rounded-full bg-gradient-to-l from-amber-500 to-orange-500 transition-[width] duration-500"
            :style="{ width: `${Math.max(4, progressPercent)}%` }"
          />
        </div>
        <span class="text-xs tabular-nums text-muted-foreground">
          {{ stepIndex + 1 }} / {{ STEPS.length }}
        </span>
        <button
          type="button"
          class="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          aria-label="تخطي المعالج"
          title="تخطي"
          @click="emit('skip')"
        >
          <X class="size-4" aria-hidden="true" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 pb-4 pt-3">
        <Transition
          mode="out-in"
          enter-active-class="motion-safe:transition motion-safe:duration-300"
          enter-from-class="opacity-0 translate-y-2"
          leave-active-class="motion-safe:transition motion-safe:duration-150"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div :key="step" class="space-y-4">
            <!-- WELCOME -->
            <template v-if="step === 'welcome'">
              <div class="text-5xl" aria-hidden="true">🫓🥗🌙</div>
              <h2 id="calorie-wizard-title" ref="headingRef" tabindex="-1" class="text-2xl font-bold outline-none">
                أهلاً بك على السفرة السورية!
              </h2>
              <p class="text-sm leading-relaxed text-muted-foreground">
                رح نسألك كم سؤال سريع عن جسمك وعن أكلك المعتاد بالفطور والغدا والعشا المتأخر،
                وبعدها بنفرد سفرتك بالثلاثي الأبعاد وبنحسبلك إذا أكلك عم يعمل عجز أو فائض — وكيف تعدّل عليه بدون ما تترك أكل البيت.
              </p>
              <ul class="grid gap-2 text-sm">
                <li class="flex items-center gap-2"><Check class="size-4 text-emerald-500" aria-hidden="true" /> أقل من دقيقة</li>
                <li class="flex items-center gap-2"><Check class="size-4 text-emerald-500" aria-hidden="true" /> بتقدر تغيّر كل شي لاحقاً</li>
                <li class="flex items-center gap-2"><Check class="size-4 text-emerald-500" aria-hidden="true" /> بينحفظ تلقائياً لما تكون مسجّل دخول</li>
              </ul>
            </template>

            <!-- BODY -->
            <template v-else-if="step === 'body'">
              <h2 id="calorie-wizard-title" ref="headingRef" tabindex="-1" class="text-xl font-bold outline-none">
                عرّفنا على جسمك
              </h2>
              <p class="text-sm text-muted-foreground">منحسب منها حرق جسمك اليومي (BMR + النشاط).</p>
              <div class="grid grid-cols-2 gap-2" role="group" aria-label="الجنس">
                <button
                  v-for="g in [{ v: 'male', l: 'ذكر', e: '👨' }, { v: 'female', l: 'أنثى', e: '👩' }] as const"
                  :key="g.v"
                  type="button"
                  :aria-pressed="draft.gender === g.v"
                  class="flex items-center justify-center gap-2 rounded-2xl border-2 p-3 text-sm font-semibold transition-[border-color,background-color] focus-visible:outline-2 focus-visible:outline-ring"
                  :class="draft.gender === g.v ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'"
                  @click="draft.gender = g.v"
                >
                  <span class="text-xl" aria-hidden="true">{{ g.e }}</span>{{ g.l }}
                </button>
              </div>
              <div class="space-y-3">
                <div
                  v-for="field in statFields"
                  :key="field.key"
                  class="rounded-2xl border border-border/70 bg-muted/30 p-3"
                >
                  <div class="flex items-center justify-between gap-2">
                    <label :for="`wiz-${field.key}`" class="text-sm font-medium">{{ field.label }}</label>
                    <div class="flex items-center gap-1.5">
                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-full border bg-background hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                        :aria-label="`إنقاص ${field.label}`"
                        @click="nudgeStat(field.key, -1)"
                      >
                        <Minus class="size-3.5" aria-hidden="true" />
                      </button>
                      <input
                        :id="`wiz-${field.key}`"
                        type="number"
                        inputmode="decimal"
                        :min="field.min"
                        :max="field.max"
                        :step="field.step"
                        :value="draft[field.key]"
                        class="w-16 rounded-lg border bg-background px-1 py-1 text-center text-base font-bold tabular-nums"
                        @change="setStat(field.key, ($event.target as HTMLInputElement).value)"
                      />
                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-full border bg-background hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                        :aria-label="`زيادة ${field.label}`"
                        @click="nudgeStat(field.key, 1)"
                      >
                        <Plus class="size-3.5" aria-hidden="true" />
                      </button>
                      <span class="w-7 text-xs text-muted-foreground">{{ field.unit }}</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    :min="field.min"
                    :max="field.max"
                    :step="field.step"
                    :value="draft[field.key]"
                    :aria-label="field.label"
                    class="mt-2 w-full accent-amber-500"
                    @input="setStat(field.key, ($event.target as HTMLInputElement).value)"
                  />
                </div>
              </div>
            </template>

            <!-- ACTIVITY -->
            <template v-else-if="step === 'activity'">
              <h2 id="calorie-wizard-title" ref="headingRef" tabindex="-1" class="text-xl font-bold outline-none">
                قديش بتتحرك بيومك؟
              </h2>
              <div class="grid gap-2" role="radiogroup" aria-label="مستوى النشاط">
                <button
                  v-for="opt in activityOptions"
                  :key="opt.value"
                  type="button"
                  role="radio"
                  :aria-checked="draft.activity_level === opt.value"
                  class="flex items-center gap-3 rounded-2xl border-2 p-3 text-start transition-[border-color,background-color] focus-visible:outline-2 focus-visible:outline-ring"
                  :class="draft.activity_level === opt.value ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'"
                  @click="draft.activity_level = opt.value"
                >
                  <span class="text-2xl" aria-hidden="true">{{ opt.emoji }}</span>
                  <span class="flex-1">
                    <span class="block text-sm font-semibold">{{ opt.label }}</span>
                    <span class="block text-xs text-muted-foreground">{{ opt.desc }}</span>
                  </span>
                  <Check v-if="draft.activity_level === opt.value" class="size-5 text-primary" aria-hidden="true" />
                </button>
              </div>
            </template>

            <!-- TREND -->
            <template v-else-if="step === 'trend'">
              <h2 id="calorie-wizard-title" ref="headingRef" tabindex="-1" class="text-xl font-bold outline-none">
                شو عم يصير بوزنك هالفترة؟
              </h2>
              <p class="text-sm text-muted-foreground">
                هاد أهم سؤال! منقارن ميزانك بأكلك المعتاد لنعرف حرقك الحقيقي، مو بس الرقم النظري.
              </p>
              <div class="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="اتجاه الوزن">
                <button
                  v-for="opt in trendOptions"
                  :key="opt.value"
                  type="button"
                  role="radio"
                  :aria-checked="draft.weight_trend === opt.value"
                  class="flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 text-center transition-[border-color,background-color] focus-visible:outline-2 focus-visible:outline-ring"
                  :class="draft.weight_trend === opt.value ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'"
                  @click="draft.weight_trend = opt.value"
                >
                  <component :is="opt.icon" class="size-7" :class="opt.tone" aria-hidden="true" />
                  <span class="text-sm font-semibold">{{ opt.label }}</span>
                  <span class="text-xs text-muted-foreground">{{ opt.desc }}</span>
                </button>
              </div>
            </template>

            <!-- GOAL -->
            <template v-else-if="step === 'goal'">
              <h2 id="calorie-wizard-title" ref="headingRef" tabindex="-1" class="text-xl font-bold outline-none">
                شو هدفك؟
              </h2>
              <div class="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="الهدف">
                <button
                  v-for="opt in goalOptions"
                  :key="opt.value"
                  type="button"
                  role="radio"
                  :aria-checked="draft.goal === opt.value"
                  class="flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 text-center transition-[border-color,background-color] focus-visible:outline-2 focus-visible:outline-ring"
                  :class="draft.goal === opt.value ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'"
                  @click="draft.goal = opt.value"
                >
                  <span class="text-3xl" aria-hidden="true">{{ opt.emoji }}</span>
                  <span class="text-sm font-semibold">{{ opt.label }}</span>
                  <span class="text-xs text-muted-foreground">{{ opt.desc }}</span>
                </button>
              </div>
              <div class="rounded-2xl bg-muted/40 p-3 text-sm">
                حرق جسمك التقديري:
                <strong class="tabular-nums">{{ analysis.calibratedTdee }}</strong> سعرة —
                هدفك اليومي: <strong class="tabular-nums text-primary">{{ analysis.targetCalories }}</strong> سعرة
              </div>
            </template>

            <!-- MEAL PICKS -->
            <template v-else-if="currentMeal">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h2 id="calorie-wizard-title" ref="headingRef" tabindex="-1" class="text-xl font-bold outline-none">
                    {{ MEAL_META[currentMeal].emoji }} شو بتاكل عادةً على {{ MEAL_META[currentMeal].titleAr }}؟
                  </h2>
                  <p class="mt-1 text-xs text-muted-foreground">
                    اختار أكلك الحقيقي مو المثالي 😉 — شوفه عم ينحط على السفرة وراك.
                  </p>
                </div>
                <div class="shrink-0 rounded-2xl bg-amber-500/15 px-3 py-1.5 text-center">
                  <div class="text-lg font-bold tabular-nums text-amber-700 dark:text-amber-300">{{ mealCalories }}</div>
                  <div class="text-[11px] text-muted-foreground">سعرة</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div
                  v-for="food in mealFoods"
                  :key="food.id"
                  class="relative rounded-2xl border-2 transition-[border-color,background-color]"
                  :class="entryFor(food.id) ? 'border-amber-500 bg-amber-500/10' : 'border-border hover:border-amber-500/40'"
                >
                  <button
                    type="button"
                    :aria-pressed="Boolean(entryFor(food.id))"
                    class="flex w-full flex-col items-start gap-0.5 p-2.5 text-start focus-visible:outline-2 focus-visible:outline-ring rounded-2xl"
                    @click="toggleFood(food.id)"
                  >
                    <span class="text-2xl" aria-hidden="true">{{ food.emoji }}</span>
                    <span class="line-clamp-1 text-xs font-semibold">{{ food.nameAr }}</span>
                    <span class="text-[11px] tabular-nums text-muted-foreground">{{ food.calories }} سعرة</span>
                  </button>
                  <div
                    v-if="entryFor(food.id)"
                    class="flex items-center justify-between gap-1 border-t border-amber-500/30 px-1.5 py-1"
                  >
                    <button
                      type="button"
                      class="flex size-6 items-center justify-center rounded-full hover:bg-background"
                      :aria-label="`إنقاص حصة ${food.nameAr}`"
                      @click="stepPortion(food.id, -1)"
                    >
                      <Minus class="size-3" aria-hidden="true" />
                    </button>
                    <span class="text-xs font-bold tabular-nums">{{ formatPortionAr(entryFor(food.id)!.portion) }}×</span>
                    <button
                      type="button"
                      class="flex size-6 items-center justify-center rounded-full hover:bg-background"
                      :aria-label="`زيادة حصة ${food.nameAr}`"
                      @click="stepPortion(food.id, 1)"
                    >
                      <Plus class="size-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                class="text-xs font-medium text-primary underline-offset-4 hover:underline"
                @click="showAllFoods = !showAllFoods"
              >
                {{ showAllFoods ? 'اعرض المقترح لهالوجبة بس' : 'اعرض كل الأكلات' }}
              </button>
            </template>

            <!-- CONTROLS + RESULT -->
            <template v-else-if="step === 'controls'">
              <h2 id="calorie-wizard-title" ref="headingRef" tabindex="-1" class="text-xl font-bold outline-none">
                <Sparkles class="inline size-5 text-amber-500" aria-hidden="true" /> هي نتيجتك المبدئية
              </h2>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="rounded-2xl bg-muted/40 p-2.5">
                  <div class="text-lg font-bold tabular-nums">{{ analysis.currentDailyCalories }}</div>
                  <div class="text-[11px] text-muted-foreground">أكلك اليومي</div>
                </div>
                <div class="rounded-2xl bg-muted/40 p-2.5">
                  <div class="text-lg font-bold tabular-nums">{{ analysis.calibratedTdee }}</div>
                  <div class="text-[11px] text-muted-foreground">حرقك الحقيقي</div>
                </div>
                <div class="rounded-2xl bg-primary/10 p-2.5">
                  <div class="text-lg font-bold tabular-nums text-primary">{{ analysis.targetCalories }}</div>
                  <div class="text-[11px] text-muted-foreground">هدفك</div>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusUi.cls">{{ statusUi.label }}</span>
                <span class="text-xs text-muted-foreground">{{ analysis.crossCheckInsightAr }}</span>
              </div>

              <h3 class="pt-1 text-sm font-bold">كيف بتتحكم بسفرتك</h3>
              <ul class="grid gap-2 sm:grid-cols-2">
                <li
                  v-for="tip in controlTips"
                  :key="tip.title"
                  class="flex items-start gap-2.5 rounded-2xl border border-border/70 p-3"
                >
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    <component :is="tip.icon" class="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span class="block text-sm font-semibold">{{ tip.title }}</span>
                    <span class="block text-xs leading-relaxed text-muted-foreground">{{ tip.desc }}</span>
                  </span>
                </li>
              </ul>
            </template>
          </div>
        </Transition>
      </div>

      <!-- Footer nav -->
      <div class="flex items-center justify-between gap-2 border-t border-border/60 bg-muted/20 px-5 py-3">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground disabled:invisible focus-visible:outline-2 focus-visible:outline-ring"
          :disabled="stepIndex === 0"
          @click="back"
        >
          <ArrowRight class="size-4" aria-hidden="true" /> رجوع
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:brightness-105 motion-safe:active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          @click="next"
        >
          {{ nextLabel }} <ArrowLeft class="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  </div>
</template>
