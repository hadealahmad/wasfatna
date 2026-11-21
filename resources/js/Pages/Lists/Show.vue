<script setup lang="ts">
import { computed, ref } from 'vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { Check, ChevronLeft, Globe, Lock, Share2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import ListActions from '@/components/features/lists/ListActions.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import ReportModal from '@/components/reports/ReportModal.vue';
import { Avatar, AvatarFallback, AvatarImage, Badge, Button } from '@/components/ui';

interface User {
  id: number;
  name: string;
  avatar?: string;
}

interface List {
  id: number;
  user_id: number;
  name: string;
  slug: string | null;
  description: string | null;
  cover_image: string | null;
  is_default: boolean;
  is_public: boolean;
  status: string;
  created_at: string;
  user: User;
  recipes: any[];
}

const props = defineProps<{
  list: List;
}>();

const page = usePage();
const isOwner = computed(() => {
  const u = (page.props.auth as any)?.user;
  return Boolean(u && u.id === props.list.user_id);
});

const copied = ref(false);

const initials = (name: string) => name.charAt(0).toUpperCase();

const listDescription = computed(
  () =>
    props.list.description ||
    `قائمة وصفات "${props.list.name}" من إعداد ${props.list.user?.name || 'مستخدم وصفاتنا'} وتضم ${props.list.recipes?.length || 0} وصفة على منصة وصفاتنا.`,
);

const listImage = computed(() => props.list.cover_image || 'https://food.syrian.zone/og-image.webp');

async function handleShare(): Promise<void> {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    toast.success('تم نسخ رابط القائمة');
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    toast.error('تعذّر نسخ الرابط');
  }
}
</script>

<template>
  <PublicLayout>
    <Head>
      <title>{{ list.name }}</title>
      <meta head-key="description" name="description" :content="listDescription" />
      <meta head-key="og:title" property="og:title" :content="`${list.name} | وصفاتنا`" />
      <meta head-key="og:description" property="og:description" :content="listDescription" />
      <meta head-key="og:image" property="og:image" :content="listImage" />
      <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta head-key="twitter:title" name="twitter:title" :content="`${list.name} | وصفاتنا`" />
      <meta head-key="twitter:description" name="twitter:description" :content="listDescription" />
      <meta head-key="twitter:image" name="twitter:image" :content="listImage" />
    </Head>

    <div class="container max-w-7xl mx-auto py-8 px-4 md:px-8">
      <nav aria-label="مسار التصفح" class="flex items-center gap-1.5 mb-5 text-sm text-muted-foreground">
        <Link href="/lists" class="hover:text-primary transition-colors">القوائم</Link>
        <ChevronLeft class="h-4 w-4 shrink-0" aria-hidden="true" />
        <span class="text-foreground font-medium truncate">{{ list.name }}</span>
      </nav>

      <!-- Header -->
      <div class="mb-8 p-5 sm:p-6 bg-card rounded-2xl border border-border/80 shadow-2xs">
        <div class="flex flex-col md:flex-row gap-5 md:gap-6 items-start md:items-center">
          <!-- Cover Image -->
          <div class="relative w-full md:w-32 h-40 md:h-32 rounded-xl overflow-hidden bg-muted shrink-0 flex items-center justify-center border border-border/50">
            <img
              v-if="list.cover_image"
              :src="list.cover_image"
              :alt="list.name"
              width="128"
              height="128"
              decoding="async"
              class="object-cover w-full h-full"
            />
            <ProjectIcon v-else name="lists" class="w-12 h-12" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0 space-y-2">
            <div class="flex flex-wrap items-center gap-2.5">
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{{ list.name }}</h1>
              <Badge v-if="list.is_public" variant="secondary" class="gap-1">
                <Globe class="w-3 h-3" aria-hidden="true" />
                عامة
              </Badge>
              <Badge v-else variant="outline" class="gap-1">
                <Lock class="w-3 h-3" aria-hidden="true" />
                خاصة
              </Badge>
            </div>

            <p v-if="list.description" class="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {{ list.description }}
            </p>

            <div class="flex flex-wrap items-center gap-2 pt-1 text-sm text-muted-foreground">
              <span>بواسطة</span>
              <div class="flex items-center gap-1.5 font-medium text-foreground">
                <Avatar class="w-5 h-5">
                  <AvatarImage :src="list.user.avatar" :alt="list.user.name" width="20" height="20" />
                  <AvatarFallback class="text-xs">{{ initials(list.user.name) }}</AvatarFallback>
                </Avatar>
                <span>{{ list.user.name }}</span>
              </div>
              <span aria-hidden="true">•</span>
              <span class="tabular-nums">{{ list.recipes.length }} وصفة</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              v-if="list.is_public && !isOwner"
              type="button"
              variant="outline"
              size="icon"
              aria-label="مشاركة القائمة"
              title="نسخ رابط القائمة"
              @click="handleShare"
            >
              <Check v-if="copied" class="w-4 h-4 text-success" aria-hidden="true" />
              <Share2 v-else class="w-4 h-4" aria-hidden="true" />
            </Button>
            <ListActions :list="list" />
            <ReportModal :reportable-id="list.id" reportable-type="list" />
          </div>
        </div>
      </div>

      <!-- Recipes Grid -->
      <RecipeGrid
        :recipes="list.recipes"
        empty-message="هذه القائمة فارغة حالياً."
      />
    </div>
  </PublicLayout>
</template>
