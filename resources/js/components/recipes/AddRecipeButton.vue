<script setup lang="ts">
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { PlusCircle } from 'lucide-vue-next';
import { Button } from '@/components/ui';

interface Props {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xl';
  showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  variant: 'default',
  size: 'default',
  showIcon: true,
});

const page = usePage();
const isAuthenticated = computed(() => Boolean((page.props.auth as any)?.user));

const handleLogin = () => {
  window.location.href = route('auth.google.redirect');
};
</script>

<template>
  <Button
    v-if="isAuthenticated"
    as-child
    :variant="props.variant"
    :size="props.size"
    :class="props.className"
  >
    <Link href="/recipes/new">
      <PlusCircle v-if="props.showIcon" class="me-2 h-4 w-4" aria-hidden="true" />
      <slot>أضف وصفة</slot>
    </Link>
  </Button>

  <Button
    v-else
    type="button"
    :variant="props.variant"
    :size="props.size"
    :class="props.className"
    @click="handleLogin"
  >
    <PlusCircle v-if="props.showIcon" class="me-2 h-4 w-4" aria-hidden="true" />
    <slot>شارك وصفتك</slot>
  </Button>
</template>
