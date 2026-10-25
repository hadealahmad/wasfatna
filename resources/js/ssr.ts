import { createInertiaApp } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h, DefineComponent } from 'vue';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from 'ziggy-js';

const rawAppName = import.meta.env.VITE_APP_NAME;
const appName = (!rawAppName || rawAppName === 'Laravel' || rawAppName === 'CookingApp') ? 'وصفاتنا' : rawAppName;

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => title ? (title.includes('وصفاتنا') ? title : `${title} | ${appName}`) : `${appName} - مجتمع الطبخ السوري`,
        resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob<DefineComponent>('./Pages/**/*.vue')),
        setup({ App, props, plugin }) {
            const app = createSSRApp({ render: () => h(App, props) }).use(plugin);
            const ziggyConfig = (page.props as any)?.ziggy;
            if (ziggyConfig && ziggyConfig.location) {
                app.use(ZiggyVue, {
                    ...ziggyConfig,
                    location: new URL(ziggyConfig.location),
                });
            } else {
                app.use(ZiggyVue);
            }
            return app;
        },
    })
);
