<script setup lang="ts">
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { MapPin } from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import SeoHead from '@/components/SeoHead.vue';
import { Button } from '@/components/ui';

const props = defineProps<{
  cities: any[];
}>();

const metaDescription = computed(
  () =>
    `استكشف المطبخ المحلي لكل مدينة ومحافظة سورية وتعرّف على أشهر أطباقها التراثية والبيتية. تصفح ${props.cities.length} مدينة ومنطقة على منصة وصفاتنا.`,
);
</script>

<template>
  <PublicLayout>
    <SeoHead
      title="المدن والمناطق"
      :description="metaDescription"
      canonical="/cities"
    />

    <div class="container max-w-7xl mx-auto py-10 md:py-16 px-4 md:px-8">
      <div class="flex flex-col items-center gap-3 text-center mb-10">
        <div class="inline-flex items-center justify-center rounded-2xl border border-border/70 bg-card p-3 shadow-2xs">
          <ProjectIcon name="cities" class="h-10 w-10" />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          المدن والمناطق
        </h1>
        <p class="text-muted-foreground text-base sm:text-lg max-w-2xl">
          استكشف المطبخ المحلي لكل مدينة سورية وتعرّف على أشهر أطباقها التراثية
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-if="cities.length === 0"
        class="flex flex-col items-center justify-center gap-3 py-20 px-4 text-center border-2 border-dashed rounded-2xl bg-muted/20"
      >
        <ProjectIcon name="cities" class="w-14 h-14 opacity-80" />
        <p class="text-xl font-semibold text-foreground">لا توجد مدن مسجلة بعد</p>
        <p class="text-sm text-muted-foreground max-w-md">تصفح جميع الوصفات المتاحة حالياً في مكتبة وصفاتنا.</p>
        <Button as-child variant="outline" class="mt-2">
          <Link href="/recipes">تصفح الوصفات</Link>
        </Button>
      </div>

      <!-- Cities Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <Link
          v-for="city in cities"
          :key="city.id"
          :href="route('cities.show', city.slug)"
          prefetch
          class="group flex flex-col items-center justify-center p-7 rounded-xl border border-border/80 bg-card text-card-foreground shadow-2xs transition-[box-shadow,border-color,transform] hover:shadow-md hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div class="h-14 w-14 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
            <MapPin class="w-7 h-7" aria-hidden="true" />
          </div>
          <h2 class="text-xl font-bold mb-1.5 group-hover:text-primary transition-colors">{{ city.name }}</h2>
          <p class="text-sm text-muted-foreground tabular-nums">{{ city.recipes_count || 0 }} وصفة</p>
        </Link>
      </div>
    </div>
  </PublicLayout>
</template>
