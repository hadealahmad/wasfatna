<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import { Badge, Button } from '@/components/ui';
import { MapPin } from 'lucide-vue-next';

interface City {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

defineProps<{
    city: City;
    recipes: {
        data: any[];
        links: any[];
        meta: any;
    };
}>();
</script>

<template>
  <PublicLayout>
    <Head :title="`وصفات ${city.name}`" />
    
    <!-- Hero Section -->
    <section class="border-b bg-background py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-6 text-center">
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 text-primary">
          <MapPin class="w-10 h-10" />
        </div>
        <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          وصفات {{ city.name }}
        </h1>
        <p v-if="city.description" class="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-4">
          {{ city.description }}
        </p>
        <Badge variant="outline" class="text-sm">
          {{ recipes.meta?.total || recipes.data.length }} وصفة
        </Badge>
      </div>
    </section>

    <!-- Recipes Grid -->
    <section class="container mx-auto py-12 px-4 md:px-6">
      <RecipeGrid 
        :recipes="recipes.data" 
        :empty-message="`لا توجد وصفات من ${city.name} بعد`"
      />

      <!-- Pagination -->
      <div v-if="recipes.meta?.last_page > 1" class="mt-12 flex justify-center gap-2">
        <template v-for="(link, key) in recipes.meta.links" :key="key">
          <component
            :is="link.url ? 'Link' : 'span'"
            :href="link.url"
            v-if="link.url || link.label === '...'"
            class="px-3 py-1 border rounded-md text-sm"
            :class="{ 
              'bg-primary text-primary-foreground': link.active,
              'bg-background hover:bg-muted': !link.active && link.url,
              'opacity-50 cursor-default': !link.url 
            }"
            v-html="link.label" 
          />
        </template>
      </div>
    </section>
  </PublicLayout>
</template>
