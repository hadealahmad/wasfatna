import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [
        laravel({
            input: ['resources/js/app.ts'],
            ssr: 'resources/js/ssr.ts',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    build: {
        rollupOptions: {
            output: isSsrBuild ? {} : {
                manualChunks: {
                    'vendor-vue': ['vue', '@inertiajs/vue3'],
                    'vendor-ui': ['radix-vue', 'lucide-vue-next', 'clsx', 'tailwind-merge', 'class-variance-authority'],
                    'vendor-draggable': ['vuedraggable'],
                },
            },
        },
    },
}));
