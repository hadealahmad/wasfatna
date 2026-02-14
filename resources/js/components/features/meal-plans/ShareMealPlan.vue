<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from '@/components/ui/Button.vue';
import { Copy, Check, Share2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const props = defineProps<{
    shareToken: string | null;
}>();

const copied = ref(false);

const shareUrl = computed(() => {
    if (props.shareToken) {
        return `${window.location.origin}/meal-plans/shared/${props.shareToken}`;
    }
    return null;
});

const copyLink = async () => {
    if (!shareUrl.value) return;
    try {
        await navigator.clipboard.writeText(shareUrl.value);
        copied.value = true;
        toast.success('تم نسخ الرابط');
        setTimeout(() => { copied.value = false; }, 2000);
    } catch {
        toast.error('فشل نسخ الرابط');
    }
};

const shareWhatsApp = () => {
    if (!shareUrl.value) return;
    const text = encodeURIComponent(`شاهد خطة وجباتي: ${shareUrl.value}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
};
</script>

<template>
    <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" @click="copyLink" class="gap-1.5">
            <Check v-if="copied" class="h-3.5 w-3.5" />
            <Copy v-else class="h-3.5 w-3.5" />
            نسخ الرابط
        </Button>

        <Button variant="outline" size="sm" @click="shareWhatsApp" class="gap-1.5 text-green-600 hover:text-green-700">
            <Share2 class="h-3.5 w-3.5" />
            واتساب
        </Button>
    </div>
</template>
