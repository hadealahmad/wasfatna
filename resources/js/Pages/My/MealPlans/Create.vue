<script setup lang="ts">
import { watch } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import MyDashboardLayout from '@/Layouts/MyDashboardLayout.vue';
import {
    Button, Input, Label, Textarea, Card, CardContent,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui';
import { ChevronRight } from 'lucide-vue-next';

interface Preset {
    id: number;
    name: string;
    type: string;
    start_date: string;
    end_date: string;
    days_count: number;
}

const props = defineProps<{
    presets: Preset[];
}>();

const form = useForm({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    preset_id: '' as string | number,
});

// Auto-fill dates when a preset is selected
watch(() => form.preset_id, (presetId) => {
    if (presetId) {
        const preset = props.presets.find(p => p.id === Number(presetId));
        if (preset) {
            form.start_date = preset.start_date;
            form.end_date = preset.end_date;
            if (!form.name) {
                form.name = `خطتي - ${preset.name}`;
            }
        }
    }
});

const submit = () => {
    form.transform((data) => ({
        ...data,
        preset_id: data.preset_id ? Number(data.preset_id) : null,
    })).post(route('my.meal-plans.store'));
};
</script>

<template>
    <MyDashboardLayout>
        <Head title="خطة وجبات جديدة" />

        <div class="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <Link :href="route('my.meal-plans.index')" class="hover:text-primary">خطط الوجبات</Link>
            <ChevronRight class="w-4 h-4" />
            <span class="text-foreground font-medium">خطة جديدة</span>
        </div>

        <h2 class="text-2xl font-bold mb-6">إنشاء خطة وجبات جديدة</h2>

        <Card>
            <CardContent class="pt-6">
                <form @submit.prevent="submit" class="space-y-6">
                    <!-- Preset Selection -->
                    <div v-if="presets.length > 0" class="space-y-2">
                        <Label>اختر قالب (اختياري)</Label>
                        <Select v-model="form.preset_id">
                            <SelectTrigger>
                                <SelectValue placeholder="بدون قالب - تواريخ مخصصة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="preset in presets" :key="preset.id" :value="String(preset.id)">
                                    {{ preset.name }} ({{ preset.days_count }} يوم)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="space-y-2">
                        <Label for="name">اسم الخطة</Label>
                        <Input id="name" v-model="form.name" required placeholder="مثال: خطة رمضان، وجبات الأسبوع..." />
                        <p v-if="form.errors.name" class="text-sm text-red-500">{{ form.errors.name }}</p>
                    </div>

                    <div class="space-y-2">
                        <Label for="description">الوصف (اختياري)</Label>
                        <Textarea id="description" v-model="form.description" placeholder="وصف مختصر للخطة..." />
                        <p v-if="form.errors.description" class="text-sm text-red-500">{{ form.errors.description }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="start_date">تاريخ البداية</Label>
                            <Input id="start_date" type="date" v-model="form.start_date" required />
                            <p v-if="form.errors.start_date" class="text-sm text-red-500">{{ form.errors.start_date }}</p>
                        </div>
                        <div class="space-y-2">
                            <Label for="end_date">تاريخ النهاية</Label>
                            <Input id="end_date" type="date" v-model="form.end_date" required />
                            <p v-if="form.errors.end_date" class="text-sm text-red-500">{{ form.errors.end_date }}</p>
                        </div>
                    </div>

                    <div class="flex justify-end gap-4 pt-4">
                        <Link :href="route('my.meal-plans.index')">
                            <Button variant="outline" type="button">إلغاء</Button>
                        </Link>
                        <Button type="submit" :disabled="form.processing">
                            {{ form.processing ? 'جاري الحفظ...' : 'إنشاء الخطة' }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </MyDashboardLayout>
</template>
