<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';

interface Props {
  dish_name: string;
  recipes: any[];
}

defineProps<Props>();
</script>

<template>
  <PublicLayout>
    <Head :title="`طرق تحضير ${dish_name}`" />

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
