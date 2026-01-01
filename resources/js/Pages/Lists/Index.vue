<script setup lang="ts">
import { Link, Head } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, Badge, Button } from '@/components/ui';
import { Heart, User } from 'lucide-vue-next';

defineProps<{
    lists: {
        data: any[];
        links: any[];
        meta: any;
    };
}>();
</script>

<template>
  <PublicLayout>
    <Head>
      <title>قوائم الوصفات العامة</title>
      <meta name="description" content="استكشف قوائم الوصفات التي شاركها مجتمعنا. من قوائم العزائم إلى قوائم الحلويات السهلة." />
      <meta property="og:title" content="قوائم الوصفات العامة | وصفاتنا" />
    </Head>
    
    <div class="container mx-auto py-8 px-4 md:px-6">
      <h1 class="text-3xl font-bold mb-8">قوائم الوصفات العامة</h1>

      <!-- Empty State -->
      <div v-if="lists.data.length === 0" class="flex flex-col items-center justify-center py-16 text-center space-y-6 border-2 border-dashed rounded-3xl bg-muted/20">
        <div class="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
          <Heart class="w-12 h-12 text-red-500 fill-red-500" />
        </div>
        <div class="max-w-md space-y-2">
          <h2 class="text-2xl font-bold">لا توجد قوائم عامة بعد</h2>
          <p class="text-muted-foreground">
            كن أول من يشارك قوائمه! تصفح الوصفات، اضغط على زر القلب ❤️، وأنشئ قائمة جديدة لمشاركتها مع الجميع.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" class="rounded-full">تصفح الوصفات</Button>
        </Link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            v-for="list in lists.data" 
            :key="list.id" 
            :href="route('lists.show', list.id)"
            class="block group h-full"
          >
              <Card class="h-full overflow-hidden hover:shadow-md transition-shadow">
                    <div class="aspect-video relative overflow-hidden bg-muted">
                        <img 
                            v-if="list.cover_image" 
                            :src="list.cover_image" 
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
                            <span class="text-4xl text-muted-foreground/20 font-bold">{{ list.name.charAt(0) }}</span>
                        </div>
                    </div>
                    
                    <CardHeader class="p-4 pb-2">
                        <CardTitle class="line-clamp-1 group-hover:text-primary transition-colors">{{ list.name }}</CardTitle>
                    </CardHeader>
                    
                    <CardContent class="p-4 py-2 text-sm text-muted-foreground">
                        <div class="flex items-center gap-2 mb-2">
                            <User class="w-3 h-3" />
                            <span>{{ list.user?.display_name || list.user?.name }}</span>
                        </div>
                        <p class="line-clamp-2">{{ list.description || 'لا يوجد وصف' }}</p>
                    </CardContent>
                    
                    <CardFooter class="p-4 pt-2">
                        <Badge variant="secondary">{{ list.recipes_count || 0 }} وصفة</Badge>
                    </CardFooter>
              </Card>
          </Link>
      </div>

      <!-- Pagination -->
      <div v-if="lists.meta?.last_page > 1" class="mt-12 flex justify-center gap-2">
        <template v-for="(link, key) in lists.meta.links" :key="key">
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
    </div>
  </PublicLayout>
</template>
