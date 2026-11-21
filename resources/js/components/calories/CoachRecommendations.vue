<script setup lang="ts">
import { computed } from 'vue';
import { Sparkles, CheckCircle2, ArrowLeftRight, Scissors, PlusCircle, Trash2, Wand2 } from 'lucide-vue-next';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { MEAL_META } from '@/data/syrianFoods';
import type { CalorieAnalysis, CoachSuggestion } from '@/lib/calorieEngine';

const props = defineProps<{
  suggestions: CoachSuggestion[];
  analysis: CalorieAnalysis;
}>();

const emit = defineEmits<{
  (e: 'apply-suggestion', suggestion: CoachSuggestion): void;
}>();

const introMessage = computed(() => {
  const { vsTargetDelta } = props.analysis;
  if (vsTargetDelta > 100) {
    return `باقي حوالي ${Math.round(vsTargetDelta)} سعرة فوق هدفك اليومي — هالتعديلات الشامية البسيطة بتوصلك لهدفك بدون ما تحرم حالك من أكل البيت.`;
  }
  if (vsTargetDelta < -250) {
    return `سفرتك حالياً أقل من هدفك بحوالي ${Math.abs(Math.round(vsTargetDelta))} سعرة — أضف خيارات مغذية بالبروتين لتحافظ على نشاطك وعضلاتك.`;
  }
  return 'سفرتك قريبة جداً من هدفك اليومي! هي لمسات ذكية لتحسين الشبع وجودة الأكل.';
});

function iconForSuggestion(type: CoachSuggestion['type']) {
  switch (type) {
    case 'partition':
      return Scissors;
    case 'swap':
      return ArrowLeftRight;
    case 'add':
      return PlusCircle;
    case 'remove':
      return Trash2;
  }
}

function typeLabelAr(type: CoachSuggestion['type']): string {
  switch (type) {
    case 'partition':
      return 'تقسيم ذكي';
    case 'swap':
      return 'بديل أخف';
    case 'add':
      return 'إضافة مغذية';
    case 'remove':
      return 'تخفيف فائض';
  }
}
</script>

<template>
  <Card class="rounded-2xl py-5 gap-4">
    <CardHeader class="px-5 pb-0">
      <div class="flex items-center justify-between gap-2">
        <CardTitle class="text-base sm:text-lg flex items-center gap-2">
          <Wand2 aria-hidden="true" class="size-5 text-amber-500" />
          <span>مساعد السفرة الذكي</span>
        </CardTitle>
        <Badge variant="secondary" class="text-xs tabular-nums">
          {{ suggestions.length }} اقتراحات
        </Badge>
      </div>
      <p class="text-xs text-muted-foreground leading-relaxed">
        {{ introMessage }}
      </p>
    </CardHeader>

    <CardContent class="px-5">
      <!-- Balanced Celebration State -->
      <div
        v-if="suggestions.length === 0"
        class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-2"
      >
        <div
          class="mx-auto flex size-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
          aria-hidden="true"
        >
          <CheckCircle2 class="size-6" />
        </div>
        <h3 class="text-sm font-bold text-emerald-900 dark:text-emerald-200">
          يا سلام! سفرتك متوازنة تماماً مع هدفك
        </h3>
        <p class="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed max-w-md mx-auto">
          مجموع سعراتك اليومية ({{ Math.round(analysis.currentDailyCalories) }} سعرة) قريب جداً من هدفك ({{ Math.round(analysis.targetCalories) }} سعرة) مع خيارات سورية ممتازة. استمر بهالتوازن!
        </p>
      </div>

      <!-- Suggestion Cards -->
      <ul v-else class="space-y-3" aria-label="اقتراحات تعديل السفرة">
        <li
          v-for="item in suggestions"
          :key="item.id"
          class="rounded-xl border border-border/80 bg-muted/25 p-3.5 space-y-2.5 hover:border-primary/40 transition-colors"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" class="text-xs gap-1">
                <span aria-hidden="true">{{ MEAL_META[item.meal].emoji }}</span>
                <span>{{ MEAL_META[item.meal].titleAr }}</span>
              </Badge>
              <Badge variant="secondary" class="text-xs gap-1">
                <component :is="iconForSuggestion(item.type)" aria-hidden="true" class="size-3" />
                <span>{{ typeLabelAr(item.type) }}</span>
              </Badge>
            </div>

            <Badge
              variant="outline"
              :class="[
                'text-xs font-bold tabular-nums',
                item.calorieImpact < 0
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  : 'border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300',
              ]"
            >
              {{ item.calorieImpact > 0 ? `+${item.calorieImpact}` : item.calorieImpact }} سعرة
            </Badge>
          </div>

          <div class="space-y-1">
            <p class="text-sm font-semibold leading-snug">{{ item.titleAr }}</p>
            <p class="text-xs text-muted-foreground leading-relaxed">{{ item.reasonAr }}</p>
          </div>

          <div class="flex justify-end pt-1">
            <Button
              type="button"
              size="sm"
              class="min-h-8 text-xs gap-1.5"
              @click="emit('apply-suggestion', item)"
            >
              <Sparkles aria-hidden="true" class="size-3.5" />
              <span>طبّق على السفرة</span>
            </Button>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
