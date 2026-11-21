<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import ListCard from '@/components/features/lists/ListCard.vue';
import CreateListDialog from '@/components/features/lists/CreateListDialog.vue';
import { computed } from 'vue';

const props = defineProps<{
    lists: any[];
}>();

// Separate default list from custom lists
const defaultList = computed(() => props.lists.find(l => l.is_default));
const customLists = computed(() => props.lists.filter(l => !l.is_default));
</script>

<template>
    <PublicLayout>
        <Head title="قوائمي" />
        
        <div class="container max-w-7xl mx-auto py-8 px-4 md:px-8">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div class="flex items-center gap-3">
                    <div class="inline-flex items-center justify-center rounded-xl border border-border/70 bg-card p-2 shadow-2xs shrink-0">
                        <ProjectIcon name="lists" class="h-8 w-8" />
                    </div>
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">قوائمي</h1>
                        <p class="text-sm text-muted-foreground mt-0.5">احفظ وصفاتك المفضلة ونظّمها في قوائم خاصة أو عامة</p>
                    </div>
                </div>
                <CreateListDialog />
            </div>

            <!-- Default Favorites List -->
            <div v-if="defaultList" class="mb-8">
                <h2 class="text-xl font-semibold mb-4 text-muted-foreground">المفضلة</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ListCard :list="defaultList" :href="route('lists.show', defaultList.id)" />
                </div>
            </div>

            <!-- Custom Lists -->
            <div v-if="customLists.length > 0">
                <h2 class="text-xl font-semibold mb-4 text-muted-foreground">قوائم مخصصة</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ListCard 
                        v-for="list in customLists" 
                        :key="list.id" 
                        :list="list" 
                        :href="route('lists.show', list.id)" 
                    />
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="lists.length === 0 && !defaultList" class="flex flex-col items-center justify-center gap-3 text-center py-16 px-4 border-2 border-dashed rounded-2xl bg-muted/20">
                <ProjectIcon name="lists" class="h-14 w-14 opacity-85" />
                <p class="text-lg font-semibold text-foreground">لم تقم بإنشاء أي قوائم بعد</p>
                <p class="text-sm text-muted-foreground max-w-md">أنشئ قائمة جديدة لحفظ وصفاتك المفضلة والرجوع إليها بسهولة.</p>
                <div class="pt-2">
                    <CreateListDialog />
                </div>
            </div>
        </div>
    </PublicLayout>
</template>

