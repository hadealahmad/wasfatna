<script setup lang="ts">
import { TabsContent, type TabsContentProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<TabsContentProps & { class?: string }>();
</script>

<template>
  <TabsContent
    v-bind="props"
    :class="cn('flex-1 outline-none', props.class)"
  >
    <slot />
  </TabsContent>
</template>
