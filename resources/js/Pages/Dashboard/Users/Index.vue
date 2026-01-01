<script setup lang="ts">
import { ref, watch } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import UnifiedUserTable from '@/components/admin/UnifiedUserTable.vue';
import { Input, Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui';
import { Search, Filter } from 'lucide-vue-next';
import type { AdminUser, Pagination } from '@/types';
import { useDebounceFn } from '@vueuse/core';

interface Props {
    users: {
        data: AdminUser[];
        links: any[];
    } & Pagination;
    filters: {
        role?: string;
        search?: string;
        sort_by?: string;
        sort_dir?: 'asc' | 'desc';
        per_page?: number;
    };
}

const props = defineProps<Props>();

const searchQuery = ref(props.filters.search || '');
const roleFilter = ref(props.filters.role || '');

const updateUrl = (updates: Record<string, any>) => {
    router.get(route('dashboard.users'), {
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

const handleRoleChange = (role: string, checked: boolean) => {
    const newRole = checked ? role : '';
    roleFilter.value = newRole;
    updateUrl({ role: newRole || null, page: 1 });
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
    <Head title="إدارة المستخدمين" />

    <DashboardLayout>
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 class="text-2xl font-bold tracking-tight">إدارة المستخدمين</h2>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <div class="relative flex-1 sm:w-64">
                        <Search class="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="بحث عن مستخدم..."
                            class="pr-9"
                            v-model="searchQuery"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" :class="roleFilter ? 'border-primary text-primary' : ''">
                                <Filter class="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56">
                            <DropdownMenuLabel>تصفية حسب الدور</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                :checked="roleFilter === 'admin'"
                                @update:checked="(checked) => handleRoleChange('admin', checked)"
                            >
                                Admin
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                :checked="roleFilter === 'moderator'"
                                @update:checked="(checked) => handleRoleChange('moderator', checked)"
                            >
                                Moderator
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                :checked="roleFilter === 'user'"
                                @update:checked="(checked) => handleRoleChange('user', checked)"
                            >
                                User
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <UnifiedUserTable
                :users="users.data"
                :pagination="users"
                :sort-column="filters.sort_by || 'created_at'"
                :sort-direction="filters.sort_dir || 'desc'"
                @sort="handleSort"
                @page-change="handlePageChange"
                @per-page-change="handlePerPageChange"
            />
        </div>
    </DashboardLayout>
</template>
