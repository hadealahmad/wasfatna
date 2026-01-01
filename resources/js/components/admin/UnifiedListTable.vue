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
        onFinish: () => {
            isLoading.value = false;
        }
    });
};
</script>

<template>
    <div>
        <div v-if="selectedIds.length > 0" class="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between">
            <span class="font-medium text-sm">تم تحديد {{ selectedIds.length }} عنصر</span>
            <div class="flex gap-2">
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-12">
                            <Checkbox
                                :checked="lists.length > 0 && selectedIds.length === lists.length"
                                @update:checked="handleSelectAll"
                            />
                        </TableHead>
                        <TableHead class="cursor-pointer" @click="emits('sort', 'name')">
                            القائمة
                            <span v-if="sortColumn === 'name'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </TableHead>
                        <TableHead>المستخدم</TableHead>
                        <TableHead class="cursor-pointer" @click="emits('sort', 'status')">
                            الحالة
                            <span v-if="sortColumn === 'status'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </TableHead>
                        <TableHead class="cursor-pointer" @click="emits('sort', 'recipes_count')">
                            عدد الوصفات
                            <span v-if="sortColumn === 'recipes_count'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الإجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="loading">
                        <TableRow v-for="i in 5" :key="i">
                            <TableCell colspan="7" class="h-12 text-center text-right">جاري التحميل...</TableCell>
                        </TableRow>
                    </template>
                    <template v-else-if="lists.length === 0">
                        <TableRow>
                            <TableCell colspan="7" class="h-24 text-center text-right">لا توجد قوائم</TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow v-for="list in lists" :key="list.id">
                            <TableCell>
                                <Checkbox
                                    :checked="selectedIds.includes(list.id)"
                                    @update:checked="(c) => handleSelectOne(list.id, c)"
                                />
                            </TableCell>
                            <TableCell>
                                <a :href="`/lists/${list.id}`" class="font-medium hover:underline text-right" target="_blank">
                                    {{ list.name }}
                                </a>
                                <div v-if="list.description" class="text-xs text-muted-foreground truncate max-w-[200px] text-right">
                                    {{ list.description }}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center gap-2 justify-end">
                                    <span class="text-sm">{{ list.user?.name }}</span>
                                    <img v-if="list.user?.avatar" :src="list.user.avatar" class="w-6 h-6 rounded-full" />
                                    <div v-else class="w-6 h-6 rounded-full bg-gray-300" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge v-if="list.status === 'approved'" class="bg-green-100 text-green-800">منشورة</Badge>
                                <Badge v-else-if="list.status === 'review'" class="bg-amber-100 text-amber-800">بانتظار الموافقة</Badge>
                                <Badge v-else-if="list.status === 'rejected'" class="bg-red-100 text-red-800">مرفوضة</Badge>
                                <Badge v-else-if="list.status === 'private'" class="bg-gray-100 text-gray-800">خاصة</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{{ list.recipes_count }}</Badge>
                            </TableCell>
                            <TableCell class="text-sm text-muted-foreground">
                                {{ formatRelativeTime(list.updated_at) }}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <template v-if="list.status === 'review'">
                                            <DropdownMenuItem @click="handleUpdateStatus(list, 'approved')">
                                                <CheckCircle class="h-4 w-4 ml-2" /> موافقة
                                            </DropdownMenuItem>
                                            <DropdownMenuItem @click="handleUpdateStatus(list, 'rejected')" class="text-red-600">
                                                <XCircle class="h-4 w-4 ml-2" /> رفض
                                            </DropdownMenuItem>
                                        </template>
                                        <template v-if="list.status === 'approved'">
                                            <DropdownMenuItem @click="handleUpdateStatus(list, 'private')">
                                                <EyeOff class="h-4 w-4 ml-2" /> إلغاء النشر
                                            </DropdownMenuItem>
                                        </template>
                                        <template v-if="list.status === 'private'">
                                            <DropdownMenuItem @click="handleUpdateStatus(list, 'approved')">
                                                <CheckCircle class="h-4 w-4 ml-2" /> نشر
                                            </DropdownMenuItem>
                                        </template>
                                        <DropdownMenuItem @click="handleDelete(list)" class="text-red-600 focus:text-red-600">
                                            <Trash class="h-4 w-4 ml-2" /> حذف
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
