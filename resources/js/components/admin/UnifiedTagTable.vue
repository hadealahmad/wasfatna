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
    PaginationControls
} from '@/components/ui';
import { MoreHorizontal, Trash, Edit, Plus } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import type { Tag, Pagination } from '@/types';

interface Props {
    tags: Tag[];
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
const selectedTag = ref<Tag | null>(null);
const isLoading = ref(false);

const name = ref('');

const handleSelectAll = (checked: boolean) => {
    if (checked) {
        selectedIds.value = props.tags.map(t => t.id);
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
    selectedTag.value = null;
};

const handleOpenCreate = () => {
    resetForm();
    isDialogOpen.value = true;
};

const handleOpenEdit = (tag: Tag) => {
    selectedTag.value = tag;
    name.value = tag.name;
    isDialogOpen.value = true;
};

const handleSubmit = () => {
    if (!name.value.trim()) return;
    
    isLoading.value = true;
    const url = selectedTag.value 
        ? route('dashboard.tags.update', selectedTag.value.id) 
        : route('dashboard.tags.store');
    
    router.post(url, {
        _method: selectedTag.value ? 'PUT' : 'POST',
        name: name.value
    }, {
        onSuccess: () => {
            isDialogOpen.value = false;
            resetForm();
            toast.success(selectedTag.value ? 'تم تحديث الوسم' : 'تم إنشاء الوسم');
        },
        onError: () => {
            toast.error('فشل في حفظ الوسم');
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleBulkDelete = () => {
    if (selectedIds.value.length === 0) return;
    if (!confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} وسم؟ سيتم إزالتها من الوصفات المرتبطة.`)) return;

    isLoading.value = true;
    router.post(route('dashboard.tags.bulk'), {
        _method: 'PUT',
        ids: selectedIds.value,
        action: 'delete'
    }, {
        onSuccess: () => {
            selectedIds.value = [];
            toast.success('تم حذف الوسوم المحددة');
        },
        onError: () => {
            toast.error('فشل في حذف الوسوم المحددة');
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleDeleteSingle = (tag: Tag) => {
    if (!confirm(`هل أنت متأكد من حذف ${tag.name}؟ سيتم إزالته من الوصفات المرتبطة.`)) return;

    isLoading.value = true;
    router.delete(route('dashboard.tags.destroy', tag.id), {
        onSuccess: () => {
            toast.success('تم حذف الوسم');
        },
        onError: () => {
            toast.error('فشل في حذف الوسم');
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
                <Plus class="w-4 h-4 mr-1" /> إضافة وسم
            </Button>
        </div>

        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-12">
                            <Checkbox
                                :checked="tags.length > 0 && selectedIds.length === tags.length"
                                @update:checked="handleSelectAll"
                            />
                        </TableHead>
                        <TableHead class="cursor-pointer" @click="emits('sort', 'name')">
                            الاسم
                            <span v-if="sortColumn === 'name'" class="mr-1 inline-block">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </TableHead>
                        <TableHead class="cursor-pointer" @click="emits('sort', 'recipes_count')">
                            عدد الوصفات
                            <span v-if="sortColumn === 'recipes_count'" class="mr-1 inline-block">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </TableHead>
                        <TableHead>الإجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="loading">
                        <TableRow v-for="i in 5" :key="i">
                            <TableCell colspan="4" class="h-12 text-center">جاري التحميل...</TableCell>
                        </TableRow>
                    </template>
                    <template v-else-if="tags.length === 0">
                        <TableRow>
                            <TableCell colspan="4" class="h-24 text-center">لا توجد وسوم</TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow v-for="tag in tags" :key="tag.id">
                            <TableCell>
                                <Checkbox
                                    :checked="selectedIds.includes(tag.id)"
                                    @update:checked="(c) => handleSelectOne(tag.id, c)"
                                />
                            </TableCell>
                            <TableCell class="font-medium">
                                {{ tag.name }}
                            </TableCell>
                            <TableCell>
                                {{ tag.recipes_count }}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem @click="handleOpenEdit(tag)">
                                            <Edit class="h-4 w-4" /> تعديل
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="handleDeleteSingle(tag)" class="text-red-600 focus:text-red-600">
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
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{{ selectedTag ? 'تعديل وسم' : 'إضافة وسم جديد' }}</DialogTitle>
                    <DialogDescription>
                        {{ selectedTag ? 'تعديل اسم الوسم' : 'أدخل اسم الوسم الجديد' }}
                    </DialogDescription>
                </DialogHeader>
                <div class="space-y-4 py-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium">اسم الوسم</label>
                        <Input
                            v-model="name"
                            placeholder="مثال: نباتي"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="isDialogOpen = false">
                        إلغاء
                    </Button>
                    <Button @click="handleSubmit" :disabled="!name.trim() || isLoading">
                        {{ selectedTag ? 'حفظ التعديلات' : 'إنشاء' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
