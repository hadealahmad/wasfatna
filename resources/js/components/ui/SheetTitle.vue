<script setup lang="ts">
import { cn } from '@/lib/utils';
import { DialogTitle } from 'radix-vue';

interface SheetTitleProps {
  class?: string;
}

const props = defineProps<SheetTitleProps>();
</script>

<template>
  <DialogTitle :class="cn('text-lg font-semibold text-foreground', props.class)">
    <slot />
  </DialogTitle>
</template>
