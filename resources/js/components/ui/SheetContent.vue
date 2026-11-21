<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'radix-vue';
import { X } from 'lucide-vue-next';

interface SheetContentProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
  showClose?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<SheetContentProps>(), {
  side: 'right',
  showClose: true,
});

const sheetVariants = {
  top: 'inset-x-0 top-0 border-b',
  bottom: 'inset-x-0 bottom-0 border-t',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
  right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
};

const delegatedProps = computed(() => {
  const { class: _, side: __, showClose: ___, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps);
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/80 motion-safe:transition-opacity duration-200"
    />
    <DialogContent
      v-bind="forwarded"
      :class="cn(
        'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out duration-200',
        sheetVariants[side],
        props.class,
      )"
    >
      <slot />

      <DialogClose
        v-if="showClose"
        class="absolute end-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
      >
        <X class="h-4 w-4" aria-hidden="true" />
        <span class="sr-only">إغلاق</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
