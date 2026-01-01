<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import Button from '@/components/ui/Button.vue';
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
        
        <div class="container mx-auto py-8 px-4 md:px-6">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold">قوائمي</h1>
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
            <div v-if="lists.length === 0 && !defaultList" class="text-center py-12 border rounded-xl bg-muted/20">
                <p class="text-muted-foreground">لم تقم بإنشاء أي قوائم بعد.</p>
            </div>
        </div>
    </PublicLayout>
</template>

