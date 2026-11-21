<script setup lang="ts">
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import SeoHead from '@/components/SeoHead.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import { Badge } from '@/components/ui';
import { buildBreadcrumbSchema, buildRecipeItemList, resolveCanonicalUrl } from '@/lib/seo';
import { formatPaginationLabel } from '@/lib/utils';
import { ChevronLeft } from 'lucide-vue-next';

interface City {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url?: string | null;
}

const props = defineProps<{
    city: City;
    recipes: {
        data: any[];
        links: any[];
        meta: any;
    };
}>();

const recipesCount = computed(() => props.recipes.meta?.total ?? props.recipes.data.length);

const cityDescription = computed(() => {
    const custom = props.city.description?.trim();
    if (custom && custom.length >= 100) {
        return custom;
    }

    const prefix = custom ? `${custom} — ` : '';
    return `${prefix}اكتشف ${recipesCount.value} وصفة وأكلة شعبية وتراثية من مطبخ ${props.city.name} الأصيل في سوريا، مع المكونات الدقيقة وخطوات التحضير على منصة وصفاتنا.`;
});

const cityCanonicalPath = computed(() => `/cities/${props.city.slug}`);

const collectionSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `وصفات وأكلات ${props.city.name} - المطبخ السوري`,
    'description': cityDescription.value,
    'url': resolveCanonicalUrl(cityCanonicalPath.value),
    'inLanguage': 'ar-SY',
    'about': {
        '@type': 'Place',
        'name': props.city.name,
        'address': {
            '@type': 'PostalAddress',
            'addressCountry': 'SY'
        }
    },
    'mainEntity': buildRecipeItemList(props.recipes.data || []),
}));

const breadcrumbSchema = computed(() =>
    buildBreadcrumbSchema([
        { name: 'الرئيسية', path: '/' },
        { name: 'المدن والمناطق', path: '/cities' },
        { name: `وصفات ${props.city.name}`, path: cityCanonicalPath.value },
    ]),
);

const cityJsonLd = computed(() => [
    { key: 'jsonld-city-collection', data: collectionSchema.value },
    { key: 'jsonld-city-breadcrumb', data: breadcrumbSchema.value },
]);
</script>

<template>
  <PublicLayout>
    <SeoHead
      :title="`وصفات ${city.name}`"
      :description="cityDescription"
      :image="city.image_url"
      :canonical="cityCanonicalPath"
      :json-ld="cityJsonLd"
    />
    
    <!-- Hero Section -->
    <section class="border-b border-border bg-background py-10 md:py-16">
      <div class="container max-w-7xl mx-auto px-4 md:px-8">
        <nav aria-label="مسار التصفح" class="flex items-center justify-center gap-1.5 mb-6 text-sm text-muted-foreground">
          <Link href="/cities" class="hover:text-primary transition-colors">المدن والمناطق</Link>
          <ChevronLeft class="h-4 w-4 shrink-0" aria-hidden="true" />
          <span class="text-foreground font-medium">{{ city.name }}</span>
        </nav>

        <div class="text-center">
          <div class="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-border/70 bg-card mb-5 shadow-2xs">
            <ProjectIcon name="cities" class="w-10 h-10" />
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-3 text-foreground">
            وصفات {{ city.name }}
          </h1>
          <p class="mx-auto max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
            {{ cityDescription }}
          </p>
          <Badge variant="outline" class="text-sm tabular-nums">
            {{ recipes.meta?.total || recipes.data.length }} وصفة
          </Badge>
        </div>
      </div>
    </section>

    <!-- Recipes Grid -->
    <section class="container max-w-7xl mx-auto py-10 md:py-12 px-4 md:px-8">
      <RecipeGrid
        :recipes="recipes.data"
        :empty-message="`لا توجد وصفات من ${city.name} بعد`"
      />

      <!-- Pagination -->
      <div v-if="recipes.meta?.last_page > 1" class="mt-10 flex flex-wrap justify-center gap-2">
        <template v-for="(link, key) in recipes.meta.links" :key="key">
          <component
            :is="link.url ? Link : 'span'"
            :href="link.url"
            v-if="link.url || link.label === '...'"
            class="px-3 py-1 border rounded-md text-sm"
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
    </section>
  </PublicLayout>
</template>
