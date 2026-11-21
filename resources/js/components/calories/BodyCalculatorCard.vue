<script setup lang="ts">
import { computed } from 'vue';
import {
  User,
  Ruler,
  Scale,
  Activity,
  TrendingDown,
  TrendingUp,
  Minus,
  Target,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
} from 'lucide-vue-next';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import type {
  ActivityLevel,
  CalorieProfileData,
  Gender,
  GoalType,
  WeightTrend,
} from '@/data/syrianFoods';
import type { CalorieAnalysis } from '@/lib/calorieEngine';

const props = defineProps<{
  profile: CalorieProfileData;
  analysis: CalorieAnalysis;
}>();

const emit = defineEmits<{
  (e: 'update:profile', patch: Partial<CalorieProfileData>): void;
}>();

const activityOptions: Array<{ value: ActivityLevel; label: string; desc: string }> = [
  { value: 'sedentary', label: 'قليل الحركة', desc: 'عمل مكتبي ومشي خفيف جداً' },
  { value: 'light', label: 'خفيف', desc: 'حركة ومشي بسيط 1–3 أيام/أسبوع' },
  { value: 'moderate', label: 'متوسط', desc: 'نشاط أو تمرين 3–5 أيام/أسبوع' },
  { value: 'active', label: 'نشيط', desc: 'عمل حركي أو رياضة 6–7 أيام' },
  { value: 'very_active', label: 'نشيط جداً', desc: 'مجهود بدني عالٍ يومياً' },
];

const trendOptions: Array<{
  value: WeightTrend;
  label: string;
  icon: typeof TrendingDown;
}> = [
  { value: 'losing', label: 'وزني عم ينزل', icon: TrendingDown },
  { value: 'maintaining', label: 'وزني ثابت', icon: Minus },
  { value: 'gaining', label: 'وزني عم يزيد', icon: TrendingUp },
];

const goalOptions: Array<{ value: GoalType; label: string; hint: string }> = [
  { value: 'lose', label: 'تخفيف وزن', hint: 'عجز مريح ومستدام' },
  { value: 'maintain', label: 'الحفاظ على الوزن', hint: 'توازن يومي' },
  { value: 'gain', label: 'زيادة وزن', hint: 'فائض صحي للعضل' },
];

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function setGender(gender: Gender) {
  emit('update:profile', { gender });
}

function updateAge(val: number | string) {
  const num = Number(val);
  if (!Number.isFinite(num)) return;
  emit('update:profile', { age: Math.round(clamp(num, 12, 100)) });
}

function updateHeight(val: number | string) {
  const num = Number(val);
  if (!Number.isFinite(num)) return;
  emit('update:profile', { height_cm: Math.round(clamp(num, 100, 240)) });
}

function updateWeight(val: number | string) {
  const num = Number(val);
  if (!Number.isFinite(num)) return;
  const rounded = Math.round(clamp(num, 30, 250) * 2) / 2;
  emit('update:profile', { weight_kg: rounded });
}

function updateActivity(val: string) {
  emit('update:profile', { activity_level: val as ActivityLevel });
}

function setTrend(weight_trend: WeightTrend) {
  emit('update:profile', { weight_trend });
}

function setGoal(goal: GoalType) {
  emit('update:profile', { goal });
}

const crossCheckUi = computed(() => {
  const status = props.analysis.crossCheckStatus;
  if (status === 'hidden_calories') {
    return {
      title: 'ملاحظة ذكية عن السعرات المخفية',
      icon: AlertTriangle,
      containerClass:
        'bg-amber-500/10 border-amber-500/35 text-amber-950 dark:text-amber-200',
      iconClass: 'text-amber-600 dark:text-amber-400',
    };
  }
  if (status === 'higher_burn') {
    return {
      title: 'حرق جسمك أعلى من التقدير النظري',
      icon: Sparkles,
      containerClass:
        'bg-sky-500/10 border-sky-500/35 text-sky-950 dark:text-sky-200',
      iconClass: 'text-sky-600 dark:text-sky-400',
    };
  }
  return {
    title: 'توافق ممتاز بين أكلك ووزنك',
    icon: CheckCircle2,
    containerClass:
      'bg-emerald-500/10 border-emerald-500/35 text-emerald-950 dark:text-emerald-200',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  };
});
</script>

