<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { AlertCircle, ArrowRight } from 'lucide-vue-next';
import AppearanceMenu from '@/components/AppearanceMenu.vue';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/components/ui';

const props = defineProps<{
  error?: string;
}>();

const page = usePage();
const errorMessage = computed(
  () => props.error || ((page.props.flash as any)?.error as string | undefined) || null,
);
</script>

<template>
  <Head title="تسجيل الدخول" />

  <div class="min-h-dvh flex flex-col bg-background font-sans antialiased" dir="rtl">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
    >
      تخطي إلى المحتوى الرئيسي
    </a>

    <!-- Minimal top bar matching the design system -->
    <header class="w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight aria-hidden="true" class="h-4 w-4" />
          <span>العودة إلى الرئيسية</span>
        </Link>
        <AppearanceMenu />
      </div>
    </header>

    <main
      id="main-content"
      tabindex="-1"
      class="flex-1 flex items-center justify-center px-4 py-12 focus:outline-none"
    >
      <Card class="w-full max-w-md border-border bg-card text-card-foreground shadow-sm">
        <CardHeader class="items-center text-center space-y-4 pb-2">
          <Link href="/" class="inline-flex items-center justify-center">
            <img
              src="/logo-light.svg"
              alt="وصفاتنا"
              width="144"
              height="45"
              decoding="async"
              class="logo-light h-10 w-auto object-contain"
            />
            <img
              src="/logo-dark.svg"
              alt="وصفاتنا"
              width="144"
              height="45"
              decoding="async"
              class="logo-dark h-10 w-auto object-contain"
            />
          </Link>
          <div class="space-y-1.5">
            <h1 class="text-2xl font-bold tracking-tight text-foreground leading-none">
              تسجيل الدخول إلى وصفاتنا
            </h1>
            <CardDescription class="text-sm text-muted-foreground">
              سجّل دخولك بحساب Google لمشاركة وصفاتك، حفظ قوائمك المفضلة، وتنظيم خطط وجباتك.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent class="space-y-6 pt-4">
          <Alert v-if="errorMessage" variant="destructive">
            <AlertCircle aria-hidden="true" class="h-4 w-4" />
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>

          <Button
            as-child
            size="lg"
            class="w-full h-12 text-base font-semibold gap-3"
          >
            <a href="/auth/google/redirect">
              <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>المتابعة بحساب Google</span>
            </a>
          </Button>

          <Separator />

          <p class="text-center text-xs leading-relaxed text-muted-foreground">
            بتسجيل الدخول، فإنك توافق على
            <Link href="/terms" class="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors">
              الشروط والأحكام
            </Link>
            و
            <Link href="/privacy" class="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors">
              سياسة الخصوصية
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  </div>
</template>
