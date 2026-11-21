<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import Button from '@/components/ui/Button.vue';
import { Copy, Check, Share2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const props = defineProps<{
    shareToken: string | null;
}>();

const copied = ref(false);
const copyStatus = ref('');
let copyTimeout: ReturnType<typeof setTimeout> | null = null;

const shareUrl = computed(() => {
    if (props.shareToken && typeof window !== 'undefined') {
        return `${window.location.origin}/meal-plans/shared/${props.shareToken}`;
    }
    return null;
});

const whatsappUrl = computed(() => {
    if (!shareUrl.value) return undefined;
    const text = encodeURIComponent(`شاهد خطة وجباتي: ${shareUrl.value}`);
    return `https://wa.me/?text=${text}`;
});

const copyLink = async () => {
    if (!shareUrl.value) return;
    if (copyTimeout) {
        clearTimeout(copyTimeout);
        copyTimeout = null;
    }

    try {
        await navigator.clipboard.writeText(shareUrl.value);
        copied.value = true;
        copyStatus.value = 'تم نسخ الرابط';
        toast.success('تم نسخ الرابط');
        copyTimeout = setTimeout(() => {
            copied.value = false;
            copyStatus.value = '';
            copyTimeout = null;
        }, 2000);
    } catch {
        copied.value = false;
        copyStatus.value = 'فشل نسخ الرابط';
        toast.error('فشل نسخ الرابط');
    }
};

onUnmounted(() => {
    if (copyTimeout) {
        clearTimeout(copyTimeout);
    }
});
</script>

<template>
    <div class="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" @click="copyLink" class="gap-1.5">
            <Check v-if="copied" class="h-3.5 w-3.5" aria-hidden="true" />
            <Copy v-else class="h-3.5 w-3.5" aria-hidden="true" />
            نسخ الرابط
        </Button>

        <Button
            as="a"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="sm"
            :class="['gap-1.5 text-green-600 hover:text-green-700', !whatsappUrl && 'pointer-events-none opacity-50']"
            :aria-disabled="!whatsappUrl || undefined"
        >
            <Share2 class="h-3.5 w-3.5" aria-hidden="true" />
            واتساب
        </Button>

        <span role="status" class="sr-only">{{ copyStatus }}</span>
    </div>
</template>