<template>
  <Card class="rounded-2xl py-5 gap-4">
    <CardHeader class="px-5 pb-0">
      <div class="flex items-center justify-between gap-2">
        <CardTitle class="text-base sm:text-lg flex items-center gap-2">
          <User aria-hidden="true" class="size-5 text-primary" />
          <span>حاسبة جسمك ووزنك</span>
        </CardTitle>
        <Badge variant="secondary" class="text-xs">معايرة ذكية</Badge>
      </div>
      <p class="text-xs text-muted-foreground">
        عدّل قياساتك ووضع وزنك الحالي لنعاير حرق جسمك الحقيقي مع سفرتك اليومية.
      </p>
    </CardHeader>

    <CardContent class="px-5 space-y-5">
      <!-- Gender -->
      <fieldset class="space-y-2">
        <legend class="text-sm font-medium">الجنس</legend>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            :aria-pressed="profile.gender === 'male'"
            :class="[
              'min-h-10 rounded-xl border px-3 py-2 text-sm font-medium transition-[color,background-color,border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              profile.gender === 'male'
                ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                : 'border-border bg-background hover:bg-accent text-foreground',
            ]"
            @click="setGender('male')"
          >
            ذكر
          </button>
          <button
            type="button"
            :aria-pressed="profile.gender === 'female'"
            :class="[
              'min-h-10 rounded-xl border px-3 py-2 text-sm font-medium transition-[color,background-color,border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              profile.gender === 'female'
                ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                : 'border-border bg-background hover:bg-accent text-foreground',
            ]"
            @click="setGender('female')"
          >
            أنثى
          </button>
        </div>
      </fieldset>

      <!-- Age, Height, Weight Game Steppers + Sliders -->
      <div class="space-y-4">
        <!-- Age -->
        <div class="rounded-xl border border-border/70 bg-muted/30 p-3 space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <Label for="calorie-age" class="flex items-center gap-1.5 text-sm">
              <span>العمر</span>
            </Label>
            <div class="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="تقليل العمر سنة واحدة"
                @click="updateAge(profile.age - 1)"
              >
                <Minus aria-hidden="true" class="size-3.5" />
              </Button>
              <Input
                id="calorie-age"
                type="number"
                :min="12"
                :max="100"
                :model-value="profile.age"
                class="w-20 text-center tabular-nums font-semibold"
                @update:model-value="updateAge"
              />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="زيادة العمر سنة واحدة"
                @click="updateAge(profile.age + 1)"
              >
                <Plus aria-hidden="true" class="size-3.5" />
              </Button>
              <span class="text-xs text-muted-foreground min-w-7">سنة</span>
            </div>
          </div>
          <input
            type="range"
            :min="12"
            :max="100"
            :step="1"
            :value="profile.age"
            aria-label="شريط تمرير العمر"
            class="w-full h-2 rounded-lg accent-primary cursor-pointer"
            @input="updateAge(($event.target as HTMLInputElement).value)"
          />
        </div>

        <!-- Height -->
        <div class="rounded-xl border border-border/70 bg-muted/30 p-3 space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <Label for="calorie-height" class="flex items-center gap-1.5 text-sm">
              <Ruler aria-hidden="true" class="size-4 text-muted-foreground" />
              <span>الطول</span>
            </Label>
            <div class="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="تقليل الطول 1 سم"
                @click="updateHeight(profile.height_cm - 1)"
              >
                <Minus aria-hidden="true" class="size-3.5" />
              </Button>
              <Input
                id="calorie-height"
                type="number"
                :min="100"
                :max="240"
                :model-value="profile.height_cm"
                class="w-20 text-center tabular-nums font-semibold"
                @update:model-value="updateHeight"
              />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="زيادة الطول 1 سم"
                @click="updateHeight(profile.height_cm + 1)"
              >
                <Plus aria-hidden="true" class="size-3.5" />
              </Button>
              <span class="text-xs text-muted-foreground min-w-7">سم</span>
            </div>
          </div>
          <input
            type="range"
            :min="100"
            :max="240"
            :step="1"
            :value="profile.height_cm"
            aria-label="شريط تمرير الطول بالسنتيمتر"
            class="w-full h-2 rounded-lg accent-primary cursor-pointer"
            @input="updateHeight(($event.target as HTMLInputElement).value)"
          />
        </div>

        <!-- Weight -->
        <div class="rounded-xl border border-border/70 bg-muted/30 p-3 space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <Label for="calorie-weight" class="flex items-center gap-1.5 text-sm">
              <Scale aria-hidden="true" class="size-4 text-muted-foreground" />
              <span>الوزن</span>
            </Label>
            <div class="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="تقليل الوزن نصف كيلو"
                @click="updateWeight(profile.weight_kg - 0.5)"
              >
                <Minus aria-hidden="true" class="size-3.5" />
              </Button>
              <Input
                id="calorie-weight"
                type="number"
                step="0.5"
                :min="30"
                :max="250"
                :model-value="profile.weight_kg"
                class="w-20 text-center tabular-nums font-semibold"
                @update:model-value="updateWeight"
              />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="زيادة الوزن نصف كيلو"
                @click="updateWeight(profile.weight_kg + 0.5)"
              >
                <Plus aria-hidden="true" class="size-3.5" />
              </Button>
              <span class="text-xs text-muted-foreground min-w-7">كغ</span>
            </div>
          </div>
          <input
            type="range"
            :min="30"
            :max="200"
            :step="0.5"
            :value="profile.weight_kg"
            aria-label="شريط تمرير الوزن بالكيلوغرام"
            class="w-full h-2 rounded-lg accent-primary cursor-pointer"
            @input="updateWeight(($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>

      <!-- Activity Level -->
      <div class="space-y-2">
        <Label for="calorie-activity" class="flex items-center gap-1.5 text-sm">
          <Activity aria-hidden="true" class="size-4 text-muted-foreground" />
          <span>مستوى النشاط اليومي</span>
        </Label>
        <Select :model-value="profile.activity_level" @update:model-value="updateActivity">
          <SelectTrigger id="calorie-activity" class="w-full">
            <SelectValue placeholder="اختر مستوى نشاطك" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="opt in activityOptions"
              :key="opt.value"
              :value="opt.value"
            >
              <span>{{ opt.label }} — {{ opt.desc }}</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Current Weight Trend -->
      <fieldset class="space-y-2">
        <legend class="text-sm font-medium">شو عم يصير بوزنك هالفترة؟</legend>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="item in trendOptions"
            :key="item.value"
            type="button"
            :aria-pressed="profile.weight_trend === item.value"
            :class="[
              'flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-center text-xs font-medium transition-[color,background-color,border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              profile.weight_trend === item.value
                ? 'border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30'
                : 'border-border bg-background hover:bg-accent text-foreground',
            ]"
            @click="setTrend(item.value)"
          >
            <component :is="item.icon" aria-hidden="true" class="size-4" />
            <span>{{ item.label }}</span>
          </button>
        </div>
      </fieldset>

      <!-- Goal -->
      <fieldset class="space-y-2">
        <legend class="text-sm font-medium flex items-center gap-1.5">
          <Target aria-hidden="true" class="size-4 text-muted-foreground" />
          <span>هدفك</span>
        </legend>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="g in goalOptions"
            :key="g.value"
            type="button"
            :aria-pressed="profile.goal === g.value"
            :class="[
              'flex flex-col items-center justify-center gap-0.5 rounded-xl border p-2.5 text-center transition-[color,background-color,border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              profile.goal === g.value
                ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                : 'border-border bg-background hover:bg-accent text-foreground',
            ]"
            @click="setGoal(g.value)"
          >
            <span class="text-xs font-semibold">{{ g.label }}</span>
            <span
              :class="[
                'text-xs',
                profile.goal === g.value ? 'text-primary-foreground/80' : 'text-muted-foreground',
              ]"
            >
              {{ g.hint }}
            </span>
          </button>
        </div>
      </fieldset>

      <!-- Calculated Readouts & Cross-Check Card -->
      <div class="space-y-3 pt-1 border-t border-border">
        <div class="grid grid-cols-2 gap-2.5">
          <div class="rounded-xl border border-border/70 bg-muted/30 p-3">
            <p class="text-xs text-muted-foreground">الحرق الأساسي (BMR)</p>
            <p class="text-base font-bold tabular-nums mt-0.5">
              {{ Math.round(analysis.bmr) }}
              <span class="text-xs font-normal text-muted-foreground">سعرة</span>
            </p>
          </div>

          <div class="rounded-xl border border-border/70 bg-muted/30 p-3">
            <p class="text-xs text-muted-foreground">الحرق النظري (TDEE)</p>
            <p class="text-base font-bold tabular-nums mt-0.5">
              {{ Math.round(analysis.theoreticalTdee) }}
              <span class="text-xs font-normal text-muted-foreground">سعرة</span>
            </p>
          </div>

          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
            <p class="text-xs text-sky-800 dark:text-sky-300">الحرق التقديري بعد المقارنة</p>
            <p class="text-base font-bold tabular-nums text-sky-900 dark:text-sky-100 mt-0.5">
              {{ Math.round(analysis.calibratedTdee) }}
              <span class="text-xs font-normal opacity-80">سعرة</span>
            </p>
          </div>

          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
            <p class="text-xs text-emerald-800 dark:text-emerald-300">هدف السعرات اليومي</p>
            <p class="text-base font-bold tabular-nums text-emerald-900 dark:text-emerald-100 mt-0.5">
              {{ Math.round(analysis.targetCalories) }}
              <span class="text-xs font-normal opacity-80">سعرة</span>
            </p>
          </div>
        </div>

        <!-- Empathetic Syrian Cross-Check Insight Alert -->
        <div
          role="status"
          aria-live="polite"
          :class="['rounded-xl border p-3.5 flex items-start gap-3', crossCheckUi.containerClass]"
        >
          <component
            :is="crossCheckUi.icon"
            aria-hidden="true"
            :class="['size-5 shrink-0 mt-0.5', crossCheckUi.iconClass]"
          />
          <div class="space-y-1 text-start">
            <p class="text-xs font-bold">{{ crossCheckUi.title }}</p>
            <p class="text-xs leading-relaxed opacity-90">
              {{ analysis.crossCheckInsightAr }}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
