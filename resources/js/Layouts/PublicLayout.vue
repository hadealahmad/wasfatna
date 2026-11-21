<script setup lang="ts">
import { watch } from 'vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { FileText, Globe, Info, Shield } from 'lucide-vue-next';
import { Toaster, toast } from 'vue-sonner';
import PublicHeader from '@/components/layout/PublicHeader.vue';
import { useColorScheme } from '@/composables/useColorScheme';
import { useGlobalSearchShortcut } from '@/composables/useGlobalSearch';

defineProps<{
  title?: string;
}>();

// Register Ctrl/Cmd+K and "/" global search shortcuts once at the root layout.
useGlobalSearchShortcut();

const { toasterTheme } = useColorScheme();
const currentYear = new Date().getFullYear();

// Surface backend flash messages (e.g. middleware redirects) as toasts
const page = usePage();
watch(
  () => page.props.flash,
  (flash: any) => {
    if (flash?.error) toast.error(flash.error);
    if (flash?.success) toast.success(flash.success);
  },
  { deep: true, immediate: true },
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
          direction: 'rtl',
        },
      }"
    />

    <PublicHeader />

    <main id="main-content" tabindex="-1" class="flex-1 focus:outline-none">
      <slot />
    </main>

    <footer
      class="cv-auto-section border-t border-border bg-card/50 py-8 mt-auto"
      style="contain-intrinsic-block-size: auto 10rem;"
    >
      <div class="container max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center gap-3 text-center">
        <div class="flex items-center gap-2 text-sm">
          <span class="font-medium tracking-wide text-primary">SYRIAN.ZONE</span>
          <span class="text-xs text-muted-foreground" aria-hidden="true">/</span>
          <span class="font-bold text-foreground">وصفاتنا</span>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <Link href="/about" class="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Info aria-hidden="true" class="h-4 w-4" />
            <span>عن وصفاتنا</span>
          </Link>
          <span aria-hidden="true">•</span>
          <Link href="/privacy" class="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Shield aria-hidden="true" class="h-4 w-4" />
            <span>سياسة الخصوصية</span>
          </Link>
          <span aria-hidden="true">•</span>
          <Link href="/terms" class="flex items-center gap-1.5 hover:text-primary transition-colors">
            <FileText aria-hidden="true" class="h-4 w-4" />
            <span>الشروط والأحكام</span>
          </Link>
          <span aria-hidden="true">•</span>
          <a
            href="https://hadealahmad.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <Globe aria-hidden="true" class="h-4 w-4" />
            <span>هادي الأحمد</span>
          </a>
        </div>

        <p class="text-xs text-muted-foreground">
          © {{ currentYear }} وصفاتنا · مجتمع الطبخ السوري
        </p>
      </div>
    </footer>
  </div>
</template>
