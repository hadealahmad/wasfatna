<script setup lang="ts">
import { TabsList, type TabsListProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<TabsListProps & { class?: string }>();
</script>

<template>
  <TabsList
    v-bind="props"
    :class="cn(
      'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
      props.class
    )"
  >
    <slot />
  </TabsList>
</template>
