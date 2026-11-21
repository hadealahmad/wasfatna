<script setup lang="ts">
import { computed, toRef } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import SeoHead from '@/components/SeoHead.vue';
import AddRecipeButton from '@/components/recipes/AddRecipeButton.vue';
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

interface Props {
  recipes: {
    data: Recipe[];
    links: any[];
    meta: any;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  cities: FilterEntity[];
  tags: FilterEntity[];
  filters: RecipePageFilters;
}

const props = defineProps<Props>();

const {
  isLoading,
  filterValue,
  facets,
  activeDifficulty,
  onSmartFilterChange,
  selectDifficulty,
  handlePageChange,
  handlePerPageChange,
} = useRecipeFilterPage({
  routeName: 'recipes.index',
  cities: toRef(props, 'cities'),
  tags: toRef(props, 'tags'),
  filters: toRef(props, 'filters'),
});

const totalResults = computed(() => props.recipes.total ?? props.recipes.data.length);

const metaDescription = computed(() =>
  totalResults.value > 0
    ? `تصفح ${totalResults.value} وصفة سورية مجربة ومضمونة من مختلف المطابخ والمدن السورية، مع المكونات الدقيقة وخطوات التحضير الواضحة على منصة وصفاتنا.`
    : 'تصفح مئات الوصفات السورية المجربة والمضمونة من مختلف المطابخ والمدن السورية، مع المكونات الدقيقة وخطوات التحضير الواضحة على منصة وصفاتنا.',
);
</script>

<template>
  <PublicLayout>
    <SeoHead
      title="تصفح جميع الوصفات"
      :description="metaDescription"
      canonical="/recipes"
    />

    <div class="container max-w-7xl mx-auto py-10 md:py-14 px-4 md:px-8">
      <!-- Header -->
      <div class="flex flex-col items-center gap-3 text-center mb-8 md:mb-10">
        <div class="inline-flex items-center justify-center rounded-2xl border border-border/70 bg-card p-3 shadow-2xs">
          <ProjectIcon name="recipes" class="h-10 w-10" />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          جميع الوصفات
        </h1>
        <p class="text-muted-foreground text-base sm:text-lg max-w-2xl">
          تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية
        </p>
        <div class="pt-1">
          <AddRecipeButton size="sm" variant="outline">أضف وصفتك</AddRecipeButton>
        </div>
      </div>

      <!-- Smart Filter Search + Quick Difficulty Chips -->
      <div class="mb-10 max-w-4xl mx-auto space-y-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
        <SmartFilterSearch
          :facets="facets"
          :model-value="filterValue"
          :result-count="totalResults"
          result-label="وصفة"
          :loading="isLoading"
          mobile-filters-scroll
          placeholder="ابحث عن وصفة أو مكون، أو اكتب المدينة: / الوسم: / الصعوبة:"
          aria-label="تصفية الوصفات"
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

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Skeleton v-for="i in 8" :key="i" class="h-64 rounded-xl" />
      </div>

      <!-- Results -->
      <RecipeGrid
        v-else
        :recipes="recipes.data"
        empty-message="لم يتم العثور على وصفات تطابق معايير البحث."
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
