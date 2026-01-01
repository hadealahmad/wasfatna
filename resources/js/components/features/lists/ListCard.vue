<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardFooter from '@/components/ui/CardFooter.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import Badge from '@/components/ui/Badge.vue';
import { Lock, Globe, Image as ImageIcon } from 'lucide-vue-next';

interface List {
    id: number;
    name: string;
    slug: string | null;
    description: string | null;
    cover_image: string | null;
    is_default: boolean;
    is_public: boolean;
    status: string;
    recipes_count: number;
}

defineProps<{
    list: List;
    href: string;
}>();
</script>

<template>
    <Link :href="href">
        <Card class="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer group bg-card">
            <div class="aspect-video relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                <img
                    v-if="list.cover_image"
                    :src="list.cover_image"
                    :alt="list.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <ImageIcon v-else class="text-slate-300 dark:text-slate-600 h-10 w-10" />
                
                <div v-if="list.is_public" class="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white">
                    <Globe class="h-3 w-3" />
                </div>
                <div v-else class="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white">
                    <Lock class="h-3 w-3" />
                </div>
            </div>
            
            <CardHeader class="p-4 pb-2">
                <div class="flex justify-between items-start">
                    <CardTitle class="text-lg line-clamp-1">{{ list.name }}</CardTitle>
                    <Badge v-if="list.is_default" variant="secondary" class="text-xs">افتراضي</Badge>
                </div>
            </CardHeader>
            
            <CardContent class="p-4 py-2 text-sm text-muted-foreground min-h-[40px]">
                <p class="line-clamp-2">{{ list.description || 'لا يوجد وصف' }}</p>
            </CardContent>
            
            <CardFooter class="p-4 pt-2 text-xs text-muted-foreground flex justify-between">
                <span>{{ list.recipes_count }} وصفة</span>
                <span>
                    <Badge v-if="list.status === 'review'" variant="outline" class="text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-900">قيد المراجعة</Badge>
                    <Badge v-if="list.status === 'rejected'" variant="outline" class="text-red-600 border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-900">مرفوض</Badge>
                </span>
            </CardFooter>
        </Card>
    </Link>
</template>
