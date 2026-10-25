<script setup lang="ts">
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
</script>

<template>
    <div v-if="totalPages > 1 || totalItems > perPage" :class="['flex flex-col sm:flex-row items-center justify-between gap-4 py-4', className]">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <span>عرض</span>
            <Select
                :model-value="perPage.toString()"
                @update:model-value="(v) => emits('perPageChange', Number(v))"
            >
                <SelectTrigger class="h-8 w-[70px]">
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
            <Button
                as="a"
                variant="outline"
                size="icon"
                :class="['h-8 w-8', currentPage <= 1 ? 'pointer-events-none opacity-50' : '']"
                :href="currentPage <= 1 ? undefined : getPageHref(1)"
                :aria-disabled="currentPage <= 1 || undefined"
                aria-label="الصفحة الأولى"
                @click.prevent="onPageClick(1, currentPage <= 1)"
            >
                <ChevronsRight class="h-4 w-4" />
            </Button>
            <Button
                as="a"
                variant="outline"
                size="icon"
                :class="['h-8 w-8', currentPage <= 1 ? 'pointer-events-none opacity-50' : '']"
                :href="currentPage <= 1 ? undefined : getPageHref(currentPage - 1)"
                :aria-disabled="currentPage <= 1 || undefined"
                aria-label="الصفحة السابقة"
                @click.prevent="onPageClick(currentPage - 1, currentPage <= 1)"
            >
                <ChevronRight class="h-4 w-4" />
            </Button>

            <div class="flex items-center gap-1 mx-2 text-sm font-medium">
                <span>صفحة</span>
                <span class="px-2 py-1 rounded-md bg-muted">{{ currentPage }}</span>
                <span>من {{ totalPages }}</span>
            </div>

            <Button
                as="a"
                variant="outline"
                size="icon"
                :class="['h-8 w-8', currentPage >= totalPages ? 'pointer-events-none opacity-50' : '']"
                :href="currentPage >= totalPages ? undefined : getPageHref(currentPage + 1)"
                :aria-disabled="currentPage >= totalPages || undefined"
                aria-label="الصفحة التالية"
                @click.prevent="onPageClick(currentPage + 1, currentPage >= totalPages)"
            >
                <ChevronLeft class="h-4 w-4" />
            </Button>
            <Button
                as="a"
                variant="outline"
                size="icon"
                :class="['h-8 w-8', currentPage >= totalPages ? 'pointer-events-none opacity-50' : '']"
                :href="currentPage >= totalPages ? undefined : getPageHref(totalPages)"
                :aria-disabled="currentPage >= totalPages || undefined"
                aria-label="الصفحة الأخيرة"
                @click.prevent="onPageClick(totalPages, currentPage >= totalPages)"
            >
                <ChevronsLeft class="h-4 w-4" />
            </Button>
        </div>
    </div>
</template>
