<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import PaginationControls from '@/components/ui/PaginationControls.vue';

const props = defineProps<{
    profile: {
        id: number;
        name: string;
        avatar_url: string | null;
        recipes_count: number;
    };
    recipes: {
        data: any[];
        links: any[];
        meta: any;
    };
}>();
</script>

<template>
    <PublicLayout>
        <Head>
            <title>وصفات {{ profile.name }}</title>
            <meta name="description" :content="`اكتشف ${recipes.meta?.total || 0} وصفة شاركها ${profile.name} مع مجتمع وصفاتنا.`" />
            <meta property="og:title" :content="`وصفات ${profile.name} | وصفاتنا`" />
            <meta property="og:description" :content="`اكتشف ${recipes.meta?.total || 0} وصفة شاركها ${profile.name} مع مجتمع وصفاتنا.`" />
            <meta property="og:image" :content="profile.avatar_url || '/og-image.png'" />
        </Head>

        <div>
            <!-- Profile Header -->
            <section class="border-b bg-background py-16">
                <div class="container mx-auto px-4 md:px-6">
                    <div class="flex flex-col items-center text-center">
                        <Avatar class="w-24 h-24 border mb-4">
                            <AvatarImage :src="profile.avatar_url || undefined" />
                            <AvatarFallback class="text-3xl bg-primary/10 text-primary uppercase">
                                {{ profile.name.charAt(0) }}
                            </AvatarFallback>
                        </Avatar>
                        <h1 class="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{{ profile.name }}</h1>
                        <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                            {{ recipes.meta?.total || 0 }} وصفة
                        </div>
                    </div>
                </div>
            </section>

            <!-- User Recipes -->
            <section class="container mx-auto py-12 px-4 md:px-6">
                <h2 class="text-2xl font-bold mb-8">وصفات {{ profile.name }}</h2>
                
                <RecipeGrid
                    :recipes="recipes.data"
                    empty-message="لم يضف هذا المستخدم وصفات بعد"
                />

                <!-- Pagination -->
                <div v-if="recipes.meta?.last_page > 1" class="mt-12 flex justify-center gap-2">
                    <template v-for="(link, key) in recipes.meta.links" :key="key">
                        <component
                            :is="link.url ? 'Link' : 'span'"
                            :href="link.url"
                            v-if="link.url || link.label === '...'"
                            class="px-4 py-2 border rounded-md text-sm"
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
        </div>
    </PublicLayout>
</template>
