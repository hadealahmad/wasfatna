<script setup lang="ts">
import { computed, ref } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import axios from 'axios';
import { Edit, EyeOff, Loader2, Send } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui';

const props = defineProps<{
  recipeId: number;
  recipeSlug: string;
  ownerId?: number;
  status?: string;
}>();

const page = usePage();
const user = computed(() => (page.props.auth as any)?.user);
const canModerate = computed(() => ['admin', 'moderator'].includes(user.value?.role));

// Both sides must be real ids: a guest (no user) viewing an anonymous recipe
// (no ownerId) would otherwise match `undefined === undefined`.
const isOwner = computed(() => user.value?.id != null && props.ownerId != null && user.value.id === props.ownerId);
const canUnpublish = computed(() => (isOwner.value || canModerate.value) && props.status === 'approved');
const canPublish = computed(() => canModerate.value && props.status !== 'approved');
const showControls = computed(() => canUnpublish.value || canPublish.value || isOwner.value);

const isPublishing = ref(false);
const isUnpublishing = ref(false);

const handleUnpublish = async () => {
  if (!confirm('هل أنت متأكد من إلغاء نشر هذه الوصفة؟')) return;

  isUnpublishing.value = true;
  try {
    await axios.post(`/dashboard/recipes/${props.recipeId}/unpublish`);
    toast.success('تم إلغاء نشر الوصفة');
    router.visit('/my/recipes');
  } catch (error) {
    console.error('Failed to unpublish:', error);
    toast.error('حدث خطأ أثناء إلغاء النشر');
  } finally {
    isUnpublishing.value = false;
  }
};

const handlePublish = async () => {
  if (!confirm('هل أنت متأكد من نشر هذه الوصفة؟')) return;

  isPublishing.value = true;
  try {
    await axios.post(`/dashboard/recipes/${props.recipeId}/approve`);
    toast.success('تم نشر الوصفة بنجاح');
    router.reload();
  } catch (error) {
    console.error('Failed to publish:', error);
    toast.error('حدث خطأ أثناء نشر الوصفة');
  } finally {
    isPublishing.value = false;
  }
};
</script>

<template>
  <div v-if="showControls" class="flex flex-wrap gap-2">
    <Button as-child variant="outline" size="sm" class="gap-2">
      <Link :href="route('my.recipes.edit', recipeId)">
        <Edit class="w-4 h-4" aria-hidden="true" />
        <span>تعديل</span>
      </Link>
    </Button>

    <Button
      v-if="canPublish"
      type="button"
      size="sm"
      class="gap-2"
      :disabled="isPublishing"
      :aria-busy="isPublishing || undefined"
      @click="handlePublish"
    >
      <Loader2 v-if="isPublishing" class="w-4 h-4 animate-spin" aria-hidden="true" />
      <Send v-else class="w-4 h-4" aria-hidden="true" />
      <span>نشر الوصفة</span>
    </Button>

    <Button
      v-if="canUnpublish"
      type="button"
      variant="destructive"
      size="sm"
      class="gap-2"
      :disabled="isUnpublishing"
      :aria-busy="isUnpublishing || undefined"
      @click="handleUnpublish"
    >
      <Loader2 v-if="isUnpublishing" class="w-4 h-4 animate-spin" aria-hidden="true" />
      <EyeOff v-else class="w-4 h-4" aria-hidden="true" />
      <span>إلغاء النشر</span>
    </Button>
  </div>
</template>
