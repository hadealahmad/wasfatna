<script setup lang="ts">
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import SeoHead from '@/components/SeoHead.vue';
import { Avatar, AvatarFallback, AvatarImage, Badge } from '@/components/ui';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import { buildBreadcrumbSchema, resolveCanonicalUrl } from '@/lib/seo';
import { formatPaginationLabel } from '@/lib/utils';

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

const userCanonicalPath = computed(() => `/users/${props.profile.id}`);

const userDescription = computed(() => {
    const count = props.profile.recipes_count ?? props.recipes.meta?.total ?? 0;
    return `تصفح الملف الشخصي للطاهي ${props.profile.name} على منصة وصفاتنا، واكتشف ${count} وصفة سورية بيتية معتمدة ومجربة بمكوناتها الدقيقة وخطوات تحضيرها.`;
});

const userJsonLd = computed(() => [
    {
        key: 'jsonld-profile',
        data: {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            url: resolveCanonicalUrl(userCanonicalPath.value),
            inLanguage: 'ar-SY',
            mainEntity: {
                '@type': 'Person',
                name: props.profile.name,
                url: resolveCanonicalUrl(userCanonicalPath.value),
                ...(props.profile.avatar_url ? { image: props.profile.avatar_url } : {}),
            },
        },
    },
    {
        key: 'jsonld-user-breadcrumb',
        data: buildBreadcrumbSchema([
            { name: 'الرئيسية', path: '/' },
            { name: props.profile.name, path: userCanonicalPath.value },
        ]),
    },
]);
</script>

<template>
    <PublicLayout>
        <SeoHead
            :title="`وصفات ${profile.name}`"
            :description="userDescription"
            :image="profile.avatar_url"
            type="profile"
            :canonical="userCanonicalPath"
            :json-ld="userJsonLd"
        />

        <div>
            <!-- Profile Header -->
            <section class="border-b bg-background py-16">
                <div class="container mx-auto px-4 md:px-6">
                    <div class="flex flex-col items-center text-center">
                        <Avatar class="w-24 h-24 border mb-4">
                            <AvatarImage :src="profile.avatar_url || undefined" :alt="profile.name" width="96" height="96" />
                            <AvatarFallback class="text-3xl bg-primary/10 text-primary uppercase">
                                {{ profile.name.charAt(0) }}
                            </AvatarFallback>
                        </Avatar>
                        <h1 class="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{{ profile.name }}</h1>
                        <Badge variant="outline" class="tabular-nums">
                            {{ profile.recipes_count }} وصفة
                        </Badge>
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
                <div v-if="recipes.meta?.last_page > 1" class="mt-10 flex flex-wrap justify-center gap-2">
                    <template v-for="(link, key) in recipes.meta.links" :key="key">
                        <component
                            :is="link.url ? Link : 'span'"
                            :href="link.url"
                            v-if="link.url || link.label === '...'"
                            class="px-4 py-2 border rounded-md text-sm"
                            :class="{ 
                                'bg-primary text-primary-foreground': link.active,
                                'bg-background hover:bg-muted': !link.active && link.url,
                                'opacity-50 cursor-default': !link.url 
                            }"
                        >
                            {{ formatPaginationLabel(link.label) }}
                        </component>
                    </template>
                </div>
            </section>
        </div>
    </PublicLayout>
</template>
