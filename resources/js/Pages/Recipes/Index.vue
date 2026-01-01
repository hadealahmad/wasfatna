<script setup lang="ts">
import { ref, watch } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import SearchFilters from '@/components/recipes/SearchFilters.vue';

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

interface Props {
  recipes: {
    data: Recipe[];
    links: any[];
    meta: any;
    current_page: number;
    last_page: number;
  };
  cities: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
  filters: {
    search?: string;
    city?: string;
    tag?: string;
  };
}

const props = defineProps<Props>();

// Use a simplified version of SearchFilters logic directly or pass props
// Since SearchFilters component is reused, we can use it here.
// But we need to make sure SearchFilters component supports the "emit" way or "url" way.
// The Vue SearchFilters component likely needs to be checked.
</script>

<template>
  <PublicLayout>
    <Head>
      <title>تصفح جميع الوصفات</title>
      <meta name="description" content="تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية. ابحث عن وصفتك المفضلة وسجل إعجابك بها." />
      <meta property="og:title" content="تصفح جميع الوصفات | وصفاتنا" />
      <meta property="og:description" content="تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية." />
    </Head>
    
    <div class="container mx-auto py-12 px-4 md:px-6">
      <!-- Header -->
      <div class="flex flex-col items-center gap-4 text-center mb-10">
        <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          جميع الوصفات
        </h1>
        <p class="text-muted-foreground text-lg max-w-[800px]">
          تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية
        </p>
      </div>

      <!-- Filters -->
      <div class="mb-10 max-w-4xl mx-auto p-4 bg-muted/50 rounded-lg">
        <SearchFilters 
          :cities="cities" 
          :tags="tags" 
          :initial-filters="filters"
        />
      </div>

      <!-- Results -->
      <RecipeGrid 
        :recipes="recipes.data" 
        empty-message="لم يتم العثور على وصفات تطابق معايير البحث."
      />

      <!-- Pagination -->
      <div v-if="recipes.last_page > 1" class="mt-12 flex justify-center gap-2">
         <!-- Simple Pagination for now -->
         <div class="flex gap-2">
            <template v-for="(link, key) in recipes.links" :key="key">
                <component
                    :is="link.url ? 'Link' : 'span'"
                    :href="link.url"
                    v-if="link.url || link.label === '...'"
                    class="px-4 py-2 border rounded-md"
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
    </div>
  </PublicLayout>
</template>
