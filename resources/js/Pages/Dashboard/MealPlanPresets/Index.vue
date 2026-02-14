<script setup lang="ts">
import { ref } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import {
    Button, Input, Label, Textarea, Badge,
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
    Switch,
} from '@/components/ui';
import { Plus, Pencil, Trash2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import type { MealPlanPreset } from '@/types';

interface Props {
    presets: MealPlanPreset[];
    filters: {
        search?: string;
    };
}

const props = defineProps<Props>();

const createOpen = ref(false);
const editOpen = ref(false);
const editingPreset = ref<MealPlanPreset | null>(null);

const createForm = useForm({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    type: 'ramadan',
    is_active: true,
});

const editForm = useForm({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    type: 'ramadan' as string,
    is_active: true,
});

const handleCreate = () => {
    createForm.post(route('dashboard.meal-plan-presets.store'), {
        onSuccess: () => {
            toast.success('تم إنشاء القالب بنجاح');
            createOpen.value = false;
            createForm.reset();
        },
        onError: () => toast.error('فشل في إنشاء القالب'),
    });
};

const openEdit = (preset: MealPlanPreset) => {
    editingPreset.value = preset;
    editForm.name = preset.name;
    editForm.description = preset.description || '';
    editForm.start_date = preset.start_date;
    editForm.end_date = preset.end_date;
    editForm.type = preset.type;
    editForm.is_active = preset.is_active;
    editOpen.value = true;
};

const handleEdit = () => {
    if (!editingPreset.value) return;
    editForm.put(route('dashboard.meal-plan-presets.update', editingPreset.value.id), {
        onSuccess: () => {
            toast.success('تم تحديث القالب بنجاح');
            editOpen.value = false;
        },
        onError: () => toast.error('فشل في تحديث القالب'),
    });
};

const handleDelete = (preset: MealPlanPreset) => {
    if (!confirm('هل أنت متأكد من حذف هذا القالب؟')) return;
    router.delete(route('dashboard.meal-plan-presets.destroy', preset.id), {
        onSuccess: () => toast.success('تم حذف القالب'),
        onError: () => toast.error('فشل في حذف القالب'),
    });
};

const typeLabels: Record<string, string> = {
    ramadan: 'رمضان',
    custom: 'مخصص',
};
</script>

<template>
    <Head title="قوالب خطط الوجبات" />

    <DashboardLayout>
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 class="text-2xl font-bold tracking-tight">قوالب خطط الوجبات</h2>

                <Dialog v-model:open="createOpen">
                    <DialogTrigger asChild>
                        <Button class="gap-2">
                            <Plus class="w-4 h-4" />
                            قالب جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-md" dir="rtl">
                        <DialogHeader>
                            <DialogTitle>إنشاء قالب جديد</DialogTitle>
                        </DialogHeader>
                        <form @submit.prevent="handleCreate" class="space-y-4 py-4">
                            <div class="space-y-2">
                                <Label>اسم القالب</Label>
                                <Input v-model="createForm.name" placeholder="مثال: رمضان 2026" required />
                                <div v-if="createForm.errors.name" class="text-sm text-red-500">{{ createForm.errors.name }}</div>
                            </div>
                            <div class="space-y-2">
                                <Label>الوصف (اختياري)</Label>
                                <Textarea v-model="createForm.description" placeholder="وصف القالب..." rows="2" />
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <Label>تاريخ البداية</Label>
                                    <Input type="date" v-model="createForm.start_date" required />
                                    <div v-if="createForm.errors.start_date" class="text-sm text-red-500">{{ createForm.errors.start_date }}</div>
                                </div>
                                <div class="space-y-2">
                                    <Label>تاريخ النهاية</Label>
                                    <Input type="date" v-model="createForm.end_date" required />
                                    <div v-if="createForm.errors.end_date" class="text-sm text-red-500">{{ createForm.errors.end_date }}</div>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label>النوع</Label>
                                <Select v-model="createForm.type">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ramadan">رمضان</SelectItem>
                                        <SelectItem value="custom">مخصص</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div class="flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end">
                                <Label class="cursor-pointer">مفعّل</Label>
                                <Switch :checked="createForm.is_active" @update:checked="createForm.is_active = $event" />
                            </div>
                            <div class="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" @click="createOpen = false">إلغاء</Button>
                                <Button type="submit" :disabled="createForm.processing">
                                    {{ createForm.processing ? 'جاري الإنشاء...' : 'إنشاء' }}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="text-right">الاسم</TableHead>
                        <TableHead class="text-right">النوع</TableHead>
                        <TableHead class="text-right">الفترة</TableHead>
                        <TableHead class="text-right">الحالة</TableHead>
                        <TableHead class="text-right">الاستخدام</TableHead>
                        <TableHead class="text-right">إجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="preset in presets" :key="preset.id">
                        <TableCell class="font-medium">{{ preset.name }}</TableCell>
                        <TableCell>
                            <Badge :variant="preset.type === 'ramadan' ? 'default' : 'secondary'">
                                {{ typeLabels[preset.type] }}
                            </Badge>
                        </TableCell>
                        <TableCell class="text-sm text-muted-foreground">
                            {{ preset.start_date }} → {{ preset.end_date }}
                            <span class="text-xs">({{ preset.days_count }} يوم)</span>
                        </TableCell>
                        <TableCell>
                            <Badge :variant="preset.is_active ? 'default' : 'outline'" :class="preset.is_active ? 'bg-green-600' : ''">
                                {{ preset.is_active ? 'مفعّل' : 'معطّل' }}
                            </Badge>
                        </TableCell>
                        <TableCell>{{ preset.meal_plans_count }} خطة</TableCell>
                        <TableCell>
                            <div class="flex items-center gap-1">
                                <Button variant="ghost" size="icon" class="h-8 w-8" @click="openEdit(preset)">
                                    <Pencil class="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" class="h-8 w-8 text-red-500 hover:text-red-700" @click="handleDelete(preset)">
                                    <Trash2 class="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow v-if="presets.length === 0">
                        <TableCell colspan="6" class="text-center py-8 text-muted-foreground">
                            لا توجد قوالب بعد
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <!-- Edit Dialog -->
        <Dialog v-model:open="editOpen">
            <DialogContent class="sm:max-w-md" dir="rtl">
                <DialogHeader>
                    <DialogTitle>تعديل القالب</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="handleEdit" class="space-y-4 py-4">
                    <div class="space-y-2">
                        <Label>اسم القالب</Label>
                        <Input v-model="editForm.name" required />
                        <div v-if="editForm.errors.name" class="text-sm text-red-500">{{ editForm.errors.name }}</div>
                    </div>
                    <div class="space-y-2">
                        <Label>الوصف (اختياري)</Label>
                        <Textarea v-model="editForm.description" rows="2" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label>تاريخ البداية</Label>
                            <Input type="date" v-model="editForm.start_date" required />
                        </div>
                        <div class="space-y-2">
                            <Label>تاريخ النهاية</Label>
                            <Input type="date" v-model="editForm.end_date" required />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label>النوع</Label>
                        <Select v-model="editForm.type">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ramadan">رمضان</SelectItem>
                                <SelectItem value="custom">مخصص</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end">
                        <Label class="cursor-pointer">مفعّل</Label>
                        <Switch :checked="editForm.is_active" @update:checked="editForm.is_active = $event" />
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
    </DashboardLayout>
</template>
