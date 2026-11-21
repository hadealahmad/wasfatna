<script setup lang="ts">
import { computed } from 'vue';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const filterChipVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 cursor-pointer select-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-3.5 [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  },
);

type ChipVariant = VariantProps<typeof filterChipVariants>['variant'];

interface Props {
  active?: boolean;
  variant?: ChipVariant;
  activeVariant?: ChipVariant;
  count?: number;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  variant: 'outline',
  activeVariant: 'default',
  disabled: false,
});

const resolvedVariant = computed<ChipVariant>(() =>
  props.active ? props.activeVariant : props.variant,
);
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :aria-pressed="active"
    :class="cn(filterChipVariants({ variant: resolvedVariant }), props.class)"
  >
    <slot />
    <span
      v-if="count !== undefined"
      class="inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[11px] font-semibold tabular-nums"
      :class="active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'"
    >
      {{ count }}
    </span>
  </button>
</template>
