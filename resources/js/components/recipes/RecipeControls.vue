<script setup lang="ts">
import { ref, computed } from 'vue';
import { Link, usePage, router } from '@inertiajs/vue3';
import axios from 'axios';
import { Button } from '@/components/ui';
import { Loader2, Edit, EyeOff, Send } from 'lucide-vue-next';

const props = defineProps<{
    recipeId: number;
    recipeSlug: string;
    ownerId?: number;
    status?: string;
}>();

const page = usePage();
const user = computed(() => page.props.auth?.user);
const canModerate = computed(() => ['admin', 'moderator'].includes(user.value?.role));

const isOwner = computed(() => user.value?.id === props.ownerId);
const canUnpublish = computed(() => (isOwner.value || canModerate.value) && props.status === 'approved');
const canPublish = computed(() => canModerate.value && props.status !== 'approved');
const showControls = computed(() => canUnpublish.value || canPublish.value || isOwner.value);

const isPublishing = ref(false);
const isUnpublishing = ref(false);

const handleUnpublish = async () => {
    if (!confirm('هل أنت متأكد أنك تريد إلغاء نشر هذه الوصفة؟')) return;
    
    isUnpublishing.value = true;
    try {
        await axios.post(`/dashboard/recipes/${props.recipeId}/unpublish`);
        router.visit('/my/recipes');
    } catch (error) {
        console.error('Failed to unpublish:', error);
        alert('حدث خطأ أثناء إلغاء النشر');
    } finally {
        isUnpublishing.value = false;
    }
};

const handlePublish = async () => {
    if (!confirm('هل أنت متأكد أنك تريد نشر هذه الوصفة؟')) return;
    
    isPublishing.value = true;
    try {
        await axios.post(`/dashboard/recipes/${props.recipeId}/approve`);
        router.reload();
    } catch (error) {
        console.error('Failed to publish:', error);
        alert('حدث خطأ أثناء نشر الوصفة');
    } finally {
        isPublishing.value = false;
    }
};
</script>

<template>
    <div v-if="showControls" class="flex gap-2">
        <Link :href="route('my.recipes.edit', recipeId)">
            <Button variant="outline" size="sm" class="gap-2">
                <Edit class="w-4 h-4" />
                تعديل
            </Button>
        </Link>
        
        <Button
            v-if="canPublish"
            size="sm"
            class="gap-2"
            @click="handlePublish"
            :disabled="isPublishing"
        >
            <Loader2 v-if="isPublishing" class="w-4 h-4 animate-spin" />
            <Send v-else class="w-4 h-4" />
            نشر الوصفة
        </Button>
        
        <Button
            v-if="canUnpublish"
            variant="destructive"
            size="sm"
            class="gap-2"
            @click="handleUnpublish"
            :disabled="isUnpublishing"
        >
            <Loader2 v-if="isUnpublishing" class="w-4 h-4 animate-spin" />
            <EyeOff v-else class="w-4 h-4" />
            إلغاء النشر
        </Button>
    </div>
</template>
