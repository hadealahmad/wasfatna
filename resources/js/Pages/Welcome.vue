<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { ArrowLeft, Dices, MapPin } from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import SeoHead from '@/components/SeoHead.vue';
import AddRecipeButton from '@/components/recipes/AddRecipeButton.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import SearchFilters from '@/components/recipes/SearchFilters.vue';
import { Button } from '@/components/ui';
import PaginationControls from '@/components/ui/PaginationControls.vue';
import { SITE_URL } from '@/lib/seo';

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
    per_page: number;
    total: number;
  };
  cities: City[];
  allCities: City[];
  allTags: Tag[];
  filters: any;
}>();

const sectionShortcuts = [
  { href: '/recipes', label: 'جميع الوصفات', description: 'تصفح كل الأطباق', icon: 'recipes' },
  { href: '/cities', label: 'المدن السورية', description: 'مطابخ المحافظات', icon: 'cities' },
  { href: '/lists', label: 'القوائم', description: 'مجموعات مختارة', icon: 'lists' },
  { href: '/meal-plans/browse', label: 'خطط الوجبات', description: 'جداول أسبوعية', icon: 'meal_plans' },
  { href: '/randomizer', label: 'شو نطبخ؟', description: 'صندوق الاختيار العشوائي', icon: 'randomizer' },
  { href: '/search', label: 'البحث المتقدم', description: 'تصفية دقيقة', icon: 'search' },
] as const;

const homeDescription =
  'اكتشف أشهى الوصفات السورية الأصيلة من مختلف المدن والمحافظات. تصفح المكونات وطرق التحضير خطوة بخطوة، وشارك وصفاتك مع مجتمع الطبخ السوري.';

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'وصفاتنا - مجتمع الطبخ السوري',
  alternateName: 'Wasfatna',
  url: SITE_URL,
  inLanguage: 'ar-SY',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'وصفاتنا',
  url: SITE_URL,
  logo: `${SITE_URL}/logo-light.svg`,
  description: 'مجتمع الطبخ السوري الأول لتوثيق ومشاركة أشهى الوصفات والأكلات التراثية من جميع المدن والمناطق السورية.',
};

const homeJsonLd = [
  { key: 'jsonld-website', data: websiteSchema },
  { key: 'jsonld-organization', data: organizationSchema },
];

function handlePageChange(page: number) {
  router.get('/', { ...props.filters, page }, { preserveState: true, preserveScroll: false });
}

function handlePerPageChange(perPage: number) {
  router.get('/', { ...props.filters, per_page: perPage, page: 1 }, { preserveState: true, preserveScroll: false });
}
</script>

