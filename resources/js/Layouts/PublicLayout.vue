<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import PublicHeader from '@/components/layout/PublicHeader.vue';
import { Toaster } from 'vue-sonner';
import { useDark } from '@vueuse/core';
import { computed } from 'vue';

defineProps<{
  title?: string;
}>();

const isDark = useDark();
const theme = computed(() => isDark.value ? 'dark' : 'light');
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased flex flex-col" dir="rtl">
    <Head :title="title ? `${title} | وصفاتنا` : 'وصفاتنا - مجتمع الطبخ السوري'" />
    
    <Toaster 
      position="top-center" 
      :theme="theme"
      richColors 
      closeButton 
      :toastOptions="{
        style: {
          direction: 'rtl'
        }
      }"
    />
    <PublicHeader />


    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t py-8 bg-muted/20 mt-auto">
      <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p class="mb-2">
          © 2024 وصفاتنا. جميع الحقوق محفوظة. | تم التطوير بواسطة 
          <a href="https://hadealahmad.com/" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">هادي الأحمد</a>
        </p>
        <div class="flex justify-center gap-4">
          <a href="/privacy" class="hover:text-primary transition-colors">سياسة الخصوصية</a>
          <span>|</span>
          <a href="/terms" class="hover:text-primary transition-colors">الشروط والأحكام</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Custom fonts or global styles if needed */
body {
  font-family: 'IBM Plex Sans Arabic', sans-serif;
}
</style>
