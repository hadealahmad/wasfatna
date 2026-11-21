<script setup lang="ts">
import { ref, computed } from 'vue';
import { router, Link, usePage } from '@inertiajs/vue3';
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Label,
    Textarea,
    PaginationControls
} from '@/components/ui';
import { MoreHorizontal, Edit, Trash, Eye, EyeOff, Sparkles } from 'lucide-vue-next';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from 'vue-sonner';
import type { AdminRecipe, Pagination } from '@/types';

interface Props {
    recipes: AdminRecipe[];
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

const page = usePage();
const isAdmin = computed(() => page.props.auth?.user?.role === 'admin');
const selectedIds = ref<number[]>([]);
const isLoading = ref(false);

// Dialog states
const rejectDialogOpen = ref(false);
const selectedRecipe = ref<AdminRecipe | null>(null);
const rejectReason = ref('');
const rejectError = ref('');

const handleSelectAll = (checked: boolean) => {
    if (checked) {
        selectedIds.value = props.recipes.map(r => r.id);
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

const handleBulkAction = (action: string, status?: string) => {
    if (selectedIds.value.length === 0) return;
    if (action === 'delete' && !confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} وصفة؟`)) return;

    isLoading.value = true;
    router.post(route('dashboard.recipes.bulk'), {
        ids: selectedIds.value,
        action,
        status
    }, {
        onSuccess: () => {
            selectedIds.value = [];
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleBulkAiTagging = () => {
    if (selectedIds.value.length === 0) return;

    isLoading.value = true;
    router.post(route('dashboard.recipes.bulk_tag'), {
        ids: selectedIds.value
    }, {
        onSuccess: () => {
            selectedIds.value = [];
            toast.success('بدأت عملية تنظيم الوسوم');
        },
        onError: () => {
            toast.error('فشل في بدء عملية تنظيم الوسوم');
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleSingleStatusChange = (recipe: AdminRecipe, newStatus: string) => {
    if (newStatus === 'rejected') {
        selectedRecipe.value = recipe;
        rejectReason.value = '';
        rejectError.value = '';
        rejectDialogOpen.value = true;
        return;
    }

    isLoading.value = true;
    router.post(route('dashboard.recipes.bulk'), {
        ids: [recipe.id],
        action: 'change_status',
        status: newStatus
    }, {
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleReject = () => {
    if (!selectedRecipe.value) return;
    if (!rejectReason.value.trim()) {
        rejectError.value = 'يرجى ذكر سبب الرفض';
        return;
    }
    rejectError.value = '';
    
    isLoading.value = true;
    router.post(route('dashboard.recipes.reject', selectedRecipe.value.id), {
        reason: rejectReason.value
    }, {
        onSuccess: () => {
            rejectDialogOpen.value = false;
            rejectReason.value = '';
            rejectError.value = '';
            selectedRecipe.value = null;
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleDelete = (recipe: AdminRecipe) => {
    if (!isAdmin.value) return;
    if (!confirm('هل أنت متأكد من حذف هذه الوصفة؟')) return;

    isLoading.value = true;
    router.post(route('dashboard.recipes.bulk'), {
        ids: [recipe.id],
        action: 'delete'
    }, {
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        unpublished: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        approved: 'منشورة',
        pending: 'بانتظار الموافقة',
        rejected: 'مرفوضة',
        unpublished: 'غير منشورة',
    };
    return labels[status] || status;
};
</script>

<template>
    <div>
        <div v-if="selectedIds.length > 0" class="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between">
            <span class="font-medium text-sm">تم تحديد {{ selectedIds.length }} عنصر</span>
            <div class="flex gap-2">
                <Button size="sm" @click="handleBulkAction('publish')" :disabled="isLoading">
                    نشر
                </Button>
                <Button size="sm" variant="outline" @click="handleBulkAction('unpublish')" :disabled="isLoading">
                    إلغاء النشر
                </Button>
                <template v-if="isAdmin">
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        @click="handleBulkAiTagging" 
                        :disabled="isLoading"
                        class="gap-2"
                    >
                        <Sparkles class="h-4 w-4" aria-hidden="true" />
                        تنظيم الوسوم
                    </Button>
                    <Button size="sm" variant="destructive" @click="handleBulkAction('delete')" :disabled="isLoading">
                        حذف
                    </Button>
                </template>
            </div>
        </div>

        <div class="rounded-md border">
            <Table aria-label="جدول الوصفات" :aria-busy="loading || undefined">
                <caption class="sr-only">جدول الوصفات</caption>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-12">
                            <Checkbox
                                aria-label="تحديد جميع الوصفات"
                                :checked="recipes.length > 0 && selectedIds.length === recipes.length"
                                @update:checked="handleSelectAll"
                            />
                        </TableHead>
                        <TableHead>الصورة</TableHead>
                        <TableHead :aria-sort="sortColumn === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'">
                            <button type="button" class="inline-flex items-center gap-1 font-medium cursor-pointer" @click="emits('sort', 'name')">
                                اسم الوصفة
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
                        <TableHead :aria-sort="sortColumn === 'tags_count' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'">
                            <button type="button" class="inline-flex items-center gap-1 font-medium cursor-pointer" @click="emits('sort', 'tags_count')">
                                الوسوم
                                <span v-if="sortColumn === 'tags_count'" aria-hidden="true">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                            </button>
                        </TableHead>
                        <TableHead>الإجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="loading">
                        <TableRow v-for="i in 5" :key="i">
                            <TableCell colspan="7" class="h-12 text-center">جاري التحميل...</TableCell>
                        </TableRow>
                    </template>
                    <template v-else-if="recipes.length === 0">
                        <TableRow>
                            <TableCell colspan="7" class="h-24 text-center">لا توجد وصفات</TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow v-for="recipe in recipes" :key="recipe.id">
                            <TableCell>
                                <Checkbox
                                    :aria-label="`تحديد ${recipe.name}`"
                                    :checked="selectedIds.includes(recipe.id)"
                                    @update:checked="(c) => handleSelectOne(recipe.id, c)"
                                />
                            </TableCell>
                            <TableCell>
                                <img v-if="recipe.image_url" :src="recipe.image_url" :alt="recipe.name" width="40" height="40" loading="lazy" decoding="async" class="w-10 h-10 rounded object-cover" />
                                <div v-else class="w-10 h-10 rounded bg-muted flex items-center justify-center text-lg" aria-hidden="true">🍽️</div>
                            </TableCell>
                            <TableCell>
                                <div class="flex flex-col">
                                    <Link :href="`/recipes/${recipe.slug}`" class="font-medium hover:underline" target="_blank" rel="noopener noreferrer">
                                        {{ recipe.name }}
                                    </Link>
                                    <span class="text-xs text-muted-foreground">{{ formatRelativeTime(recipe.created_at) }}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div v-if="recipe.user" class="flex items-center gap-2">
                                    <Link :href="route('users.show', recipe.user.id)" class="flex items-center gap-2 hover:underline" target="_blank" rel="noopener noreferrer">
                                        <img v-if="recipe.user.avatar" :src="recipe.user.avatar" alt="" width="24" height="24" loading="lazy" decoding="async" class="w-6 h-6 rounded-full object-cover" />
                                        <div v-else class="w-6 h-6 rounded-full bg-muted" aria-hidden="true" />
                                        <span class="text-sm">{{ recipe.user.name }}</span>
                                    </Link>
                                </div>
                                <span v-else class="text-sm text-muted-foreground">مجهول</span>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" class="h-auto p-0 hover:bg-transparent">
                                            <Badge :class="getStatusColor(recipe.status)">{{ getStatusLabel(recipe.status) }}</Badge>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>تغيير الحالة</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup :model-value="recipe.status" @update:model-value="(v) => handleSingleStatusChange(recipe, v)">
                                            <DropdownMenuRadioItem value="approved">منشورة</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="pending">بانتظار الموافقة</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="unpublished">غير منشورة</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="rejected">مرفوضة</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{{ recipe.tags?.length || 0 }} وسوم</Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" :aria-label="`إجراءات ${recipe.name}`">
                                            <MoreHorizontal class="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link :href="route('my.recipes.edit', recipe.id)" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2">
                                                <Edit class="h-4 w-4" aria-hidden="true" /> تعديل
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="handleSingleStatusChange(recipe, recipe.status === 'approved' ? 'unpublished' : 'approved')">
                                            <template v-if="recipe.status === 'approved'">
                                                <EyeOff class="h-4 w-4" aria-hidden="true" /> إلغاء النشر
                                            </template>
                                            <template v-else>
                                                <Eye class="h-4 w-4" aria-hidden="true" /> نشر
                                            </template>
                                        </DropdownMenuItem>
                                        <template v-if="isAdmin">
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem @click="handleDelete(recipe)" class="text-red-600 focus:text-red-600">
                                                <Trash class="h-4 w-4" aria-hidden="true" /> حذف
                                            </DropdownMenuItem>
                                        </template>
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

        <Dialog :open="rejectDialogOpen" @update:open="(v) => rejectDialogOpen = v">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>رفض الوصفة</DialogTitle>
                    <DialogDescription>يرجى ذكر سبب الرفض</DialogDescription>
                </DialogHeader>
                <div class="space-y-2">
                    <Label for="reject-reason" class="sr-only">سبب الرفض</Label>
                    <Textarea
                        id="reject-reason"
                        v-model="rejectReason"
                        placeholder="سبب الرفض..."
                        :aria-invalid="Boolean(rejectError) || undefined"
                        :aria-describedby="rejectError ? 'reject-reason-error' : undefined"
                        @input="rejectError = ''"
                    />
                    <p v-if="rejectError" id="reject-reason-error" class="text-sm text-red-600 dark:text-red-400">{{ rejectError }}</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="rejectDialogOpen = false">إلغاء</Button>
                    <Button variant="destructive" @click="handleReject" :disabled="isLoading" :aria-busy="isLoading || undefined">تأكيد الرفض</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
