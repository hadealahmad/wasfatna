<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import { ChevronLeft } from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';

interface Props {
  dish_name: string;
  recipes: any[];
}

const props = defineProps<Props>();

const descriptionText = computed(
  () =>
    `اكتشف ${props.recipes.length} طريقة مختلفة لتحضير طبق ${props.dish_name} من مختلف المدن السورية على منصة وصفاتنا.`,
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
