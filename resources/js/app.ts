import '../css/app.css';
import 'vue-sonner/style.css';
import './bootstrap';

import { createApp, h, DefineComponent } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from 'ziggy-js';

const rawAppName = import.meta.env.VITE_APP_NAME;
const appName = (!rawAppName || rawAppName === 'Laravel' || rawAppName === 'CookingApp') ? 'وصفاتنا' : rawAppName;

createInertiaApp({
    title: (title) => title ? (title.includes('وصفاتنا') ? title : `${title} | ${appName}`) : `${appName} - مجتمع الطبخ السوري`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob<DefineComponent>('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
