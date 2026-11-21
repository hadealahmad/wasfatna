<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import {
  ArrowUpLeft,
  BookHeart,
  CalendarDays,
  ChefHat,
  Clock,
  Dices,
  History,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Utensils,
  X,
} from 'lucide-vue-next';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  FilterChip,
} from '@/components/ui';
import {
  claimGlobalSearchDialogHost,
  isGlobalSearchDialogHost,
  releaseGlobalSearchDialogHost,
  useGlobalSearch,
  useIsMac,
} from '@/composables/useGlobalSearch';
import { matchesArabicSearch, normalizeArabic } from '@/lib/arabic';
import { cn, formatTimeNeeded } from '@/lib/utils';

interface Props {
  variant?: 'navbar' | 'icon';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'navbar',
});

interface RemoteRecipe {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  city: string | null;
  city_slug: string | null;
  difficulty: string | null;
  time_needed: unknown;
}

interface RemoteCity {
  id: number;
  name: string;
  slug: string;
  recipes_count: number;
}

interface RemoteList {
  id: number;
  name: string;
  slug: string;
  recipes_count: number;
}

interface RemoteTag {
  id: number;
  name: string;
  slug: string;
  recipes_count: number;
}

interface RemoteIngredient {
  id: number;
  name: string;
  recipes_count: number;
}

interface GlobalSearchResponse {
  recipes: RemoteRecipe[];
  cities: RemoteCity[];
  lists: RemoteList[];
  tags: RemoteTag[];
  ingredients: RemoteIngredient[];
}

type SearchScope = 'all' | 'recipes' | 'cities' | 'lists' | 'taxonomy';

const SCOPE_TABS: ReadonlyArray<{ id: SearchScope; label: string }> = [
  { id: 'all', label: 'الكل' },
  { id: 'recipes', label: 'الوصفات' },
  { id: 'cities', label: 'المدن' },
  { id: 'lists', label: 'القوائم' },
  { id: 'taxonomy', label: 'الوسوم والمكونات' },
];

const QUICK_LINKS = [
  {
    id: 'cities',
    label: 'المدن',
    subtitle: 'استكشف الوصفات حسب المدينة السورية',
    href: '/cities',
    keywords: 'مدن محافظات دمشق حلب حمص حماة اللاذقية',
    icon: MapPin,
  },
  {
    id: 'lists',
    label: 'القوائم',
    subtitle: 'قوائم وصفات مختارة من المجتمع',
    href: '/lists',
    keywords: 'قوائم مفضلة مختارات',
    icon: BookHeart,
  },
  {
    id: 'meal-plans',
    label: 'خطط الوجبات',
    subtitle: 'خطط أسبوعية وموسمية للوجبات',
    href: '/meal-plans/browse',
    keywords: 'خطط وجبات جدول رمضان اسبوعي',
    icon: CalendarDays,
  },
  {
    id: 'randomizer',
    label: 'شو نطبخ؟',
    subtitle: 'اقتراح عشوائي لطبخة اليوم',
    href: '/randomizer',
    keywords: 'عشوائي اقتراح شو نطبخ طبخة اليوم',
    icon: Dices,
  },
  {
    id: 'recipes',
    label: 'جميع الوصفات',
    subtitle: 'تصفح مئات الوصفات السورية المعتمدة',
    href: '/recipes',
    keywords: 'وصفات اكلات طبخ',
    icon: Utensils,
  },
] as const;

const RECENT_STORAGE_KEY = 'wasfatna:recent-searches';
const MAX_RECENT = 5;

const EMPTY_RESULTS: GlobalSearchResponse = {
  recipes: [],
  cities: [],
  lists: [],
  tags: [],
  ingredients: [],
};

const hostId = Symbol('GlobalSearchDialogHost');
const uid = useId();
const listboxId = `${uid}-listbox`;

const { isOpen, open, close, setOpen } = useGlobalSearch();
const isMac = useIsMac();

const isDialogHost = ref(false);
const query = ref('');
const scope = ref<SearchScope>('all');
const results = ref<GlobalSearchResponse>(EMPTY_RESULTS);
const loading = ref(false);
const errorMessage = ref<string | null>(null);
const activeIndex = ref(-1);
const recentSearches = ref<string[]>([]);

const inputRef = ref<HTMLInputElement | null>(null);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let abortController: AbortController | null = null;

function readRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .slice(0, MAX_RECENT);
  } catch {
    // Storage may be unavailable in private browsing; treat as empty.
    return [];
  }
}

function writeRecentSearches(items: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_RECENT)));
  } catch {
    // Ignore storage quota / privacy mode errors.
  }
}

function saveRecentSearch(term: string): void {
  const clean = term.trim();
  if (clean.length < 2) return;
  const normalized = normalizeArabic(clean);
  const next = [
    clean,
    ...recentSearches.value.filter((item) => normalizeArabic(item) !== normalized),
  ].slice(0, MAX_RECENT);
  recentSearches.value = next;
  writeRecentSearches(next);
}

function removeRecentSearch(term: string): void {
  recentSearches.value = recentSearches.value.filter((item) => item !== term);
  writeRecentSearches(recentSearches.value);
}

function clearRecentSearches(): void {
  recentSearches.value = [];
  writeRecentSearches([]);
}

onMounted(() => {
  claimGlobalSearchDialogHost(hostId);
  isDialogHost.value = isGlobalSearchDialogHost(hostId);
  recentSearches.value = readRecentSearches();
});

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  abortController?.abort();
  releaseGlobalSearchDialogHost(hostId);
});

const shortcutLabel = computed(() => (isMac.value ? '⌘ K' : 'Ctrl K'));
const triggerAriaLabel = computed(() => `بحث سريع في وصفاتنا (${shortcutLabel.value})`);
const trimmedQuery = computed(() => query.value.trim());

