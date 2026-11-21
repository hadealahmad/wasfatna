<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from "radix-vue";
import { X } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<DialogContentProps & { class?: string; showCloseButton?: boolean; dir?: 'ltr' | 'rtl' }>();
const emits = defineEmits<DialogContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/50 motion-safe:transition-opacity duration-200"
    />
    <DialogContent
      v-bind="forwarded"
      :class="
        cn(
          'bg-background motion-safe:transition-[opacity,transform] fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg',
          props.class,
        )
      "
    >
      <slot />

      <DialogClose
        v-if="showCloseButton !== false"
        class="ring-offset-background data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 end-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4"
      >
        <X class="h-4 w-4" aria-hidden="true" />
        <span class="sr-only">إغلاق</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
