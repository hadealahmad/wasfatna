<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-md border p-4 text-sm [&>svg~*]:ps-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:start-4 [&>svg]:top-4',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border-border [&>svg]:text-foreground',
        destructive:
          'bg-destructive/10 text-destructive border-destructive/30 [&>svg]:text-destructive',
        success:
          'bg-primary/10 text-primary border-primary/30 [&>svg]:text-primary',
        warning:
          'bg-accent text-accent-foreground border-border [&>svg]:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type AlertVariants = VariantProps<typeof alertVariants>;

const props = defineProps<{
  class?: HTMLAttributes['class'];
  variant?: AlertVariants['variant'];
}>();

const delegatedProps = computed(() => {
  const { class: _, variant: __, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <div :class="cn(alertVariants({ variant }), props.class)" v-bind="delegatedProps" role="alert">
    <slot />
  </div>
</template>
