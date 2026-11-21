<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { BookOpen, User } from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { formatPaginationLabel } from '@/lib/utils';

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
      <meta head-key="description" name="description" content="استكشف قوائم الوصفات التي شاركها مجتمعنا. من قوائم العزائم إلى قوائم الحلويات السهلة." />
      <meta head-key="og:title" property="og:title" content="قوائم الوصفات العامة | وصفاتنا" />
      <meta head-key="og:description" property="og:description" content="استكشف قوائم الوصفات التي شاركها مجتمعنا. من قوائم العزائم إلى قوائم الحلويات السهلة." />
      <meta head-key="og:image" property="og:image" content="https://food.syrian.zone/og-image.webp" />
      <meta head-key="twitter:title" name="twitter:title" content="قوائم الوصفات العامة | وصفاتنا" />
      <meta head-key="twitter:description" name="twitter:description" content="استكشف قوائم الوصفات التي شاركها مجتمعنا. من قوائم العزائم إلى قوائم الحلويات السهلة." />
      <meta head-key="twitter:image" name="twitter:image" content="https://food.syrian.zone/og-image.webp" />
    </Head>

    <div class="container max-w-7xl mx-auto py-10 md:py-14 px-4 md:px-8">
      <!-- Header -->
      <div class="flex flex-col items-center gap-3 text-center mb-10">
        <div class="inline-flex items-center justify-center rounded-2xl border border-border/70 bg-card p-3 shadow-2xs">
          <ProjectIcon name="lists" class="h-10 w-10" />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          قوائم الوصفات العامة
        </h1>
        <p class="text-muted-foreground text-base sm:text-lg max-w-2xl">
          تشكيلات منتقاة من الوصفات شاركها مجتمع وصفاتنا لكل مناسبة وموسم
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-if="lists.data.length === 0"
        class="flex flex-col items-center justify-center py-16 px-4 text-center space-y-5 border-2 border-dashed rounded-2xl bg-muted/20"
      >
        <ProjectIcon name="lists" class="w-14 h-14 opacity-85" />
        <div class="max-w-md space-y-2">
          <h2 class="text-2xl font-bold text-foreground">لا توجد قوائم عامة بعد</h2>
          <p class="text-sm sm:text-base text-muted-foreground">
            كن أول من يشارك قوائمه! تصفح الوصفات، اضغط على زر الحفظ، وأنشئ قائمة جديدة لمشاركتها مع الجميع.
          </p>
        </div>
        <Button as-child size="lg" class="rounded-full">
          <Link href="/recipes">تصفح الوصفات</Link>
        </Button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          v-for="(list, index) in lists.data"
          :key="list.id"
          :href="route('lists.show', list.id)"
          prefetch
          class="block group h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card class="h-full overflow-hidden hover:shadow-md hover:border-primary/40 transition-[box-shadow,border-color] flex flex-col">
            <div class="aspect-video relative overflow-hidden bg-muted shrink-0">
              <img
                v-if="list.cover_image"
                :src="list.cover_image"
                :alt="list.name"
                :loading="index < 4 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : undefined"
                :decoding="index === 0 ? undefined : 'async'"
                width="640"
                height="360"
                class="w-full h-full object-cover motion-safe:group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-accent">
                <BookOpen class="w-10 h-10 text-muted-foreground/35" aria-hidden="true" />
              </div>
            </div>

            <CardHeader class="p-4 pb-2">
              <CardTitle class="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {{ list.name }}
              </CardTitle>
            </CardHeader>

            <CardContent class="p-4 py-2 text-sm text-muted-foreground flex-1">
              <div class="flex items-center gap-1.5 mb-2">
                <User class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span class="truncate">{{ list.user?.display_name || list.user?.name }}</span>
              </div>
              <p class="line-clamp-2 leading-relaxed">{{ list.description || 'لا يوجد وصف' }}</p>
            </CardContent>

            <CardFooter class="p-4 pt-2 border-t border-border/50">
              <Badge variant="secondary" class="tabular-nums">{{ list.recipes_count || 0 }} وصفة</Badge>
            </CardFooter>
          </Card>
        </Link>
      </div>

      <!-- Pagination -->
      <div v-if="lists.meta?.last_page > 1" class="mt-10 flex flex-wrap justify-center gap-2">
        <template v-for="(link, key) in lists.meta.links" :key="key">
          <component
            :is="link.url ? Link : 'span'"
            :href="link.url"
            v-if="link.url || link.label === '...'"
            class="px-3 py-1.5 border rounded-md text-sm transition-colors"
            :class="{
              'bg-primary text-primary-foreground border-primary': link.active,
              'bg-background hover:bg-muted': !link.active && link.url,
              'opacity-50 cursor-default': !link.url,
            }"
          >
            {{ formatPaginationLabel(link.label) }}
          </component>
        </template>
      </div>
    </div>
  </PublicLayout>
</template>
