<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import axios from 'axios';
import { toast } from 'vue-sonner';
import {
  Check,
  ChevronsLeft,
  ChevronsRight,
  CloudOff,
  HardDrive,
  LoaderCircle,
  PanelRightOpen,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  UtensilsCrossed,
  Wand2,
  X,
  Cloud,
  Compass,
} from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { Badge, Skeleton } from '@/components/ui';
import CalorieWizard from '@/components/calories/CalorieWizard.vue';
import BodyCalculatorCard from '@/components/calories/BodyCalculatorCard.vue';
import MealTablePanel from '@/components/calories/MealTablePanel.vue';
import CoachRecommendations from '@/components/calories/CoachRecommendations.vue';
import {
  DEFAULT_PROFILE,
  DEFAULT_SYRIAN_MEALS,
  formatPortionAr,
  getFoodById,
  MEAL_META,
  PORTION_STEPS,
  type CalorieProfileData,
  type MealEntry,
  type MealsState,
  type MealType,
} from '@/data/syrianFoods';
import {
  analyzeCalorieProfile,
  generateCoachSuggestions,
  type CoachSuggestion,
} from '@/lib/calorieEngine';

const SyrianTable3D = defineAsyncComponent(
  () => import('@/components/calories/SyrianTable3D.vue')
);

const STORAGE_KEY = 'wasfatna_calorie_profile_v1';
const ONBOARDED_KEY = 'wasfatna_calorie_onboarded_v1';
const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'late_dinner'];

const props = defineProps<{
  initialProfile: CalorieProfileData | null;
}>();

const page = usePage();
const isAuthenticated = computed(() => Boolean(page.props.auth?.user));

function cloneMeals(meals: MealsState): MealsState {
  return {
    breakfast: (meals.breakfast ?? []).map((entry) => ({
      foodId: entry.foodId,
      portion: entry.portion,
    })),
    lunch: (meals.lunch ?? []).map((entry) => ({
      foodId: entry.foodId,
      portion: entry.portion,
    })),
    late_dinner: (meals.late_dinner ?? []).map((entry) => ({
      foodId: entry.foodId,
      portion: entry.portion,
    })),
  };
}

function cloneProfile(source: CalorieProfileData): CalorieProfileData {
  return {
    gender: source.gender,
    age: source.age,
    height_cm: source.height_cm,
    weight_kg: source.weight_kg,
    activity_level: source.activity_level,
    weight_trend: source.weight_trend,
    goal: source.goal,
    meals: cloneMeals(source.meals),
    baseline_meals: source.baseline_meals ? cloneMeals(source.baseline_meals) : null,
  };
}

function isValidProfilePayload(value: unknown): value is CalorieProfileData {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<CalorieProfileData>;
  return (
    (candidate.gender === 'male' || candidate.gender === 'female') &&
    typeof candidate.age === 'number' &&
    typeof candidate.height_cm === 'number' &&
    typeof candidate.weight_kg === 'number' &&
    typeof candidate.activity_level === 'string' &&
    typeof candidate.weight_trend === 'string' &&
    typeof candidate.goal === 'string' &&
    Boolean(candidate.meals) &&
    Array.isArray(candidate.meals?.breakfast) &&
    Array.isArray(candidate.meals?.lunch) &&
    Array.isArray(candidate.meals?.late_dinner)
  );
}

const profile = ref<CalorieProfileData>(
  cloneProfile(props.initialProfile ?? DEFAULT_PROFILE)
);

const activeMeal = ref<MealType>('breakfast');
const selectedFoodId = ref<string | null>(null);
const activeDockTab = ref<'body' | 'table' | 'coach'>('table');
const desktopPanelOpen = ref(true);
const mobileSheetOpen = ref(false);
const isDesktop = ref(false);
const wizardOpen = ref(false);
const wizardPreview = ref<{ meal: MealType | null; meals: MealsState } | null>(null);
let desktopMql: MediaQueryList | null = null;
const saveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle');
const isMounted = ref(false);
const confirmingReset = ref(false);

let isHydrating = true;
let saveDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let resetConfirmTimer: ReturnType<typeof setTimeout> | null = null;

const analysis = computed(() => analyzeCalorieProfile(profile.value));
const suggestions = computed(() => generateCoachSuggestions(profile.value, analysis.value));

