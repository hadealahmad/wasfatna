<script setup lang="ts">
import { computed } from 'vue';
import { SelectIcon, SelectTrigger, type SelectTriggerProps, useForwardProps } from 'radix-vue';
import { ChevronsUpDown } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps<SelectTriggerProps & { class?: string; size?: 'sm' | 'default' | 'lg' }>();

const delegatedProps = computed(() => {
  const { class: _, size: __, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    v-bind="forwarded"
    :data-size="props.size ?? 'default'"
    :class="cn(
      'flex h-9 w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=sm]:h-8 data-[size=lg]:h-11 [&>span]:line-clamp-1 [&_svg]:pointer-events-none [&_svg]:shrink-0',
      props.class,
    )"
  >
    <slot />
    <SelectIcon as-child>
      <ChevronsUpDown class="h-4 w-4 opacity-50" aria-hidden="true" />
    </SelectIcon>
  </SelectTrigger>
</template>
