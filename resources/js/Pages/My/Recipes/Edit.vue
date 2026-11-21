<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import RecipeForm from '@/components/recipes/RecipeForm.vue';
import { ChevronLeft } from 'lucide-vue-next';

const props = defineProps<{
    recipe: any;
    cities: any[];
    tags?: any[];
    users?: any[];
}>();
</script>

<template>
    <PublicLayout>
        <Head :title="`تعديل: ${recipe.name}`" />
        
        <div class="container mx-auto py-8 max-w-4xl px-4 md:px-6">
            <nav aria-label="مسار التصفح" class="flex items-center gap-1.5 mb-6 text-sm text-muted-foreground">
                <Link :href="route('my.recipes.index')" class="hover:text-primary transition-colors">وصفاتي</Link>
                <ChevronLeft class="w-4 h-4 shrink-0" aria-hidden="true" />
                <span class="text-foreground font-medium truncate">تعديل: {{ recipe.name }}</span>
            </nav>

            <h1 class="text-2xl sm:text-3xl font-bold mb-8">تعديل الوصفة: {{ recipe.name }}</h1>
            
            <RecipeForm 
                :cities="cities" 
                :tags="tags" 
                :users="users"
                :initial-data="recipe" 
            />
        </div>
    </PublicLayout>
</template>
