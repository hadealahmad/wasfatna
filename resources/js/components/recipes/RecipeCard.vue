<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Card, CardContent, CardHeader, Badge } from '@/components/ui';
import { Clock, MapPin, UtensilsCrossed } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import AddToFavoritesModal from '@/components/features/lists/AddToFavoritesModal.vue';
import type { Recipe } from '@/types';

const props = withDefaults(defineProps<{
  recipe: Recipe;
  priority?: 'lcp' | 'eager' | 'lazy';
}>(), {
  priority: 'lazy',
});

const difficultyColors: Record<string, string> = {
  'سهلة جداً': 'bg-success text-success-foreground border-transparent',
  'سهلة': 'bg-success text-success-foreground border-transparent',
  'متوسطة': 'bg-warning text-warning-foreground border-transparent',
  'صعبة': 'bg-chart-6 text-primary-foreground border-transparent',
  'صعبة جداً': 'bg-destructive text-destructive-foreground border-transparent',
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
  <Card class="relative h-full overflow-hidden motion-safe:transition-[transform,box-shadow,border-color] duration-300 hover:shadow-lg hover:border-primary/40 motion-safe:hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-ring group cursor-pointer flex flex-col">
    <!-- Image -->
    <div class="relative aspect-video bg-muted overflow-hidden shrink-0">
      <img
        v-if="recipe.image_url"
        :src="recipe.image_url"
        :alt="recipe.name"
        :loading="priority === 'lazy' ? 'lazy' : undefined"
        :decoding="priority === 'lcp' ? undefined : 'async'"
        :fetchpriority="priority === 'lcp' ? 'high' : undefined"
        width="640"
        height="360"
        class="object-cover w-full h-full motion-safe:group-hover:scale-105 motion-safe:transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-accent">
        <UtensilsCrossed class="h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
      </div>

      <!-- Difficulty Badge -->
      <Badge
        :class="cn(
          'absolute top-3 end-3',
          difficultyColors[recipe.difficulty] || difficultyColors['متوسطة']
        )"
      >
        {{ recipe.difficulty }}
      </Badge>
    </div>

    <!-- Favorite Action -->
    <div class="absolute top-3 start-3 z-10">
      <div class="relative z-10">
        <AddToFavoritesModal :recipe-id="recipe.id" variant="icon" />
      </div>
    </div>

    <CardHeader class="pb-2">
      <h3 class="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
        <Link :href="`/recipes/${recipe.slug}`" prefetch class="after:absolute after:inset-0">
          {{ recipe.name }}
        </Link>
      </h3>
    </CardHeader>

    <CardContent class="space-y-3 flex-1 flex flex-col justify-between">
      <div class="space-y-2">
        <!-- Meta Info -->
        <div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span v-if="recipe.city" class="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-md">
            <MapPin class="w-3 h-3 text-primary" aria-hidden="true" />
            {{ recipe.city }}
          </span>
          <span v-if="recipe.time_needed" class="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-md">
            <Clock class="w-3 h-3 text-primary" aria-hidden="true" />
            <span class="truncate max-w-[120px]">{{ formatTimeNeeded(recipe.time_needed) }}</span>
          </span>
        </div>

        <!-- Tags -->
        <div v-if="recipe.tags && recipe.tags.length > 0" class="flex flex-wrap gap-1">
          <Badge 
            v-for="tag in recipe.tags.slice(0, 3)" 
            :key="tag.id" 
            variant="secondary" 
            class="text-xs px-1.5 py-0 min-h-5 font-normal bg-secondary/50"
          >
            {{ tag.name }}
          </Badge>
          <span v-if="recipe.tags.length > 3" class="text-xs text-muted-foreground self-center">
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
</template>
