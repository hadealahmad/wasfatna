<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { Button } from '@/components/ui';
import { LogIn } from 'lucide-vue-next';

defineProps<{
    error?: string;
}>();
</script>

<template>
    <Head title="تسجيل الدخول" />

    <div class="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-foreground">لوحة التحكم</h2>
                <p class="mt-2 text-sm text-muted-foreground">
                    يرجى تسجيل الدخول للمتابعة
                </p>
            </div>

            <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                {{ error }}
            </div>

            <div class="mt-8">
                <a href="/auth/google/redirect" class="block w-full">
                    <Button class="w-full py-6 text-lg font-semibold flex items-center justify-center gap-3" variant="outline">
                        <img src="https://www.google.com/favicon.ico" class="w-5 h-5" alt="Google" />
                        تسجيل الدخول بواسطة Google
                    </Button>
                </a>
            </div>

            <p class="text-center text-xs text-muted-foreground pt-4">
                حصري للمشرفين والمديرين
            </p>
        </div>
    </div>
</template>
