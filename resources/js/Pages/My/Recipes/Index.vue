<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import Button from '@/components/ui/Button.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import { Plus } from 'lucide-vue-next';

defineProps<{
    recipes: {
        data: any[];
        links: any[];
        meta: any;
    };
    filters: any;
}>();
</script>

<template>
    <PublicLayout>
        <Head title="وصفاتي" />
        
        <div class="container mx-auto py-8 px-4 md:px-6">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold">وصفاتي</h1>
                <Link :href="route('recipes.create')">
                    <Button>
                        <Plus class="ml-2 h-4 w-4" />
                        إضافة وصفة
                    </Button>
                </Link>
            </div>

            <RecipeGrid 
                :recipes="recipes.data" 
                empty-message="لم تقم بإضافة أي وصفات بعد. ابدأ بإضافة وصفتك الأولى!"
            />
            
            <!-- Pagination -->
            <div v-if="recipes.meta?.last_page > 1" class="mt-8 flex justify-center gap-2">
                 <template v-for="(link, key) in recipes.meta.links" :key="key">
                    <component
                        :is="link.url ? 'Link' : 'span'"
                        :href="link.url"
                        v-if="link.url || link.label === '...'"
                        class="px-3 py-1 border rounded-md text-sm transition-colors"
                        :class="{ 
                            'bg-primary text-primary-foreground': link.active,
                            'bg-background hover:bg-muted': !link.active && link.url,
                            'opacity-50 cursor-default': !link.url 
                        }"
                        v-html="link.label" 
                    />
                </template>
            </div>
        </div>
    </PublicLayout>
</template>
