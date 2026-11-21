<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'radix-vue';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:pointer-events-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        success:
          'border-success/30 bg-success/15 text-success hover:bg-success/20',
        warning:
          'border-warning/30 bg-warning/15 text-warning hover:bg-warning/20',
        info:
          'border-info/30 bg-info/15 text-info hover:bg-info/20',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface Props extends PrimitiveProps {
  variant?: VariantProps<typeof badgeVariants>['variant'];
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'span',
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(badgeVariants({ variant }), props.class)"
  >
    <slot />
  </Primitive>
</template>
