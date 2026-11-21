<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ChevronLeft } from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import RecipeForm from '@/components/recipes/RecipeForm.vue';

defineProps<{
  cities: any[];
  tags?: any[];
  users?: any[];
}>();
</script>

<template>
  <PublicLayout>
    <Head title="إضافة وصفة جديدة" />

    <div class="container mx-auto py-8 max-w-4xl px-4 md:px-6">
      <nav aria-label="مسار التصفح" class="flex items-center gap-1.5 mb-6 text-sm text-muted-foreground">
        <Link :href="route('recipes.index')" class="hover:text-primary transition-colors">الوصفات</Link>
        <ChevronLeft class="w-4 h-4 shrink-0" aria-hidden="true" />
        <span class="text-foreground font-medium">إضافة وصفة جديدة</span>
      </nav>

      <div class="flex items-center gap-3 mb-8">
        <div class="inline-flex items-center justify-center rounded-xl border border-border/70 bg-card p-2.5 shadow-2xs">
          <ProjectIcon name="add_recipe" class="h-8 w-8" />
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">شارك وصفتك</h1>
          <p class="text-sm text-muted-foreground mt-0.5">
            أضف المكونات وخطوات التحضير ليتمكن المجتمع من تجربتها
          </p>
        </div>
      </div>

      <RecipeForm
        :cities="cities"
        :tags="tags"
        :users="users"
      />
    </div>
  </PublicLayout>
</template>