function resolveSaveEndpoint(): string {
  try {
    if (typeof route === 'function') {
      return route('web-api.calorie-profile.update');
    }
  } catch {
    // Fallback to static path if route helper isn't registered yet
  }
  return '/web-api/calorie-profile';
}

async function persistToServer() {
  if (!isAuthenticated.value) return;
  saveStatus.value = 'saving';
  try {
    await axios.put(resolveSaveEndpoint(), profile.value);
    saveStatus.value = 'saved';
  } catch {
    saveStatus.value = 'error';
  }
}

function persistToLocalStorage() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile.value));
  } catch {
    // Ignore quota/storage errors
  }
}

function schedulePersist() {
  if (isHydrating) return;

  if (!isAuthenticated.value) {
    persistToLocalStorage();
    return;
  }

  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
  }
  saveStatus.value = 'saving';
  saveDebounceTimer = setTimeout(() => {
    void persistToServer();
  }, 700);
}

function syncDesktop() {
  isDesktop.value = Boolean(desktopMql?.matches);
}

onMounted(() => {
  isMounted.value = true;
  desktopMql = window.matchMedia('(min-width: 1024px)');
  syncDesktop();
  desktopMql.addEventListener('change', syncDesktop);

  let restoredGuestProfile: CalorieProfileData | null = null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidProfilePayload(parsed)) {
        restoredGuestProfile = cloneProfile(parsed);
      }
    }
  } catch {
    // Ignore malformed local storage
  }

  let onboarded = false;
  try {
    onboarded = window.localStorage.getItem(ONBOARDED_KEY) === '1';
  } catch {
    // Ignore storage errors
  }
  const hasSavedProfile = Boolean(props.initialProfile) || Boolean(restoredGuestProfile);
  if (!onboarded && !hasSavedProfile) {
    wizardOpen.value = true;
  }

  if (isAuthenticated.value) {
    if (props.initialProfile === null && restoredGuestProfile) {
      profile.value = restoredGuestProfile;
      isHydrating = false;
      void persistToServer();
      toast.success('تم استيراد خطتك المحفوظة محلياً ومزامنتها مع حسابك');
      return;
    }
    saveStatus.value = props.initialProfile ? 'saved' : 'idle';
  } else if (restoredGuestProfile) {
    profile.value = restoredGuestProfile;
  }

  isHydrating = false;
});

onBeforeUnmount(() => {
  desktopMql?.removeEventListener('change', syncDesktop);
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
  if (resetConfirmTimer) clearTimeout(resetConfirmTimer);
});

watch(
  profile,
  () => {
    schedulePersist();
  },
  { deep: true }
);

function handleProfilePatch(patch: Partial<CalorieProfileData>) {
  profile.value = {
    ...profile.value,
    ...patch,
  };
}

function switchMeal(meal: MealType) {
  activeMeal.value = meal;
  selectedFoodId.value = null;
}

function handleSelectFoodFrom3D(foodId: string | null) {
  selectedFoodId.value = foodId;
}

function handleUpdatePortion({ foodId, portion }: { foodId: string; portion: number }) {
  const list = profile.value.meals[activeMeal.value];
  const entry = list.find((e) => e.foodId === foodId);
  if (!entry) return;
  entry.portion = portion;
  selectedFoodId.value = foodId;
}

function handleRemoveFood(foodId: string) {
  const food = getFoodById(foodId);
  profile.value.meals[activeMeal.value] = profile.value.meals[activeMeal.value].filter(
    (e) => e.foodId !== foodId
  );
  if (selectedFoodId.value === foodId) {
    selectedFoodId.value = null;
  }
  if (food) {
    toast.info(`تم حذف ${food.nameAr} من ${MEAL_META[activeMeal.value].titleAr}`);
  }
}

function getNextPortionStep(current: number): number {
  const next = PORTION_STEPS.find((step) => step > current);
  return next ?? PORTION_STEPS[PORTION_STEPS.length - 1];
}

function handleAddFood(foodId: string) {
  const food = getFoodById(foodId);
  if (!food) return;

  const list = profile.value.meals[activeMeal.value];
  const existing = list.find((e) => e.foodId === foodId);

  if (existing) {
    const nextPortion = getNextPortionStep(existing.portion);
    if (nextPortion === existing.portion) {
      toast.info(`${food.nameAr} وصل لأعلى حصة متاحة على الطاولة`);
    } else {
      existing.portion = nextPortion;
      toast.success(`تمت زيادة حصة ${food.nameAr}`);
    }
  } else {
    list.push({ foodId, portion: 1 });
    toast.success(`تمت إضافة ${food.nameAr} إلى ${MEAL_META[activeMeal.value].titleAr}`);
  }

  selectedFoodId.value = foodId;
}

