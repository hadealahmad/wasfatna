<script setup lang="ts">
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
  class?: string;
}

const props = withDefaults(defineProps<SheetContentProps>(), {
  side: 'right',
});

const sheetVariants = {
  top: 'inset-x-0 top-0 border-b',
  bottom: 'inset-x-0 bottom-0 border-t',
  left: 'inset-y-0 left-0 h-full w-3/4 border-e sm:max-w-sm',
  right: 'inset-y-0 right-0 h-full w-3/4 border-s sm:max-w-sm',
};

const forwarded = useForwardPropsEmits(props);
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 z-50 bg-black/80 motion-safe:transition-opacity duration-200" />
    <DialogContent
      v-bind="forwarded"
      :class="cn('fixed z-50 gap-4 bg-background p-6 shadow-lg motion-safe:transition-[opacity,transform] duration-200 ease-in-out', sheetVariants[side], props.class)"
    >
      <slot />

      <DialogClose
        class="absolute end-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none data-[state=open]:bg-secondary"
      >
        <X class="h-4 w-4" aria-hidden="true" />
        <span class="sr-only">إغلاق</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
