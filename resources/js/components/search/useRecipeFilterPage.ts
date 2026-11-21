import { computed, onUnmounted, ref, watch, type Ref } from 'vue';
import { router } from '@inertiajs/vue3';
import type { SmartFilterFacet, SmartFilterValue } from './smartFilter';

declare function route(name: string, params?: Record<string, unknown>): string;

export interface FilterEntity {
  id: number;
  name: string;
  slug: string;
}

export interface RecipePageFilters {
  search?: string;
  q?: string;
  city?: string;
  tag?: string;
  difficulty?: string;
  per_page?: number;
}

export const DIFFICULTY_OPTIONS = [
  { value: 'سهلة جداً', label: 'سهلة جداً' },
  { value: 'سهلة', label: 'سهلة' },
  { value: 'متوسطة', label: 'متوسطة' },
  { value: 'صعبة', label: 'صعبة' },
  { value: 'صعبة جداً', label: 'صعبة جداً' },
] as const;

function resolveEntityValue(raw: string | undefined, items: readonly FilterEntity[]): string | undefined {
  if (!raw || raw === 'all') return undefined;
  const match = items.find((item) => String(item.id) === String(raw) || item.slug === raw);
  return match ? String(match.id) : String(raw);
}

function toSmartFilterValue(
  filters: RecipePageFilters,
  cities: readonly FilterEntity[],
  tags: readonly FilterEntity[],
): SmartFilterValue {
  const nextFilters: Record<string, string[]> = {};

  const resolvedCity = resolveEntityValue(filters.city, cities);
  if (resolvedCity) nextFilters.city = [resolvedCity];

  const resolvedTag = resolveEntityValue(filters.tag, tags);
  if (resolvedTag) nextFilters.tag = [resolvedTag];

  if (filters.difficulty && filters.difficulty !== 'all') {
    nextFilters.difficulty = [filters.difficulty];
  }

  return {
    search: filters.search ?? filters.q ?? '',
    filters: nextFilters,
  };
}

function toQueryParams(
  value: SmartFilterValue,
  perPage?: number,
): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  const trimmedSearch = value.search.trim();
  if (trimmedSearch) query.search = trimmedSearch;
  if (value.filters.city?.[0]) query.city = value.filters.city[0];
  if (value.filters.tag?.[0]) query.tag = value.filters.tag[0];
  if (value.filters.difficulty?.[0]) query.difficulty = value.filters.difficulty[0];
  if (perPage) query.per_page = perPage;
  return query;
}

export function useRecipeFilterPage(options: {
  routeName: string;
  cities: Ref<readonly FilterEntity[]>;
  tags: Ref<readonly FilterEntity[]>;
  filters: Ref<RecipePageFilters>;
  debounceMs?: number;
}) {
  const { routeName, cities, tags, filters, debounceMs = 250 } = options;

  const isLoading = ref(false);
  const filterValue = ref<SmartFilterValue>(
    toSmartFilterValue(filters.value, cities.value, tags.value),
  );

  let timer: ReturnType<typeof setTimeout> | null = null;

  const facets = computed<SmartFilterFacet[]>(() => [
    {
      key: 'city',
      label: 'المدينة',
      aliases: ['مدينة', 'محافظة', 'city'],
      selectionMode: 'single',
      options: cities.value.map((c) => ({ value: String(c.id), label: c.name })),
    },
    {
      key: 'tag',
      label: 'الوسم',
      aliases: ['وسم', 'تصنيف', 'tag'],
      selectionMode: 'single',
      options: tags.value.map((t) => ({ value: String(t.id), label: t.name })),
    },
    {
      key: 'difficulty',
      label: 'الصعوبة',
      aliases: ['صعوبة', 'المستوى', 'difficulty'],
      selectionMode: 'single',
      options: DIFFICULTY_OPTIONS,
    },
  ]);

  const activeDifficulty = computed(() => filterValue.value.filters.difficulty?.[0] ?? '');

  const hasActiveFilters = computed(() =>
    Boolean(
      filterValue.value.search.trim() ||
        filterValue.value.filters.city?.length ||
        filterValue.value.filters.tag?.length ||
        filterValue.value.filters.difficulty?.length,
    ),
  );

  function navigateWithFilters(next: SmartFilterValue, immediate = false) {
    if (timer) clearTimeout(timer);

    const run = () => {
      const query = toQueryParams(next, filters.value.per_page);
      router.get(route(routeName), query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onStart: () => {
          isLoading.value = true;
        },
        onFinish: () => {
          isLoading.value = false;
        },
      });
    };

    if (immediate) {
      run();
    } else {
      timer = setTimeout(run, debounceMs);
    }
  }

  function onSmartFilterChange(next: SmartFilterValue) {
    const searchChanged = next.search !== filterValue.value.search;
    filterValue.value = next;
    navigateWithFilters(next, !searchChanged);
  }

  function selectDifficulty(level: string) {
    const nextFilters = { ...filterValue.value.filters };
    if (!level || nextFilters.difficulty?.[0] === level) {
      delete nextFilters.difficulty;
    } else {
      nextFilters.difficulty = [level];
    }
    const next: SmartFilterValue = { ...filterValue.value, filters: nextFilters };
    filterValue.value = next;
    navigateWithFilters(next, true);
  }

  function handlePageChange(page: number) {
    const query = toQueryParams(filterValue.value, filters.value.per_page);
    router.get(route(routeName), { ...query, page }, { preserveState: true, preserveScroll: false });
  }

  function handlePerPageChange(perPage: number) {
    const query = toQueryParams(filterValue.value, perPage);
    router.get(route(routeName), { ...query, page: 1 }, { preserveState: true, preserveScroll: false });
  }

  // Sync if URL/Inertia props change externally (e.g. browser back/forward or header navigation)
  watch(
    filters,
    (incoming) => {
      const synced = toSmartFilterValue(incoming, cities.value, tags.value);
      const currentQuery = JSON.stringify(toQueryParams(filterValue.value));
      const syncedQuery = JSON.stringify(toQueryParams(synced));
      if (currentQuery !== syncedQuery) {
        filterValue.value = synced;
      }
    },
    { deep: true },
  );

  onUnmounted(() => {
    if (timer) clearTimeout(timer);
  });

  return {
    isLoading,
    filterValue,
    facets,
    activeDifficulty,
    hasActiveFilters,
    onSmartFilterChange,
    selectDifficulty,
    handlePageChange,
    handlePerPageChange,
  };
}
