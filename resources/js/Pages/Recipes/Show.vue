<script setup lang="ts">
import { computed } from 'vue';
import { Link, Head, usePage } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { Badge, Card, CardContent, CardHeader, CardTitle, Button, Avatar, AvatarImage, AvatarFallback } from '@/components/ui';
import { MapPin, Clock, Utensils, Tag as TagIcon } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import AddRecipeButton from '@/components/recipes/AddRecipeButton.vue';
import AddToFavoritesModal from '@/components/features/lists/AddToFavoritesModal.vue';
import ReportModal from '@/components/reports/ReportModal.vue';
import RecipeControls from '@/components/recipes/RecipeControls.vue';
import RecipeRevisions from '@/components/recipes/RecipeRevisions.vue';
import ShareButtons from '@/components/recipes/ShareButtons.vue';

interface Recipe {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  city: { id: number; name: string; slug: string } | null;
  city_slug: string | null;
  time_needed: any;
  difficulty: string;
  servings: number | string | null;
  ingredients: any;
  steps: any;
  author_name: string;
  status?: string;
  is_anonymous?: boolean;
  user?: {
    id: number;
    name: string;
    avatar: string | null;
  };
  tags: Array<{ id: number; name: string; slug: string }>;
  created_at: string;
}

const props = defineProps<{
  recipe: Recipe;
  similar_recipes: Recipe[];
  has_variations?: boolean;
  variations_count?: number;
}>();

const page = usePage();
const user = computed(() => page.props.auth?.user);

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

  if (Array.isArray(time)) return time;

  if (typeof time === 'object') {
    if (time.raw) return time.raw;
    
    const parts: string[] = [];
    
    // Explicitly handle prep/cook if they exist
    if (time.prep || time.cook) {
      const prep = parseInt(time.prep) || 0;
      const cook = parseInt(time.cook) || 0;
      
      if (prep) parts.push(`تحضير: ${prep} دقيقة`);
      if (cook) parts.push(`طبخ: ${cook} دقيقة`);
    } else {
      // Handle other arbitrary stages
      Object.entries(time).forEach(([key, value]) => {
        if (!value) return;
        
        // If key is numeric or just an index, don't show label
        if (!isNaN(Number(key))) {
          parts.push(String(value));
        } else {
          const label = translations[key] || key;
          parts.push(`${label}: ${value}`);
        }
      });
    }
    
    return parts.length > 0 ? parts : null;
  }
  
  return null;
};

