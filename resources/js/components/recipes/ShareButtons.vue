<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui';
import { Share2, Printer, Check } from 'lucide-vue-next';

const copied = ref(false);

const handleCopyLink = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        copied.value = true;
        setTimeout(() => copied.value = false, 2000);
    } catch (err) {
        console.error('Failed to copy', err);
    }
};

const handlePrint = () => {
    window.print();
};
</script>

<template>
    <div class="flex gap-2">
        <Button
            variant="outline"
            size="sm"
            class="flex-1"
            @click="handleCopyLink"
        >
            <Check v-if="copied" class="ml-2 h-4 w-4" />
            <Share2 v-else class="ml-2 h-4 w-4" />
            {{ copied ? 'تم النسخ' : 'نسخ الرابط' }}
        </Button>
        <Button
            variant="outline"
            size="sm"
            class="flex-1"
            @click="handlePrint"
        >
            <Printer class="ml-2 h-4 w-4" />
            طباعة
        </Button>
    </div>
</template>