function handleSetBaseline() {
  profile.value.baseline_meals = cloneMeals(profile.value.meals);
  toast.success('تم تثبيت وجباتك الحالية كأكلك المعتاد للمقارنة');
}

function handleResetBaseline() {
  if (!profile.value.baseline_meals) return;
  profile.value.meals = cloneMeals(profile.value.baseline_meals);
  selectedFoodId.value = null;
  toast.info('تم استرجاع أكلك المعتاد');
}

function handleApplySuggestion(suggestion: CoachSuggestion) {
  const mealList: MealEntry[] = profile.value.meals[suggestion.meal];
  const index = mealList.findIndex((entry) => entry.foodId === suggestion.foodId);

  if (suggestion.type === 'partition' && index !== -1 && suggestion.newPortion) {
    mealList[index].portion = suggestion.newPortion;
    activeMeal.value = suggestion.meal;
    selectedFoodId.value = suggestion.foodId;
  } else if (suggestion.type === 'remove' && index !== -1) {
    mealList.splice(index, 1);
    activeMeal.value = suggestion.meal;
    selectedFoodId.value = null;
  } else if (suggestion.type === 'swap' && index !== -1 && suggestion.swapToFoodId) {
    const originalPortion = mealList[index].portion;
    const existingTarget = mealList.find((entry) => entry.foodId === suggestion.swapToFoodId);
    mealList.splice(index, 1);
    if (existingTarget) {
      existingTarget.portion = getNextPortionStep(existingTarget.portion);
    } else {
      mealList.push({ foodId: suggestion.swapToFoodId, portion: originalPortion });
    }
    activeMeal.value = suggestion.meal;
    selectedFoodId.value = suggestion.swapToFoodId;
  } else if (suggestion.type === 'add') {
    const existing = mealList.find((entry) => entry.foodId === suggestion.foodId);
    if (!existing) {
      mealList.push({
        foodId: suggestion.foodId,
        portion: suggestion.newPortion ?? 1,
      });
    }
    activeMeal.value = suggestion.meal;
    selectedFoodId.value = suggestion.foodId;
  }

  toast.success(`تم التطبيق: ${suggestion.titleAr}`);
}

function handleResetDefaultMeals() {
  if (!confirmingReset.value) {
    confirmingReset.value = true;
    if (resetConfirmTimer) clearTimeout(resetConfirmTimer);
    resetConfirmTimer = setTimeout(() => {
      confirmingReset.value = false;
    }, 4500);
    return;
  }

  const previousMeals = cloneMeals(profile.value.meals);
  profile.value.meals = cloneMeals(DEFAULT_SYRIAN_MEALS);
  selectedFoodId.value = null;
  confirmingReset.value = false;

  toast.success('تمت إعادة ضبط السفرة السورية الافتراضية', {
    action: {
      label: 'تراجع',
      onClick: () => {
        profile.value.meals = previousMeals;
      },
    },
  });
}


// ---- Stage (3D) bindings: wizard previews override the live profile ----
const stageMeal = computed<MealType>(() =>
  wizardOpen.value && wizardPreview.value?.meal ? wizardPreview.value.meal : activeMeal.value
);
const stageEntries = computed<MealEntry[]>(() =>
  wizardOpen.value && wizardPreview.value
    ? wizardPreview.value.meals[stageMeal.value]
    : profile.value.meals[activeMeal.value]
);
const stageViewOffset = computed(() =>
  isDesktop.value && desktopPanelOpen.value && !wizardOpen.value ? 210 : 0
);

const panelInert = computed(() =>
  wizardOpen.value || (isDesktop.value ? !desktopPanelOpen.value : !mobileSheetOpen.value)
);

function markOnboarded() {
  try {
    window.localStorage.setItem(ONBOARDED_KEY, '1');
  } catch {
    // Ignore storage errors
  }
}

function handleWizardPreview(payload: { meal: MealType | null; meals: MealsState }) {
  wizardPreview.value = payload;
}

