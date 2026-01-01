<script setup lang="ts">
import { cn } from '@/lib/utils';
import * as Avatar from 'radix-vue';

interface AvatarImageProps {
  src?: string;
  alt?: string;
  class?: string;
}

const props = defineProps<AvatarImageProps>();
</script>

<template>
  <Avatar.AvatarImage
    :src="props.src"
    :alt="props.alt"
    :class="cn('aspect-square h-full w-full', props.class)"
  />
</template>
