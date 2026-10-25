<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import { Badge } from '@/components/ui';
import { MapPin } from 'lucide-vue-next';

interface City {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

const props = defineProps<{
    city: City;
    recipes: {
        data: any[];
        links: any[];
        meta: any;
    };
}>();

const cityDescription = computed(() =>
    props.city.description || `اكتشف أشهر اكلات ووصفات ${props.city.name} الأصيلة من المطبخ السوري التراثي مع المكونات وطريقة التحضير بالتفصيل على منصة وصفاتنا.`
);

const collectionSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `وصفات وأكلات ${props.city.name} - المطبخ السوري`,
    'description': cityDescription.value,
    'url': `https://food.syrian.zone/cities/${props.city.slug}`,
    'inLanguage': 'ar-SY',
    'about': {
        '@type': 'Place',
        'name': props.city.name,
        'address': {
            '@type': 'PostalAddress',
            'addressCountry': 'SY'
        }
    }
}));

const breadcrumbSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
        {
            '@type': 'ListItem',
            'position': 1,
            'name': 'الرئيسية',
            'item': 'https://food.syrian.zone/'
        },
        {
            '@type': 'ListItem',
            'position': 2,
            'name': 'المدن والمناطق',
            'item': 'https://food.syrian.zone/cities'
        },
        {
            '@type': 'ListItem',
            'position': 3,
            'name': `وصفات ${props.city.name}`,
            'item': `https://food.syrian.zone/cities/${props.city.slug}`
        }
    ]
}));
</script>

<template>
  <PublicLayout>
    <Head>
      <title>وصفات {{ city.name }}</title>
      <meta head-key="description" name="description" :content="cityDescription" />
      <meta head-key="og:title" property="og:title" :content="`وصفات وأكلات ${city.name} | وصفاتنا`" />
      <meta head-key="og:description" property="og:description" :content="cityDescription" />
      <meta head-key="og:image" property="og:image" content="https://food.syrian.zone/og-image.webp" />
      <meta head-key="twitter:title" name="twitter:title" :content="`وصفات وأكلات ${city.name} | وصفاتنا`" />
      <meta head-key="twitter:description" name="twitter:description" :content="cityDescription" />
      <meta head-key="twitter:image" name="twitter:image" content="https://food.syrian.zone/og-image.webp" />
      <component :is="'script'" type="application/ld+json" head-key="jsonld-city-collection" v-html="JSON.stringify(collectionSchema)" />
      <component :is="'script'" type="application/ld+json" head-key="jsonld-city-breadcrumb" v-html="JSON.stringify(breadcrumbSchema)" />
    </Head>
    
    <!-- Hero Section -->
    <section class="border-b bg-background py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-6 text-center">
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 text-primary">
          <MapPin class="w-10 h-10" />
        </div>
        <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          وصفات {{ city.name }}
        </h1>
        <p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-4">
          {{ cityDescription }}
        </p>
        <Badge variant="outline" class="text-sm">
          {{ recipes.meta?.total || recipes.data.length }} وصفة
        </Badge>
      </div>
    </section>

    <!-- Recipes Grid -->
    <section class="container mx-auto py-12 px-4 md:px-6">
      <RecipeGrid 
        :recipes="recipes.data" 
        :empty-message="`لا توجد وصفات من ${city.name} بعد`"
      />

      <!-- Pagination -->
      <div v-if="recipes.meta?.last_page > 1" class="mt-12 flex justify-center gap-2">
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
            v-html="link.label" 
          />
        </template>
      </div>
    </section>
  </PublicLayout>
</template>
