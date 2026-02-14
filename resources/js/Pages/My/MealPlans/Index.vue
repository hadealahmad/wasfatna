<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import MyDashboardLayout from '@/Layouts/MyDashboardLayout.vue';
import Button from '@/components/ui/Button.vue';
import MealPlanCard from '@/components/features/meal-plans/MealPlanCard.vue';
import { Plus } from 'lucide-vue-next';
import type { MealPlan } from '@/types';

defineProps<{
    plans: MealPlan[];
}>();
</script>

<template>
    <MyDashboardLayout>
        <Head title="خطط الوجبات" />

        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">خطط الوجبات</h2>
            <Link :href="route('my.meal-plans.create')">
                <Button class="gap-2">
                    <Plus class="w-4 h-4" />
                    خطة جديدة
                </Button>
            </Link>
        </div>

        <div v-if="plans.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MealPlanCard v-for="plan in plans" :key="plan.id" :plan="plan" />
        </div>

        <div v-else class="text-center py-16">
            <div class="text-4xl mb-4">📅</div>
            <h3 class="text-lg font-semibold mb-2">لا توجد خطط وجبات بعد</h3>
            <p class="text-muted-foreground mb-6">أنشئ خطة وجبات لتنظيم وجباتك اليومية</p>
            <Link :href="route('my.meal-plans.create')">
                <Button class="gap-2">
                    <Plus class="w-4 h-4" />
                    إنشاء خطة جديدة
                </Button>
            </Link>
        </div>
    </MyDashboardLayout>
</template>
