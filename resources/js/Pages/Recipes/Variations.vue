<script setup lang="ts">
import { computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';

interface Props {
  dish_name: string;
  recipes: any[];
}

const props = defineProps<Props>();

const descriptionText = computed(() =>
  `اكتشف ${props.recipes.length} طريقة مختلفة لتحضير طبق ${props.dish_name} من مختلف المدن السورية على منصة وصفاتنا.`
);
</script>

<template>
  <PublicLayout>
    <Head>
      <title>طرق تحضير {{ dish_name }}</title>
      <meta head-key="description" name="description" :content="descriptionText" />
      <meta head-key="og:title" property="og:title" :content="`طرق تحضير ${dish_name} | وصفاتنا`" />
      <meta head-key="og:description" property="og:description" :content="descriptionText" />
      <meta head-key="og:image" property="og:image" content="https://food.syrian.zone/og-image.webp" />
      <meta head-key="twitter:title" name="twitter:title" :content="`طرق تحضير ${dish_name} | وصفاتنا`" />
      <meta head-key="twitter:description" name="twitter:description" :content="descriptionText" />
      <meta head-key="twitter:image" name="twitter:image" content="https://food.syrian.zone/og-image.webp" />
    </Head>

    <div class="container mx-auto py-8 px-4 md:px-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">
          طرق تحضير: {{ dish_name }}
        </h1>
        <p class="text-muted-foreground">
          عثرنا على {{ recipes.length }} طريقة مختلفة لتحضير هذا الطبق
        </p>
      </div>

      <RecipeGrid :recipes="recipes" />
    </div>
  </PublicLayout>
</template>
