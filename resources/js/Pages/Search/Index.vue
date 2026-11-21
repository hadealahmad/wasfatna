<script setup lang="ts">
import { computed, toRef } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import SeoHead from '@/components/SeoHead.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import SmartFilterSearch from '@/components/search/SmartFilterSearch.vue';
import {
  DIFFICULTY_OPTIONS,
  useRecipeFilterPage,
  type FilterEntity,
  type RecipePageFilters,
} from '@/components/search/useRecipeFilterPage';
import { FilterChip, Skeleton } from '@/components/ui';
import PaginationControls from '@/components/ui/PaginationControls.vue';

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

const props = defineProps<{
  recipes: {
    data: Recipe[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
  cities: FilterEntity[];
  tags: FilterEntity[];
  filters: RecipePageFilters;
}>();

const {
  isLoading,
  filterValue,
  facets,
  activeDifficulty,
  hasActiveFilters,
  onSmartFilterChange,
  selectDifficulty,
  handlePageChange,
  handlePerPageChange,
} = useRecipeFilterPage({
  routeName: 'search.index',
  cities: toRef(props, 'cities'),
  tags: toRef(props, 'tags'),
  filters: toRef(props, 'filters'),
});

const totalResults = computed(() => props.recipes.total ?? props.recipes.data.length);
</script>

<template>
  <PublicLayout>
    <SeoHead
      title="نتائج البحث"
      description="ابحث في مكتبة وصفاتنا عن أشهى الأكلات السورية حسب اسم الطبق أو المكونات المتوفرة أو المدينة والوسم ومستوى الصعوبة بسرعة وسهولة."
      canonical="/search"
      noindex
    />

    <div class="container max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-8">
      <div class="flex items-start gap-3 mb-6">
        <div class="inline-flex items-center justify-center rounded-xl border border-border/70 bg-card p-2.5 shadow-2xs shrink-0">
          <ProjectIcon name="search" class="h-8 w-8" />
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">نتائج البحث</h1>
          <p class="text-sm text-muted-foreground mt-0.5">
            ابحث بالاسم أو المكون أو صفّ حسب المدينة والوسم ومستوى الصعوبة
          </p>
        </div>
      </div>

      <!-- Smart Filter Search + Quick Difficulty Chips -->
      <div class="mb-8 space-y-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
        <SmartFilterSearch
          :facets="facets"
          :model-value="filterValue"
          :result-count="totalResults"
          result-label="وصفة"
          :loading="isLoading"
          mobile-filters-scroll
          placeholder="ابحث عن وصفة أو مكون، أو اكتب المدينة: / الوسم: / الصعوبة:"
          aria-label="البحث والتصفية في الوصفات"
          @update:model-value="onSmartFilterChange"
        />

        <div
          role="group"
          aria-label="تصفية سريعة حسب مستوى الصعوبة"
          class="flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <span class="shrink-0 text-xs font-medium text-muted-foreground me-1">الصعوبة:</span>
          <FilterChip
            :active="!activeDifficulty"
            @click="selectDifficulty('')"
          >
            كل المستويات
          </FilterChip>
          <FilterChip
            v-for="level in DIFFICULTY_OPTIONS"
            :key="level.value"
            :active="activeDifficulty === level.value"
            @click="selectDifficulty(level.value)"
          >
            {{ level.label }}
          </FilterChip>
        </div>
      </div>

      <!-- Results Count -->
      <p v-if="!isLoading" class="text-muted-foreground mb-6 tabular-nums">
        <template v-if="totalResults > 0">
          عثرنا على {{ totalResults }} وصفة
        </template>
        <template v-else-if="hasActiveFilters">
          لم نجد نتائج مطابقة
        </template>
        <template v-else>
          ابدأ البحث للعثور على وصفات
        </template>
      </p>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Skeleton v-for="i in 8" :key="i" class="h-64 rounded-xl" />
      </div>

      <!-- Results -->
      <RecipeGrid
        v-else
        :recipes="recipes.data"
        empty-message="جرب البحث بكلمات مختلفة"
      />

      <!-- Pagination -->
      <PaginationControls
        v-if="recipes.last_page > 1"
        :current-page="recipes.current_page"
        :total-pages="recipes.last_page"
        :per-page="recipes.per_page"
        :total-items="recipes.total"
        class-name="mt-12"
        @page-change="handlePageChange"
        @per-page-change="handlePerPageChange"
      />
    </div>
  </PublicLayout>
</template>
