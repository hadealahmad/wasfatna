<script setup lang="ts">
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import { CalendarDays, Copy, Check, Share2 } from 'lucide-vue-next';
import MealPlanCalendar from '@/components/features/meal-plans/MealPlanCalendar.vue';
import type { MealPlan, MealPlanEntriesByDate } from '@/types';
import { formatDate } from '@/lib/utils';
import { toast } from 'vue-sonner';

const props = defineProps<{
    plan: MealPlan;
    entriesByDate: MealPlanEntriesByDate;
}>();

const copied = ref(false);

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        copied.value = true;
        toast.success('تم نسخ الرابط');
        setTimeout(() => { copied.value = false; }, 2000);
    } catch {
        toast.error('فشل نسخ الرابط');
    }
};

const shareWhatsApp = () => {
    const text = encodeURIComponent(`شاهد خطة وجبات "${props.plan.name}": ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
};
</script>

<template>
    <PublicLayout>
        <Head :title="`خطة وجبات - ${plan.name}`" />

        <div class="container mx-auto py-6 px-4 md:px-6 max-w-5xl">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <h1 class="text-2xl font-bold">{{ plan.name }}</h1>
                        <Badge v-if="plan.preset" variant="secondary" class="text-xs">
                            {{ plan.preset?.type === 'ramadan' ? 'رمضان' : plan.preset?.name }}
                        </Badge>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays class="h-4 w-4" />
                        <span>{{ formatDate(plan.start_date) }} - {{ formatDate(plan.end_date) }}</span>
                        <span>({{ plan.days_count }} يوم)</span>
                    </div>
                    <p v-if="plan.description" class="text-sm text-muted-foreground mt-1">{{ plan.description }}</p>
                    <p v-if="plan.user" class="text-xs text-muted-foreground mt-1">بواسطة {{ plan.user.name }}</p>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" @click="copyLink" class="gap-1.5">
                        <Check v-if="copied" class="h-3.5 w-3.5" />
                        <Copy v-else class="h-3.5 w-3.5" />
                        نسخ الرابط
                    </Button>
                    <Button variant="outline" size="sm" @click="shareWhatsApp" class="gap-1.5 text-green-600 hover:text-green-700">
                        <Share2 class="h-3.5 w-3.5" />
                        واتساب
                    </Button>
                </div>
            </div>

            <!-- Calendar (readonly) -->
            <MealPlanCalendar
                :plan="plan"
                :entries-by-date="entriesByDate"
                :readonly="true"
            />
        </div>
    </PublicLayout>
</template>
