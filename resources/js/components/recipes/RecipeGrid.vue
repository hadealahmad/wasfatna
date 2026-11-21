<script setup lang="ts">
import RecipeCard from './RecipeCard.vue';
import { Utensils } from 'lucide-vue-next';

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
  recipes: Recipe[];
  emptyMessage?: string;
  eagerFirstRow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  emptyMessage: 'لا توجد وصفات',
  eagerFirstRow: true,
});
</script>

<template>
  <div>
    <div v-if="recipes.length === 0" class="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
      <Utensils class="w-16 h-16 mb-4 text-muted-foreground/20" aria-hidden="true" />
      <p class="text-xl text-muted-foreground font-medium">{{ emptyMessage }}</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <RecipeCard
        v-for="(recipe, index) in recipes"
        :key="recipe.id"
        :recipe="recipe"
        :priority="eagerFirstRow ? (index === 0 ? 'lcp' : index < 4 ? 'eager' : 'lazy') : (index < 2 ? 'eager' : 'lazy')"
        :class="index >= 8 ? 'cv-auto-card' : undefined"
      />
    </div>
  </div>
</template>
