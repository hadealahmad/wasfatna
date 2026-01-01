<script setup lang="ts">
import { ref, watch } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import UnifiedListTable from '@/components/admin/UnifiedListTable.vue';
import { 
    Input, 
    Button,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui';
import { Search, Filter } from 'lucide-vue-next';
import { useDebounceFn } from '@vueuse/core';

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

interface Pagination {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

interface Props {
    lists: {
        data: List[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    filters: {
        search?: string;
        status?: string;
        sort_by?: string;
        sort_dir?: string;
    };
}

const props = defineProps<Props>();

const searchQuery = ref(props.filters.search || '');
const statusFilter = ref<string[]>(props.filters.status ? props.filters.status.split(',') : []);

const debouncedSearch = useDebounceFn(() => {
    updateUrl();
}, 500);

watch(searchQuery, () => {
    debouncedSearch();
});

const updateUrl = () => {
    router.get(route('dashboard.lists'), {
        search: searchQuery.value || undefined,
        status: statusFilter.value.length > 0 ? statusFilter.value.join(',') : undefined,
        sort_by: props.filters.sort_by,
        sort_dir: props.filters.sort_dir,
        per_page: props.lists.per_page,
        page: 1, // Reset to first page on filter change
    }, {
        preserveState: true,
        replace: true,
        only: ['lists', 'filters'],
    });
};

const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
        statusFilter.value.push(status);
    } else {
        statusFilter.value = statusFilter.value.filter(s => s !== status);
    }
    updateUrl();
};

const handleSort = (column: string) => {
    const isCurrent = props.filters.sort_by === column;
    const direction = isCurrent && props.filters.sort_dir === 'desc' ? 'asc' : 'desc';
    
    router.get(route('dashboard.lists'), {
        ...props.filters,
        sort_by: column,
        sort_dir: direction,
        page: props.lists.current_page,
    }, {
        preserveState: true,
        replace: true,
        only: ['lists', 'filters'],
    });
};

const handlePageChange = (page: number) => {
    router.get(route('dashboard.lists'), {
        ...props.filters,
        page,
        per_page: props.lists.per_page,
    }, {
        preserveState: true,
        only: ['lists'],
    });
};

const handlePerPageChange = (perPage: number) => {
    router.get(route('dashboard.lists'), {
        ...props.filters,
        per_page: perPage,
        page: 1,
    }, {
        preserveState: true,
        only: ['lists'],
    });
};
</script>

<template>
    <Head title="إدارة القوائم" />

    <DashboardLayout>
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center gap-4">
                <h2 class="text-2xl font-bold tracking-tight text-right w-full sm:w-auto">إدارة القوائم</h2>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <div class="relative flex-1 sm:w-64">
                        <Search class="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="بحث عن قائمة..."
                            class="pr-9 text-right"
                            v-model="searchQuery"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" :class="statusFilter.length > 0 ? 'border-primary text-primary' : ''">
                                <Filter class="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56 text-right">
                            <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                :checked="statusFilter.includes('review')"
                                @update:checked="(c) => handleStatusChange('review', c)"
                            >
                                بانتظار الموافقة
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                :checked="statusFilter.includes('approved')"
                                @update:checked="(c) => handleStatusChange('approved', c)"
                            >
                                منشورة
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                :checked="statusFilter.includes('rejected')"
                                @update:checked="(c) => handleStatusChange('rejected', c)"
                            >
                                مرفوضة
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                :checked="statusFilter.includes('private')"
                                @update:checked="(c) => handleStatusChange('private', c)"
                            >
                                خاصة
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <UnifiedListTable
                :lists="lists.data"
                :pagination="{
                    current_page: lists.current_page,
                    last_page: lists.last_page,
                    total: lists.total,
                    per_page: lists.per_page
                }"
                :sort-column="filters.sort_by || 'updated_at'"
                :sort-direction="(filters.sort_dir as 'asc' | 'desc') || 'desc'"
                @sort="handleSort"
                @page-change="handlePageChange"
                @per-page-change="handlePerPageChange"
            />
        </div>
    </DashboardLayout>
</template>
