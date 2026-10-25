<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Card, CardContent, CardHeader, Badge } from '@/components/ui';
import { Clock, MapPin, Tag as TagIcon } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import AddToFavoritesModal from '@/components/features/lists/AddToFavoritesModal.vue';
import type { Recipe } from '@/types';

const props = defineProps<{
  recipe: Recipe;
}>();

const difficultyColors: Record<string, string> = {
  'سهلة جداً': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'سهلة': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'متوسطة': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'صعبة': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'صعبة جداً': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const formatTimeNeeded = (time: any): string => {
  if (!time) return 'غير محدد';
  if (typeof time === 'string') return time;
  if (typeof time === 'number') return `${time} دقيقة`;
  if (Array.isArray(time)) return time.join('، ');
  if (typeof time === 'object') {
    if (time.raw) return time.raw;
    const prep = parseInt(time.prep) || 0;
    const cook = parseInt(time.cook) || 0;
    const total = prep + cook;
    if (total > 0) return `${total} دقيقة`;
    
    // Fallback for arbitrary stages (like { "مرحلة 1": "15 د" })
    const values = Object.values(time).filter(Boolean);
    if (values.length > 0) return values.join(' + ');
  }
  return 'غير محدد';
};
</script>

<template>
  <Link :href="`/recipes/${recipe.slug}`" class="block h-full">
    <Card class="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer flex flex-col">
      <!-- Image -->
      <div class="relative aspect-video bg-muted overflow-hidden shrink-0">
        <img
          v-if="recipe.image_url"
          :src="recipe.image_url"
          :alt="recipe.name"
          loading="lazy"
          decoding="async"
          width="640"
          height="360"
          class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950 dark:to-red-950">
          <span class="text-5xl">🍽️</span>
        </div>

        <!-- Difficulty Badge -->
        <Badge
          :class="cn(
            'absolute top-3 left-3',
            difficultyColors[recipe.difficulty] || difficultyColors['متوسطة']
          )"
        >
          {{ recipe.difficulty }}
        </Badge>

        <!-- Favorite Action -->
        <div class="absolute top-3 right-3 z-10" @click.prevent.stop>
            <AddToFavoritesModal :recipe-id="recipe.id" variant="icon" />
        </div>
      </div>

      <CardHeader class="pb-2">
        <h3 class="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
          {{ recipe.name }}
        </h3>
      </CardHeader>

      <CardContent class="space-y-3 flex-1 flex flex-col justify-between">
        <div class="space-y-2">
          <!-- Meta Info -->
          <div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span v-if="recipe.city" class="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-md">
              <MapPin class="w-3 h-3 text-primary" />
              {{ recipe.city }}
            </span>
            <span v-if="recipe.time_needed" class="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-md">
              <Clock class="w-3 h-3 text-primary" />
              <span class="truncate max-w-[120px]">{{ formatTimeNeeded(recipe.time_needed) }}</span>
            </span>
          </div>

          <!-- Tags -->
          <div v-if="recipe.tags && recipe.tags.length > 0" class="flex flex-wrap gap-1">
            <Badge 
              v-for="tag in recipe.tags.slice(0, 3)" 
              :key="tag.id" 
              variant="secondary" 
              class="text-[10px] px-1.5 py-0 h-5 font-normal bg-secondary/50"
            >
              {{ tag.name }}
            </Badge>
            <span v-if="recipe.tags.length > 3" class="text-[10px] text-muted-foreground self-center">
              +{{ recipe.tags.length - 3 }}
            </span>
          </div>
        </div>

        <!-- Author -->
        <p class="text-xs text-muted-foreground pt-2 border-t border-border/50">
          بواسطة <span class="text-foreground font-medium">{{ recipe.author_name }}</span>
        </p>
      </CardContent>
    </Card>
  </Link>
</template>
