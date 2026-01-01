<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { DashboardStats } from '@/types';

// We can define the props directly or use the shared types
defineProps<{
    stats: DashboardStats;
}>();

const page = usePage();
const isAdmin = computed(() => page.props.auth?.user?.role === 'admin');
</script>

<template>
    <Head title="نظرة عامة" />

    <DashboardLayout>
        <div class="space-y-6">
            <h2 class="text-2xl font-bold tracking-tight">نظرة عامة</h2>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader class="pb-2">
                        <CardTitle class="text-sm text-muted-foreground">إجمالي الوصفات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="text-3xl font-bold">{{ stats.total_recipes }}</div>
                    </CardContent>
                </Card>

                <Card :class="stats.pending_recipes > 0 ? 'border-amber-200 bg-amber-50/50' : ''">
                    <CardHeader class="pb-2">
                        <CardTitle class="text-sm text-muted-foreground">بانتظار الموافقة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="text-3xl font-bold text-amber-600">{{ stats.pending_recipes }}</div>
                    </CardContent>
                </Card>

                <Card :class="stats.needs_reapproval > 0 ? 'border-orange-200 bg-orange-50/50' : ''">
                    <CardHeader class="pb-2">
                        <CardTitle class="text-sm text-muted-foreground">تحتاج إعادة موافقة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="text-3xl font-bold text-orange-600">{{ stats.needs_reapproval }}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class="pb-2">
                        <CardTitle class="text-sm text-muted-foreground">منشورة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="text-3xl font-bold text-green-600">{{ stats.approved_recipes }}</div>
                    </CardContent>
                </Card>

                <template v-if="isAdmin">
                    <Card>
                        <CardHeader class="pb-2">
                            <CardTitle class="text-sm text-muted-foreground">المستخدمين</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="text-3xl font-bold">{{ stats.total_users }}</div>
                        </CardContent>
                    </Card>
                    
                    <Card :class="stats.deletion_requests > 0 ? 'border-red-200 bg-red-50/50' : ''">
                        <CardHeader class="pb-2">
                            <CardTitle class="text-sm text-muted-foreground">طلبات الحذف</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="text-3xl font-bold text-red-600">{{ stats.deletion_requests }}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader class="pb-2">
                            <CardTitle class="text-sm text-muted-foreground">المدن</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="text-3xl font-bold">{{ stats.total_cities }}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader class="pb-2">
                            <CardTitle class="text-sm text-muted-foreground">المكونات</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="text-3xl font-bold">{{ stats.total_ingredients }}</div>
                        </CardContent>
                    </Card>
                </template>
            </div>
        </div>
    </DashboardLayout>
</template>
