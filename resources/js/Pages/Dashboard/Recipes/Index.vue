<script setup lang="ts">
import { ref, watch } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import UnifiedRecipeTable from '@/components/admin/UnifiedRecipeTable.vue';
import { Input, Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui';
import { Search, Filter } from 'lucide-vue-next';
import type { AdminRecipe, Pagination } from '@/types';
import { useDebounceFn } from '@vueuse/core';

interface Props {
    recipes: {
        data: AdminRecipe[];
        links: any[];
    } & Pagination;
    filters: {
        status?: string;
        search?: string;
        sort_by?: string;
        sort_dir?: 'asc' | 'desc';
        per_page?: number;
    };
}

const props = defineProps<Props>();

const searchQuery = ref(props.filters.search || '');
const statusFilter = ref<string[]>(props.filters.status ? props.filters.status.split(',') : []);

const updateUrl = (updates: Record<string, any>) => {
    router.get(route('dashboard.recipes'), {
        ...props.filters,
        ...updates,
    }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
    });
};

const debouncedSearch = useDebounceFn(() => {
    updateUrl({ search: searchQuery.value, page: 1 });
}, 500);

watch(searchQuery, () => {
    debouncedSearch();
});

const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
        statusFilter.value.push(status);
    } else {
        statusFilter.value = statusFilter.value.filter(s => s !== status);
    }
    updateUrl({
        status: statusFilter.value.length > 0 ? statusFilter.value.join(',') : null,
        page: 1
    });
};

const handleSort = (column: string) => {
    const direction = props.filters.sort_by === column && props.filters.sort_dir === 'asc' ? 'desc' : 'asc';
    updateUrl({ sort_by: column, sort_dir: direction });
};

const handlePageChange = (page: number) => {
    updateUrl({ page });
};

const handlePerPageChange = (perPage: number) => {
    updateUrl({ per_page: perPage, page: 1 });
};
</script>

<template>
    <Head title="إدارة الوصفات" />

    <DashboardLayout>
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 class="text-2xl font-bold tracking-tight">إدارة الوصفات</h2>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <div class="relative flex-1 sm:w-64">
                        <Search class="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="بحث عن وصفة..."
                            class="pr-9"
                            v-model="searchQuery"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" :class="statusFilter.length > 0 ? 'border-primary text-primary' : ''">
                                <Filter class="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56">
                            <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                :checked="statusFilter.includes('pending')"
                                @update:checked="(checked) => handleStatusChange('pending', checked)"
                            >
                                بانتظار الموافقة
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                :checked="statusFilter.includes('approved')"
                                @update:checked="(checked) => handleStatusChange('approved', checked)"
                            >
                                منشورة
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                :checked="statusFilter.includes('unpublished')"
                                @update:checked="(checked) => handleStatusChange('unpublished', checked)"
                            >
                                غير منشورة
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                :checked="statusFilter.includes('rejected')"
                                @update:checked="(checked) => handleStatusChange('rejected', checked)"
                            >
                                مرفوضة
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <UnifiedRecipeTable
                :recipes="recipes.data"
                :pagination="recipes"
                :sort-column="filters.sort_by || 'created_at'"
                :sort-direction="filters.sort_dir || 'desc'"
                @sort="handleSort"
                @page-change="handlePageChange"
                @per-page-change="handlePerPageChange"
            />
        </div>
    </DashboardLayout>
</template>
