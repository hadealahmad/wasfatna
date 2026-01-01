<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import SearchFilters from '@/components/recipes/SearchFilters.vue';
import AddRecipeButton from '@/components/recipes/AddRecipeButton.vue';
import { Button } from '@/components/ui';
import { PlusCircle, ArrowRight, MapPin } from 'lucide-vue-next';

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
  recipes_count: number;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

const props = defineProps<{
  recipes: {
    data: Recipe[];
    links: any[];
    meta: any;
    current_page: number;
    last_page: number;
  };
  cities: City[];
  allCities: City[];
  allTags: Tag[];
  filters: any;
}>();
</script>

<template>
  <PublicLayout>
    <Head>
      <title>وصفاتنا - مجتمع الطبخ السوري</title>
      <meta name="description" content="اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق. شارك وصفاتك واستمتع بتجربة طهي فريدة مع مجتمعنا." />
      <meta name="keywords" content="وصفات سورية, طبخ سوري, أكلات سورية, مطبخ سوري, طعام عربي, وصفات عربية, حلويات سورية, مقبلات سورية" />
      <meta property="og:title" content="وصفاتنا - مجتمع الطبخ السوري" />
      <meta property="og:description" content="اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق. شارك وصفاتك واستمتع بتجربة طهي فريدة مع مجتمعنا." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>

    <!-- Hero Section -->
    <section class="border-b bg-background py-20 md:py-32">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <div class="relative mb-8 h-10 w-32 md:h-12 md:w-40">
            <img src="/logo-light.svg" alt="وصفاتنا" class="dark:hidden w-full h-full object-contain" />
            <img src="/logo-dark.svg" alt="وصفاتنا" class="hidden dark:block w-full h-full object-contain" />
          </div>
          <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
            اكتشف أشهى الوصفات السورية
          </h1>
          <p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            مجتمع من المحبين للطبخ يشاركون وصفاتهم المميزة من مختلف المدن والمناطق.
          </p>

          <div class="flex justify-center pt-4">
             <AddRecipeButton size="lg" class-name="px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              شارك وصفتك الآن
            </AddRecipeButton>
          </div>

          <div class="w-full max-w-5xl space-y-2 pt-4">
            <SearchFilters 
              :cities="allCities" 
              :tags="allTags" 
              :initial-filters="filters"
              :show-search-button="true"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Recipes -->
    <section class="py-24 bg-background">
      <div class="container mx-auto px-4">
          <div class="flex flex-col items-start gap-4 mb-10 md:flex-row md:justify-between md:items-center">
            <div class="space-y-1">
              <h2 class="text-2xl font-bold tracking-tight md:text-3xl">أحدث الوصفات</h2>
              <p class="text-muted-foreground">
                وصفات تم إضافتها حديثاً من قبل مجتمعنا
              </p>
            </div>
          </div>

        <RecipeGrid :recipes="recipes.data" empty-message="لم يتم إضافة وصفات بعد. كن أول من يضيف!" />

        <!-- Pagination (Simplified for now) -->
        <div v-if="recipes.last_page > 1" class="mt-16 flex justify-center gap-2">
           <!-- We can add PaginationControls here later -->
           <p class="text-muted-foreground">الصفحة {{ recipes.current_page }} من {{ recipes.last_page }}</p>
        </div>
      </div>
    </section>

    <!-- Cities Grid -->
    <section v-if="cities.length > 0" class="py-24 bg-muted/30 border-t">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center text-center mb-10 space-y-2">
          <h2 class="text-2xl font-bold tracking-tight md:text-3xl">
            اكتشف وصفات من مدينتك
          </h2>
          <p class="text-muted-foreground max-w-[600px]">
            تصفح الوصفات حسب المدينة أو المنطقة واستكشف نكهات جديدة
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <a
            v-for="city in cities.slice(0, 8)"
            :key="city.id"
            :href="`/cities/${city.slug}`"
            class="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-md transition-all hover:border-primary/50"
          >
            <div class="flex flex-col items-center justify-center space-y-2">
              <h3 class="text-lg font-bold group-hover:text-primary transition-colors">{{ city.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ city.recipes_count }} وصفة</p>
            </div>
          </a>
        </div>
        
        <div class="mt-12 text-center">
          <Link href="/cities">
            <Button variant="outline" class="rounded-full px-8">عرض كل المدن</Button>
          </Link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <!-- Disabled CTA Section to match Frontend -->
  </PublicLayout>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
