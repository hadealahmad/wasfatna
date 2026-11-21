<script setup lang="ts">
import { cn } from '@/lib/utils';
import * as Avatar from 'radix-vue';

interface AvatarImageProps {
  src?: string;
  alt?: string;
  class?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
}

const props = defineProps<AvatarImageProps>();
</script>

<template>
  <Avatar.AvatarImage
    :src="props.src"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    :loading="props.loading"
    :decoding="props.decoding"
    :class="cn('aspect-square h-full w-full', props.class)"
  />
</template>
