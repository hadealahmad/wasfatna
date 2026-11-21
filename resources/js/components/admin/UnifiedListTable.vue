<script setup lang="ts">
import { ref } from 'vue';
import { router, Link } from '@inertiajs/vue3';
import { 
    Button, 
    Badge, 
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
    PaginationControls
} from '@/components/ui';
import { MoreHorizontal, Trash, CheckCircle, EyeOff, XCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { formatRelativeTime } from '@/lib/utils';
import type { Pagination } from '@/types';

interface List {
    id: number;
    name: string;
    description: string;
    user: { id: number; name: string; avatar?: string };
    recipes_count: number;
    updated_at: string;
    status: string;
    is_public: boolean;
}

interface Props {
    lists: List[];
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
const isLoading = ref(false);

const handleSelectAll = (checked: boolean) => {
    if (checked) {
        selectedIds.value = props.lists.map(l => l.id);
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

const handleBulkAction = (action: 'delete' | 'approve' | 'reject' | 'unpublish') => {
    if (selectedIds.value.length === 0) return;
    if (action === 'delete' && !confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} قائمة؟`)) return;

    isLoading.value = true;
    router.post(route('dashboard.lists.bulk'), {
        ids: selectedIds.value,
        action
    }, {
        onSuccess: () => {
            selectedIds.value = [];
            toast.success('تم تنفيذ الإجراء بنجاح');
        },
        onError: () => {
            toast.error('فشل تنفيذ الإجراء');
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleDelete = (list: List) => {
    if (!confirm('هل أنت متأكد من حذف هذه القائمة؟')) return;

    isLoading.value = true;
    router.delete(route('dashboard.lists.destroy', list.id), {
        onSuccess: () => toast.success('تم حذف القائمة'),
        onError: () => toast.error('فشل حذف القائمة'),
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleUpdateStatus = (list: List, status: string) => {
    isLoading.value = true;
    router.post(route('dashboard.lists.update', list.id), {
        _method: 'PUT',
        status
    }, {
        onSuccess: () => toast.success('تم تحديث حالة القائمة'),
        onError: () => toast.error('فشل تحديث حالة القائمة'),
        onFinish: () => {
            isLoading.value = false;
        }
    });
};
</script>

<template>
    <div>
        <div v-if="selectedIds.length > 0" class="bg-muted p-4 rounded-lg mb-4 flex flex-wrap items-center justify-between gap-3">
            <span class="font-medium text-sm">تم تحديد {{ selectedIds.length }} عنصر</span>
            <div class="flex flex-wrap gap-2">
                <Button size="sm" @click="handleBulkAction('approve')" :disabled="isLoading">
                    موافقة
                </Button>
                <Button size="sm" variant="secondary" @click="handleBulkAction('unpublish')" :disabled="isLoading">
                    إلغاء النشر
                </Button>
                <Button size="sm" variant="destructive" @click="handleBulkAction('delete')" :disabled="isLoading">
                    حذف
                </Button>
            </div>
        </div>

        <div class="rounded-md border">
            <Table aria-label="جدول قوائم الوصفات" :aria-busy="loading || undefined">
                <caption class="sr-only">جدول قوائم الوصفات</caption>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-12">
                            <Checkbox
                                aria-label="تحديد جميع القوائم"
                                :checked="lists.length > 0 && selectedIds.length === lists.length"
                                @update:checked="handleSelectAll"
                            />
                        </TableHead>
                        <TableHead :aria-sort="sortColumn === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'">
                            <button type="button" class="inline-flex items-center gap-1 font-medium cursor-pointer" @click="emits('sort', 'name')">
                                القائمة
                                <span v-if="sortColumn === 'name'" aria-hidden="true">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                            </button>
                        </TableHead>
                        <TableHead>المستخدم</TableHead>
                        <TableHead :aria-sort="sortColumn === 'status' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'">
                            <button type="button" class="inline-flex items-center gap-1 font-medium cursor-pointer" @click="emits('sort', 'status')">
                                الحالة
                                <span v-if="sortColumn === 'status'" aria-hidden="true">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                            </button>
                        </TableHead>
                        <TableHead :aria-sort="sortColumn === 'recipes_count' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'">
                            <button type="button" class="inline-flex items-center gap-1 font-medium cursor-pointer" @click="emits('sort', 'recipes_count')">
                                عدد الوصفات
                                <span v-if="sortColumn === 'recipes_count'" aria-hidden="true">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                            </button>
                        </TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الإجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="loading">
                        <TableRow v-for="i in 5" :key="i">
                            <TableCell colspan="7" class="h-12 text-center">جاري التحميل...</TableCell>
                        </TableRow>
                    </template>
                    <template v-else-if="lists.length === 0">
                        <TableRow>
                            <TableCell colspan="7" class="h-24 text-center">لا توجد قوائم</TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow v-for="list in lists" :key="list.id">
                            <TableCell>
                                <Checkbox
                                    :aria-label="`تحديد ${list.name}`"
                                    :checked="selectedIds.includes(list.id)"
                                    @update:checked="(c) => handleSelectOne(list.id, c)"
                                />
                            </TableCell>
                            <TableCell>
                                <a :href="`/lists/${list.id}`" class="font-medium hover:underline text-start" target="_blank" rel="noopener noreferrer">
                                    {{ list.name }}
                                </a>
                                <div v-if="list.description" class="text-xs text-muted-foreground truncate max-w-[200px] text-start">
                                    {{ list.description }}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center gap-2 justify-start">
                                    <img v-if="list.user?.avatar" :src="list.user.avatar" alt="" width="24" height="24" loading="lazy" decoding="async" class="w-6 h-6 rounded-full object-cover shrink-0" />
                                    <div v-else class="w-6 h-6 rounded-full bg-muted shrink-0" aria-hidden="true" />
                                    <span class="text-sm">{{ list.user?.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge v-if="list.status === 'approved'" variant="success">منشورة</Badge>
                                <Badge v-else-if="list.status === 'review'" variant="warning">بانتظار الموافقة</Badge>
                                <Badge v-else-if="list.status === 'rejected'" variant="destructive">مرفوضة</Badge>
                                <Badge v-else-if="list.status === 'private'" variant="secondary">خاصة</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" class="tabular-nums">{{ list.recipes_count }}</Badge>
                            </TableCell>
                            <TableCell class="text-sm text-muted-foreground">
                                {{ formatRelativeTime(list.updated_at) }}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" :aria-label="`إجراءات ${list.name}`">
                                            <MoreHorizontal class="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <template v-if="list.status === 'review'">
                                            <DropdownMenuItem @click="handleUpdateStatus(list, 'approved')">
                                                <CheckCircle class="h-4 w-4 me-2" aria-hidden="true" /> موافقة
                                            </DropdownMenuItem>
                                            <DropdownMenuItem @click="handleUpdateStatus(list, 'rejected')" class="text-destructive focus:text-destructive">
                                                <XCircle class="h-4 w-4 me-2" aria-hidden="true" /> رفض
                                            </DropdownMenuItem>
                                        </template>
                                        <template v-if="list.status === 'approved'">
                                            <DropdownMenuItem @click="handleUpdateStatus(list, 'private')">
                                                <EyeOff class="h-4 w-4 me-2" aria-hidden="true" /> إلغاء النشر
                                            </DropdownMenuItem>
                                        </template>
                                        <template v-if="list.status === 'private'">
                                            <DropdownMenuItem @click="handleUpdateStatus(list, 'approved')">
                                                <CheckCircle class="h-4 w-4 me-2" aria-hidden="true" /> نشر
                                            </DropdownMenuItem>
                                        </template>
                                        <DropdownMenuItem @click="handleDelete(list)" class="text-destructive focus:text-destructive">
                                            <Trash class="h-4 w-4 me-2" aria-hidden="true" /> حذف
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
    </div>
</template>
