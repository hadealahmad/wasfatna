<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref, watch, computed } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import SearchFilters from '@/components/recipes/SearchFilters.vue';
import { Skeleton } from '@/components/ui';

interface Recipe {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    city: string | null;
    city_slug: string | null;
    time_needed: any;
    difficulty: string;
    author_name: string;
    tags: Array<{ id: number; name: string; slug: string }>;
}

interface City {
    id: number;
    name: string;
    slug: string;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
}

const props = defineProps<{
    recipes: {
        data: Recipe[];
        total: number;
        current_page: number;
        last_page: number;
    };
    cities: City[];
    tags: Tag[];
    filters: {
        search?: string;
        city?: string;
        tag?: string;
        difficulty?: string;
    };
}>();

const isLoading = ref(false);

const totalResults = computed(() => props.recipes.total || props.recipes.data.length);

const hasActiveFilters = computed(() => {
    return props.filters.search || props.filters.city || props.filters.tag || props.filters.difficulty;
});

// Handle filter changes from SearchFilters component
const handleSearch = (params: { search: string; city: string; difficulty: string; tags: string[] }) => {
    isLoading.value = true;
    
    const query: Record<string, string> = {};
    if (params.search) query.search = params.search;
    if (params.city) query.city = params.city;
    if (params.difficulty) query.difficulty = params.difficulty;
    if (params.tags && params.tags.length > 0) query.tag = params.tags[0];
    
    router.get(route('search.index'), query, {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => {
            isLoading.value = false;
        }
    });
};
</script>

<template>
    <PublicLayout>
        <Head>
            <title>نتائج البحث - وصفاتنا</title>
            <meta name="description" content="ابحث في وصفاتنا عن وصفتك المفضلة" />
        </Head>

        <div class="container mx-auto py-8 px-4 md:px-6">
            <h1 class="text-3xl font-bold mb-8">نتائج البحث</h1>

            <!-- Search Filters -->
            <div class="mb-8 p-4 bg-muted/50 rounded-lg">
                <SearchFilters
                    :cities="cities"
                    :tags="tags"
                    :initial-filters="filters"
                    :show-search-button="true"
                    @search="handleSearch"
                />
            </div>

            <!-- Results Count -->
            <p v-if="!isLoading" class="text-muted-foreground mb-6">
                <template v-if="totalResults > 0">
                    عثرنا على {{ totalResults }} وصفة
                </template>
                <template v-else-if="hasActiveFilters">
                    لم نجد نتائج مطابقة
                </template>
                <template v-else>
                    ابدأ البحث للعثور على وصفات
                </template>
            </p>

            <!-- Loading State -->
            <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <Skeleton v-for="i in 8" :key="i" class="h-64 rounded-xl" />
            </div>

            <!-- Results -->
            <RecipeGrid
                v-else
                :recipes="recipes.data"
                empty-message="جرب البحث بكلمات مختلفة"
            />
        </div>
    </PublicLayout>
</template>
