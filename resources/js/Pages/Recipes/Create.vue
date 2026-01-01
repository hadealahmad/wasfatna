<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import RecipeForm from '@/components/recipes/RecipeForm.vue';
import { ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
    cities: any[];
    tags?: any[];
    users?: any[];
}>();
</script>

<template>
    <PublicLayout>
        <Head title="إضافة وصفة جديدة" />
        
        <div class="container mx-auto py-8 max-w-4xl px-4 md:px-6">
            <div class="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                <Link :href="route('recipes.index')" class="hover:text-primary">الوصفات</Link>
                <ChevronRight class="w-4 h-4" />
                <span class="text-foreground font-medium">إضافة وصفة جديدة</span>
            </div>

            <h1 class="text-3xl font-bold mb-8">شارك وصفتك</h1>
            
            <RecipeForm 
                :cities="cities" 
                :tags="tags" 
                :users="users"
            />
        </div>
    </PublicLayout>
</template>
