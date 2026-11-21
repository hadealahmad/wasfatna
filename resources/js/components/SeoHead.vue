<script setup lang="ts">
import { computed } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import { safeJsonLd } from '@/lib/utils';
import {
  formatSeoDescription,
  formatSeoTitle,
  resolveCanonicalUrl,
  resolveOgImageUrl,
} from '@/lib/seo';

export interface JsonLdItem {
  key: string;
  data: Record<string, unknown>;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    isHome?: boolean;
    description?: string | null;
    fallbackDescription?: string;
    keywords?: string;
    image?: string | null;
    type?: 'website' | 'article' | 'profile';
    canonical?: string | null;
    noindex?: boolean;
    jsonLd?: JsonLdItem[];
  }>(),
  {
    isHome: false,
    type: 'website',
    noindex: false,
    jsonLd: () => [],
  },
);

const page = usePage();

const fullTitle = computed(() => formatSeoTitle(props.title, props.isHome));

const resolvedDescription = computed(() =>
  formatSeoDescription(props.description, props.fallbackDescription),
);

const resolvedCanonical = computed(() =>
  resolveCanonicalUrl(props.canonical, (page.props.ziggy as { location?: string } | undefined)?.location),
);

const resolvedImage = computed(() => resolveOgImageUrl(props.image));

const robotsContent = computed(() => (props.noindex ? 'noindex, follow' : 'index, follow'));

const normalizedJsonLd = computed(() =>
  props.jsonLd.filter((item) => item && item.key && item.data),
);
</script>

<template>
  <Head>
    <title>{{ fullTitle }}</title>
    <meta head-key="description" name="description" :content="resolvedDescription" />
    <meta v-if="keywords" head-key="keywords" name="keywords" :content="keywords" />
    <meta head-key="robots" name="robots" :content="robotsContent" />
    <link head-key="canonical" rel="canonical" :href="resolvedCanonical" />
    <meta head-key="og:type" property="og:type" :content="type" />
    <meta head-key="og:url" property="og:url" :content="resolvedCanonical" />
    <meta head-key="og:title" property="og:title" :content="fullTitle" />
    <meta head-key="og:description" property="og:description" :content="resolvedDescription" />
    <meta head-key="og:image" property="og:image" :content="resolvedImage" />
    <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
    <meta head-key="twitter:title" name="twitter:title" :content="fullTitle" />
    <meta head-key="twitter:description" name="twitter:description" :content="resolvedDescription" />
    <meta head-key="twitter:image" name="twitter:image" :content="resolvedImage" />
    <component
      :is="'script'"
      v-for="item in normalizedJsonLd"
      :key="item.key"
      type="application/ld+json"
      :head-key="item.key"
    >{{ safeJsonLd(item.data) }}</component>
    <slot />
  </Head>
</template>
