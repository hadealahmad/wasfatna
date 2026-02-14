<script setup lang="ts">
import { ref } from 'vue';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
    Button, Label, Checkbox,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui';
import { Shuffle, Loader2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import type { Tag } from '@/types';

const props = defineProps<{
    planId: number;
    isRamadan?: boolean;
    tags?: Tag[];
}>();

const emit = defineEmits<{
    filled: [];
}>();

const open = ref(false);
const loading = ref(false);
const mealType = ref(props.tags?.[0]?.slug || 'main');
const overwrite = ref(false);

const handleSubmit = async () => {
    loading.value = true;
    try {
        const res = await fetch(route('web-api.meal-plans.random-fill', { mealPlan: props.planId }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                meal_type: mealType.value,
                overwrite: overwrite.value,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message || 'حدث خطأ');
            return;
        }

        toast.success(data.message);
        emit('filled');
        open.value = false;
    } catch {
        toast.error('حدث خطأ');
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger asChild>
            <Button variant="outline" size="sm" class="gap-2">
                <Shuffle class="h-4 w-4" />
                تعبئة عشوائية
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-sm" dir="rtl">
            <DialogHeader>
                <DialogTitle>تعبئة عشوائية</DialogTitle>
            </DialogHeader>
            <form @submit.prevent="handleSubmit" class="space-y-4 py-4">
                <div class="space-y-2">
                    <Label>نوع الوجبة</Label>
                    <Select v-model="mealType">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="tag in (props.tags || [])" :key="tag.id" :value="tag.slug">{{ tag.name }}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="flex items-center gap-2">
                    <Checkbox :checked="overwrite" @update:checked="overwrite = $event" />
                    <Label class="cursor-pointer" @click="overwrite = !overwrite">استبدال الوجبات الموجودة</Label>
                </div>

                <p class="text-xs text-muted-foreground">سيتم ملء الأيام الفارغة بوصفات عشوائية من الوصفات المعتمدة.</p>

                <div class="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" @click="open = false">إلغاء</Button>
                    <Button type="submit" :disabled="loading">
                        <Loader2 v-if="loading" class="h-4 w-4 ml-2 animate-spin" />
                        {{ loading ? 'جاري التعبئة...' : 'تعبئة' }}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>
