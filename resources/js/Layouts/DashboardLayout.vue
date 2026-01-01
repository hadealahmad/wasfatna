<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import { 
    LayoutDashboard, 
    FileText, 
    Users, 
    MapPin, 
    Settings, 
    Flag, 
    Tag,
    LogOut,
    Upload
} from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';

const page = usePage();
const pathname = computed(() => page.url);
const user = computed(() => page.props.auth?.user);
const isAdmin = computed(() => user.value?.role === 'admin');

const navItems = computed(() => [
    {
        name: 'dashboard.index',
        label: 'نظرة عامة',
        icon: LayoutDashboard,
        exact: true
    },
    {
        name: 'dashboard.recipes',
        label: 'الوصفات',
        icon: FileText
    },
    {
        name: 'dashboard.lists',
        label: 'القوائم',
        icon: FileText
    },
    ...(isAdmin.value ? [
        {
            name: 'dashboard.users',
            label: 'المستخدمين',
            icon: Users
        },
        {
            name: 'dashboard.cities',
            label: 'المدن',
            icon: MapPin
        },
        {
            name: 'dashboard.import',
            label: 'استيراد وصفات',
            icon: Upload
        },
        {
            name: 'dashboard.settings',
            label: 'الإعدادات',
            icon: Settings
        }
    ] : []),
    {
        name: 'dashboard.reports',
        label: 'البلاغات والملاحظات',
        icon: Flag
    },
    {
        name: 'dashboard.tags',
        label: 'الوسوم',
        icon: Tag
    }
]);

const isActive = (item: any) => {
    try {
        const url = route(item.name);
        if (item.exact) {
            return pathname.value === url;
        }
        return pathname.value.startsWith(url);
    } catch (e) {
        return false;
    }
};
</script>

<template>
    <PublicLayout>
        <div class="container mx-auto py-8 px-4 md:px-6">
            <h1 class="text-3xl font-bold mb-8">لوحة التحكم</h1>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="md:col-span-1">
                    <nav class="flex flex-col space-y-1">
                        <Link
                            v-for="item in navItems"
                            :key="item.name"
                            :href="route(item.name)"
                            :class="cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                isActive(item)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-foreground'
                            )"
                        >
                            <component :is="item.icon" class="h-4 w-4" />
                            {{ item.label }}
                        </Link>
                    </nav>
                </div>
                <div class="md:col-span-3">
                    <slot />
                </div>
            </div>
        </div>
    </PublicLayout>
</template>
