<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import PublicHeader from '@/components/layout/PublicHeader.vue';
import { Toaster, toast } from 'vue-sonner';
import { watch } from 'vue';
import { useColorScheme } from '@/composables/useColorScheme';

defineProps<{
  title?: string;
}>();

const { toasterTheme } = useColorScheme();

// Surface backend flash messages (e.g. middleware redirects) as toasts
const page = usePage();
watch(
  () => page.props.flash,
  (flash: any) => {
    if (flash?.error) toast.error(flash.error);
    if (flash?.success) toast.success(flash.success);
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="min-h-dvh bg-background font-sans antialiased flex flex-col" dir="rtl">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
    >
      تخطي إلى المحتوى الرئيسي
    </a>

    <Head v-if="title" :title="title" />

    <Toaster
      position="top-center"
      :theme="toasterTheme"
      richColors
      closeButton
      :toastOptions="{
        style: {
          direction: 'rtl'
        }
      }"
    />
    <PublicHeader />

    <main id="main-content" tabindex="-1" class="flex-1 focus:outline-none">
      <slot />
    </main>

    <footer
      class="cv-auto-section border-t py-8 bg-muted/20 mt-auto"
      style="contain-intrinsic-block-size: auto 10rem;"
    >
      <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p class="mb-2">
          © 2024 وصفاتنا. جميع الحقوق محفوظة. | تم التطوير بواسطة
          <a href="https://hadealahmad.com/" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">هادي الأحمد</a>
        </p>
        <div class="flex justify-center gap-4">
          <Link href="/privacy" class="hover:text-primary transition-colors">سياسة الخصوصية</Link>
          <span aria-hidden="true">|</span>
          <Link href="/terms" class="hover:text-primary transition-colors">الشروط والأحكام</Link>
        </div>
      </div>
    </footer>
  </div>
</template>
