<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import {
  ArrowLeft,
  Clock,
  Dices,
  Filter,
  History,
  Loader2,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Utensils,
  UtensilsCrossed,
  Volume2,
  VolumeX,
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import IngredientSelector, {
  type IngredientOption,
} from '@/components/randomizer/IngredientSelector.vue';
import RecipeSpinner from '@/components/randomizer/RecipeSpinner.vue';
import {
  RARITY_TIERS,
  formatRandomizerTime,
  getRecipeRarity,
  type RandomizerRecipe,
} from '@/components/randomizer/rarity';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FilterChip,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { cn } from '@/lib/utils';

interface CityOption {
  id: number;
  name: string;
  slug: string;
  recipes_count?: number;
}

interface TagOption {
  id: number;
  name: string;
  slug: string;
}

const props = withDefaults(
  defineProps<{
    cities?: CityOption[];
    tags?: TagOption[];
    popularIngredients?: IngredientOption[];
    totalRecipes?: number;
  }>(),
  {
    cities: () => [],
    tags: () => [],
    popularIngredients: () => [],
    totalRecipes: 0,
  },
);

const DIFFICULTIES = [
  { value: 'all', label: 'كل المستويات' },
  { value: 'سهلة جداً', label: 'سهلة جداً' },
  { value: 'سهلة', label: 'سهلة' },
  { value: 'متوسطة', label: 'متوسطة' },
  { value: 'صعبة', label: 'صعبة' },
  { value: 'صعبة جداً', label: 'صعبة جداً' },
] as const;

type Phase = 'idle' | 'loading' | 'spinning' | 'revealed' | 'empty';

const phase = ref<Phase>('idle');
const recipes = ref<RandomizerRecipe[]>([]);
const winner = ref<RandomizerRecipe | null>(null);
const totalMatching = ref<number | null>(null);
const dropHistory = ref<RandomizerRecipe[]>([]);
const soundEnabled = ref(false);
const liveAnnouncement = ref('');

// Filter state
const selectedIngredients = ref<IngredientOption[]>([]);
const selectedCity = ref<string>('all');
const selectedDifficulty = ref<string>('all');

const filtersSectionRef = ref<HTMLElement | null>(null);
const stageSectionRef = ref<HTMLElement | null>(null);
const revealHeadingRef = ref<HTMLElement | null>(null);

const activeFilterCount = computed(() => {
  let count = selectedIngredients.value.length;
  if (selectedCity.value !== 'all') count += 1;
  if (selectedDifficulty.value !== 'all') count += 1;
  return count;
});

const currentStep = computed<1 | 2 | 3>(() => {
  if (phase.value === 'revealed') return 3;
  if (phase.value === 'loading' || phase.value === 'spinning') return 2;
  return 1;
});

const winnerRarity = computed(() => (winner.value ? getRecipeRarity(winner.value.difficulty) : null));
const winnerTime = computed(() => (winner.value ? formatRandomizerTime(winner.value.time_needed) : null));

const confettiPieces = [
  { color: 'bg-primary', angle: '-65deg', dist: '90px', delay: '0ms' },
  { color: 'bg-warning', angle: '-38deg', dist: '115px', delay: '40ms' },
  { color: 'bg-success', angle: '-15deg', dist: '100px', delay: '20ms' },
  { color: 'bg-chart-3', angle: '12deg', dist: '118px', delay: '60ms' },
  { color: 'bg-chart-4', angle: '38deg', dist: '105px', delay: '30ms' },
  { color: 'bg-info', angle: '64deg', dist: '92px', delay: '80ms' },
  { color: 'bg-chart-6', angle: '-52deg', dist: '78px', delay: '90ms' },
  { color: 'bg-warning', angle: '50deg', dist: '82px', delay: '50ms' },
];

function handleIngredientSelect(ingredient: IngredientOption): void {
  if (!selectedIngredients.value.some((i) => i.id === ingredient.id)) {
    selectedIngredients.value = [...selectedIngredients.value, ingredient];
  }
}

function handleIngredientRemove(id: number): void {
  selectedIngredients.value = selectedIngredients.value.filter((i) => i.id !== id);
}

function clearIngredients(): void {
  selectedIngredients.value = [];
}

function resetAllFilters(): void {
  selectedIngredients.value = [];
  selectedCity.value = 'all';
  selectedDifficulty.value = 'all';
  if (phase.value === 'empty') {
    phase.value = 'idle';
  }
}

function scrollToFilters(): void {
  filtersSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function openCrate(): Promise<void> {
  if (phase.value === 'loading' || phase.value === 'spinning') return;

  phase.value = 'loading';
  winner.value = null;
  recipes.value = [];
  liveAnnouncement.value = 'جاري تجهيز صندوق الوصفات...';

  await nextTick();
  stageSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  try {
    const queryParams = new URLSearchParams();
    queryParams.set('count', '30');
    if (selectedIngredients.value.length > 0) {
      queryParams.set('exclude', selectedIngredients.value.map((i) => i.id).join(','));
    }
    if (selectedCity.value !== 'all') {
      queryParams.set('city', selectedCity.value);
    }
    if (selectedDifficulty.value !== 'all') {
      queryParams.set('difficulty', selectedDifficulty.value);
    }

    const response = await fetch(`/api/recipes/randomizer?${queryParams.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('Request failed');

    const data = await response.json();
    const fetched: RandomizerRecipe[] = Array.isArray(data.recipes) ? data.recipes : [];
    totalMatching.value = typeof data.total_matching === 'number' ? data.total_matching : fetched.length;

    if (fetched.length === 0) {
      phase.value = 'empty';
      liveAnnouncement.value = 'لم يتم العثور على وصفات تطابق الفلاتر الحالية.';
      return;
    }

    recipes.value = fetched;
    liveAnnouncement.value = 'جاري فتح الصندوق واختيار وصفة عشوائية...';

    // Let Vue mount the reel track before starting the spin
    await nextTick();
    setTimeout(() => {
      phase.value = 'spinning';
    }, 60);
  } catch {
    phase.value = 'idle';
    liveAnnouncement.value = 'حدث خطأ أثناء تحميل الوصفات.';
    toast.error('تعذّر تحميل الوصفات، يرجى المحاولة مرة أخرى.');
  }
}

function onSpinComplete(wonRecipe: RandomizerRecipe): void {
  winner.value = wonRecipe;
  phase.value = 'revealed';

  const rarity = getRecipeRarity(wonRecipe.difficulty);
  liveAnnouncement.value = `تم اختيار الوصفة: ${wonRecipe.name}، من ${wonRecipe.city?.name || 'المطبخ السوري'}، تصنيف ${rarity.label}.`;

  // Push to drop history (deduplicated, keep latest 6)
  dropHistory.value = [
    wonRecipe,
    ...dropHistory.value.filter((item) => item.id !== wonRecipe.id),
  ].slice(0, 6);

  nextTick(() => {
    revealHeadingRef.value?.focus({ preventScroll: true });
  });
}

const rarityLegend = Object.values(RARITY_TIERS);
</script>

<template>
  <PublicLayout>
    <Head>
      <title>شو نطبخ اليوم؟</title>
      <meta name="robots" content="noindex, follow" head-key="robots" />
      <meta
        head-key="description"
        name="description"
        content="محتار شو تطبخ اليوم؟ خصّص صندوق الوصفات واستبعد المكونات التي لا تفضلها، ثم افتح الصندوق لتكتشف وصفتك السورية القادمة!"
      />
      <meta head-key="og:title" property="og:title" content="شو نطبخ اليوم؟ | وصفاتنا" />
      <meta
        head-key="og:description"
        property="og:description"
        content="محتار شو تطبخ اليوم؟ افتح صندوق وصفاتنا العشوائي واكتشف طبقك القادم."
      />
      <meta head-key="og:image" property="og:image" content="https://food.syrian.zone/og-image.webp" />
      <meta head-key="twitter:title" name="twitter:title" content="شو نطبخ اليوم؟ | وصفاتنا" />
      <meta
        head-key="twitter:description"
        name="twitter:description"
        content="محتار شو تطبخ اليوم؟ افتح صندوق وصفاتنا العشوائي واكتشف طبقك القادم."
      />
      <meta head-key="twitter:image" name="twitter:image" content="https://food.syrian.zone/og-image.webp" />
    </Head>

    <div class="container max-w-5xl mx-auto py-8 md:py-12 px-4 md:px-6 space-y-8" dir="rtl">
      <!-- Screen-reader live region -->
      <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
        {{ liveAnnouncement }}
      </div>

      <!-- Page Header -->
      <div class="flex flex-col items-center text-center space-y-3">
        <div class="inline-flex items-center justify-center rounded-2xl border border-border/70 bg-card p-3 shadow-2xs">
          <ProjectIcon name="randomizer" class="h-11 w-11" />
        </div>
        <div class="space-y-2 max-w-2xl">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            شو نطبخ اليوم؟
          </h1>
          <p class="text-sm sm:text-base md:text-lg text-muted-foreground">
            خصّص صندوق الوصفات حسب رغبتك، ثم افتحه لتكتشف طبقاً سورياً شهياً بشكل عشوائي
          </p>
        </div>

        <!-- Stepper + Sound Toggle -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
          <ol class="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-medium" aria-label="خطوات الاختيار">
            <li
              :class="
                cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors',
                  currentStep === 1
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground',
                )
              "
            >
              <span class="font-bold tabular-nums">1</span>
              <span>خصّص الصندوق</span>
            </li>
            <li
              :class="
                cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors',
                  currentStep === 2
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground',
                )
              "
            >
              <span class="font-bold tabular-nums">2</span>
              <span>افتح الصندوق</span>
            </li>
            <li
              :class="
                cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors',
                  currentStep === 3
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground',
                )
              "
            >
              <span class="font-bold tabular-nums">3</span>
              <span>اكتشف وصفتك</span>
            </li>
          </ol>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            :aria-pressed="soundEnabled"
            :aria-label="soundEnabled ? 'كتم مؤثرات الصوت' : 'تفعيل مؤثرات الصوت'"
            class="h-8 gap-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground"
            @click="soundEnabled = !soundEnabled"
          >
            <Volume2 v-if="soundEnabled" class="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <VolumeX v-else class="h-3.5 w-3.5" aria-hidden="true" />
            <span>{{ soundEnabled ? 'الصوت مفعّل' : 'الصوت صامت' }}</span>
          </Button>
        </div>
      </div>

      <!-- STEP 2 & 3: Loot-Crate Stage -->
      <section ref="stageSectionRef" aria-label="صندوق الوصفات العشوائي">
        <!-- IDLE / LOADING: Interactive Mystery Crate -->
        <Card
          v-if="phase === 'idle' || phase === 'loading'"
          class="relative overflow-hidden border-2 border-border/80 bg-card shadow-sm"
        >
          <!-- Subtle Ambient Glow -->
          <div
            class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-96 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          <CardContent class="relative flex flex-col items-center text-center py-10 md:py-14 px-4 sm:px-8 space-y-6">
            <!-- Interactive Loot Crate Graphic -->
            <button
              type="button"
              :disabled="phase === 'loading'"
              aria-label="افتح صندوق الوصفات العشوائي"
              class="group relative flex flex-col items-center justify-center rounded-3xl p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70"
              @click="openCrate"
            >
              <div
                :class="
                  cn(
                    'relative flex h-36 w-44 sm:h-40 sm:w-52 items-center justify-center rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-accent/80 to-card shadow-lg transition-all duration-300',
                    phase === 'loading'
                      ? 'crate-shake border-primary shadow-[0_0_36px_-8px_hsl(var(--primary)/0.55)]'
                      : 'motion-safe:group-hover:-translate-y-1.5 group-hover:border-primary group-hover:shadow-[0_0_36px_-8px_hsl(var(--primary)/0.45)]',
                  )
                "
              >
                <!-- Crate Lid -->
                <div
                  class="absolute -top-3 inset-x-3 h-7 rounded-t-xl border-2 border-primary/50 bg-gradient-to-b from-primary/25 to-primary/10 transition-transform duration-300 motion-safe:group-hover:-translate-y-1"
                  aria-hidden="true"
                />
                <!-- Vertical Ribbon / Straps -->
                <div
                  class="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-5 bg-primary/15 border-x border-primary/25"
                  aria-hidden="true"
                />
                <!-- Corner Rivets -->
                <span class="absolute top-3 start-3 h-2 w-2 rounded-full bg-primary/40" aria-hidden="true" />
                <span class="absolute top-3 end-3 h-2 w-2 rounded-full bg-primary/40" aria-hidden="true" />
                <span class="absolute bottom-3 start-3 h-2 w-2 rounded-full bg-primary/40" aria-hidden="true" />
                <span class="absolute bottom-3 end-3 h-2 w-2 rounded-full bg-primary/40" aria-hidden="true" />

                <!-- Center Emblem -->
                <div
                  class="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-background/90 shadow-md"
                >
                  <Loader2
                    v-if="phase === 'loading'"
                    class="h-8 w-8 text-primary animate-spin"
                    aria-hidden="true"
                  />
                  <ProjectIcon v-else name="randomizer" class="h-10 w-10" />
                </div>
              </div>
            </button>

            <div class="space-y-1.5 max-w-md">
              <h2 class="text-xl sm:text-2xl font-bold text-foreground">
                {{ phase === 'loading' ? 'جاري تجهيز الصندوق...' : 'صندوق وصفاتنا جاهز للفتح' }}
              </h2>
              <p class="text-sm text-muted-foreground tabular-nums">
                <template v-if="activeFilterCount > 0">
                  تم تطبيق {{ activeFilterCount }} فلتر على الصندوق · اضغط للفتح واكتشاف طبقك
                </template>
                <template v-else-if="totalRecipes > 0">
                  يضم الصندوق {{ totalRecipes }} وصفة سورية مجرّبة ومعتمدة بانتظارك
                </template>
                <template v-else>
                  اضغط على الصندوق لتدوير شريط الوصفات واختيار طبق اليوم
                </template>
              </p>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                size="lg"
                class="h-12 px-8 text-base font-bold gap-2 shadow-sm"
                :disabled="phase === 'loading'"
                :aria-busy="phase === 'loading' || undefined"
                @click="openCrate"
              >
                <Loader2 v-if="phase === 'loading'" class="h-5 w-5 animate-spin" aria-hidden="true" />
                <Dices v-else class="h-5 w-5" aria-hidden="true" />
                <span>{{ phase === 'loading' ? 'جاري التحميل...' : 'افتح الصندوق الآن' }}</span>
              </Button>
            </div>

            <!-- Rarity Tier Legend -->
            <div
              class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-xs text-muted-foreground"
              aria-label="مستويات ندرة الوصفات"
            >
              <span v-for="tier in rarityLegend" :key="tier.key" class="inline-flex items-center gap-1.5">
                <span :class="cn('h-2.5 w-2.5 rounded-full shrink-0', tier.dotClass)" aria-hidden="true" />
                <span class="font-medium text-foreground/90">{{ tier.label }}</span>
                <span class="hidden sm:inline text-muted-foreground/80">({{ tier.subtitle }})</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <!-- SPINNING: Horizontal Reel -->
        <div v-else-if="phase === 'spinning'" class="space-y-4">
          <div class="flex items-center justify-between gap-2 px-1 text-sm">
            <span class="inline-flex items-center gap-2 font-semibold text-primary">
              <Sparkles class="h-4 w-4 motion-safe:animate-pulse" aria-hidden="true" />
              <span>جاري فتح الصندوق...</span>
            </span>
            <span v-if="totalMatching !== null" class="text-xs text-muted-foreground tabular-nums">
              من بين {{ totalMatching }} وصفة مطابقة
            </span>
          </div>

          <RecipeSpinner
            :recipes="recipes"
            :spinning="phase === 'spinning'"
            :sound-enabled="soundEnabled"
            @spin-complete="onSpinComplete"
          />
        </div>

        <!-- REVEALED: Winner Spotlight Card -->
        <div v-else-if="phase === 'revealed' && winner && winnerRarity" class="space-y-4">
          <Card
            :class="
              cn(
                'relative overflow-hidden border-2 bg-card reveal-pop',
                winnerRarity.borderClass,
                winnerRarity.glowClass,
              )
            "
          >
            <!-- Rarity Top Strip -->
            <div :class="cn('h-2 w-full', winnerRarity.topBarClass)" />

            <!-- CSS-Only Confetti-Lite Burst -->
            <div
              class="pointer-events-none absolute top-14 left-1/2 -translate-x-1/2 z-20"
              aria-hidden="true"
            >
              <span
                v-for="(piece, idx) in confettiPieces"
                :key="idx"
                :class="cn('confetti-bit absolute h-2 w-2 rounded-full', piece.color)"
                :style="{
                  '--c-angle': piece.angle,
                  '--c-dist': piece.dist,
                  animationDelay: piece.delay,
                }"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-5 gap-0">
              <!-- Winner Image -->
              <div class="relative md:col-span-2 aspect-video md:aspect-auto md:min-h-[280px] bg-muted overflow-hidden">
                <img
                  v-if="winner.image_url"
                  :src="winner.image_url"
                  :alt="winner.name"
                  width="560"
                  height="360"
                  decoding="async"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-accent"
                >
                  <UtensilsCrossed class="h-16 w-16 text-muted-foreground/30" aria-hidden="true" />
                </div>

                <!-- Rarity Pill -->
                <div class="absolute top-3 start-3 flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    :class="cn('gap-1.5 px-3 py-1 text-xs font-bold backdrop-blur-md bg-background/90 shadow-sm', winnerRarity.badgeClass)"
                  >
                    <Trophy class="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{{ winnerRarity.label }}</span>
                  </Badge>
                </div>
              </div>

              <!-- Winner Details -->
              <div class="md:col-span-3 p-5 sm:p-6 md:p-7 flex flex-col justify-between gap-5">
                <div class="space-y-3">
                  <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
                    <Sparkles class="h-4 w-4" aria-hidden="true" />
                    <span>وصفة الصندوق المختارة لك!</span>
                  </div>

                  <h2
                    ref="revealHeadingRef"
                    tabindex="-1"
                    class="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground focus:outline-none"
                  >
                    {{ winner.name }}
                  </h2>

                  <p v-if="winner.description" class="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {{ winner.description }}
                  </p>

                  <!-- Meta Badges -->
                  <div class="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                    <Badge v-if="winner.city?.name" variant="secondary" class="gap-1">
                      <MapPin class="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      <span>{{ winner.city.name }}</span>
                    </Badge>
                    <Badge v-if="winnerTime" variant="outline" class="gap-1 tabular-nums">
                      <Clock class="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      <span>{{ winnerTime }}</span>
                    </Badge>
                    <Badge v-if="winner.servings" variant="outline" class="gap-1 tabular-nums">
                      <Utensils class="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      <span>{{ winner.servings }}</span>
                    </Badge>
                    <Badge v-if="winner.difficulty" variant="outline" :class="winnerRarity.badgeClass">
                      {{ winner.difficulty }}
                    </Badge>
                  </div>

                  <p v-if="winner.author?.name" class="text-xs text-muted-foreground pt-1">
                    بواسطة <span class="font-medium text-foreground">{{ winner.author.name }}</span>
                  </p>
                </div>

                <!-- CTAs -->
                <div class="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-border/60">
                  <Button as-child size="lg" class="flex-1 h-11 font-bold gap-2">
                    <Link :href="route('recipes.show', winner.slug)">
                      <span>اذهب إلى الوصفة</span>
                      <ArrowLeft class="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    class="flex-1 h-11 font-semibold gap-2"
                    @click="openCrate"
                  >
                    <RotateCcw class="h-4 w-4" aria-hidden="true" />
                    <span>افتح صندوقاً آخر</span>
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="ghost"
                    class="h-11 px-3 text-muted-foreground hover:text-foreground gap-1.5"
                    @click="scrollToFilters"
                  >
                    <SlidersHorizontal class="h-4 w-4" aria-hidden="true" />
                    <span class="sm:sr-only lg:not-sr-only">الفلاتر</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- EMPTY / NO MATCH STATE -->
        <Card v-else-if="phase === 'empty'" class="border-2 border-dashed border-border bg-muted/20">
          <CardContent class="flex flex-col items-center text-center py-12 px-4 space-y-5">
            <ProjectIcon name="randomizer" class="h-14 w-14 opacity-80" />
            <div class="space-y-1.5 max-w-md">
              <h2 class="text-xl font-bold text-foreground">الصندوق فارغ بهذه الشروط!</h2>
              <p class="text-sm text-muted-foreground">
                لم نجد وصفات مطابقة مع المكونات المستبعدة والفلاتر المحددة حالياً. جرّب تخفيف القيود أو مسح الفلاتر.
              </p>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-3">
              <Button
                v-if="selectedIngredients.length > 0"
                type="button"
                variant="outline"
                @click="clearIngredients(); openCrate()"
              >
                إزالة المكونات المستبعدة وإعادة الفتح
              </Button>
              <Button type="button" @click="resetAllFilters(); openCrate()">
                <RotateCcw class="h-4 w-4 me-2" aria-hidden="true" />
                إعادة ضبط كل الفلاتر وفتح الصندوق
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <!-- STEP 1: Crate Filters & Ingredient Exclusions -->
      <section ref="filtersSectionRef" aria-label="تخصيص صندوق الوصفات">
        <Card class="border-border/80">
          <CardHeader class="pb-4">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="space-y-1">
                <CardTitle class="flex items-center gap-2 text-lg sm:text-xl">
                  <Filter class="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>خصّص صندوق الوصفات</span>
                </CardTitle>
                <CardDescription>
                  اختر مستوى الصعوبة أو المدينة أو استبعد المكونات التي لا تود استخدامها اليوم.
                </CardDescription>
              </div>
              <Button
                v-if="activeFilterCount > 0"
                type="button"
                variant="ghost"
                size="sm"
                class="text-xs text-muted-foreground hover:text-destructive"
                @click="resetAllFilters"
              >
                إعادة ضبط الفلاتر ({{ activeFilterCount }})
              </Button>
            </div>
          </CardHeader>

          <CardContent class="space-y-6">
            <!-- Difficulty & City Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div class="md:col-span-2 space-y-2">
                <span class="block text-sm font-medium text-foreground">مستوى الصعوبة</span>
                <div
                  role="group"
                  aria-label="تصفية حسب مستوى الصعوبة"
                  class="flex flex-wrap gap-1.5"
                >
                  <FilterChip
                    v-for="level in DIFFICULTIES"
                    :key="level.value"
                    :active="selectedDifficulty === level.value"
                    @click="selectedDifficulty = level.value"
                  >
                    {{ level.label }}
                  </FilterChip>
                </div>
              </div>

              <div v-if="cities.length > 0" class="space-y-2">
                <label for="randomizer-city-select" class="block text-sm font-medium text-foreground">
                  المدينة أو المطبخ
                </label>
                <Select v-model="selectedCity">
                  <SelectTrigger id="randomizer-city-select" class="bg-background h-10">
                    <SelectValue placeholder="كل المدن" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل المدن</SelectItem>
                    <SelectItem
                      v-for="city in cities"
                      :key="city.id"
                      :value="String(city.id)"
                    >
                      {{ city.name }}
                      <span v-if="city.recipes_count" class="text-muted-foreground">
                        ({{ city.recipes_count }})
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <!-- Ingredient Exclusion Selector -->
            <IngredientSelector
              :selected-ingredients="selectedIngredients"
              :popular-ingredients="popularIngredients"
              @select="handleIngredientSelect"
              @remove="handleIngredientRemove"
              @clear="clearIngredients"
            />

            <!-- Action Trigger -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border/60">
              <p class="text-xs text-muted-foreground">
                يمكنك فتح الصندوق مباشرة دون فلاتر للاختيار من كامل مكتبة وصفاتنا.
              </p>
              <Button
                type="button"
                size="lg"
                class="h-11 px-7 font-bold gap-2 shrink-0"
                :disabled="phase === 'loading' || phase === 'spinning'"
                :aria-busy="phase === 'loading' || phase === 'spinning' || undefined"
                @click="openCrate"
              >
                <Loader2
                  v-if="phase === 'loading'"
                  class="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                <Dices v-else class="h-4 w-4" aria-hidden="true" />
                <span>
                  {{
                    phase === 'loading'
                      ? 'جاري التحميل...'
                      : phase === 'spinning'
                        ? 'جاري التدوير...'
                        : winner
                          ? 'افتح صندوقاً جديداً'
                          : 'افتح الصندوق!'
                  }}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <!-- Recent Drops History -->
      <section v-if="dropHistory.length > 0" aria-label="آخر الصناديق المفتوحة" class="space-y-4">
        <div class="flex items-center justify-between gap-2">
          <h2 class="flex items-center gap-2 text-lg font-bold text-foreground">
            <History class="h-5 w-5 text-primary" aria-hidden="true" />
            <span>آخر الصناديق المفتوحة</span>
          </h2>
          <span class="text-xs text-muted-foreground tabular-nums">
            {{ dropHistory.length }} وصفة في هذه الجلسة
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            v-for="item in dropHistory"
            :key="item.id"
            :href="route('recipes.show', item.slug)"
            class="group flex items-center gap-3 rounded-xl border border-border/80 bg-card p-2.5 transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div class="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img
                v-if="item.image_url"
                :src="item.image_url"
                :alt="item.name"
                loading="lazy"
                decoding="async"
                width="56"
                height="56"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <UtensilsCrossed class="h-5 w-5 text-muted-foreground/40" aria-hidden="true" />
              </div>
              <span
                :class="cn('absolute bottom-1 end-1 h-2.5 w-2.5 rounded-full ring-2 ring-card', getRecipeRarity(item.difficulty).dotClass)"
                aria-hidden="true"
              />
            </div>

            <div class="min-w-0 flex-1 text-start">
              <p class="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                {{ item.name }}
              </p>
              <p class="text-xs text-muted-foreground truncate mt-0.5">
                {{ item.city?.name || 'المطبخ السوري' }} · {{ getRecipeRarity(item.difficulty).label }}
              </p>
            </div>

            <ArrowLeft
              class="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    </div>
  </PublicLayout>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  @keyframes crate-shake {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(0deg);
    }
    20% {
      transform: translate3d(-4px, -2px, 0) rotate(-2deg);
    }
    40% {
      transform: translate3d(4px, 0, 0) rotate(2deg);
    }
    60% {
      transform: translate3d(-3px, -1px, 0) rotate(-1.5deg);
    }
    80% {
      transform: translate3d(3px, 1px, 0) rotate(1.5deg);
    }
  }

  .crate-shake {
    animation: crate-shake 0.55s ease-in-out infinite;
  }

  @keyframes reveal-pop {
    0% {
      opacity: 0;
      transform: scale(0.96) translateY(8px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .reveal-pop {
    animation: reveal-pop 0.36s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes confetti-burst {
    0% {
      opacity: 1;
      transform: rotate(var(--c-angle)) translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: rotate(var(--c-angle)) translateY(calc(var(--c-dist) * -1)) scale(0.4);
    }
  }

  .confetti-bit {
    animation: confetti-burst 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  .confetti-bit {
    display: none;
  }
}
</style>
