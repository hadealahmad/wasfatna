<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
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
        
        <div class="container max-w-7xl mx-auto py-8 px-4 md:px-8">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div class="flex items-center gap-3">
                    <div class="inline-flex items-center justify-center rounded-xl border border-border/70 bg-card p-2 shadow-2xs shrink-0">
                        <ProjectIcon name="recipes" class="h-8 w-8" />
                    </div>
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">وصفاتي</h1>
                        <p class="text-sm text-muted-foreground mt-0.5">إدارة وتعديل الوصفات التي شاركتها مع المجتمع</p>
                    </div>
                </div>
                <Button as-child class="self-start sm:self-auto">
                    <Link :href="route('recipes.create')">
                        <Plus class="me-2 h-4 w-4" aria-hidden="true" />
                        إضافة وصفة
                    </Link>
                </Button>
            </div>

            <RecipeGrid 
                :recipes="recipes.data" 
                empty-message="لم تقم بإضافة أي وصفات بعد. ابدأ بإضافة وصفتك الأولى!"
            />
            
            <!-- Pagination -->
            <div v-if="recipes.meta?.last_page > 1" class="mt-8 flex flex-wrap justify-center gap-2">
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