function handleWizardFinish(result: CalorieProfileData) {
  profile.value = {
    ...cloneProfile(result),
    baseline_meals: cloneMeals(result.meals),
  };
  wizardOpen.value = false;
  wizardPreview.value = null;
  activeMeal.value = 'breakfast';
  selectedFoodId.value = null;
  activeDockTab.value = 'coach';
  desktopPanelOpen.value = true;
  markOnboarded();
  toast.success('سفرتك جاهزة! ثبّتنا أكلك المعتاد كنقطة مقارنة — جرّب عدّل عليها هلأ');
}

function handleWizardSkip() {
  wizardOpen.value = false;
  wizardPreview.value = null;
  markOnboarded();
}

function openWizard() {
  mobileSheetOpen.value = false;
  selectedFoodId.value = null;
  wizardOpen.value = true;
}

function openPanelTab(tab: 'body' | 'table' | 'coach') {
  activeDockTab.value = tab;
  if (isDesktop.value) desktopPanelOpen.value = true;
  else mobileSheetOpen.value = true;
}


// ---- Selected dish quick editor ----
const selectedInfo = computed(() => {
  if (!selectedFoodId.value || wizardOpen.value) return null;
  const entry = profile.value.meals[activeMeal.value].find((e) => e.foodId === selectedFoodId.value);
  const food = entry ? getFoodById(entry.foodId) : undefined;
  if (!entry || !food) return null;
  return { entry, food, calories: Math.round(food.calories * entry.portion) };
});

// ---- HUD ----
const hudGauge = computed(() => {
  const a = analysis.value;
  const max = Math.max(a.calibratedTdee * 1.3, a.currentDailyCalories, 1);
  return {
    intake: Math.min(100, (a.currentDailyCalories / max) * 100),
    target: Math.min(97, (a.targetCalories / max) * 100),
    tdee: Math.min(97, (a.calibratedTdee / max) * 100),
  };
});

