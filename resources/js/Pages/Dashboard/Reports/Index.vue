<script setup lang="ts">
import { ref, watch } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import ReportsTable from '@/components/admin/reports/ReportsTable.vue';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui';
import type { AdminReport, Pagination } from '@/types';

interface Props {
    reports: {
        data: AdminReport[];
        links: any[];
    } & Pagination;
    filters: {
        status?: string;
        type?: string;
        per_page?: number;
    };
}

const props = defineProps<Props>();

const statusFilter = ref(props.filters.status || 'all');
const typeFilter = ref(props.filters.type || 'all');

const updateUrl = (updates: Record<string, any>) => {
    router.get(route('dashboard.reports'), {
        ...props.filters,
        ...updates,
    }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
    });
};

watch(statusFilter, (val) => {
    updateUrl({ status: val === 'all' ? null : val, page: 1 });
});

watch(typeFilter, (val) => {
    updateUrl({ type: val === 'all' ? null : val, page: 1 });
});

const handlePageChange = (page: number) => {
    updateUrl({ page });
};

const handlePerPageChange = (perPage: number) => {
    updateUrl({ per_page: perPage, page: 1 });
};
</script>

<template>
    <Head title="إدارة البلاغات" />

    <DashboardLayout>
        <div class="space-y-6">
            <div>
                <h1 class="text-3xl font-bold tracking-tight">إدارة البلاغات</h1>
                <p class="text-muted-foreground">مراجعة وإدارة بلاغات المستخدمين</p>
            </div>

            <Card>
                <CardHeader>
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>البلاغات</CardTitle>
                            <CardDescription>عرض {{ reports.total }} بلاغ</CardDescription>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full sm:w-auto">
                            <Select v-model="statusFilter">
                                <SelectTrigger class="w-full sm:w-[180px]">
                                    <SelectValue placeholder="تصفية حسب الحالة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">كل الحالات</SelectItem>
                                    <SelectItem value="pending">قيد المراجعة</SelectItem>
                                    <SelectItem value="fixed">تم الحل</SelectItem>
                                    <SelectItem value="rejected">مرفوض</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select v-model="typeFilter">
                                <SelectTrigger class="w-full sm:w-[180px]">
                                    <SelectValue placeholder="تصفية حسب النوع" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">كل الأنواع</SelectItem>
                                    <SelectItem value="content_issue">مشكلة محتوى</SelectItem>
                                    <SelectItem value="feedback">اقتراح / تعليق</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ReportsTable
                        :reports="reports.data"
                        :pagination="reports"
                        @page-change="handlePageChange"
                        @per-page-change="handlePerPageChange"
                    />
                </CardContent>
            </Card>
        </div>
    </DashboardLayout>
</template>
