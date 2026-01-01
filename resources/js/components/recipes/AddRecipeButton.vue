<script setup lang="ts">
import { computed } from 'vue';
import { usePage, Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui';
import { PlusCircle } from 'lucide-vue-next';

interface Props {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "xl";
  showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  variant: 'default',
  size: 'default',
  showIcon: true,
});

const page = usePage();
const isAuthenticated = computed(() => !!page.props.auth?.user);

const handleLogin = () => {
  window.location.href = route('auth.google.redirect');
};
</script>

<template>
  <template v-if="isAuthenticated">
    <Link href="/recipes/new">
      <Button :variant="props.variant" :size="props.size" :class="props.className">
        <PlusCircle v-if="props.showIcon" class="ml-2 h-4 w-4" />
        <slot>أضف وصفة</slot>
      </Button>
    </Link>
  </template>
  <template v-else>
    <Button 
      :variant="props.variant" 
      :size="props.size" 
      :class="props.className"
      @click="handleLogin"
    >
      <PlusCircle v-if="props.showIcon" class="ml-2 h-4 w-4" />
      <slot>شاركينا وصفتك</slot>
    </Button>
  </template>
</template>
