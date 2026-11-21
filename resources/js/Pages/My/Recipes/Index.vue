<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import Button from '@/components/ui/Button.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import { formatPaginationLabel } from '@/lib/utils';
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
                <Button as-child>
                    <Link :href="route('recipes.create')">
                        <Plus class="ms-2 h-4 w-4" aria-hidden="true" />
                        إضافة وصفة
                    </Link>
                </Button>
            </div>

            <RecipeGrid 
                :recipes="recipes.data" 
                empty-message="لم تقم بإضافة أي وصفات بعد. ابدأ بإضافة وصفتك الأولى!"
            />
            
            <!-- Pagination -->
            <div v-if="recipes.meta?.last_page > 1" class="mt-8 flex justify-center gap-2">
                 <template v-for="(link, key) in recipes.meta.links" :key="key">
                    <component
                        :is="link.url ? Link : 'span'"
                        :href="link.url"
                        v-if="link.url || link.label === '...'"
                        class="px-3 py-1 border rounded-md text-sm transition-colors"
                        :class="{ 
                            'bg-primary text-primary-foreground': link.active,
                            'bg-background hover:bg-muted': !link.active && link.url,
                            'opacity-50 cursor-default': !link.url 
                        }"
                    >
                        {{ formatPaginationLabel(link.label) }}
                    </component>
                </template>
            </div>
        </div>
    </PublicLayout>
</template>
