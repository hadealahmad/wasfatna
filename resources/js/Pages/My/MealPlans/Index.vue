<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Plus } from 'lucide-vue-next';
import MyDashboardLayout from '@/Layouts/MyDashboardLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import MealPlanCard from '@/components/features/meal-plans/MealPlanCard.vue';
import Button from '@/components/ui/Button.vue';
import type { MealPlan } from '@/types';

defineProps<{
  plans: MealPlan[];
}>();
</script>

<template>
  <MyDashboardLayout>
    <Head title="خطط الوجبات" />

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">خطط الوجبات</h1>
        <p class="text-sm text-muted-foreground mt-0.5">نظّم وجباتك الأسبوعية والموسمية وشاركها مع من تحب</p>
      </div>
      <Button as-child class="gap-2 self-start sm:self-auto">
        <Link :href="route('my.meal-plans.create')">
          <Plus class="w-4 h-4" aria-hidden="true" />
          <span>خطة جديدة</span>
        </Link>
      </Button>
    </div>

    <div v-if="plans.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <MealPlanCard v-for="plan in plans" :key="plan.id" :plan="plan" />
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center gap-3 text-center py-16 px-4 rounded-2xl border-2 border-dashed border-border bg-muted/20"
    >
      <ProjectIcon name="meal_plans" class="h-14 w-14 opacity-85" />
      <h2 class="text-lg font-bold text-foreground">لا توجد خطط وجبات بعد</h2>
      <p class="text-sm text-muted-foreground max-w-md">
        أنشئ خطة وجبات لتنظيم وجباتك اليومية أو استخدم أحد القوالب الجاهزة.
      </p>
      <Button as-child class="mt-2 gap-2">
        <Link :href="route('my.meal-plans.create')">
          <Plus class="w-4 h-4" aria-hidden="true" />
          <span>إنشاء خطة جديدة</span>
        </Link>
      </Button>
    </div>
  </MyDashboardLayout>
</template>
