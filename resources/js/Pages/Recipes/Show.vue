<script setup lang="ts">
import { computed, ref } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import {
  Check,
  ChefHat,
  ChevronLeft,
  Clock,
  Info,
  ListChecks,
  MapPin,
  RotateCcw,
  Tag as TagIcon,
  Utensils,
  UtensilsCrossed,
} from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import AddToFavoritesModal from '@/components/features/lists/AddToFavoritesModal.vue';
import AddRecipeButton from '@/components/recipes/AddRecipeButton.vue';
import RecipeControls from '@/components/recipes/RecipeControls.vue';
import RecipeRevisions from '@/components/recipes/RecipeRevisions.vue';
import ShareButtons from '@/components/recipes/ShareButtons.vue';
import ReportModal from '@/components/reports/ReportModal.vue';
import {
  Alert,
  AlertDescription,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { cn, safeJsonLd } from '@/lib/utils';

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
    avatar_url: string | null;
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

// Interactive cooking checklist state (client-side only)
const checkedIngredients = ref<Set<string>>(new Set());
const completedSteps = ref<Set<string>>(new Set());

function toggleIngredient(key: string): void {
  const next = new Set(checkedIngredients.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  checkedIngredients.value = next;
}

function resetIngredients(): void {
  checkedIngredients.value = new Set();
}

function toggleStep(key: string): void {
  const next = new Set(completedSteps.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  completedSteps.value = next;
}

const getDifficultyColor = (difficulty: string) => {
  const colors: Record<string, string> = {
    'سهلة جداً': 'bg-success/15 text-success border-success/30',
    'سهلة': 'bg-success/15 text-success border-success/30',
    'متوسطة': 'bg-warning/15 text-warning border-warning/30',
    'صعبة': 'bg-chart-6/15 text-chart-6 border-chart-6/30',
    'صعبة جداً': 'bg-destructive/15 text-destructive border-destructive/30',
  };
  return colors[difficulty] || 'bg-secondary text-secondary-foreground border-transparent';
};

const formatTimeNeeded = (time: any): string | string[] | null => {
  if (!time) return null;

  const translations: Record<string, string> = {
    prep: 'تحضير',
    cook: 'طبخ',
    ready: 'جاهز',
  };

  if (typeof time === 'string') {
    if (time.startsWith('{') || time.startsWith('[')) {
      try {
        const parsed = JSON.parse(time);
        return formatTimeNeeded(parsed);
      } catch {
        return time;
      }
    }
    return time;
  }

  if (Array.isArray(time)) return time;

  if (typeof time === 'object') {
    if (time.raw) return time.raw;

    const parts: string[] = [];

    if (time.prep || time.cook) {
      const prep = parseInt(time.prep) || 0;
      const cook = parseInt(time.cook) || 0;

      if (prep) parts.push(`تحضير: ${prep} دقيقة`);
      if (cook) parts.push(`طبخ: ${cook} دقيقة`);
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

    return parts.length > 0 ? parts : null;
  }

  return null;
};

const extractMinutes = (val: any): number => {
  if (typeof val === 'number') return val > 0 ? Math.round(val) : 0;
  if (typeof val !== 'string') return 0;
  const s = val.trim();
  let total = 0;
  const hourMatch = s.match(/(\d+)\s*(?:ساعة|ساعات|ساعه|h|hr|hour)/i);
  if (hourMatch) {
    total += parseInt(hourMatch[1], 10) * 60;
  } else if (/ساعة\s*ونصف/.test(s)) {
    total += 90;
  } else if (/نصف\s*ساعة/.test(s)) {
    total += 30;
  } else if (/ربع\s*ساعة/.test(s)) {
    total += 15;
  } else if (/ساعتين/.test(s)) {
    total += 120;
  }
  const minMatch = s.match(/(\d+)\s*(?:دقيقة|دقائق|دقيقه|د|m|min)/i);
  if (minMatch) {
    total += parseInt(minMatch[1], 10);
  }
  if (total === 0) {
    const plainNum = parseInt(s, 10);
    if (!isNaN(plainNum) && plainNum > 0) total = plainNum;
  }
  return total;
};

const parseIsoDurations = (rawTime: any): { prepTime?: string; cookTime?: string; totalTime?: string } => {
  if (!rawTime) return {};
  let time = rawTime;
  if (typeof time === 'string') {
    if (time.startsWith('{') || time.startsWith('[')) {
      try {
        time = JSON.parse(time);
      } catch {
        // fallback below
      }
    } else {
      const mins = extractMinutes(time);
      return mins > 0 ? { totalTime: `PT${mins}M` } : {};
    }
  }
  if (typeof time === 'object' && time !== null) {
    let prepMins = 0;
    let cookMins = 0;
    let otherMins = 0;
    Object.entries(time).forEach(([key, value]) => {
      const mins = extractMinutes(value);
      if (!mins) return;
      const k = key.toLowerCase();
      if (k === 'prep' || k.includes('تحضير') || k.includes('تجهيز')) {
        prepMins += mins;
      } else if (k === 'cook' || k.includes('طبخ') || k.includes('طهي') || k.includes('شوي') || k.includes('خبز')) {
        cookMins += mins;
      } else {
        otherMins += mins;
      }
    });
    const totalMins = prepMins + cookMins + otherMins;
    const result: { prepTime?: string; cookTime?: string; totalTime?: string } = {};
    if (prepMins > 0) result.prepTime = `PT${prepMins}M`;
    if (cookMins > 0) result.cookTime = `PT${cookMins}M`;
    if (totalMins > 0) result.totalTime = `PT${totalMins}M`;
    return result;
  }
  return {};
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

const groupedIngredientsList = computed(() => {
  const ing = props.recipe.ingredients;
  if (!ing) return [];

  if (Array.isArray(ing)) {
    if (ing.length === 0) return [];
    if (typeof ing[0] === 'object' && ing[0] !== null && 'name' in ing[0] && 'items' in ing[0]) {
      return ing;
    }
    const groups: Record<string, any[]> = {};
    ing.forEach((item) => {
      if (typeof item === 'string') {
        const groupName = 'المكونات';
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(item);
        return;
      }
      const groupName = item.pivot?.group || item.group || 'المكونات';
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push({
        name: item.name,
        amount: item.pivot?.amount ?? item.amount,
        unit: item.pivot?.unit ?? item.unit,
        descriptor: item.pivot?.ingredient_descriptor || item.pivot?.descriptor || item.descriptor,
      });
    });
    return Object.entries(groups).map(([name, items]) => ({ name, items }));
  }

  if (typeof ing === 'object') {
    return Object.entries(ing).map(([name, items]) => ({
      name: isNaN(Number(name)) ? name : 'المكونات',
      items: Array.isArray(items) ? items : [items],
    }));
  }

  return [];
});

const totalIngredientsCount = computed(() =>
  groupedIngredientsList.value.reduce((acc, g) => acc + (g.items?.length || 0), 0),
);

const groupedStepsList = computed(() => {
  let steps = props.recipe.steps;
  if (!steps) return [];

  if (typeof steps === 'string') {
    if (steps.startsWith('{') || steps.startsWith('[')) {
      try {
        steps = JSON.parse(steps);
      } catch {
        return [{ name: '', items: [steps] }];
      }
    } else {
      return [{ name: '', items: [steps] }];
    }
  }

  if (
    Array.isArray(steps) &&
    steps.length > 0 &&
    typeof steps[0] === 'object' &&
    steps[0] !== null &&
    ('items' in steps[0] || 'steps' in steps[0])
  ) {
    return steps.map((group: any) => ({
      name: group.name || '',
      items: Array.isArray(group.items) ? group.items : Array.isArray(group.steps) ? group.steps : [],
    }));
  }

  if (Array.isArray(steps)) {
    return [{ name: '', items: steps }];
  }

  if (typeof steps === 'object' && steps !== null) {
    return Object.entries(steps).map(([name, items]) => ({
      name: isNaN(Number(name)) ? name : '',
      items: Array.isArray(items) ? items : [items],
    }));
  }

  return [];
});

const formattedTime = computed(() => formatTimeNeeded(props.recipe.time_needed));

const metaDescription = computed(
  () =>
    props.recipe.description ||
    `تعلم طريقة عمل ${props.recipe.name} من مطبخ ${props.recipe.city?.name || 'منوع'}. اكتشف المكونات والخطوات بالتفصيل.`,
);

const ogImageUrl = computed(
  () => props.recipe.image_url || 'https://food.syrian.zone/og-image.webp',
);

const jsonLdSchema = computed(() => {
  const allIngredients = groupedIngredientsList.value.flatMap((group) =>
    (group.items || []).map((item: any) => formatIngredient(item)).filter(Boolean),
  );

  const allInstructions = groupedStepsList.value.flatMap((group) =>
    (group.items || [])
      .map((step: any, index: number) => ({
        '@type': 'HowToStep',
        name: group.name ? `${group.name} - الخطوة ${index + 1}` : `الخطوة ${index + 1}`,
        text: typeof step === 'string' ? step : step?.text || step?.content || step?.name || String(step || ''),
      }))
      .filter((s: any) => s.text),
  );

  const durations = parseIsoDurations(props.recipe.time_needed);

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: props.recipe.name,
    inLanguage: 'ar-SY',
    url: typeof window !== 'undefined' ? window.location.href : 'https://food.syrian.zone/recipes/' + props.recipe.slug,
    datePublished: props.recipe.created_at,
    image: props.recipe.image_url ? [props.recipe.image_url] : ['https://food.syrian.zone/og-image.webp'],
    description: props.recipe.description || `طريقة عمل ${props.recipe.name}`,
    keywords: props.recipe.tags?.map((t) => t.name).join(', ') || '',
    author: {
      '@type': 'Person',
      name: props.recipe.author_name || 'وصفاتنا',
    },
    recipeCuisine: props.recipe.city?.name ? `مطبخ ${props.recipe.city.name} - سوري` : 'سوري',
    recipeYield: props.recipe.servings ? `${props.recipe.servings} حصص` : undefined,
    ...durations,
    recipeIngredient: allIngredients,
    recipeInstructions: allInstructions,
  };
});

const breadcrumbSchema = computed(() => {
  const items: any[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'الرئيسية',
      item: 'https://food.syrian.zone/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'الوصفات',
      item: 'https://food.syrian.zone/recipes',
    },
  ];

  if (props.recipe.city) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: `وصفات ${props.recipe.city.name}`,
      item: `https://food.syrian.zone/cities/${props.recipe.city.slug || props.recipe.city_slug}`,
    });
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: props.recipe.name,
    item: `https://food.syrian.zone/recipes/${props.recipe.slug}`,
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
});
</script>

<template>
  <PublicLayout>
    <Head>
      <title>{{ recipe.name }} - طريقة التحضير والمكونات</title>
      <meta head-key="description" name="description" :content="metaDescription" />
      <meta head-key="og:title" property="og:title" :content="`طريقة عمل ${recipe.name} | وصفاتنا`" />
      <meta head-key="og:description" property="og:description" :content="metaDescription" />
      <meta head-key="og:image" property="og:image" :content="ogImageUrl" />
      <meta head-key="og:type" property="og:type" content="article" />
      <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta head-key="twitter:title" name="twitter:title" :content="`طريقة عمل ${recipe.name} | وصفاتنا`" />
      <meta head-key="twitter:description" name="twitter:description" :content="metaDescription" />
      <meta head-key="twitter:image" name="twitter:image" :content="ogImageUrl" />
      <link rel="alternate" type="text/markdown" :href="`/recipes/${recipe.slug}.md`" />
      <component :is="'script'" type="application/ld+json" head-key="jsonld-recipe">{{ safeJsonLd(jsonLdSchema) }}</component>
      <component :is="'script'" type="application/ld+json" head-key="jsonld-breadcrumb">{{ safeJsonLd(breadcrumbSchema) }}</component>
    </Head>

    <div class="container max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-8">
      <!-- Breadcrumb -->
      <nav aria-label="مسار التصفح" class="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-5">
        <Link href="/" class="hover:text-primary transition-colors">الرئيسية</Link>
        <ChevronLeft class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <Link href="/recipes" class="hover:text-primary transition-colors">الوصفات</Link>
        <template v-if="recipe.city">
          <ChevronLeft class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <Link :href="`/cities/${recipe.city.slug || recipe.city_slug}`" class="hover:text-primary transition-colors">
            {{ recipe.city.name }}
          </Link>
        </template>
        <ChevronLeft class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span class="text-foreground font-medium truncate max-w-[220px] sm:max-w-md">{{ recipe.name }}</span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Main Content -->
        <div class="flex-1 min-w-0 lg:w-[70%]">
          <div class="mb-8 space-y-5">
            <!-- Hero Recipe Image -->
            <div class="relative aspect-video rounded-2xl overflow-hidden border border-border/60 bg-muted shadow-2xs">
              <img
                v-if="recipe.image_url"
                :src="recipe.image_url"
                :alt="recipe.name"
                fetchpriority="high"
                width="1200"
                height="675"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-accent"
              >
                <UtensilsCrossed class="h-20 w-20 text-muted-foreground/30" aria-hidden="true" />
              </div>
            </div>

            <!-- Title & Actions -->
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {{ recipe.name }}
              </h1>
              <div class="flex items-center gap-2 shrink-0">
                <AddToFavoritesModal :recipe-id="recipe.id" />
                <ReportModal :reportable-id="recipe.id" reportable-type="recipe" />
              </div>
            </div>

            <!-- Variations Alert -->
            <Alert v-if="has_variations" variant="warning">
              <Info class="w-4 h-4" aria-hidden="true" />
              <AlertDescription class="tabular-nums">
                يوجد {{ variations_count }} طريقة أخرى لتحضير هذا الطبق!
                <Link :href="`/recipes/${recipe.slug}/variations`" class="font-semibold underline underline-offset-4 ms-1">
                  شاهد جميع الطرق
                </Link>
              </AlertDescription>
            </Alert>

            <!-- Meta Info Row -->
            <div class="rounded-xl border border-border/70 bg-card/60 p-4 space-y-3">
              <!-- Time, Servings & Difficulty -->
              <div class="flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
                <div
                  v-if="formattedTime"
                  class="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/60"
                >
                  <Clock class="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div class="flex gap-1.5 flex-wrap tabular-nums">
                    <template v-if="Array.isArray(formattedTime)">
                      <span
                        v-for="(time, idx) in formattedTime"
                        :key="idx"
                        class="bg-background px-2 py-0.5 rounded-md border border-border/60 text-xs font-medium text-foreground"
                      >
                        {{ time }}
                      </span>
                    </template>
                    <span v-else class="font-medium text-foreground">{{ formattedTime }}</span>
                  </div>
                </div>

                <div
                  v-if="recipe.servings"
                  class="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/60"
                >
                  <Utensils class="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <span class="font-medium text-foreground tabular-nums">
                    {{ recipe.servings }}{{ String(recipe.servings).includes('شخص') ? '' : ' أشخاص' }}
                  </span>
                </div>

                <Badge v-if="recipe.difficulty" :class="cn('ms-auto', getDifficultyColor(recipe.difficulty))">
                  {{ recipe.difficulty }}
                </Badge>
              </div>

              <!-- Location & Tags -->
              <div
                v-if="recipe.city || (recipe.tags && recipe.tags.length)"
                class="flex flex-wrap items-center gap-2 text-sm pt-1 border-t border-border/50"
              >
                <Link v-if="recipe.city" :href="`/cities/${recipe.city.slug || recipe.city_slug}`">
                  <Badge variant="secondary" class="cursor-pointer hover:bg-accent gap-1 px-3 py-1 transition-colors">
                    <MapPin class="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                    {{ recipe.city.name }}
                  </Badge>
                </Link>
                <Link v-for="tag in recipe.tags" :key="tag.id" :href="`/search?tags=${tag.slug}`">
                  <Badge variant="outline" class="cursor-pointer hover:bg-accent gap-1 px-3 py-1 transition-colors">
                    <TagIcon class="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                    {{ tag.name }}
                  </Badge>
                </Link>
              </div>
            </div>

            <!-- Description -->
            <p v-if="recipe.description" class="text-muted-foreground text-base leading-relaxed">
              {{ recipe.description }}
            </p>

            <!-- Recipe Controls & Revisions -->
            <div class="flex flex-wrap items-center gap-2">
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
            <Link v-if="recipe.user && !recipe.is_anonymous" :href="`/users/${recipe.user.id}`" class="block">
              <div class="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted/70 transition-colors">
                <Avatar class="h-10 w-10 border border-border/50">
                  <AvatarImage :src="recipe.user.avatar_url || undefined" :alt="recipe.user.name" width="40" height="40" />
                  <AvatarFallback>{{ recipe.user.name.charAt(0) }}</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <p class="font-semibold text-foreground truncate">{{ recipe.user.name }}</p>
                  <p class="text-xs sm:text-sm text-muted-foreground">نُشرت في {{ formatDate(recipe.created_at) }}</p>
                </div>
              </div>
            </Link>
            <div v-else-if="recipe.author_name" class="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-muted/40">
              <Avatar class="h-10 w-10 border border-border/50">
                <AvatarFallback>{{ recipe.author_name.charAt(0) }}</AvatarFallback>
              </Avatar>
              <div class="min-w-0">
                <p class="font-semibold text-foreground truncate">{{ recipe.author_name }}</p>
                <p class="text-xs sm:text-sm text-muted-foreground">نُشرت في {{ formatDate(recipe.created_at) }}</p>
              </div>
            </div>
          </div>

          <hr class="my-8 border-border" />

          <!-- Ingredients & Steps -->
          <div class="grid md:grid-cols-5 gap-6 md:gap-8">
            <!-- Ingredients Checklist -->
            <Card class="md:col-span-2 h-fit">
              <CardHeader class="pb-3">
                <div class="flex items-center justify-between gap-2">
                  <CardTitle class="flex items-center gap-2 text-xl">
                    <ListChecks class="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                    <span>المكونات</span>
                  </CardTitle>
                  <div v-if="totalIngredientsCount > 0" class="flex items-center gap-1.5">
                    <Badge variant="secondary" class="text-xs tabular-nums">
                      {{ checkedIngredients.size }} / {{ totalIngredientsCount }}
                    </Badge>
                    <Button
                      v-if="checkedIngredients.size > 0"
                      type="button"
                      variant="ghost"
                      size="icon"
                      class="h-7 w-7 text-muted-foreground hover:text-foreground"
                      aria-label="إعادة تعيين قائمة المكونات"
                      title="إعادة تعيين"
                      @click="resetIngredients"
                    >
                      <RotateCcw class="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="space-y-5">
                  <div v-for="(group, groupIdx) in groupedIngredientsList" :key="groupIdx">
                    <h3 v-if="group.name" class="font-semibold text-xs uppercase tracking-wide text-primary mb-2.5">
                      {{ group.name }}
                    </h3>
                    <ul class="space-y-1.5">
                      <li v-for="(ing, idx) in group.items" :key="idx">
                        <button
                          type="button"
                          role="checkbox"
                          :aria-checked="checkedIngredients.has(`${groupIdx}-${idx}`)"
                          class="group flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-start text-sm transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          @click="toggleIngredient(`${groupIdx}-${idx}`)"
                        >
                          <span
                            :class="
                              cn(
                                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                                checkedIngredients.has(`${groupIdx}-${idx}`)
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground/40 bg-background group-hover:border-primary',
                              )
                            "
                            aria-hidden="true"
                          >
                            <Check v-if="checkedIngredients.has(`${groupIdx}-${idx}`)" class="h-3 w-3" />
                          </span>
                          <span
                            :class="
                              cn(
                                'leading-relaxed transition-colors',
                                checkedIngredients.has(`${groupIdx}-${idx}`)
                                  ? 'line-through text-muted-foreground'
                                  : 'text-foreground',
                              )
                            "
                          >
                            {{ formatIngredient(ing) }}
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Steps -->
            <Card class="md:col-span-3 h-fit">
              <CardHeader class="pb-3">
                <CardTitle class="flex items-center gap-2 text-xl">
                  <ChefHat class="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                  <span>طريقة التحضير</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-7">
                  <div v-for="(group, groupIdx) in groupedStepsList" :key="groupIdx">
                    <h3 v-if="group.name" class="font-semibold text-base mb-4 text-primary">
                      {{ group.name }}
                    </h3>
                    <ol class="space-y-3">
                      <li v-for="(step, idx) in group.items" :key="idx">
                        <button
                          type="button"
                          :aria-pressed="completedSteps.has(`${groupIdx}-${idx}`)"
                          class="group flex w-full items-start gap-3.5 rounded-xl p-2.5 text-start transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          @click="toggleStep(`${groupIdx}-${idx}`)"
                        >
                          <span
                            :class="
                              cn(
                                'shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs tabular-nums transition-colors mt-0.5',
                                completedSteps.has(`${groupIdx}-${idx}`)
                                  ? 'bg-success text-success-foreground'
                                  : 'bg-primary text-primary-foreground',
                              )
                            "
                            aria-hidden="true"
                          >
                            <Check v-if="completedSteps.has(`${groupIdx}-${idx}`)" class="h-4 w-4" />
                            <template v-else>{{ idx + 1 }}</template>
                          </span>
                          <p
                            :class="
                              cn(
                                'flex-1 text-sm sm:text-base leading-relaxed transition-colors',
                                completedSteps.has(`${groupIdx}-${idx}`)
                                  ? 'line-through text-muted-foreground'
                                  : 'text-foreground',
                              )
                            "
                          >
                            {{ typeof step === 'string' ? step : step.text || step.name || step }}
                          </p>
                        </button>
                      </li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- CTA -->
          <div class="cv-auto-section mt-10 p-6 sm:p-8 rounded-2xl bg-muted/30 border border-border/70 text-center space-y-3">
            <h2 class="text-xl font-bold text-foreground">لديك وصفة مميزة؟</h2>
            <p class="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              شارك وصفاتك مع مجتمعنا وساعد الآخرين على اكتشاف نكهات جديدة من مطبخك.
            </p>
            <div class="pt-2">
              <AddRecipeButton size="lg">أضف وصفتك الخاصة</AddRecipeButton>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="lg:w-[30%] shrink-0">
          <div class="lg:sticky lg:top-24 space-y-6">
            <!-- Share Actions -->
            <Card>
              <CardHeader class="pb-3">
                <CardTitle class="text-lg">مشاركة الوصفة</CardTitle>
              </CardHeader>
              <CardContent>
                <ShareButtons />
              </CardContent>
            </Card>

            <!-- Similar Recipes -->
            <Card v-if="similar_recipes && similar_recipes.length > 0">
              <CardHeader class="pb-3">
                <CardTitle class="text-lg">وصفات مشابهة</CardTitle>
              </CardHeader>
              <CardContent class="space-y-2">
                <Link
                  v-for="similar in similar_recipes.slice(0, 4)"
                  :key="similar.id"
                  :href="`/recipes/${similar.slug}`"
                  prefetch
                  class="group flex items-center gap-3 p-2 rounded-xl hover:bg-accent/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div class="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/40">
                    <img
                      v-if="similar.image_url"
                      :src="similar.image_url"
                      :alt="similar.name"
                      loading="lazy"
                      decoding="async"
                      width="64"
                      height="64"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="flex w-full h-full items-center justify-center">
                      <UtensilsCrossed class="h-6 w-6 text-muted-foreground/35" aria-hidden="true" />
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="font-semibold line-clamp-2 text-sm text-foreground group-hover:text-primary transition-colors">
                      {{ similar.name }}
                    </h3>
                    <p class="text-xs text-muted-foreground mt-1 truncate">{{ similar.author_name }}</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  </PublicLayout>
</template>
