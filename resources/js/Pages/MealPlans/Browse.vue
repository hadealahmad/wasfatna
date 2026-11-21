<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { CalendarDays, Plus, Utensils } from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Card, CardContent } from '@/components/ui';
import PaginationControls from '@/components/ui/PaginationControls.vue';
import { formatDate } from '@/lib/utils';

interface MealPlanItem {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  share_token: string;
  days_count: number;
  entries_count: number;
  user: {
    id: number;
    display_name: string;
    avatar_url: string | null;
  } | null;
}

defineProps<{
  plans: {
    data: MealPlanItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}>();

function handlePageChange(page: number) {
  router.get(route('meal-plans.browse'), { page }, { preserveState: true, preserveScroll: false });
}

function handlePerPageChange(perPage: number) {
  router.get(route('meal-plans.browse'), { per_page: perPage, page: 1 }, { preserveState: true, preserveScroll: false });
}
</script>

<template>
  <PublicLayout>
    <Head>
      <title>تصفح خطط الوجبات</title>
      <meta head-key="description" name="description" content="تصفح خطط الوجبات المشاركة من مجتمع وصفاتنا. اكتشف أفكار وجبات أسبوعية وخطط رمضانية من مستخدمين آخرين." />
      <meta head-key="og:title" property="og:title" content="تصفح خطط الوجبات | وصفاتنا" />
      <meta head-key="og:description" property="og:description" content="تصفح خطط الوجبات المشاركة من مجتمع وصفاتنا. اكتشف أفكار وجبات أسبوعية وخطط رمضانية من مستخدمين آخرين." />
      <meta head-key="og:image" property="og:image" content="https://food.syrian.zone/og-image.webp" />
      <meta head-key="twitter:title" name="twitter:title" content="تصفح خطط الوجبات | وصفاتنا" />
      <meta head-key="twitter:description" name="twitter:description" content="تصفح خطط الوجبات المشاركة من مجتمع وصفاتنا. اكتشف أفكار وجبات أسبوعية وخطط رمضانية من مستخدمين آخرين." />
      <meta head-key="twitter:image" name="twitter:image" content="https://food.syrian.zone/og-image.webp" />
    </Head>

    <div class="container max-w-7xl mx-auto py-10 md:py-14 px-4 md:px-8">
      <!-- Header -->
      <div class="flex flex-col items-center gap-3 text-center mb-10">
        <div class="inline-flex items-center justify-center rounded-2xl border border-border/70 bg-card p-3 shadow-2xs">
          <ProjectIcon name="meal_plans" class="h-10 w-10" />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          خطط الوجبات
        </h1>
        <p class="text-muted-foreground text-base sm:text-lg max-w-2xl">
          اكتشف خطط وجبات مشاركة من مجتمعنا واستلهم أفكاراً لوجباتك الأسبوعية والموسمية
        </p>
        <div class="pt-1">
          <Button as-child variant="outline" size="sm" class="gap-1.5">
            <Link href="/my/meal-plans/create">
              <Plus class="h-4 w-4" aria-hidden="true" />
              <span>أنشئ خطتك الخاصة</span>
            </Link>
          </Button>
        </div>
      </div>

      <!-- Plans Grid -->
      <div v-if="plans.data.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          v-for="plan in plans.data"
          :key="plan.id"
          :href="route('meal-plans.shared', plan.share_token)"
          prefetch
          class="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card class="h-full hover:shadow-md transition-[box-shadow,border-color] hover:border-primary/50 cursor-pointer">
            <CardContent class="p-5 flex flex-col h-full justify-between gap-4">
              <div class="space-y-3">
                <div>
                  <h2 class="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {{ plan.name }}
                  </h2>
                  <p v-if="plan.description" class="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {{ plan.description }}
                  </p>
                </div>

                <!-- Meta -->
                <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" class="gap-1 tabular-nums">
                    <CalendarDays class="w-3 h-3" aria-hidden="true" />
                    {{ plan.days_count }} يوم
                  </Badge>
                  <Badge variant="outline" class="gap-1 tabular-nums">
                    <Utensils class="w-3 h-3" aria-hidden="true" />
                    {{ plan.entries_count }} وجبة
                  </Badge>
                </div>

                <!-- Date Range -->
                <p class="text-xs text-muted-foreground tabular-nums">
                  {{ formatDate(plan.start_date) }} - {{ formatDate(plan.end_date) }}
                </p>
              </div>

              <!-- Author -->
              <div v-if="plan.user" class="flex items-center gap-2 pt-3 border-t border-border/60">
                <Avatar class="w-6 h-6">
                  <AvatarImage :src="plan.user.avatar_url || undefined" :alt="plan.user.display_name" width="24" height="24" />
                  <AvatarFallback class="text-xs">{{ plan.user.display_name.charAt(0) }}</AvatarFallback>
                </Avatar>
                <span class="text-sm text-muted-foreground truncate">{{ plan.user.display_name }}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center gap-3 text-center py-16 px-4 rounded-2xl border-2 border-dashed border-border bg-muted/20"
      >
        <ProjectIcon name="meal_plans" class="w-14 h-14 opacity-85" />
        <h2 class="text-xl font-bold text-foreground">لا توجد خطط عامة بعد</h2>
        <p class="text-sm sm:text-base text-muted-foreground max-w-md">
          كن أول من ينظم وجباته ويشارك خطته مع مجتمع وصفاتنا.
        </p>
        <Button as-child class="mt-2 gap-1.5">
          <Link href="/my/meal-plans/create">
            <Plus class="h-4 w-4" aria-hidden="true" />
            <span>إنشاء خطة وجبات</span>
          </Link>
        </Button>
      </div>

      <!-- Pagination -->
      <PaginationControls
        v-if="plans.last_page > 1"
        :current-page="plans.current_page"
        :total-pages="plans.last_page"
        :per-page="plans.per_page"
        :total-items="plans.total"
        class-name="mt-10"
        @page-change="handlePageChange"
        @per-page-change="handlePerPageChange"
      />
    </div>
  </PublicLayout>
</template>
