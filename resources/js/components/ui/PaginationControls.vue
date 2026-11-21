<script setup lang="ts">
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-vue-next';

interface Props {
    currentPage: number;
    totalPages: number;
    perPage: number;
    totalItems: number;
    className?: string;
}

const props = defineProps<Props>();

const emits = defineEmits<{
    (e: 'pageChange', page: number): void;
    (e: 'perPageChange', perPage: number): void;
}>();

const page = usePage();

function getPageHref(targetPage: number): string {
    const clampedPage = Math.max(1, Math.min(props.totalPages || 1, targetPage));
    const searchStr = typeof window !== 'undefined'
        ? window.location.search
        : (page?.url?.includes('?') ? '?' + page.url.split('?')[1] : '');
    const params = new URLSearchParams(searchStr);
    params.set('page', String(clampedPage));
    return `?${params.toString()}`;
}

function onPageClick(targetPage: number, isDisabled: boolean) {
    if (!isDisabled) {
        emits('pageChange', targetPage);
    }
}

const startButtons = computed(() => [
    {
        key: 'first',
        label: 'الصفحة الأولى',
        targetPage: 1,
        disabled: props.currentPage <= 1,
        icon: ChevronsRight,
    },
    {
        key: 'prev',
        label: 'الصفحة السابقة',
        targetPage: props.currentPage - 1,
        disabled: props.currentPage <= 1,
        icon: ChevronRight,
    },
]);

const endButtons = computed(() => [
    {
        key: 'next',
        label: 'الصفحة التالية',
        targetPage: props.currentPage + 1,
        disabled: props.currentPage >= props.totalPages,
        icon: ChevronLeft,
    },
    {
        key: 'last',
        label: 'الصفحة الأخيرة',
        targetPage: props.totalPages,
        disabled: props.currentPage >= props.totalPages,
        icon: ChevronsLeft,
    },
]);
</script>

<template>
    <nav
        v-if="totalPages > 1 || totalItems > perPage"
        aria-label="ترقيم الصفحات"
        :class="['flex flex-col sm:flex-row items-center justify-between gap-4 py-4', className]"
    >
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <span>عرض</span>
            <Select
                :model-value="perPage.toString()"
                @update:model-value="(v) => emits('perPageChange', Number(v))"
            >
                <SelectTrigger class="min-h-8 w-[70px]" aria-label="عدد العناصر في الصفحة">
                    <SelectValue :placeholder="perPage.toString()" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                </SelectContent>
            </Select>
            <span>من أصل {{ totalItems }}</span>
        </div>

        <div class="flex items-center gap-2">
            <template v-for="btn in startButtons" :key="btn.key">
                <Button
                    v-if="btn.disabled"
                    type="button"
                    variant="outline"
                    size="icon"
                    class="size-8"
                    disabled
                    :aria-label="btn.label"
                >
                    <component :is="btn.icon" class="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                    v-else
                    as="a"
                    variant="outline"
                    size="icon"
                    class="size-8"
                    :href="getPageHref(btn.targetPage)"
                    :aria-label="btn.label"
                    @click.prevent="onPageClick(btn.targetPage, false)"
                >
                    <component :is="btn.icon" class="h-4 w-4" aria-hidden="true" />
                </Button>
            </template>

            <div class="flex items-center gap-1 mx-2 text-sm font-medium">
                <span>صفحة</span>
                <span class="px-2 py-1 rounded-md bg-muted" aria-current="page">{{ currentPage }}</span>
                <span>من {{ totalPages }}</span>
            </div>

            <template v-for="btn in endButtons" :key="btn.key">
                <Button
                    v-if="btn.disabled"
                    type="button"
                    variant="outline"
                    size="icon"
                    class="size-8"
                    disabled
                    :aria-label="btn.label"
                >
                    <component :is="btn.icon" class="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                    v-else
                    as="a"
                    variant="outline"
                    size="icon"
                    class="size-8"
                    :href="getPageHref(btn.targetPage)"
                    :aria-label="btn.label"
                    @click.prevent="onPageClick(btn.targetPage, false)"
                >
                    <component :is="btn.icon" class="h-4 w-4" aria-hidden="true" />
                </Button>
            </template>
        </div>
    </nav>
</template>
