<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { Card, CardContent, Badge, Avatar, AvatarImage, AvatarFallback, Button } from '@/components/ui';
import PaginationControls from '@/components/ui/PaginationControls.vue';
import { CalendarDays, Utensils } from 'lucide-vue-next';
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

const props = defineProps<{
    plans: {
        data: MealPlanItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}>();
</script>

<template>
    <PublicLayout>
        <Head>
            <title>تصفح خطط الوجبات</title>
            <meta name="description" content="تصفح خطط الوجبات المشاركة من مجتمع وصفاتنا. اكتشف أفكار وجبات أسبوعية وخطط رمضانية من مستخدمين آخرين." />
        </Head>

        <div class="container mx-auto py-12 px-4 md:px-6">
            <!-- Header -->
            <div class="flex flex-col items-center gap-4 text-center mb-10">
                <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    خطط الوجبات
                </h1>
                <p class="text-muted-foreground text-lg max-w-[600px]">
                    اكتشف خطط وجبات مشاركة من مجتمعنا واستلهم أفكار لوجباتك القادمة
                </p>
            </div>

            <!-- Plans Grid -->
            <div v-if="plans.data.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                    v-for="plan in plans.data"
                    :key="plan.id"
                    :href="route('meal-plans.shared', plan.share_token)"
                >
                    <Card class="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer">
                        <CardContent class="p-5 space-y-4">
                            <!-- Title & Description -->
                            <div>
                                <h3 class="font-bold text-lg line-clamp-1">{{ plan.name }}</h3>
                                <p v-if="plan.description" class="text-sm text-muted-foreground line-clamp-2 mt-1">{{ plan.description }}</p>
                            </div>

                            <!-- Meta -->
                            <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="secondary" class="gap-1">
                                    <CalendarDays class="w-3 h-3" />
                                    {{ plan.days_count }} يوم
                                </Badge>
                                <Badge variant="outline" class="gap-1">
                                    <Utensils class="w-3 h-3" />
                                    {{ plan.entries_count }} وجبة
                                </Badge>
                            </div>

                            <!-- Date Range -->
                            <p class="text-xs text-muted-foreground">
                                {{ formatDate(plan.start_date) }} - {{ formatDate(plan.end_date) }}
                            </p>

                            <!-- Author -->
                            <div v-if="plan.user" class="flex items-center gap-2 pt-2 border-t">
                                <Avatar class="w-6 h-6">
                                    <AvatarImage :src="plan.user.avatar_url || undefined" />
                                    <AvatarFallback class="text-xs">{{ plan.user.display_name.charAt(0) }}</AvatarFallback>
                                </Avatar>
                                <span class="text-sm text-muted-foreground">{{ plan.user.display_name }}</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-20">
                <CalendarDays class="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 class="text-lg font-semibold mb-2">لا توجد خطط عامة بعد</h3>
                <p class="text-muted-foreground mb-6">كن أول من يشارك خطة وجباته مع المجتمع</p>
            </div>

            <!-- Pagination -->
            <PaginationControls
                v-if="plans.last_page > 1"
                :current-page="plans.current_page"
                :total-pages="plans.last_page"
                :per-page="plans.per_page"
                :total-items="plans.total"
                class-name="mt-12"
            />
        </div>
    </PublicLayout>
</template>
