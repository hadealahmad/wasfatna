<script setup lang="ts">
import { cn } from '@/lib/utils';
import * as Avatar from 'radix-vue';

interface AvatarProps {
  class?: string;
}

const props = defineProps<AvatarProps>();
</script>

<template>
  <Avatar.AvatarRoot :class="cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', props.class)">
    <slot />
  </Avatar.AvatarRoot>
</template>
