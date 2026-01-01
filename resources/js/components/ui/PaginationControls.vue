<script setup lang="ts">
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
                variant="outline"
                size="icon"
                class="h-8 w-8"
                :disabled="currentPage <= 1"
                @click="emits('pageChange', 1)"
            >
                <ChevronsRight class="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                class="h-8 w-8"
                :disabled="currentPage <= 1"
                @click="emits('pageChange', currentPage - 1)"
            >
                <ChevronRight class="h-4 w-4" />
            </Button>

            <div class="flex items-center gap-1 mx-2 text-sm font-medium">
                <span>صفحة</span>
                <span class="px-2 py-1 rounded-md bg-muted">{{ currentPage }}</span>
                <span>من {{ totalPages }}</span>
            </div>

            <Button
                variant="outline"
                size="icon"
                class="h-8 w-8"
                :disabled="currentPage >= totalPages"
                @click="emits('pageChange', currentPage + 1)"
            >
                <ChevronLeft class="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                class="h-8 w-8"
                :disabled="currentPage >= totalPages"
                @click="emits('pageChange', totalPages)"
            >
                <ChevronsLeft class="h-4 w-4" />
            </Button>
        </div>
    </div>
</template>
