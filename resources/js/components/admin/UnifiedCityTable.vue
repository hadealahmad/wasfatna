<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { 
    Button, 
    Checkbox, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Textarea,
    PaginationControls
} from '@/components/ui';
import { MoreHorizontal, Trash, Edit, Plus } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import type { City, Pagination } from '@/types';

interface Props {
    cities: City[];
    pagination: Pagination;
    loading?: boolean;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
}

const props = defineProps<Props>();

const emits = defineEmits<{
    (e: 'sort', column: string): void;
    (e: 'pageChange', page: number): void;
    (e: 'perPageChange', perPage: number): void;
}>();

const selectedIds = ref<number[]>([]);
const isDialogOpen = ref(false);
const selectedCity = ref<City | null>(null);
const isLoading = ref(false);

const name = ref('');
const description = ref('');
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const handleSelectAll = (checked: boolean) => {
    if (checked) {
        selectedIds.value = props.cities.map(c => c.id);
    } else {
        selectedIds.value = [];
    }
};

const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
        selectedIds.value.push(id);
    } else {
        selectedIds.value = selectedIds.value.filter(selectedId => selectedId !== id);
    }
};

const resetForm = () => {
    name.value = '';
    description.value = '';
    imageFile.value = null;
    imagePreview.value = null;
    selectedCity.value = null;
};

const handleOpenCreate = () => {
    resetForm();
    isDialogOpen.value = true;
};

const handleOpenEdit = (city: City) => {
    selectedCity.value = city;
    name.value = city.name;
    description.value = city.description || '';
    imagePreview.value = city.image_url || null;
    imageFile.value = null;
    isDialogOpen.value = true;
};

const handleImageChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
        toast.error('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت');
        return;
    }

    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
};

