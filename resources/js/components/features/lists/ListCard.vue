<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Badge from '@/components/ui/Badge.vue';
import Avatar from '@/components/ui/Avatar.vue';
import AvatarImage from '@/components/ui/AvatarImage.vue';
import AvatarFallback from '@/components/ui/AvatarFallback.vue';
import { Lock, Globe, AlertCircle, BookOpen } from 'lucide-vue-next';

interface Props {
    list: {
        id: number;
        name: string;
        slug: string;
        description?: string;
        is_public: boolean;
        status: string;
        recipes_count?: number;
        cover_image?: string;
        recipes?: Array<{ image_url?: string }>;
        user: {
            id: number;
            name: string;
            avatar?: string;
        };
    };
}

const props = defineProps<Props>();

const coverImage = props.list.cover_image || props.list.recipes?.[0]?.image_url;
</script>

<template>
    <Link :href="route('lists.show', { list: list.slug || list.id })">
        <Card class="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-pointer flex flex-col">
            <!-- Cover Image -->
            <div class="relative aspect-video bg-muted overflow-hidden">
                <img
                    v-if="coverImage"
                    :src="coverImage"
                    :alt="list.name"
                    loading="lazy"
                    decoding="async"
                    width="640"
                    height="360"
                    class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
                    <BookOpen class="w-12 h-12 text-primary/40" />
                </div>

                <!-- Status Badges -->
                <div class="absolute top-3 left-3 flex gap-1">
                    <Badge v-if="list.is_public && list.status === 'approved'" variant="secondary" class="bg-background/80 backdrop-blur-sm gap-1">
                        <Globe class="w-3 h-3 text-green-600" />
                        <span class="text-xs">عامة</span>
                    </Badge>
                    <Badge v-if="list.is_public && list.status === 'review'" variant="secondary" class="bg-yellow-100/90 text-yellow-800 gap-1">
                        <AlertCircle class="w-3 h-3" />
                        <span class="text-xs">قيد المراجعة</span>
                    </Badge>
                    <Badge v-if="!list.is_public" variant="secondary" class="bg-background/80 backdrop-blur-sm gap-1">
                        <Lock class="w-3 h-3 text-muted-foreground" />
                        <span class="text-xs">خاصة</span>
                    </Badge>
                </div>

                <!-- Recipe Count -->
                <div class="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                    {{ list.recipes_count || 0 }} وصفة
                </div>
            </div>

            <CardHeader class="pb-2">
                <h3 class="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {{ list.name }}
                </h3>
                <p v-if="list.description" class="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">
                    {{ list.description }}
                </p>
            </CardHeader>

            <CardContent class="mt-auto pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <div class="flex items-center gap-2">
                    <Avatar class="w-5 h-5">
                        <AvatarImage :src="list.user.avatar || ''" />
                        <AvatarFallback class="text-[10px]">{{ list.user.name.charAt(0) }}</AvatarFallback>
                    </Avatar>
                    <span class="truncate max-w-[120px]">{{ list.user.name }}</span>
                </div>
            </CardContent>
        </Card>
    </Link>
</template>
