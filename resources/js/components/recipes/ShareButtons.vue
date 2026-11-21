<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { Button } from '@/components/ui';
import { Share2, Printer, Check } from 'lucide-vue-next';

const copied = ref(false);
const copyStatus = ref('');
const copyError = ref('');
let copyTimeout: ReturnType<typeof setTimeout> | null = null;

const handleCopyLink = async () => {
    if (copyTimeout) {
        clearTimeout(copyTimeout);
        copyTimeout = null;
    }

    try {
        await navigator.clipboard.writeText(window.location.href);
        copied.value = true;
        copyError.value = '';
        copyStatus.value = 'تم نسخ الرابط';
        copyTimeout = setTimeout(() => {
            copied.value = false;
            copyStatus.value = '';
            copyTimeout = null;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy', err);
        copied.value = false;
        copyError.value = 'تعذر نسخ الرابط، يرجى نسخه يدوياً';
        copyStatus.value = '';
    }
};

const handlePrint = () => {
    window.print();
};

onUnmounted(() => {
    if (copyTimeout) {
        clearTimeout(copyTimeout);
    }
});
</script>

<template>
    <div class="space-y-1">
        <div class="flex gap-2">
            <Button
                type="button"
                variant="outline"
                size="sm"
                class="flex-1"
                @click="handleCopyLink"
            >
                <Check v-if="copied" class="me-2 h-4 w-4" aria-hidden="true" />
                <Share2 v-else class="me-2 h-4 w-4" aria-hidden="true" />
                {{ copied ? 'تم النسخ' : 'نسخ الرابط' }}
            </Button>
            <Button
                type="button"
                variant="outline"
                size="sm"
                class="flex-1"
                @click="handlePrint"
            >
                <Printer class="me-2 h-4 w-4" aria-hidden="true" />
                طباعة
            </Button>
        </div>
        <span role="status" class="sr-only">{{ copyStatus }}</span>
        <p v-if="copyError" role="alert" class="text-xs text-destructive">{{ copyError }}</p>
    </div>
</template>