const hudStatus = computed(() => {
  const a = analysis.value;
  const delta = Math.abs(Math.round(a.dailyDelta));
  const weekly = Math.abs(a.estimatedWeeklyKgChange).toFixed(2);
  if (a.status === 'deficit')
    return { label: `عجز ${delta}`, weekly: `≈ −${weekly} كغ/أسبوع`, bar: 'bg-emerald-500', chip: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' };
  if (a.status === 'surplus')
    return { label: `فائض ${delta}`, weekly: `≈ +${weekly} كغ/أسبوع`, bar: 'bg-rose-500', chip: 'bg-rose-500/15 text-rose-700 dark:text-rose-300' };
  return { label: 'متوازن', weekly: 'ثبات تقريباً', bar: 'bg-sky-500', chip: 'bg-sky-500/15 text-sky-700 dark:text-sky-300' };
});

const glass =
  'border border-white/30 bg-background/80 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75';
</script>

<template>
  <PublicLayout>
    <Head title="حاسبة السعرات السورية">
      <meta
        name="description"
        content="حاسبة سعرات سورية تفاعلية ثلاثية الأبعاد: احسب حرق جسمك، رتّب فطورك وغداك وعشاك المتأخر، واعرف إذا أكلك عم يعمل عجز أو فائض."
      />
    </Head>

    <h1 class="sr-only">حاسبة السعرات السورية — السفرة التفاعلية ثلاثية الأبعاد</h1>

    <section
      aria-label="السفرة السورية التفاعلية"
      class="relative h-[calc(100dvh-65px)] min-h-[560px] w-full overflow-hidden bg-muted/20"
    >
      <!-- ===== 3D Stage ===== -->
      <div class="absolute inset-0">
        <Suspense v-if="isMounted">
          <SyrianTable3D
            :meal="stageMeal"
            :entries="stageEntries"
            :selected-food-id="wizardOpen ? null : selectedFoodId"
            :status="analysis.status"
            :view-offset-x="stageViewOffset"
            @select-food="handleSelectFoodFrom3D"
          />
          <template #fallback>
            <div class="flex h-full w-full flex-col items-center justify-center gap-3">
              <Skeleton class="size-56 rounded-full" />
              <span class="text-xs text-muted-foreground">جاري تجهيز السفرة السورية ثلاثية الأبعاد...</span>
            </div>
          </template>
        </Suspense>
        <div v-else class="flex h-full w-full items-center justify-center">
          <Skeleton class="size-56 rounded-full" />
        </div>
      </div>

      <!-- ===== Top HUD row ===== -->
      <div
        v-show="!wizardOpen"
        class="pointer-events-none absolute inset-x-2 top-2 z-20 flex flex-col gap-2 sm:inset-x-4 sm:top-4 lg:flex-row lg:items-start lg:justify-between"
      >
        <!-- Meal switcher -->
        <div
          role="tablist"
          aria-label="الوجبات اليومية الثلاث"
          :class="['pointer-events-auto grid grid-cols-3 gap-1 rounded-2xl p-1 lg:w-[400px]', glass]"
        >
          <button
            v-for="mealKey in MEAL_ORDER"
            :key="mealKey"
            type="button"
            role="tab"
            :aria-selected="activeMeal === mealKey"
            :class="[
              'flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-center transition-[background-color,color,box-shadow] focus-visible:outline-2 focus-visible:outline-ring motion-safe:active:scale-95',
              activeMeal === mealKey
                ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-white shadow-md'
                : 'text-foreground hover:bg-accent/70',
            ]"
            @click="switchMeal(mealKey)"
          >
            <span class="flex items-center gap-1 text-xs font-bold sm:text-sm">
              <span aria-hidden="true">{{ MEAL_META[mealKey].emoji }}</span>
              {{ MEAL_META[mealKey].titleAr }}
            </span>
            <span
              class="text-[11px] tabular-nums"
              :class="activeMeal === mealKey ? 'text-white/90' : 'text-muted-foreground'"
            >
              {{ analysis.mealBreakdown[mealKey].calories }} سعرة · {{ analysis.mealBreakdown[mealKey].count }} صحن
            </span>
          </button>
        </div>

        <!-- Calorie HUD -->
        <div
          :class="['pointer-events-auto flex items-center gap-3 rounded-2xl px-3 py-2 lg:min-w-[340px]', glass]"
          aria-live="polite"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline justify-between gap-2">
              <span class="text-lg font-extrabold tabular-nums sm:text-xl">
                {{ analysis.currentDailyCalories }}
                <span class="text-xs font-medium text-muted-foreground">/ {{ analysis.targetCalories }} سعرة</span>
              </span>
              <span class="rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums" :class="hudStatus.chip">
                {{ hudStatus.label }}
              </span>
            </div>
            <div class="relative mt-1.5 h-2 rounded-full bg-muted" aria-hidden="true">
              <div
                class="h-full rounded-full transition-[width] duration-500"
                :class="hudStatus.bar"
                :style="{ width: `${hudGauge.intake}%` }"
              />
              <span
                class="absolute -top-1 h-4 w-0.5 rounded bg-primary"
                :style="{ insetInlineStart: `${hudGauge.target}%` }"
                title="هدفك"
              />
              <span
                class="absolute -top-1 h-4 w-0.5 rounded bg-foreground/50"
                :style="{ insetInlineStart: `${hudGauge.tdee}%` }"
                title="حرقك"
              />
            </div>
            <div class="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span class="tabular-nums">حرقك {{ analysis.calibratedTdee }} · {{ hudStatus.weekly }}</span>
              <span class="flex items-center gap-1">
                <template v-if="!isAuthenticated">
                  <HardDrive class="size-3" aria-hidden="true" /> محفوظ على الجهاز
                </template>
                <template v-else-if="saveStatus === 'saving'">
                  <LoaderCircle class="size-3 motion-safe:animate-spin" aria-hidden="true" /> جاري الحفظ
                </template>
                <template v-else-if="saveStatus === 'error'">
                  <button
                    type="button"
                    class="flex items-center gap-1 text-destructive hover:underline"
                    @click="persistToServer"
                  >
                    <CloudOff class="size-3" aria-hidden="true" /> فشل الحفظ
                    <RefreshCw class="size-3" aria-hidden="true" />
                  </button>
                </template>
                <template v-else>
                  <Cloud class="size-3" aria-hidden="true" /> محفوظ بحسابك
                </template>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Control Panel (desktop side panel / mobile bottom sheet) ===== -->
      <aside
        aria-label="لوحة التحكم بالسفرة"
        :inert="panelInert"
        :class="[
          'absolute z-30 flex flex-col overflow-hidden transition-transform duration-300 ease-out',
          'inset-x-0 bottom-0 max-h-[78%] rounded-t-3xl',
          'lg:inset-x-auto lg:start-4 lg:top-[5.5rem] lg:bottom-4 lg:max-h-none lg:w-[400px] lg:rounded-3xl lg:translate-y-0',
          glass,
          mobileSheetOpen ? 'translate-y-0' : 'translate-y-[calc(100%+1rem)]',
          desktopPanelOpen ? 'lg:translate-x-0' : 'lg:translate-x-[calc(100%+2rem)]',
          wizardOpen ? 'opacity-0' : 'opacity-100',
        ]"
      >
        <!-- Grabber (mobile) -->
        <button
          type="button"
          class="mx-auto mt-2 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/30 lg:hidden"
          aria-label="إغلاق لوحة التحكم"
          @click="mobileSheetOpen = false"
        />

        <!-- Panel tabs -->
        <div class="flex shrink-0 items-center gap-1 border-b border-border/50 p-2">
          <div role="tablist" aria-label="أقسام لوحة التحكم" class="grid flex-1 grid-cols-3 gap-1">
            <button
              v-for="tab in [
                { id: 'table', label: 'السفرة', icon: UtensilsCrossed },
                { id: 'body', label: 'جسمي', icon: SlidersHorizontal },
                { id: 'coach', label: 'المدرب', icon: Wand2 },
              ] as const"
              :key="tab.id"
              type="button"
              role="tab"
              :aria-selected="activeDockTab === tab.id"
              :class="[
                'flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring sm:text-sm',
                activeDockTab === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent',
              ]"
              @click="activeDockTab = tab.id"
            >
              <component :is="tab.icon" class="size-4" aria-hidden="true" />
              {{ tab.label }}
              <Badge
                v-if="tab.id === 'coach' && suggestions.length > 0"
                variant="secondary"
                class="px-1.5 py-0 text-[10px] tabular-nums"
              >
                {{ suggestions.length }}
              </Badge>
            </button>
          </div>
          <button
            type="button"
            class="hidden size-9 items-center justify-center rounded-xl hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring lg:flex"
            aria-label="إخفاء لوحة التحكم"
            title="إخفاء اللوحة"
            @click="desktopPanelOpen = false"
          >
            <ChevronsRight class="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-xl hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring lg:hidden"
            aria-label="إغلاق لوحة التحكم"
            @click="mobileSheetOpen = false"
          >
            <X class="size-4" aria-hidden="true" />
          </button>
        </div>

        <!-- Panel body -->
        <div
          class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 [&>[data-slot=card]]:border-0 [&>[data-slot=card]]:bg-transparent [&>[data-slot=card]]:py-3 [&>[data-slot=card]]:shadow-none"
        >
          <MealTablePanel
            v-if="activeDockTab === 'table'"
            :active-meal="activeMeal"
            :entries="profile.meals[activeMeal]"
            :selected-food-id="selectedFoodId"
            :has-baseline="profile.baseline_meals !== null"
            :baseline-delta-calories="analysis.vsBaselineDelta"
            @update-portion="handleUpdatePortion"
            @remove-food="handleRemoveFood"
            @add-food="handleAddFood"
            @select-food="selectedFoodId = $event"
            @set-baseline="handleSetBaseline"
            @reset-baseline="handleResetBaseline"
          />
          <BodyCalculatorCard
            v-else-if="activeDockTab === 'body'"
            :profile="profile"
            :analysis="analysis"
            @update:profile="handleProfilePatch"
          />
          <CoachRecommendations
            v-else
            :suggestions="suggestions"
            :analysis="analysis"
            @apply-suggestion="handleApplySuggestion"
          />
        </div>

        <!-- Panel footer actions -->
        <div class="flex shrink-0 items-center justify-between gap-2 border-t border-border/50 px-3 py-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            @click="openWizard"
          >
            <Compass class="size-3.5" aria-hidden="true" /> معالج البداية
          </button>
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium focus-visible:outline-2 focus-visible:outline-ring',
              confirmingReset ? 'bg-destructive text-white' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            ]"
            @click="handleResetDefaultMeals"
          >
            <Check v-if="confirmingReset" class="size-3.5" aria-hidden="true" />
            <RotateCcw v-else class="size-3.5" aria-hidden="true" />
            {{ confirmingReset ? 'اضغط مرة ثانية للتأكيد' : 'السفرة الافتراضية' }}
          </button>
        </div>
      </aside>

      <!-- Desktop: reopen panel tab -->
      <button
        v-if="!desktopPanelOpen && !wizardOpen"
        type="button"
        :class="['absolute start-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-1 rounded-2xl px-2 py-3 text-xs font-semibold lg:flex', glass]"
        aria-label="إظهار لوحة التحكم"
        @click="desktopPanelOpen = true"
      >
        <ChevronsLeft class="size-4" aria-hidden="true" />
        <span class="[writing-mode:vertical-rl]">لوحة التحكم</span>
      </button>

      <!-- ===== Bottom: selected dish editor / hint ===== -->
      <div
        v-show="!wizardOpen"
        :class="[
          'pointer-events-none absolute inset-x-2 bottom-3 z-20 flex justify-center transition-[padding] duration-300 sm:inset-x-4',
          isDesktop && desktopPanelOpen ? 'lg:ps-[420px]' : '',
          mobileSheetOpen ? 'opacity-0' : '',
        ]"
      >
        <Transition
          mode="out-in"
          enter-active-class="motion-safe:transition motion-safe:duration-200"
          enter-from-class="opacity-0 translate-y-3"
          leave-active-class="motion-safe:transition motion-safe:duration-150"
          leave-to-class="opacity-0 translate-y-3"
        >
          <div
            v-if="selectedInfo"
            :key="selectedInfo.food.id"
            :class="['pointer-events-auto w-full max-w-md rounded-3xl p-3', glass]"
            role="region"
            :aria-label="`تعديل ${selectedInfo.food.nameAr}`"
          >
            <div class="flex items-center gap-3">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-2xl" aria-hidden="true">
                {{ selectedInfo.food.emoji }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-bold">{{ selectedInfo.food.nameAr }}</p>
                <p class="truncate text-xs text-muted-foreground">
                  <span class="font-semibold tabular-nums text-foreground">{{ selectedInfo.calories }}</span> سعرة ·
                  {{ selectedInfo.food.unitLabelAr }}
                </p>
              </div>
              <button
                type="button"
                class="flex size-9 items-center justify-center rounded-xl text-destructive hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-ring"
                :aria-label="`حذف ${selectedInfo.food.nameAr}`"
                title="حذف من السفرة"
                @click="handleRemoveFood(selectedInfo.food.id)"
              >
                <Trash2 class="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                class="flex size-9 items-center justify-center rounded-xl hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                aria-label="إلغاء التحديد"
                @click="selectedFoodId = null"
              >
                <X class="size-4" aria-hidden="true" />
              </button>
            </div>
            <div class="mt-2.5 grid grid-cols-6 gap-1" role="radiogroup" aria-label="حجم الحصة">
              <button
                v-for="stepValue in PORTION_STEPS"
                :key="stepValue"
                type="button"
                role="radio"
                :aria-checked="selectedInfo.entry.portion === stepValue"
                :class="[
                  'rounded-xl py-2 text-sm font-bold tabular-nums transition-[background-color,color,transform] focus-visible:outline-2 focus-visible:outline-ring motion-safe:active:scale-90',
                  selectedInfo.entry.portion === stepValue
                    ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-white shadow'
                    : 'bg-muted/60 hover:bg-accent',
                ]"
                @click="handleUpdatePortion({ foodId: selectedInfo.food.id, portion: stepValue })"
              >
                {{ formatPortionAr(stepValue) }}×
              </button>
            </div>
          </div>

          <div
            v-else
            :class="['pointer-events-auto flex items-center gap-2 rounded-full py-1.5 pe-1.5 ps-4 text-xs', glass]"
          >
            <span class="text-muted-foreground">اضغط على صحن لتعديله · اسحب لتدوير السفرة</span>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
              @click="openPanelTab('table')"
            >
              <PanelRightOpen class="size-3.5" aria-hidden="true" /> لوحة التحكم
            </button>
            <button
              type="button"
              class="hidden items-center gap-1 rounded-full bg-primary px-3 py-1.5 font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:inline-flex"
              @click="openPanelTab('table')"
            >
              <UtensilsCrossed class="size-3.5" aria-hidden="true" /> أضف صحن
            </button>
          </div>
        </Transition>
      </div>

      <!-- ===== Startup Wizard ===== -->
      <CalorieWizard
        v-if="wizardOpen"
        :initial="profile"
        @preview="handleWizardPreview"
        @finish="handleWizardFinish"
        @skip="handleWizardSkip"
      />
    </section>
  </PublicLayout>
</template>
