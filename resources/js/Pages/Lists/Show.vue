<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import RecipeGrid from '@/components/recipes/RecipeGrid.vue';
import { Badge } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { Button } from '@/components/ui';
import { Share2, Lock, Globe } from 'lucide-vue-next';
import ReportModal from '@/components/reports/ReportModal.vue';
import ListActions from '@/components/features/lists/ListActions.vue';

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
  recipes: any[]; // RecipeGrid handles the type
}

interface Props {
  list: List;
}

const props = defineProps<Props>();

const initials = (name: string) => name.charAt(0).toUpperCase();
</script>

<template>
  <PublicLayout>
    <Head :title="list.name" />

    <div class="container mx-auto py-8 px-4 md:px-6">
      <!-- Header -->
      <div class="mb-8 p-6 bg-muted/30 rounded-2xl border border-border/50">
        <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <!-- Cover Image -->
          <div class="relative w-full md:w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
            <img
              v-if="list.cover_image"
              :src="list.cover_image"
              :alt="list.name"
              class="object-cover w-full h-full"
            />
            <div v-else class="text-4xl">
              📋
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 space-y-2">
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold">{{ list.name }}</h1>
              <Badge v-if="list.is_public" variant="secondary" class="gap-1">
                <Globe class="w-3 h-3" />
                عامة
              </Badge>
              <Badge v-else variant="outline" class="gap-1">
                <Lock class="w-3 h-3" />
                خاصة
              </Badge>
            </div>
            
            <p v-if="list.description" class="text-muted-foreground max-w-2xl">
              {{ list.description }}
            </p>

            <div class="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
              <span>بواسطة</span>
              <div class="flex items-center gap-1 font-medium text-foreground">
                <Avatar class="w-5 h-5">
                  <AvatarImage :src="list.user.avatar" />
                  <AvatarFallback>{{ initials(list.user.name) }}</AvatarFallback>
                </Avatar>
                <span>{{ list.user.name }}</span>
              </div>
              <span>•</span>
              <span>{{ list.recipes.length }} وصفة</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Share functionality can be added later -->
            <Button v-if="list.is_public" variant="outline" size="icon">
              <Share2 class="w-4 h-4" />
            </Button>
            <ListActions :list="list" />
            <ReportModal :reportable-id="list.id" reportable-type="list" />
          </div>
        </div>
      </div>

      <!-- Recipes Grid -->
      <RecipeGrid 
        :recipes="list.recipes" 
        empty-message="هذه القائمة فارغة."
      />
    </div>
  </PublicLayout>
</template>