async function fetchGlobalSearch(q: string) {
  abortController?.abort();
  abortController = new AbortController();
  loading.value = true;
  errorMessage.value = null;

  try {
    const response = await fetch(`/api/search/global?q=${encodeURIComponent(q)}`, {
      headers: { Accept: 'application/json' },
      signal: abortController.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = (await response.json()) as Partial<GlobalSearchResponse>;
    results.value = {
      recipes: Array.isArray(data.recipes) ? data.recipes : [],
      cities: Array.isArray(data.cities) ? data.cities : [],
      lists: Array.isArray(data.lists) ? data.lists : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    results.value = EMPTY_RESULTS;
    errorMessage.value = 'تعذّر إتمام البحث الآن. تحقق من اتصالك وحاول مجدداً.';
  } finally {
    if (!abortController?.signal.aborted) {
      loading.value = false;
    }
  }
}

function retrySearch() {
  if (trimmedQuery.value.length >= 2) {
    fetchGlobalSearch(trimmedQuery.value);
  }
}

watch(isOpen, async (opened) => {
  if (!isDialogHost.value) return;
  if (opened) {
    recentSearches.value = readRecentSearches();
    errorMessage.value = null;
    activeIndex.value = -1;
    await nextTick();
    inputRef.value?.focus();
  } else {
    if (debounceTimer) clearTimeout(debounceTimer);
    abortController?.abort();
    query.value = '';
    scope.value = 'all';
    results.value = EMPTY_RESULTS;
    loading.value = false;
    errorMessage.value = null;
    activeIndex.value = -1;
  }
});

watch([trimmedQuery, isOpen], ([q, opened]) => {
  if (!isDialogHost.value || !opened) return;
  if (debounceTimer) clearTimeout(debounceTimer);

  if (q.length < 2) {
    abortController?.abort();
    results.value = EMPTY_RESULTS;
    loading.value = false;
    errorMessage.value = null;
    return;
  }

  loading.value = true;
  errorMessage.value = null;
  debounceTimer = setTimeout(() => {
    fetchGlobalSearch(q);
  }, 200);
});

const matchedQuickLinks = computed(() => {
  if (scope.value !== 'all') return [];
  if (!trimmedQuery.value) return QUICK_LINKS;
  return QUICK_LINKS.filter((item) =>
    matchesArabicSearch(trimmedQuery.value, item.label, item.subtitle, item.keywords),
  );
});

const visibleRecipes = computed(() =>
  scope.value === 'all' || scope.value === 'recipes' ? results.value.recipes : [],
);
const visibleCities = computed(() =>
  scope.value === 'all' || scope.value === 'cities' ? results.value.cities : [],
);
const visibleLists = computed(() =>
  scope.value === 'all' || scope.value === 'lists' ? results.value.lists : [],
);
const visibleTags = computed(() =>
  scope.value === 'all' || scope.value === 'taxonomy' ? results.value.tags : [],
);
const visibleIngredients = computed(() =>
  scope.value === 'all' || scope.value === 'taxonomy' ? results.value.ingredients : [],
);

const visibleRecent = computed(() =>
  !trimmedQuery.value && scope.value === 'all' ? recentSearches.value : [],
);

interface NavigableItem {
  id: string;
  kind: 'recent' | 'quick' | 'recipe' | 'city' | 'list' | 'tag' | 'ingredient' | 'all';
  href?: string;
  queryText?: string;
}

const navigableItems = computed<NavigableItem[]>(() => {
  const items: NavigableItem[] = [];

  for (const term of visibleRecent.value) {
    items.push({ id: `recent-${term}`, kind: 'recent', queryText: term });
  }

  for (const recipe of visibleRecipes.value) {
    items.push({ id: `recipe-${recipe.id}`, kind: 'recipe', href: `/recipes/${recipe.slug}` });
  }

  for (const city of visibleCities.value) {
    items.push({ id: `city-${city.id}`, kind: 'city', href: `/cities/${city.slug}` });
  }

  for (const list of visibleLists.value) {
    items.push({ id: `list-${list.id}`, kind: 'list', href: `/lists/${list.id}` });
  }

  for (const tag of visibleTags.value) {
    items.push({
      id: `tag-${tag.id}`,
      kind: 'tag',
      href: `/recipes?tag=${encodeURIComponent(tag.slug)}`,
    });
  }

  for (const ingredient of visibleIngredients.value) {
    items.push({
      id: `ingredient-${ingredient.id}`,
      kind: 'ingredient',
      href: `/search?q=${encodeURIComponent(ingredient.name)}`,
    });
  }

  for (const link of matchedQuickLinks.value) {
    items.push({ id: `quick-${link.id}`, kind: 'quick', href: link.href });
  }

  if (trimmedQuery.value.length >= 1) {
    items.push({
      id: 'show-all',
      kind: 'all',
      href: `/search?q=${encodeURIComponent(trimmedQuery.value)}`,
    });
  }

  return items;
});

const itemIndexMap = computed(() => {
  const map = new Map<string, number>();
  navigableItems.value.forEach((item, index) => map.set(item.id, index));
  return map;
});

function indexOfItem(id: string): number {
  return itemIndexMap.value.get(id) ?? -1;
}

function optionDomId(id: string): string {
  return `${uid}-option-${encodeURIComponent(id)}`;
}

const activeOptionDomId = computed(() => {
  const item = navigableItems.value[activeIndex.value];
  return item ? optionDomId(item.id) : undefined;
});

const hasAnyResultSection = computed(
  () =>
    visibleRecipes.value.length > 0 ||
    visibleCities.value.length > 0 ||
    visibleLists.value.length > 0 ||
    visibleTags.value.length > 0 ||
    visibleIngredients.value.length > 0 ||
    matchedQuickLinks.value.length > 0,
);

watch(navigableItems, (items) => {
  if (items.length === 0) {
    activeIndex.value = -1;
  } else if (activeIndex.value >= items.length) {
    activeIndex.value = 0;
  }
});

watch(activeIndex, (idx) => {
  const item = navigableItems.value[idx];
  if (!item) return;
  nextTick(() => {
    document.getElementById(optionDomId(item.id))?.scrollIntoView({ block: 'nearest' });
  });
});

function navigateTo(href: string, recordQuery = true): void {
  if (recordQuery && trimmedQuery.value.length >= 2) {
    saveRecentSearch(trimmedQuery.value);
  }
  close();
  router.visit(href);
}

function applyRecentSearch(term: string): void {
  query.value = term;
  activeIndex.value = -1;
  nextTick(() => inputRef.value?.focus());
}

function activateItem(item: NavigableItem): void {
  if (item.kind === 'recent' && item.queryText) {
    applyRecentSearch(item.queryText);
    return;
  }
  if (item.href) {
    navigateTo(item.href, item.kind !== 'quick');
  }
}

function onInputKeyDown(e: KeyboardEvent): void {
  if (e.isComposing) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    close();
    return;
  }

  const total = navigableItems.value.length;
  if (e.key === 'ArrowDown') {
    if (!total) return;
    e.preventDefault();
    activeIndex.value = activeIndex.value < total - 1 ? activeIndex.value + 1 : 0;
    return;
  }

  if (e.key === 'ArrowUp') {
    if (!total) return;
    e.preventDefault();
    activeIndex.value = activeIndex.value > 0 ? activeIndex.value - 1 : total - 1;
    return;
  }

  if (e.key === 'Enter') {
    const selected = navigableItems.value[activeIndex.value] ?? navigableItems.value[0];
    if (selected) {
      e.preventDefault();
      activateItem(selected);
    } else if (trimmedQuery.value.length >= 1) {
      e.preventDefault();
      navigateTo(`/search?q=${encodeURIComponent(trimmedQuery.value)}`);
    }
  }
}
</script>

<template>
  <!-- Search Triggers -->
  <div :class="cn('inline-flex items-center', props.class)">
    <!-- Mobile / Icon-only trigger -->
    <Button
      type="button"
      variant="ghost"
      size="icon"
      :aria-label="triggerAriaLabel"
      :class="variant === 'icon' ? 'h-9 w-9' : 'h-9 w-9 md:hidden'"
      @click="open()"
    >
      <Search class="h-4 w-4" aria-hidden="true" />
    </Button>

    <!-- Desktop pill trigger (only when variant === 'navbar') -->
    <Button
      v-if="variant === 'navbar'"
      type="button"
      variant="outline"
      :aria-label="triggerAriaLabel"
      class="hidden md:inline-flex h-9 min-w-44 xl:min-w-60 items-center justify-between gap-3 rounded-xl border-border/80 bg-muted/40 px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      @click="open()"
    >
      <span class="flex items-center gap-2 truncate">
        <Search class="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span class="truncate">ابحث عن وصفة أو مدينة...</span>
      </span>
      <kbd
        dir="ltr"
        class="pointer-events-none inline-flex h-5 shrink-0 select-none items-center gap-0.5 rounded-md border border-border bg-background px-1.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-2xs"
      >
        {{ shortcutLabel }}
      </kbd>
    </Button>
  </div>

  <!-- Global Command Palette Dialog (mounted once by the primary host) -->
  <Dialog v-if="isDialogHost" :open="isOpen" @update:open="setOpen">
    <DialogContent
      dir="rtl"
      :show-close-button="false"
      class="inset-0 top-0 left-0 translate-x-0 translate-y-0 max-w-none h-dvh rounded-none border-0 p-0 gap-0 flex flex-col bg-card text-foreground shadow-2xl overflow-hidden sm:inset-auto sm:top-[12%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-0 sm:h-auto sm:max-h-[80vh] sm:w-[calc(100vw-2rem)] sm:max-w-2xl sm:rounded-2xl sm:border sm:border-border/80"
    >
      <DialogTitle class="sr-only">بحث شامل في وصفاتنا</DialogTitle>
      <DialogDescription class="sr-only">
        ابحث في الوصفات، المدن السورية، القوائم، الوسوم، والمكونات
      </DialogDescription>

      <!-- Top Search Input Row -->
      <div class="flex shrink-0 items-center gap-2.5 border-b border-border/80 bg-muted/25 px-3.5 py-3">
        <Search class="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="navigableItems.length > 0"
          :aria-controls="listboxId"
          :aria-activedescendant="activeOptionDomId"
          aria-label="ابحث في وصفاتنا"
          placeholder="ابحث عن وصفة، مدينة، قائمة، وسم، أو مكون..."
          enterkeyhint="search"
          autocomplete="off"
          dir="rtl"
          class="min-w-0 flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          @keydown="onInputKeyDown"
        />
        <Loader2
          v-if="loading"
          class="h-4 w-4 shrink-0 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
        <button
          v-if="query"
          type="button"
          aria-label="مسح البحث"
          class="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          @click="() => { query = ''; inputRef?.focus(); }"
        >
          <X class="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="إغلاق نافذة البحث"
          class="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          @click="close()"
        >
          <span class="hidden sm:inline font-mono text-[11px]">Esc</span>
          <span class="sm:hidden">إغلاق</span>
        </button>
      </div>

      <!-- Scope Filter Chips -->
      <div
        role="group"
        aria-label="تصفية نطاق البحث"
        class="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-border/60 bg-background/60 px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <FilterChip
          v-for="tab in SCOPE_TABS"
          :key="tab.id"
          :active="scope === tab.id"
          @click="scope = tab.id"
        >
          {{ tab.label }}
        </FilterChip>
      </div>

      <!-- Results Listbox -->
      <div
        :id="listboxId"
        role="listbox"
        aria-label="نتائج البحث"
        class="min-h-0 flex-1 overflow-y-auto p-2 space-y-3 sm:max-h-[430px]"
      >
        <!-- Error state -->
        <div
          v-if="errorMessage"
          role="alert"
          class="mx-1 flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-xs text-destructive"
        >
          <span>{{ errorMessage }}</span>
          <Button type="button" variant="outline" size="sm" @click="retrySearch">
            إعادة المحاولة
          </Button>
        </div>

        <!-- Loading state (initial fetch before results arrive) -->
        <div
          v-if="loading && trimmedQuery.length >= 2 && !hasAnyResultSection"
          class="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground"
        >
          <Loader2 class="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
          <span>جاري البحث في الوصفات والمدن...</span>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="trimmedQuery.length >= 2 && !loading && !errorMessage && !hasAnyResultSection"
          class="py-8 text-center"
        >
          <div class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Search class="h-5 w-5" aria-hidden="true" />
          </div>
          <p class="text-sm font-semibold text-foreground">
            لا توجد نتائج مطابقة لـ «{{ trimmedQuery }}»
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            جرّب البحث باسم وصفة، مدينة سورية، مكون، أو وسم
          </p>
        </div>

        <!-- Recent Searches (when query is empty) -->
        <section v-if="visibleRecent.length > 0" aria-label="عمليات البحث الأخيرة" class="py-1">
          <div class="flex items-center justify-between px-2 pb-1.5">
            <p class="text-xs font-bold text-muted-foreground">عمليات البحث الأخيرة</p>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              @click="clearRecentSearches"
            >
              <Trash2 class="h-3 w-3" aria-hidden="true" />
              <span>مسح السجل</span>
            </button>
          </div>
          <div class="flex flex-col gap-0.5">
            <div
              v-for="term in visibleRecent"
              :key="term"
              :id="optionDomId(`recent-${term}`)"
              role="option"
              :aria-selected="activeIndex === indexOfItem(`recent-${term}`)"
              :class="cn(
                'group flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm cursor-pointer transition-colors',
                activeIndex === indexOfItem(`recent-${term}`)
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/60',
              )"
              @pointermove="activeIndex = indexOfItem(`recent-${term}`)"
              @click="applyRecentSearch(term)"
            >
              <span class="flex items-center gap-2.5 min-w-0">
                <History class="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span class="truncate font-medium">{{ term }}</span>
              </span>
              <button
                type="button"
                :aria-label="`إزالة «${term}» من السجل`"
                class="rounded-md p-1 text-muted-foreground opacity-70 hover:bg-muted hover:text-foreground hover:opacity-100 transition-opacity"
                @click.stop="removeRecentSearch(term)"
              >
                <X class="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <!-- Recipes -->
        <section v-if="visibleRecipes.length > 0" aria-label="الوصفات" class="py-1">
          <p class="px-2 pb-1.5 text-xs font-bold text-muted-foreground">الوصفات</p>
          <div class="flex flex-col gap-1">
            <div
              v-for="recipe in visibleRecipes"
              :key="recipe.id"
              :id="optionDomId(`recipe-${recipe.id}`)"
              role="option"
              :aria-selected="activeIndex === indexOfItem(`recipe-${recipe.id}`)"
              :class="cn(
                'flex items-center justify-between gap-3 rounded-xl px-3 py-2 cursor-pointer transition-colors',
                activeIndex === indexOfItem(`recipe-${recipe.id}`)
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/60',
              )"
              @pointermove="activeIndex = indexOfItem(`recipe-${recipe.id}`)"
              @click="navigateTo(`/recipes/${recipe.slug}`)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <img
                  v-if="recipe.image_url"
                  :src="recipe.image_url"
                  :alt="recipe.name"
                  loading="lazy"
                  class="h-10 w-10 shrink-0 rounded-lg object-cover border border-border/60 bg-muted"
                />
                <div
                  v-else
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted text-primary"
                >
                  <Utensils class="h-4 w-4" aria-hidden="true" />
                </div>
                <div class="min-w-0">
                  <span class="block truncate text-sm font-semibold text-foreground">
                    {{ recipe.name }}
                  </span>
                  <span class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span v-if="recipe.city">{{ recipe.city }}</span>
                    <span v-if="recipe.difficulty">· {{ recipe.difficulty }}</span>
                    <span v-if="formatTimeNeeded(recipe.time_needed as any)" class="inline-flex items-center gap-1">
                      <Clock class="h-3 w-3" aria-hidden="true" />
                      {{ formatTimeNeeded(recipe.time_needed as any) }}
                    </span>
                  </span>
                </div>
              </div>
              <Badge variant="outline" class="shrink-0 text-[10px]">وصفة</Badge>
            </div>
          </div>
        </section>

        <!-- Cities -->
        <section v-if="visibleCities.length > 0" aria-label="المدن" class="py-1">
          <p class="px-2 pb-1.5 text-xs font-bold text-muted-foreground">المدن</p>
          <div class="flex flex-col gap-1">
            <div
              v-for="city in visibleCities"
              :key="city.id"
              :id="optionDomId(`city-${city.id}`)"
              role="option"
              :aria-selected="activeIndex === indexOfItem(`city-${city.id}`)"
              :class="cn(
                'flex items-center justify-between gap-3 rounded-xl px-3 py-2 cursor-pointer transition-colors',
                activeIndex === indexOfItem(`city-${city.id}`)
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/60',
              )"
              @pointermove="activeIndex = indexOfItem(`city-${city.id}`)"
              @click="navigateTo(`/cities/${city.slug}`)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/60 text-primary">
                  <MapPin class="h-4 w-4" aria-hidden="true" />
                </div>
                <span class="truncate text-sm font-semibold text-foreground">{{ city.name }}</span>
              </div>
              <Badge variant="secondary" class="shrink-0 text-[10px] tabular-nums">
                {{ city.recipes_count }} وصفة
              </Badge>
            </div>
          </div>
        </section>

        <!-- Public Lists -->
        <section v-if="visibleLists.length > 0" aria-label="القوائم" class="py-1">
          <p class="px-2 pb-1.5 text-xs font-bold text-muted-foreground">القوائم</p>
          <div class="flex flex-col gap-1">
            <div
              v-for="list in visibleLists"
              :key="list.id"
              :id="optionDomId(`list-${list.id}`)"
              role="option"
              :aria-selected="activeIndex === indexOfItem(`list-${list.id}`)"
              :class="cn(
                'flex items-center justify-between gap-3 rounded-xl px-3 py-2 cursor-pointer transition-colors',
                activeIndex === indexOfItem(`list-${list.id}`)
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/60',
              )"
              @pointermove="activeIndex = indexOfItem(`list-${list.id}`)"
              @click="navigateTo(`/lists/${list.id}`)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/60 text-primary">
                  <BookHeart class="h-4 w-4" aria-hidden="true" />
                </div>
                <span class="truncate text-sm font-semibold text-foreground">{{ list.name }}</span>
              </div>
              <Badge variant="secondary" class="shrink-0 text-[10px] tabular-nums">
                {{ list.recipes_count }} وصفة
              </Badge>
            </div>
          </div>
        </section>

        <!-- Tags -->
        <section v-if="visibleTags.length > 0" aria-label="الوسوم" class="py-1">
          <p class="px-2 pb-1.5 text-xs font-bold text-muted-foreground">الوسوم</p>
          <div class="flex flex-col gap-1">
            <div
              v-for="tag in visibleTags"
              :key="tag.id"
              :id="optionDomId(`tag-${tag.id}`)"
              role="option"
              :aria-selected="activeIndex === indexOfItem(`tag-${tag.id}`)"
              :class="cn(
                'flex items-center justify-between gap-3 rounded-xl px-3 py-2 cursor-pointer transition-colors',
                activeIndex === indexOfItem(`tag-${tag.id}`)
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/60',
              )"
              @pointermove="activeIndex = indexOfItem(`tag-${tag.id}`)"
              @click="navigateTo(`/recipes?tag=${encodeURIComponent(tag.slug)}`)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/60 text-primary">
                  <Tag class="h-4 w-4" aria-hidden="true" />
                </div>
                <span class="truncate text-sm font-semibold text-foreground">{{ tag.name }}</span>
              </div>
              <Badge variant="outline" class="shrink-0 text-[10px] tabular-nums">
                {{ tag.recipes_count }} وصفة
              </Badge>
            </div>
          </div>
        </section>

        <!-- Ingredients -->
        <section v-if="visibleIngredients.length > 0" aria-label="المكونات" class="py-1">
          <p class="px-2 pb-1.5 text-xs font-bold text-muted-foreground">المكونات</p>
          <div class="flex flex-col gap-1">
            <div
              v-for="ingredient in visibleIngredients"
              :key="ingredient.id"
              :id="optionDomId(`ingredient-${ingredient.id}`)"
              role="option"
              :aria-selected="activeIndex === indexOfItem(`ingredient-${ingredient.id}`)"
              :class="cn(
                'flex items-center justify-between gap-3 rounded-xl px-3 py-2 cursor-pointer transition-colors',
                activeIndex === indexOfItem(`ingredient-${ingredient.id}`)
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/60',
              )"
              @pointermove="activeIndex = indexOfItem(`ingredient-${ingredient.id}`)"
              @click="navigateTo(`/search?q=${encodeURIComponent(ingredient.name)}`)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/60 text-primary">
                  <ChefHat class="h-4 w-4" aria-hidden="true" />
                </div>
                <span class="truncate text-sm font-semibold text-foreground">{{ ingredient.name }}</span>
              </div>
              <Badge variant="outline" class="shrink-0 text-[10px] tabular-nums">
                بحث بالمكون · {{ ingredient.recipes_count }}
              </Badge>
            </div>
          </div>
        </section>

        <!-- Quick Links -->
        <section v-if="matchedQuickLinks.length > 0" aria-label="روابط سريعة" class="py-1">
          <p class="px-2 pb-1.5 text-xs font-bold text-muted-foreground">روابط سريعة</p>
          <div class="flex flex-col gap-1">
            <div
              v-for="link in matchedQuickLinks"
              :key="link.id"
              :id="optionDomId(`quick-${link.id}`)"
              role="option"
              :aria-selected="activeIndex === indexOfItem(`quick-${link.id}`)"
              :class="cn(
                'flex items-center justify-between gap-3 rounded-xl px-3 py-2 cursor-pointer transition-colors',
                activeIndex === indexOfItem(`quick-${link.id}`)
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/60',
              )"
              @pointermove="activeIndex = indexOfItem(`quick-${link.id}`)"
              @click="navigateTo(link.href, false)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/60 text-primary">
                  <component :is="link.icon" class="h-4 w-4" aria-hidden="true" />
                </div>
                <div class="min-w-0">
                  <span class="block truncate text-sm font-semibold text-foreground">{{ link.label }}</span>
                  <span class="block truncate text-xs text-muted-foreground">{{ link.subtitle }}</span>
                </div>
              </div>
              <ArrowUpLeft class="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </div>
          </div>
        </section>

        <!-- Show All Results CTA -->
        <section v-if="trimmedQuery.length >= 1" aria-label="عرض جميع النتائج" class="border-t border-border/60 pt-2">
          <div
            :id="optionDomId('show-all')"
            role="option"
            :aria-selected="activeIndex === indexOfItem('show-all')"
            :class="cn(
              'flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer transition-colors',
              activeIndex === indexOfItem('show-all')
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/40 text-foreground hover:bg-accent',
            )"
            @pointermove="activeIndex = indexOfItem('show-all')"
            @click="navigateTo(`/search?q=${encodeURIComponent(trimmedQuery)}`)"
          >
            <span class="flex items-center gap-2 min-w-0">
              <Search class="h-4 w-4 shrink-0" aria-hidden="true" />
              <span class="truncate">عرض جميع النتائج لـ «{{ trimmedQuery }}»</span>
            </span>
            <ArrowUpLeft class="h-4 w-4 shrink-0" aria-hidden="true" />
          </div>
        </section>
      </div>

      <!-- Footer Bar -->
      <div class="flex shrink-0 items-center justify-between border-t border-border/70 bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
        <div class="flex items-center gap-3">
          <span class="hidden sm:inline-flex items-center gap-1">
            <kbd class="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
            <span>للتنقل</span>
          </span>
          <span class="hidden sm:inline-flex items-center gap-1">
            <kbd class="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
            <span>للفتح</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <Sparkles class="h-3 w-3 text-primary" aria-hidden="true" />
            <span>ابحث في الوصفات والمدن والقوائم والمكونات</span>
          </span>
        </div>
        <span dir="ltr" class="font-mono text-[10px]">{{ isMac ? '⌘ + K' : 'Ctrl + K' }}</span>
      </div>
    </DialogContent>
  </Dialog>
</template>
