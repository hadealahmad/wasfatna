<script setup lang="ts">
import { cn } from '@/lib/utils';
import * as Avatar from 'radix-vue';

interface AvatarFallbackProps {
  class?: string;
}

const props = defineProps<AvatarFallbackProps>();
</script>

<template>
  <Avatar.AvatarFallback
    :class="cn('flex h-full w-full items-center justify-center rounded-full bg-muted', props.class)"
  >
    <slot />
  </Avatar.AvatarFallback>
</template>
