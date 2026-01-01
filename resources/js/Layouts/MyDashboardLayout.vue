<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { 
    LayoutDashboard, 
    ChefHat, 
    List, 
    Flag, 
    Settings, 
    User,
    LogOut
} from 'lucide-vue-next';

const page = usePage();
const pathname = computed(() => page.url);
const user = computed(() => page.props.auth?.user);

const navItems = computed(() => [
    {
        name: 'my.recipes.index',
        label: 'وصفاتي',
        icon: ChefHat,
    },
    {
        name: 'my.lists.index',
        label: 'قوائمي',
        icon: List
    },
    {
        name: 'my.reports.index',
        label: 'بلاغاتي',
        icon: Flag
    },
    {
        name: 'profile.edit',
        label: 'إعدادات الحساب',
        icon: Settings
    }
]);

const isActive = (item: any) => {
    try {
        const url = route(item.name);
        // Check if current URL starts with the item URL (for nested routes like edit)
        // Check exact match for root items if necessary, but here sub-paths are likely to belong to parent
        return pathname.value === url || pathname.value.startsWith(url + '/');
    } catch (e) {
        return false;
    }
};
</script>

<template>
    <PublicLayout title="لوحة التحكم">
        <div class="container mx-auto py-8 px-4 md:px-6">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 class="text-3xl font-bold">حسابي</h1>
                
                <div class="flex items-center gap-4 bg-muted/50 px-4 py-2 rounded-lg border">
                    <div class="flex flex-col items-end">
                        <span class="text-sm font-bold">{{ user?.name }}</span>
                        <span class="text-xs text-muted-foreground">{{ user?.email }}</span>
                    </div>
                    <img v-if="user?.avatar" :src="`/storage/${user.avatar}`" class="w-10 h-10 rounded-full border-2 border-primary/20 object-cover" />
                    <div v-else class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-primary/20">
                        {{ user?.name?.charAt(0) }}
                    </div>
                    
                    <div class="h-8 w-px bg-border mx-2"></div>
                    
                    <Link 
                        v-if="user?.role === 'admin' || user?.role === 'moderator'"
                        :href="route('dashboard.index')"
                        class="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                    >
                        <LayoutDashboard class="w-4 h-4" />
                        الإدارة
                    </Link>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="md:col-span-1">
                    <nav class="flex flex-col space-y-1 bg-card rounded-lg border p-2 shadow-sm">
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
                    <div class="bg-card rounded-lg border shadow-sm p-6 min-h-[400px]">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </PublicLayout>
</template>
