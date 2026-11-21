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
    DropdownMenuTrigger,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Textarea,
    PaginationControls,
    Label
} from '@/components/ui';
import { MoreHorizontal, Trash, MessageSquare, CheckCircle, XCircle, ExternalLink, User } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { formatRelativeTime } from '@/lib/utils';
import type { AdminReport, Pagination } from '@/types';

interface Props {
    reports: AdminReport[];
    pagination: Pagination;
    loading?: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits<{
    (e: 'pageChange', page: number): void;
    (e: 'perPageChange', perPage: number): void;
}>();

const { props: pageProps } = usePage();
const isAdmin = computed(() => pageProps.auth?.user?.role === 'admin');
const selectedIds = ref<number[]>([]);
const isLoading = ref(false);

const detailDialogOpen = ref(false);
const selectedReport = ref<AdminReport | null>(null);
const navAction = ref<'pending' | 'fixed' | 'rejected'>('pending');
const adminNote = ref('');
const adminReply = ref('');

const handleSelectAll = (checked: boolean) => {
    if (checked) {
        selectedIds.value = props.reports.map(r => r.id);
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

const openDetails = (report: AdminReport) => {
    selectedReport.value = report;
    navAction.value = report.status as any;
    adminNote.value = report.admin_note || '';
    adminReply.value = report.admin_reply || '';
    detailDialogOpen.value = true;
};

const handleSaveDetails = () => {
    if (!selectedReport.value) return;

    isLoading.value = true;
    router.post(route('dashboard.reports.update', selectedReport.value.id), {
        status: navAction.value,
        admin_note: adminNote.value,
        admin_reply: adminReply.value
    }, {
        onSuccess: () => {
            detailDialogOpen.value = false;
            toast.success('تم تحديث البلاغ');
        },
        onError: () => {
            toast.error('فشل تحديث البلاغ');
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleBulkStatus = (status: string) => {
    if (selectedIds.value.length === 0) return;

    isLoading.value = true;
    router.post(route('dashboard.reports.bulk'), {
        ids: selectedIds.value,
        action: 'status_update',
        status
    }, {
        onSuccess: () => {
            selectedIds.value = [];
            toast.success('تم تحديث حالة البلاغات المحددة');
        },
        onError: () => {
            toast.error('فشل تحديث حالة البلاغات');
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleBulkDelete = () => {
    if (selectedIds.value.length === 0) return;
    if (!confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} بلاغ؟`)) return;

    isLoading.value = true;
    router.post(route('dashboard.reports.bulk'), {
        ids: selectedIds.value,
        action: 'delete'
    }, {
        onSuccess: () => {
            selectedIds.value = [];
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleDeleteSingle = (report: AdminReport) => {
    if (!confirm('هل أنت متأكد من حذف هذا البلاغ؟')) return;

    isLoading.value = true;
    router.delete(route('dashboard.reports.destroy', report.id), {
        onSuccess: () => {
            toast.success('تم حذف البلاغ');
        },
        onError: () => {
            toast.error('فشل حذف البلاغ');
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const getReportableLink = (report: AdminReport) => {
    if (!report.reportable) return 'محتوى محذوف';
    
    // In our backend, reportable_type is the full class name.
    // We should check the type in props or handle it in controller.
    const type = report.reportable_type.includes('Recipe') ? 'recipes' : 'lists';
    const slug = report.reportable.slug || report.reportable.id;
    
    return `/${type}/${slug}`;
};
</script>

<template>
    <div>
        <div v-if="selectedIds.length > 0" class="bg-muted p-4 rounded-lg mb-4 flex flex-wrap items-center justify-between gap-3">
            <span class="font-medium text-sm">تم تحديد {{ selectedIds.length }} عنصر</span>
            <div class="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" @click="handleBulkStatus('fixed')" :disabled="isLoading">
                    <CheckCircle class="me-2 w-4 h-4" aria-hidden="true" /> تم الحل
                </Button>
                <Button size="sm" variant="outline" @click="handleBulkStatus('rejected')" :disabled="isLoading">
                    <XCircle class="me-2 w-4 h-4" aria-hidden="true" /> رفض
                </Button>
                <Button v-if="isAdmin" size="sm" variant="destructive" @click="handleBulkDelete" :disabled="isLoading">
                    <Trash class="me-2 w-4 h-4" aria-hidden="true" /> حذف
                </Button>
            </div>
        </div>

        <div class="rounded-md border">
            <Table aria-label="جدول البلاغات" :aria-busy="loading || undefined">
                <caption class="sr-only">جدول البلاغات</caption>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-12">
                            <Checkbox
                                aria-label="تحديد جميع البلاغات"
                                :checked="reports.length > 0 && selectedIds.length === reports.length"
                                @update:checked="handleSelectAll"
                            />
                        </TableHead>
                        <TableHead>المرسل</TableHead>
                        <TableHead>المحتوى</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ البلاغ</TableHead>
                        <TableHead class="text-end">الإجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="loading">
                        <TableRow v-for="i in 5" :key="i">
                            <TableCell colspan="7" class="h-12 text-center">جاري التحميل...</TableCell>
                        </TableRow>
                    </template>
                    <template v-else-if="reports.length === 0">
                        <TableRow>
                            <TableCell colspan="7" class="h-24 text-center">لا توجد بلاغات</TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow v-for="report in reports" :key="report.id">
                            <TableCell>
                                <Checkbox
                                    :aria-label="`تحديد البلاغ #${report.id}`"
                                    :checked="selectedIds.includes(report.id)"
                                    @update:checked="(c) => handleSelectOne(report.id, c)"
                                />
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center gap-2">
                                    <div v-if="report.user.avatar" class="w-8 h-8 rounded-full overflow-hidden">
                                        <img :src="report.user.avatar" alt="" width="32" height="32" loading="lazy" decoding="async" class="w-full h-full object-cover" />
                                    </div>
                                    <div v-else class="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                                        <User class="h-4 w-4" aria-hidden="true" />
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium">{{ report.user.name }}</span>
                                        <span class="text-xs text-muted-foreground">{{ report.user.email }}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <a v-if="report.reportable" :href="getReportableLink(report)" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-primary hover:underline text-sm">
                                    {{ report.reportable.name }}
                                    <ExternalLink class="w-3 h-3" aria-hidden="true" />
                                </a>
                                <span v-else class="text-muted-foreground text-sm">محتوى محذوف</span>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" class="text-xs">
                                    {{ report.type === 'content_issue' ? 'مشكلة محتوى' : 'اقتراح' }}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge :variant="report.status === 'fixed' ? 'success' : report.status === 'pending' ? 'warning' : 'destructive'" class="text-xs">
                                    {{ report.status === 'fixed' ? 'تم الحل' : report.status === 'pending' ? 'مراجعة' : 'مرفوض' }}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span class="text-xs text-muted-foreground">{{ formatRelativeTime(report.created_at) }}</span>
                            </TableCell>
                            <TableCell>
                                <div class="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" :aria-label="`عرض تفاصيل البلاغ #${report.id}`" @click="openDetails(report)">
                                        <MessageSquare class="w-4 h-4 text-info" aria-hidden="true" />
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" :aria-label="`إجراءات البلاغ #${report.id}`">
                                                <MoreHorizontal class="h-4 w-4" aria-hidden="true" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem @click="handleDeleteSingle(report)" class="text-destructive focus:text-destructive">
                                                <Trash class="h-4 w-4" aria-hidden="true" /> حذف
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
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

        <Dialog :open="detailDialogOpen" @update:open="(v) => detailDialogOpen = v">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>تفاصيل البلاغ #{{ selectedReport?.id }}</DialogTitle>
                </DialogHeader>

                <div v-if="selectedReport" class="grid gap-6 py-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-sm font-medium text-muted-foreground block">المرسل:</span>
                            <div class="font-medium">{{ selectedReport.user.name }}</div>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-muted-foreground block">التاريخ:</span>
                            <div class="font-medium">{{ formatRelativeTime(selectedReport.created_at) }}</div>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-muted-foreground block">النوع:</span>
                            <div class="font-medium">{{ selectedReport.type === 'content_issue' ? 'مشكلة محتوى' : 'اقتراح' }}</div>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-muted-foreground block">المحتوى:</span>
                            <div v-if="selectedReport.reportable">
                                <a :href="getReportableLink(selectedReport)" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">{{ selectedReport.reportable.name }}</a>
                            </div>
                            <div v-else class="text-muted-foreground">محتوى محذوف</div>
                        </div>
                    </div>

                    <div class="bg-muted p-4 rounded-md">
                        <span class="text-sm font-medium mb-2 block">الرسالة:</span>
                        <p class="text-sm whitespace-pre-wrap">{{ selectedReport.message }}</p>
                    </div>

                    <div class="space-y-4 border-t pt-4">
                        <span class="text-sm font-medium block">إجراءات الإدارة</span>

                        <div class="grid grid-cols-3 gap-2">
                            <Button
                                :variant="navAction === 'pending' ? 'default' : 'outline'"
                                @click="navAction = 'pending'"
                                size="sm"
                            >
                                قيد المراجعة
                            </Button>
                            <Button
                                :variant="navAction === 'fixed' ? 'default' : 'outline'"
                                @click="navAction = 'fixed'"
                                size="sm"
                                :class="navAction === 'fixed' ? 'bg-success text-success-foreground hover:bg-success/90' : ''"
                            >
                                تم الحل
                            </Button>
                            <Button
                                :variant="navAction === 'rejected' ? 'destructive' : 'outline'"
                                @click="navAction = 'rejected'"
                                size="sm"
                            >
                                مرفوض
                            </Button>
                        </div>

                        <div class="space-y-2">
                            <Label for="report-admin-note">ملاحظات إدارية (خاصة)</Label>
                            <Textarea
                                id="report-admin-note"
                                v-model="adminNote"
                                placeholder="ملاحظات للفريق فقط..."
                            />
                        </div>

                        <div class="space-y-2">
                            <Label for="report-admin-reply">رد على المستخدم (سيظهر للمستخدم)</Label>
                            <Textarea
                                id="report-admin-reply"
                                v-model="adminReply"
                                placeholder="اكتب رداً للمستخدم..."
                                class="min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" @click="detailDialogOpen = false">إغلاق</Button>
                    <Button @click="handleSaveDetails" :disabled="isLoading" :aria-busy="isLoading || undefined">حفظ التغييرات</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
