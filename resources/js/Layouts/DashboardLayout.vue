<script setup lang="ts">
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import {
  CalendarDays,
  FileText,
  Flag,
  LayoutDashboard,
  ListChecks,
  MapPin,
  Settings,
  Tag,
  Upload,
  Users,
} from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { cn } from '@/lib/utils';

const page = usePage();
const pathname = computed(() => page.url.split('?')[0]);
const user = computed(() => (page.props.auth as any)?.user ?? null);
const isAdmin = computed(() => user.value?.role === 'admin');

interface DashboardNavItem {
  name: string;
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
}

const navItems = computed<DashboardNavItem[]>(() => [
  {
    name: 'dashboard.index',
    href: '/dashboard',
    label: 'نظرة عامة',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: 'dashboard.recipes',
    href: '/dashboard/recipes',
    label: 'الوصفات',
    icon: FileText,
  },
  {
    name: 'dashboard.lists',
    href: '/dashboard/lists',
    label: 'القوائم',
    icon: ListChecks,
  },
  ...(isAdmin.value
    ? [
        {
          name: 'dashboard.users',
          href: '/dashboard/users',
          label: 'المستخدمين',
          icon: Users,
        },
        {
          name: 'dashboard.cities',
          href: '/dashboard/cities',
          label: 'المدن',
          icon: MapPin,
        },
        {
          name: 'dashboard.import',
          href: '/dashboard/import',
          label: 'استيراد وصفات',
          icon: Upload,
        },
        {
          name: 'dashboard.settings',
          href: '/dashboard/settings',
          label: 'الإعدادات',
          icon: Settings,
        },
        {
          name: 'dashboard.meal-plan-presets',
          href: '/dashboard/meal-plan-presets',
          label: 'قوالب خطط الوجبات',
          icon: CalendarDays,
        },
      ]
    : []),
  {
    name: 'dashboard.reports',
    href: '/dashboard/reports',
    label: 'البلاغات والملاحظات',
    icon: Flag,
  },
  {
    name: 'dashboard.tags',
    href: '/dashboard/tags',
    label: 'الوسوم',
    icon: Tag,
  },
]);

function itemHref(item: DashboardNavItem): string {
  try {
    return route(item.name);
  } catch {
    return item.href;
  }
}

function isActive(item: DashboardNavItem): boolean {
  let targetPath = item.href;
  try {
    targetPath = route(item.name, undefined, false);
  } catch {
    // Fallback when Ziggy is not present in SSR page props
  }
  if (item.exact) {
    return pathname.value === targetPath;
  }
  return pathname.value === targetPath || pathname.value.startsWith(`${targetPath}/`);
}
</script>

<template>
  <PublicLayout>
    <div class="container max-w-7xl mx-auto py-8 px-4 md:px-8 lg:px-6 xl:px-8">
      <div class="mb-8 space-y-1">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">لوحة التحكم</h1>
        <p class="text-sm text-muted-foreground">إدارة الوصفات والقوائم والمستخدمين وإعدادات المنصة</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside class="md:col-span-1">
          <div class="md:sticky md:top-24 rounded-xl border border-border bg-card p-2 shadow-2xs">
            <nav aria-label="لوحة التحكم" class="flex flex-col space-y-1">
              <Link
                v-for="item in navItems"
                :key="item.name"
                :href="itemHref(item)"
                :aria-current="isActive(item) ? 'page' : undefined"
                :class="
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive(item)
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )
                "
              >
                <component :is="item.icon" aria-hidden="true" class="h-4 w-4 shrink-0" />
                <span class="truncate">{{ item.label }}</span>
              </Link>
            </nav>
          </div>
        </aside>
        <div class="md:col-span-3 min-w-0">
          <slot />
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
