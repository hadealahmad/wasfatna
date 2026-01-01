<script setup lang="ts">
import { Link, Head } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { MapPin } from 'lucide-vue-next';

defineProps<{
    cities: any[];
}>();
</script>

<template>
  <PublicLayout>
    <Head>
      <title>المدن والمناطق</title>
      <meta name="description" content="استكشف المطبخ المحلي لكل مدينة سورية وتعرف على أشهر أطباقها. تصفح الوصفات حسب المنطقة." />
      <meta property="og:title" content="المدن والمناطق | وصفاتنا" />
      <meta property="og:description" content="استكشف المطبخ المحلي لكل مدينة وتعرف على أشهر أطباقها." />
    </Head>
    
    <div class="container mx-auto py-12 md:py-24 px-4 md:px-6">
      <div class="flex flex-col items-center gap-4 text-center mb-10">
        <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          المدن والمناطق
        </h1>
        <p class="text-muted-foreground text-lg max-w-[800px]">
          استكشف المطبخ المحلي لكل مدينة وتعرف على أشهر أطباقها
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="cities.length === 0" class="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20">
        <MapPin class="w-16 h-16 mb-4 text-muted-foreground/30" />
        <p class="text-xl font-medium text-muted-foreground">لا توجد مدن مسجلة بعد</p>
      </div>

      <!-- Cities Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Link 
          v-for="city in cities" 
          :key="city.id" 
          :href="route('cities.show', city.slug)"
          class="group flex flex-col items-center justify-center p-8 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50"
        >
          <div class="h-16 w-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
            <MapPin class="w-8 h-8" />
          </div>
          <h2 class="text-xl font-semibold mb-2">{{ city.name }}</h2>
          <p class="text-sm text-muted-foreground">{{ city.recipes_count || 0 }} وصفة</p>
        </Link>
      </div>
    </div>
  </PublicLayout>
</template>

