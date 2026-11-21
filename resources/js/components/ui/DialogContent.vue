<script setup lang="ts">
import { computed } from 'vue';
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'radix-vue';
import { X } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps<
  DialogContentProps & { class?: string; showCloseButton?: boolean; dir?: 'ltr' | 'rtl' }
>();
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, showCloseButton: __, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/80 motion-safe:transition-opacity duration-200"
    />
    <DialogContent
      v-bind="forwarded"
      :class="cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 motion-safe:transition-[opacity,transform] outline-none sm:max-w-lg sm:rounded-lg',
        props.class,
      )"
    >
      <slot />

      <DialogClose
        v-if="showCloseButton !== false"
        class="absolute end-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      >
        <X class="h-4 w-4" aria-hidden="true" />
        <span class="sr-only">إغلاق</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