const handleSubmit = () => {
    if (!name.value.trim()) return;
    
    isLoading.value = true;
    const url = selectedCity.value 
        ? route('dashboard.cities.update', selectedCity.value.id) 
        : route('dashboard.cities.store');
    
    const data: any = {
        name: name.value,
        description: description.value,
    };
    
    if (imageFile.value) {
        data.image = imageFile.value;
    }

    // Use router.post with _method=PUT for updates with file uploads
    if (selectedCity.value) {
        data._method = 'PUT';
    }

    router.post(url, data, {
        forceFormData: true,
        onSuccess: () => {
            isDialogOpen.value = false;
            resetForm();
            toast.success(selectedCity.value ? 'تم تحديث المدينة' : 'تم إنشاء المدينة');
        },
        onError: () => {
            toast.error('فشل في حفظ بيانات المدينة');
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleBulkDelete = () => {
    if (selectedIds.value.length === 0) return;
    if (!confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} مدينة؟ سيتم نقل الوصفات إلى المدينة الافتراضية.`)) return;

    isLoading.value = true;
    router.post(route('dashboard.cities.bulk'), {
        ids: selectedIds.value,
        action: 'delete'
    }, {
        onSuccess: () => {
            selectedIds.value = [];
            toast.success('تم حذف المدن المحددة');
        },
        onError: () => {
            toast.error('فشل في حذف المدن المحددة');
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleDeleteSingle = (city: City) => {
    if (!confirm(`هل أنت متأكد من حذف ${city.name}؟ سيتم نقل الوصفات إلى المدينة الافتراضية.`)) return;

    isLoading.value = true;
    router.delete(route('dashboard.cities.destroy', city.id), {
        onSuccess: () => {
            toast.success('تم حذف المدينة');
        },
        onError: () => {
            toast.error('فشل في حذف المدينة');
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <div v-if="selectedIds.length > 0" class="bg-muted px-4 py-2 rounded-lg flex items-center gap-4">
                <span class="font-medium text-sm">تم تحديد {{ selectedIds.length }}</span>
                <Button size="sm" variant="destructive" @click="handleBulkDelete" :disabled="isLoading">
                    <Trash class="w-4 h-4 mr-1" /> حذف المحدد
                </Button>
            </div>
            <div v-else></div>
            <Button @click="handleOpenCreate">
                <Plus class="w-4 h-4 mr-1" /> إضافة مدينة
            </Button>
        </div>

        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-12">
                            <Checkbox
                                :checked="cities.length > 0 && selectedIds.length === cities.length"
                                @update:checked="handleSelectAll"
                            />
                        </TableHead>
                        <TableHead class="cursor-pointer" @click="emits('sort', 'name')">
                            المدينة
                            <span v-if="sortColumn === 'name'" class="mr-1 inline-block">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </TableHead>
                        <TableHead>الوصف</TableHead>
                        <TableHead class="cursor-pointer" @click="emits('sort', 'recipes_count')">
                            الوصفات
                            <span v-if="sortColumn === 'recipes_count'" class="mr-1 inline-block">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </TableHead>
                        <TableHead>الإجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="loading">
                        <TableRow v-for="i in 5" :key="i">
                            <TableCell colspan="5" class="h-12 text-center">جاري التحميل...</TableCell>
                        </TableRow>
                    </template>
                    <template v-else-if="cities.length === 0">
                        <TableRow>
                            <TableCell colspan="5" class="h-24 text-center">لا توجد مدن</TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow v-for="city in cities" :key="city.id">
                            <TableCell>
                                <Checkbox
                                    :checked="selectedIds.includes(city.id)"
                                    @update:checked="(c) => handleSelectOne(city.id, c)"
                                />
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center gap-3">
                                    <img v-if="city.image_url" :src="city.image_url" :alt="city.name" class="w-10 h-10 rounded object-cover" />
                                    <div v-else class="w-10 h-10 rounded bg-muted flex items-center justify-center text-lg">🏙️</div>
                                    <span class="font-medium">{{ city.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell class="max-w-xs truncate text-muted-foreground">
                                {{ city.description || '-' }}
                            </TableCell>
                            <TableCell>
                                {{ city.recipes_count }}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem @click="handleOpenEdit(city)">
                                            <Edit class="h-4 w-4" /> تعديل
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="handleDeleteSingle(city)" class="text-red-600 focus:text-red-600">
                                            <Trash class="h-4 w-4" /> حذف
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>

        <PaginationControls
            :current-page="pagination.current_page"
            :total-pages="pagination.last_page"
            :per-page="pagination.per_page"
            :total-items="pagination.total"
            @page-change="(p) => emits('pageChange', p)"
            @per-page-change="(pp) => emits('perPageChange', pp)"
        />

        <Dialog :open="isDialogOpen" @update:open="(v) => isDialogOpen = v">
            <DialogContent class="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{{ selectedCity ? 'تعديل مدينة' : 'إضافة مدينة جديدة' }}</DialogTitle>
                    <DialogDescription>
                        {{ selectedCity ? 'تعديل بيانات المدينة' : 'أدخل بيانات المدينة الجديدة' }}
                    </DialogDescription>
                </DialogHeader>
                <div class="space-y-4 py-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium">اسم المدينة</label>
                        <Input
                            v-model="name"
                            placeholder="مثال: دمشق"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium">صورة المدينة (اختياري)</label>
                        <Input
                            type="file"
                            accept="image/*"
                            @change="handleImageChange"
                        />
                        <div v-if="imagePreview" class="mt-2 relative h-40 w-full overflow-hidden rounded-md border text-center">
                            <img
                                :src="imagePreview"
                                alt="Preview"
                                class="h-full w-full object-cover inline-block"
                            />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium">وصف (اختياري)</label>
                        <Textarea
                            v-model="description"
                            placeholder="وصف قصير عن المدينة ومطبخها..."
                            :rows="3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="isDialogOpen = false">
                        إلغاء
                    </Button>
                    <Button @click="handleSubmit" :disabled="!name.trim() || isLoading">
                        {{ selectedCity ? 'حفظ التعديلات' : 'إنشاء' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
