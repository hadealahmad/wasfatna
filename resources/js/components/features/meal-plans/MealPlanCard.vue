<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardFooter from '@/components/ui/CardFooter.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import Badge from '@/components/ui/Badge.vue';
import Progress from '@/components/ui/Progress.vue';
import { CalendarDays } from 'lucide-vue-next';
import type { MealPlan } from '@/types';
import { formatDate } from '@/lib/utils';

defineProps<{
    plan: MealPlan;
}>();
</script>

<template>
    <Link :href="route('my.meal-plans.show', plan.id)">
        <Card class="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer group bg-card">
            <CardHeader class="p-4 pb-2">
                <div class="flex justify-between items-start gap-2">
                    <CardTitle class="text-lg line-clamp-1">{{ plan.name }}</CardTitle>
                    <Badge v-if="plan.preset" variant="secondary" class="text-xs shrink-0">
                        {{ plan.preset.type === 'ramadan' ? 'رمضان' : plan.preset.name }}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent class="p-4 py-2 space-y-3">
                <p v-if="plan.description" class="text-sm text-muted-foreground line-clamp-2">{{ plan.description }}</p>

                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays class="h-3.5 w-3.5" />
                    <span>{{ formatDate(plan.start_date) }} - {{ formatDate(plan.end_date) }}</span>
                </div>

                <div v-if="plan.entries_count && plan.entries_count > 0" class="space-y-1">
                    <div class="flex justify-between text-xs text-muted-foreground">
                        <span>{{ plan.done_count || 0 }} / {{ plan.entries_count }} مكتمل</span>
                        <span>{{ Math.round(((plan.done_count || 0) / plan.entries_count) * 100) }}%</span>
                    </div>
                    <Progress :model-value="((plan.done_count || 0) / plan.entries_count) * 100" class="h-1.5" />
                </div>
            </CardContent>

            <CardFooter class="p-4 pt-2 text-xs text-muted-foreground">
                <span>{{ plan.days_count }} يوم</span>
            </CardFooter>
        </Card>
    </Link>
</template>
