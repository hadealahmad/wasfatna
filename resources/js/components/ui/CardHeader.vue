<script setup lang="ts">
import { cn } from '@/lib/utils';

interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    data-slot="card-header"
    :class="cn('flex flex-col space-y-1.5 p-6', $props.class)"
  >
    <slot />
  </div>
</template>
