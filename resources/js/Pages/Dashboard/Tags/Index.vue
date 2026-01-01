<script setup lang="ts">
import { ref, watch } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import UnifiedTagTable from '@/components/admin/UnifiedTagTable.vue';
import { Input } from '@/components/ui';
import { Search } from 'lucide-vue-next';
import type { Tag, Pagination } from '@/types';
import { useDebounceFn } from '@vueuse/core';

interface Props {
    tags: {
        data: Tag[];
        links: any[];
    } & Pagination;
    filters: {
        search?: string;
        sort_by?: string;
        sort_dir?: 'asc' | 'desc';
        per_page?: number;
    };
}

const props = defineProps<Props>();

const searchQuery = ref(props.filters.search || '');

const updateUrl = (updates: Record<string, any>) => {
    router.get(route('dashboard.tags'), {
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
    <Head title="إدارة الوسوم" />

    <DashboardLayout>
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 class="text-2xl font-bold tracking-tight">إدارة الوسوم</h2>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <div class="relative flex-1 sm:w-64">
                        <Search class="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="بحث عن وسم..."
                            class="pr-9"
                            v-model="searchQuery"
                        />
                    </div>
                </div>
            </div>

            <UnifiedTagTable
                :tags="tags.data"
                :pagination="tags"
                :sort-column="filters.sort_by || 'recipes_count'"
                :sort-direction="filters.sort_dir || 'desc'"
                @sort="handleSort"
                @page-change="handlePageChange"
                @per-page-change="handlePerPageChange"
            />
        </div>
    </DashboardLayout>
</template>
