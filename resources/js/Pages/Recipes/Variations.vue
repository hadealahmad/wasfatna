<script setup lang="ts">
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { ChevronLeft } from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import SeoHead from '@/components/SeoHead.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import { buildBreadcrumbSchema, buildRecipeItemList, resolveCanonicalUrl } from '@/lib/seo';

interface Props {
  dish_name: string;
  slug?: string;
  recipes: any[];
}

const props = defineProps<Props>();
const page = usePage();

const descriptionText = computed(
  () =>
    `اكتشف ${props.recipes.length} طريقة مختلفة لتحضير طبق ${props.dish_name} من مختلف المدن والمناطق السورية، وقارن المكونات وخطوات التحضير على منصة وصفاتنا.`,
);

const canonicalUrl = computed(() =>
  resolveCanonicalUrl(
    props.slug ? `/recipes/${props.slug}/variations` : undefined,
    (page.props.ziggy as { location?: string } | undefined)?.location,
  ),
);

const firstImage = computed(() => props.recipes.find((r) => r?.image_url)?.image_url || null);

const variationsJsonLd = computed(() => [
  {
    key: 'jsonld-variations-collection',
    data: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `طرق تحضير ${props.dish_name}`,
      description: descriptionText.value,
      url: canonicalUrl.value,
      inLanguage: 'ar-SY',
      mainEntity: buildRecipeItemList(props.recipes || []),
    },
  },
  {
    key: 'jsonld-variations-breadcrumb',
    data: buildBreadcrumbSchema([
      { name: 'الرئيسية', path: '/' },
      { name: 'الوصفات', path: '/recipes' },
      { name: `طرق تحضير ${props.dish_name}`, path: canonicalUrl.value },
    ]),
  },
]);
</script>

<template>
  <PublicLayout>
    <SeoHead
      :title="`طرق تحضير ${dish_name}`"
      :description="descriptionText"
      :image="firstImage"
      :canonical="canonicalUrl"
      :json-ld="variationsJsonLd"
    />

    <div class="container max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-8">
      <nav aria-label="مسار التصفح" class="flex items-center gap-1.5 mb-6 text-sm text-muted-foreground">
        <Link href="/recipes" class="hover:text-primary transition-colors">الوصفات</Link>
        <ChevronLeft class="h-4 w-4 shrink-0" aria-hidden="true" />
        <span class="text-foreground font-medium truncate">طرق تحضير {{ dish_name }}</span>
      </nav>

      <div class="flex items-start gap-3 mb-8">
        <div class="inline-flex items-center justify-center rounded-xl border border-border/70 bg-card p-2.5 shadow-2xs shrink-0">
          <ProjectIcon name="recipes" class="h-8 w-8" />
        </div>
        <div class="space-y-1">
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            طرق تحضير: {{ dish_name }}
          </h1>
          <p class="text-sm sm:text-base text-muted-foreground tabular-nums">
            عثرنا على {{ recipes.length }} طريقة مختلفة لتحضير هذا الطبق
          </p>
        </div>
      </div>

      <RecipeGrid :recipes="recipes" />
    </div>
  </PublicLayout>
</template>
