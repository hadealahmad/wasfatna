<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
    Input, Label, Textarea,
} from '@/components/ui';
import { CalendarDays, Pencil, Trash2, ChevronRight } from 'lucide-vue-next';
import MealPlanCalendar from '@/components/features/meal-plans/MealPlanCalendar.vue';
import RandomFillDialog from '@/components/features/meal-plans/RandomFillDialog.vue';
import ShareMealPlan from '@/components/features/meal-plans/ShareMealPlan.vue';
import type { MealPlan, MealPlanEntriesByDate, Tag } from '@/types';
import { formatDate } from '@/lib/utils';
import { toast } from 'vue-sonner';

const props = defineProps<{
    plan: MealPlan;
    entriesByDate: MealPlanEntriesByDate;
    tags: Tag[];
}>();

const editOpen = ref(false);
const editForm = useForm({
    name: props.plan.name,
    description: props.plan.description || '',
});

const handleEdit = () => {
    editForm.put(route('my.meal-plans.update', props.plan.id), {
        onSuccess: () => {
            toast.success('تم تحديث الخطة');
            editOpen.value = false;
        },
    });
};

const handleDelete = () => {
    if (!confirm('هل أنت متأكد من حذف هذه الخطة؟ سيتم حذف جميع الوجبات المخططة.')) return;
    router.delete(route('my.meal-plans.destroy', props.plan.id));
};

const handleRandomFilled = () => {
    router.reload();
};
</script>

<template>
    <PublicLayout>
        <Head :title="plan.name" />

        <div class="container mx-auto py-6 px-4 md:px-6 max-w-5xl">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                <Link :href="route('my.meal-plans.index')" class="hover:text-primary">خطط الوجبات</Link>
                <ChevronRight class="w-4 h-4" />
                <span class="text-foreground font-medium truncate">{{ plan.name }}</span>
            </div>

            <!-- Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <h1 class="text-2xl font-bold">{{ plan.name }}</h1>
                        <Badge v-if="plan.preset" variant="secondary" class="text-xs">
                            {{ plan.preset.type === 'ramadan' ? 'رمضان' : plan.preset.name }}
                        </Badge>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays class="h-4 w-4" />
                        <span>{{ formatDate(plan.start_date) }} - {{ formatDate(plan.end_date) }}</span>
                        <span>({{ plan.days_count }} يوم)</span>
                    </div>
                    <p v-if="plan.description" class="text-sm text-muted-foreground mt-1">{{ plan.description }}</p>
                </div>

                <div class="flex items-center gap-2 flex-wrap shrink-0">
                    <RandomFillDialog
                        :plan-id="plan.id"
                        :is-ramadan="plan.preset?.type === 'ramadan'"
                        :tags="tags"
                        @filled="handleRandomFilled"
                    />
                    <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-foreground" @click="editOpen = true">
                        <Pencil class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" class="h-8 w-8 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300" @click="handleDelete">
                        <Trash2 class="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <!-- Share -->
            <div class="mb-6">
                <ShareMealPlan :share-token="plan.share_token" />
            </div>

            <!-- Calendar -->
            <MealPlanCalendar
                :plan="plan"
                :entries-by-date="entriesByDate"
                :tags="tags"
            />
        </div>

        <!-- Edit Dialog -->
        <Dialog v-model:open="editOpen">
            <DialogContent class="sm:max-w-md" dir="rtl">
                <DialogHeader>
                    <DialogTitle>تعديل الخطة</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="handleEdit" class="space-y-4 py-4">
                    <div class="space-y-2">
                        <Label>اسم الخطة</Label>
                        <Input v-model="editForm.name" required />
                        <div v-if="editForm.errors.name" class="text-sm text-red-500">{{ editForm.errors.name }}</div>
                    </div>
                    <div class="space-y-2">
                        <Label>الوصف (اختياري)</Label>
                        <Textarea v-model="editForm.description" rows="2" />
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" @click="editOpen = false">إلغاء</Button>
                        <Button type="submit" :disabled="editForm.processing">
                            {{ editForm.processing ? 'جاري الحفظ...' : 'حفظ' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </PublicLayout>
</template>
