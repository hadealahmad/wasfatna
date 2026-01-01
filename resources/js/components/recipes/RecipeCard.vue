<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import { MapPin, Clock, User, Utensils, Heart } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import AddToFavoritesModal from '@/components/features/lists/AddToFavoritesModal.vue';

interface Recipe {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  city: { id: number; name: string; slug: string } | null;
  city_slug: string | null;
  time_needed: any;
  difficulty: string;
  author_name: string;
  tags: Array<{ id: number; name: string; slug: string }>;
}

const props = defineProps<{
  recipe: Recipe;
}>();

const getDifficultyColor = (difficulty: string) => {
  const colors: Record<string, string> = {
    'سهلة جداً': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'سهلة': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'متوسطة': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'صعبة': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'صعبة جداً': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
};

const formatTimeNeeded = (time: any) => {
  if (!time) return null;
  
  const translations: Record<string, string> = {
    prep: 'تحضير',
    cook: 'طبخ',
    ready: 'جاهز'
  };

  if (typeof time === 'string') {
    if (time.startsWith('{') || time.startsWith('[')) {
      try {
        const parsed = JSON.parse(time);
        return formatTimeNeeded(parsed);
      } catch (e) {}
    }
    return time;
  }

  if (Array.isArray(time)) return time.join(' - ');

  if (typeof time === 'object') {
    if (time.raw) return time.raw;
    
    const parts: string[] = [];
    
    if (time.prep || time.cook) {
      const prep = parseInt(time.prep) || 0;
      const cook = parseInt(time.cook) || 0;
      if (prep) parts.push(`تحضير: ${prep}د`);
      if (cook) parts.push(`طبخ: ${cook}د`);
    } else {
      Object.entries(time).forEach(([key, value]) => {
        if (!value) return;
        if (!isNaN(Number(key))) {
          parts.push(String(value));
        } else {
          const label = translations[key] || key;
          parts.push(`${label}: ${value}`);
        }
      });
    }
    
    return parts.length > 0 ? parts.join(' - ') : null;
  }
  
  return null;
};
</script>

<template>
  <div class="relative group h-full">
    <Link :href="`/recipes/${recipe.slug}`" class="block h-full">
      <Card class="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer py-0 gap-0 border-border/50 bg-card">
        <!-- Image Container -->
        <div class="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            v-if="recipe.image_url"
            :src="recipe.image_url"
            :alt="recipe.name"
            class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground">
            <Utensils class="w-12 h-12 opacity-20" />
          </div>

          <!-- Difficulty Badge -->
          <Badge
            :class="cn('absolute top-3 left-3 shadow-sm border-none', getDifficultyColor(recipe.difficulty))"
          >
            {{ recipe.difficulty }}
          </Badge>
        </div>

        <!-- Content -->
        <CardContent class="p-4">
          <!-- Recipe Name -->
          <h3 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {{ recipe.name }}
          </h3>

          <!-- Meta Info -->
          <div class="flex flex-col gap-2 text-sm text-muted-foreground">
            <!-- City -->
            <div v-if="recipe.city" class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{{ recipe.city.name || recipe.city }}</span>
            </div>

            <!-- Time -->
            <div v-if="formatTimeNeeded(recipe.time_needed)" class="flex items-start gap-2">
              <Clock class="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{{ formatTimeNeeded(recipe.time_needed) }}</span>
            </div>

            <!-- Author -->
            <div class="flex items-center gap-2">
              <User class="w-4 h-4 text-primary shrink-0" />
              <span>{{ recipe.author_name }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>

    <!-- Favorite Button with Modal -->
    <div class="absolute top-2 right-2 z-10">
      <AddToFavoritesModal :recipe-id="recipe.id">
        <Button
          variant="secondary"
          size="icon"
          class="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-muted-foreground hover:text-red-500 shadow-sm backdrop-blur-sm transition-colors"
        >
          <Heart class="w-4 h-4" />
        </Button>
      </AddToFavoritesModal>
    </div>
  </div>
</template>

