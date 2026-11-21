<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { Button } from '@/components/ui';

defineProps<{
    error?: string;
}>();
</script>

<template>
    <Head title="تسجيل الدخول" />

    <main id="main-content" class="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div class="w-full max-w-md space-y-8 bg-card text-card-foreground p-8 rounded-xl shadow-lg border">
            <div class="text-center">
                <h1 class="text-3xl font-extrabold text-foreground">لوحة التحكم</h1>
                <p class="mt-2 text-sm text-muted-foreground">
                    يرجى تسجيل الدخول للمتابعة
                </p>
            </div>

            <div v-if="error" role="alert" class="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm text-center">
                {{ error }}
            </div>

            <div class="mt-8">
                <Button as="a" href="/auth/google/redirect" class="w-full py-6 text-lg font-semibold flex items-center justify-center gap-3" variant="outline">
                    <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.54-5.17 3.54-8.97Z" />
                        <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96h-3.98v3.14C3.515 21.3 7.565 24 12.255 24Z" />
                        <path fill="#FBBC05" d="M5.535 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62h-3.98a11.74 11.74 0 0 0 0 10.76l3.98-3.14Z" />
                        <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.7 6.62l3.98 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
                    </svg>
                    تسجيل الدخول بواسطة Google
                </Button>
            </div>

            <p class="text-center text-xs text-muted-foreground pt-4">
                حصري للمشرفين والمديرين
            </p>
        </div>
    </main>
</template>
