<script setup lang="ts">
import { cn } from '@/lib/utils';

interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <p
    data-slot="card-description"
    :class="cn('text-sm text-muted-foreground', $props.class)"
  >
    <slot />
  </p>
</template>