<template>
  <PublicLayout>
    <SeoHead
      is-home
      title="وصفاتنا - مجتمع الطبخ السوري"
      :description="homeDescription"
      keywords="وصفات سورية, طبخ سوري, أكلات سورية, مطبخ سوري, طعام عربي, وصفات عربية, حلويات سورية, مقبلات سورية"
      canonical="/"
      :json-ld="homeJsonLd"
    />

    <!-- Hero Section -->
    <section class="relative overflow-hidden border-b border-border bg-background py-14 md:py-24">
      <div
        class="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[36rem] rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div class="container relative max-w-7xl mx-auto px-4 md:px-8">
        <div class="flex flex-col items-center text-center space-y-5 max-w-4xl mx-auto">
          <div class="relative h-10 w-32 md:h-12 md:w-40">
            <img src="/logo-light.svg" alt="وصفاتنا" width="160" height="48" decoding="async" class="logo-light w-full h-full object-contain" />
            <img src="/logo-dark.svg" alt="وصفاتنا" width="160" height="48" decoding="async" class="logo-dark w-full h-full object-contain" />
          </div>

          <h1 class="text-[clamp(1.875rem,1.25rem+2.8vw,3.5rem)] font-extrabold tracking-tight text-foreground">
            اكتشف أشهى الوصفات السورية
          </h1>

          <p class="mx-auto max-w-[60ch] text-muted-foreground text-base md:text-lg leading-relaxed">
            مجتمع من محبّي الطبخ يشاركون وصفاتهم الأصيلة والمجرّبة من مختلف المدن والمناطق السورية.
          </p>

          <div class="flex flex-wrap items-center justify-center gap-3 pt-1">
            <AddRecipeButton size="lg" class-name="h-11 px-6 text-base font-semibold shadow-sm">
              شارك وصفتك الآن
            </AddRecipeButton>
            <Button as-child variant="outline" size="lg" class="h-11 px-6 text-base font-semibold gap-2">
              <Link href="/randomizer" prefetch>
                <Dices class="h-4 w-4 text-primary" aria-hidden="true" />
                <span>شو نطبخ اليوم؟</span>
              </Link>
            </Button>
          </div>

          <div class="w-full max-w-5xl pt-4">
            <div class="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4 shadow-2xs">
              <SearchFilters
                :cities="allCities"
                :tags="allTags"
                :initial-filters="filters"
                :show-search-button="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Shortcuts (SyrianZone style) -->
    <section aria-label="أقسام وصفاتنا" class="border-b border-border/70 bg-muted/20 py-8">
      <div class="container max-w-7xl mx-auto px-4 md:px-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            v-for="shortcut in sectionShortcuts"
            :key="shortcut.href"
            :href="shortcut.href"
            prefetch
            class="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border/70 bg-card p-4 text-center transition-all hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ProjectIcon
              :name="shortcut.icon"
              class="h-9 w-9 motion-safe:transition-transform group-hover:scale-110"
            />
            <div class="space-y-0.5">
              <p class="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {{ shortcut.label }}
              </p>
              <p class="text-[11px] text-muted-foreground line-clamp-1">
                {{ shortcut.description }}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>

    <!-- Latest Recipes -->
    <section class="py-14 md:py-20 bg-background">
      <div class="container max-w-7xl mx-auto px-4 md:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div class="flex items-start gap-3">
            <ProjectIcon name="recipes" class="h-9 w-9 mt-0.5" />
            <div class="space-y-1">
              <h2 class="text-2xl font-bold tracking-tight md:text-3xl text-foreground">أحدث الوصفات</h2>
              <p class="text-sm sm:text-base text-muted-foreground max-w-[60ch]">
                وصفات أُضيفت حديثاً من قِبل مجتمعنا
              </p>
            </div>
          </div>

          <Button as-child variant="outline" size="sm" class="self-start sm:self-auto gap-1.5">
            <Link href="/recipes" prefetch>
              <span>تصفح كل الوصفات</span>
              <ArrowLeft class="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <RecipeGrid
          :recipes="recipes.data"
          :eager-first-row="false"
          empty-message="لم يتم إضافة وصفات بعد. كن أول من يضيف!"
        />

        <!-- Pagination -->
        <PaginationControls
          v-if="recipes.last_page > 1"
          :current-page="recipes.current_page"
          :total-pages="recipes.last_page"
          :per-page="recipes.per_page"
          :total-items="recipes.total"
          class-name="mt-10"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
        />
      </div>
    </section>

    <!-- Cities Grid -->
    <section v-if="cities.length > 0" class="cv-auto-section py-16 md:py-20 bg-muted/30 border-t border-border">
      <div class="container max-w-7xl mx-auto px-4 md:px-8">
        <div class="flex flex-col items-center text-center mb-10 space-y-2">
          <ProjectIcon name="cities" class="h-10 w-10 mb-1" />
          <h2 class="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
            اكتشف وصفات من مدينتك
          </h2>
          <p class="text-sm sm:text-base text-muted-foreground max-w-[60ch]">
            تصفح الوصفات حسب المدينة أو المنطقة واستكشف نكهات المطابخ المحلية
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link
            v-for="city in cities.slice(0, 8)"
            :key="city.id"
            :href="`/cities/${city.slug}`"
            prefetch
            class="group relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 hover:shadow-md transition-[box-shadow,border-color] hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div class="flex flex-col items-center justify-center text-center space-y-2">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <MapPin class="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 class="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {{ city.name }}
              </h3>
              <p class="text-xs sm:text-sm text-muted-foreground tabular-nums">
                {{ city.recipes_count }} وصفة
              </p>
            </div>
          </Link>
        </div>

        <div class="mt-10 text-center">
          <Button as-child variant="outline" class="rounded-full px-8 gap-2">
            <Link href="/cities" prefetch>
              <span>عرض كل المدن</span>
              <ArrowLeft class="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
