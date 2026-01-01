<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardContent from '@/components/ui/CardContent.vue';
import { MessageSquare, AlertCircle, ExternalLink } from 'lucide-vue-next';

defineProps<{
    reports: {
        data: any[];
        links: any[];
        meta: any;
    };
}>();

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'fixed': return 'default'; // Using default (primary) for success? Or maybe create a custom class.
        // Shadcn badge variants: default, secondary, destructive, outline.
        case 'rejected': return 'destructive';
        default: return 'secondary';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'fixed': return 'تم الحل';
        case 'rejected': return 'مرفوض';
        default: return 'قيد المراجعة';
    }
};

const getTypeLabel = (type: string) => {
    return type === 'content_issue' ? 'بلاغ عن محتوى' : 'تعليق / اقتراح';
};

const getReportableLink = (report: any) => {
    if (!report.reportable) return null;
    
    const type = report.reportable_type.includes('Recipe') ? 'recipes' : 'lists';
    // Ensure slug or id is used correctly. 
    // If backend route requires 'recipe' param as slug, pass it.
    return route(`${type}.show`, report.reportable.slug || report.reportable.id);
};
</script>

<template>
    <PublicLayout>
        <Head title="بلاغاتي" />
        
        <div class="container mx-auto py-8 px-4 md:px-6">
            <h1 class="text-3xl font-bold mb-8">بلاغاتي</h1>

            <div v-if="reports.data.length === 0" class="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
                <MessageSquare class="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 class="text-xl font-medium mb-2">لا توجد بلاغات</h3>
                <p class="text-muted-foreground">لم تقم بإرسال أي بلاغات أو ملاحظات بعد.</p>
            </div>

            <div v-else class="space-y-6">
                <Card v-for="report in reports.data" :key="report.id">
                    <CardHeader>
                         <div class="flex justify-between items-start">
                            <div class="space-y-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <Badge :variant="getStatusBadgeVariant(report.status)" :class="{'bg-green-500 hover:bg-green-600 border-transparent text-primary-foreground': report.status === 'fixed'}">
                                        {{ getStatusLabel(report.status) }}
                                    </Badge>
                                    <Badge variant="outline">{{ getTypeLabel(report.type) }}</Badge>
                                </div>
                                <CardTitle class="text-base">
                                    <span v-if="report.reportable">
                                        بخصوص: 
                                        <Link :href="getReportableLink(report)" class="text-primary hover:underline inline-flex items-center gap-1" v-if="getReportableLink(report)">
                                            {{ report.reportable.name }}
                                            <ExternalLink class="w-3 h-3" />
                                        </Link>
                                        <span v-else class="text-muted-foreground">محتوى غير متاح</span>
                                    </span>
                                    <span v-else class="text-muted-foreground">بخصوص: محتوى محذوف</span>
                                </CardTitle>
                                <CardDescription>
                                    {{ new Date(report.created_at).toLocaleDateString('ar-SY') }}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="bg-muted/50 p-4 rounded-md text-sm">
                            {{ report.message }}
                        </div>

                        <div v-if="report.admin_reply" class="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-100 dark:border-blue-900">
                            <h4 class="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
                                <AlertCircle class="w-4 h-4" />
                                رد الإدارة
                            </h4>
                            <p class="text-sm text-blue-900 dark:text-blue-200">
                                {{ report.admin_reply }}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Pagination -->
             <div v-if="reports.meta?.last_page > 1" class="mt-8 flex justify-center gap-2">
                 <template v-for="(link, key) in reports.meta.links" :key="key">
                    <component
                        :is="link.url ? 'Link' : 'span'"
                        :href="link.url"
                        v-if="link.url || link.label === '...'"
                        class="px-3 py-1 border rounded-md text-sm transition-colors"
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
