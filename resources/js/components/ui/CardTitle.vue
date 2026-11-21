<script setup lang="ts">
import { cn } from '@/lib/utils';

interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    data-slot="card-title"
    :class="cn('text-2xl font-semibold leading-none tracking-tight', $props.class)"
  >
    <slot />
  </div>
</template>