const formatIngredient = (item: string | any) => {
  if (typeof item === 'string') return item;
  const parts = [item.amount, item.unit, item.name, item.descriptor].filter(Boolean);
  return parts.join(' ');
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Check if ingredients are grouped and format them
const groupedIngredientsList = computed(() => {
  const ing = props.recipe.ingredients;
  if (!Array.isArray(ing) || ing.length === 0) return [];
  
  // If already in the new ordered group format: Array<{ name: string, items: any[] }>
  if (typeof ing[0] === 'object' && ing[0] !== null && 'name' in ing[0] && 'items' in ing[0]) {
    return ing;
  }
  
  // Group by pivot.group for Eloquent relations
  const groups: Record<string, any[]> = {};
  ing.forEach(item => {
    const groupName = item.pivot?.group || 'المكونات';
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push({
      name: item.name,
      amount: item.pivot?.amount,
      unit: item.pivot?.unit,
      descriptor: item.pivot?.ingredient_descriptor || item.pivot?.descriptor
    });
  });
  
  return Object.entries(groups).map(([name, items]) => ({ name, items }));
});

// Check if steps are grouped and format them
const groupedStepsList = computed(() => {
  const steps = props.recipe.steps;
  if (!steps) return [];
  
  // If array of objects (new format)
  if (Array.isArray(steps) && steps.length > 0 && typeof steps[0] === 'object' && 'name' in steps[0]) {
    return steps;
  }
  
  // If object where keys are group names (production format)
  if (typeof steps === 'object' && !Array.isArray(steps)) {
    return Object.entries(steps).map(([name, items]) => ({ 
      name, 
      items: Array.isArray(items) ? items : [items] 
    }));
  }
  
  // If simple array
  if (Array.isArray(steps)) {
    return [{ name: '', items: steps }];
  }
  
  return [];
});
</script>

<template>
  <PublicLayout>
    <Head>
      <title>{{ recipe.name }}</title>
      <meta name="description" content="تعلم طريقة عمل {{ recipe.name }} من مطبخ {{ recipe.city?.name || 'منوع' }}. اكتشف المكونات والخطوات بالتفصيل." />
      <meta property="og:title" content="طريقة عمل {{ recipe.name }} | وصفاتنا" />
      <meta property="og:description" content="تعلم طريقة عمل {{ recipe.name }} من مطبخ {{ recipe.city?.name || 'منوع' }}. اكتشف المكونات والخطوات بالتفصيل." />
      <meta property="og:image" :content="recipe.image_url || '/og-image.png'" />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>

    <div class="container mx-auto py-8 px-4 md:px-6">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Main Content -->
        <div class="flex-1 lg:w-[70%]">
          <div class="mb-8">
            <!-- Recipe Image -->
            <div class="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-muted">
              <img v-if="recipe.image_url" :src="recipe.image_url" :alt="recipe.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
                <span class="text-9xl">🍽️</span>
              </div>
            </div>

            <!-- Title & Actions -->
            <div class="flex items-center justify-between gap-4 mb-4">
              <h1 class="text-3xl md:text-4xl font-bold">{{ recipe.name }}</h1>
              <div class="flex items-center gap-2">
                <AddToFavoritesModal :recipe-id="recipe.id" />
                <ReportModal :reportable-id="recipe.id" reportable-type="recipe" />
              </div>
            </div>

            <!-- Variations Alert -->
            <div v-if="has_variations" class="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p class="text-amber-800 dark:text-amber-200">
                يوجد {{ variations_count }} طريقة أخرى لتحضير هذا الطبق!
                <Link :href="`/recipes/${recipe.slug}/variations`" class="font-semibold underline">
                  شاهد جميع الطرق
                </Link>
              </p>
            </div>

            <!-- Meta Info -->
            <div class="flex flex-col gap-4 mb-6">
              <!-- Location & Tags -->
              <div v-if="recipe.city || (recipe.tags && recipe.tags.length)" class="flex flex-wrap items-center gap-2 text-sm">
                <Link v-if="recipe.city" :href="`/cities/${recipe.city.slug || recipe.city_slug}`">
                  <Badge variant="secondary" class="cursor-pointer hover:bg-muted gap-1 px-3 py-1 bg-muted/50 border-muted-foreground/20">
                    <MapPin class="w-3.5 h-3.5" />
                    {{ recipe.city.name }}
                  </Badge>
                </Link>
                <Link v-for="tag in recipe.tags" :key="tag.id" :href="`/search?tags=${tag.slug}`">
                  <Badge variant="outline" class="cursor-pointer hover:bg-muted gap-1 px-3 py-1 border-muted-foreground/20">
                    <TagIcon class="w-3.5 h-3.5" />
                    {{ tag.name }}
                  </Badge>
                </Link>
              </div>

              <!-- Time & Servings -->
              <div v-if="recipe.time_needed || recipe.servings" class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div v-if="recipe.time_needed" class="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                  <Clock class="w-4 h-4 text-primary" />
                  <div class="flex gap-1.5 flex-wrap">
                    <template v-if="Array.isArray(formatTimeNeeded(recipe.time_needed))">
                      <span 
                        v-for="(time, idx) in formatTimeNeeded(recipe.time_needed)" 
                        :key="idx"
                        class="bg-background px-2 py-0.5 rounded-md border text-xs font-medium shadow-sm"
                      >
                        {{ time }}
                      </span>
                    </template>
                    <span v-else class="font-medium">{{ formatTimeNeeded(recipe.time_needed) }}</span>
                  </div>
                </div>
                <div v-if="recipe.servings" class="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                  <Utensils class="w-4 h-4 text-primary" />
                  <span class="font-medium">{{ recipe.servings }}{{ String(recipe.servings).includes('شخص') ? '' : ' أشخاص' }}</span>
                </div>
                <Badge :class="cn('mr-auto', getDifficultyColor(recipe.difficulty))">
                  {{ recipe.difficulty }}
                </Badge>
              </div>
            </div>

            <!-- Recipe Controls & Revisions -->
            <div class="flex items-center gap-2 mb-6">
              <RecipeControls
                :recipe-id="recipe.id"
                :recipe-slug="recipe.slug"
                :owner-id="recipe.user?.id"
                :status="recipe.status"
              />
              <RecipeRevisions
                :slug="recipe.slug"
                :recipe-id="recipe.id"
              />
            </div>

            <!-- Author -->
            <Link v-if="recipe.user && !recipe.is_anonymous" :href="`/users/${recipe.user.id}`">
              <div class="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Avatar>
                  <AvatarImage :src="recipe.user.avatar || undefined" />
                  <AvatarFallback>{{ recipe.user.name.charAt(0) }}</AvatarFallback>
                </Avatar>
                <div>
                  <p class="font-medium">{{ recipe.user.name }}</p>
                  <p class="text-sm text-muted-foreground">نُشرت في {{ formatDate(recipe.created_at) }}</p>
                </div>
              </div>
            </Link>
          </div>

          <hr class="my-8 border-border" />

          <!-- Ingredients & Steps -->
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Ingredients -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <span>🥗</span>
                  المكونات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-6">
                  <div v-for="(group, groupIdx) in groupedIngredientsList" :key="groupIdx">
                    <h4 v-if="group.name" class="font-semibold text-sm text-muted-foreground mb-2">{{ group.name }}</h4>
                    <ul class="space-y-2">
                      <li v-for="(ing, idx) in group.items" :key="idx" class="flex items-start gap-2">
                        <span class="text-primary mt-1">•</span>
                        <span>{{ formatIngredient(ing) }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Steps -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <span>📝</span>
                  طريقة التحضير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-8">
                  <div v-for="(group, groupIdx) in groupedStepsList" :key="groupIdx">
                    <h4 v-if="group.name" class="font-semibold text-lg mb-4 text-primary">{{ group.name }}</h4>
                    <ol class="space-y-4">
                      <li v-for="(step, idx) in group.items" :key="idx" class="flex gap-4">
                        <span class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                          {{ idx + 1 }}
                        </span>
                        <p class="pt-1">{{ step }}</p>
                      </li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- CTA -->
          <div class="mt-12 p-8 rounded-2xl bg-muted/30 border border-border/50 text-center space-y-4">
            <h3 class="text-xl font-bold">لديك وصفة مميزة؟</h3>
            <p class="text-muted-foreground max-w-lg mx-auto">
              شارك وصفاتك مع مجتمعنا وساعد الآخرين على اكتشاف نكهات جديدة من مطبخك.
            </p>
            <AddRecipeButton size="lg" class="mt-4">أضف وصفتك الخاصة</AddRecipeButton>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="lg:w-[30%]">
          <div class="sticky top-24 space-y-6">
            <!-- Similar Recipes -->
            <Card v-if="similar_recipes && similar_recipes.length > 0">
              <CardHeader>
                <CardTitle class="text-lg">وصفات مشابهة</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <Link 
                  v-for="similar in similar_recipes.slice(0, 3)" 
                  :key="similar.id" 
                  :href="`/recipes/${similar.slug}`" 
                  class="block"
                >
                  <div class="flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                    <div class="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <img v-if="similar.image_url" :src="similar.image_url" :alt="similar.name" class="w-full h-full object-cover" />
                      <div v-else class="flex w-full h-full items-center justify-center">🍽️</div>
                    </div>
                    <div>
                      <h4 class="font-medium line-clamp-2 text-sm">{{ similar.name }}</h4>
                      <p class="text-xs text-muted-foreground mt-1">{{ similar.author_name }}</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <!-- Share Actions -->
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">مشاركة الوصفة</CardTitle>
              </CardHeader>
              <CardContent>
                <ShareButtons />
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  </PublicLayout>
</template>

