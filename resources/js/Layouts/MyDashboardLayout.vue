<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { Toaster, toast } from 'vue-sonner';
import {
  CalendarDays,
  ChefHat,
  Flag,
  Heart,
  Menu,
  Plus,
  Settings,
} from 'lucide-vue-next';
import PublicHeader from '@/components/layout/PublicHeader.vue';
import Avatar from '@/components/ui/Avatar.vue';
import AvatarFallback from '@/components/ui/AvatarFallback.vue';
import AvatarImage from '@/components/ui/AvatarImage.vue';
import Button from '@/components/ui/Button.vue';
import Separator from '@/components/ui/Separator.vue';
import Sheet from '@/components/ui/Sheet.vue';
import SheetContent from '@/components/ui/SheetContent.vue';
import SheetHeader from '@/components/ui/SheetHeader.vue';
import SheetTitle from '@/components/ui/SheetTitle.vue';
import SheetTrigger from '@/components/ui/SheetTrigger.vue';
import { useColorScheme } from '@/composables/useColorScheme';
import { useGlobalSearchShortcut } from '@/composables/useGlobalSearch';
import { cn } from '@/lib/utils';

// MyDashboardLayout does not sit inside PublicLayout, so it owns the global search shortcut here.
useGlobalSearchShortcut();

const page = usePage();
const user = computed(() => (page.props.auth as any)?.user ?? null);
const pathname = computed(() => page.url.split('?')[0]);
const isSidebarOpen = ref(false);

const { toasterTheme } = useColorScheme();

watch(
  () => page.props.flash,
  (flash: any) => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  },
  { deep: true, immediate: true },
);

interface NavItem {
  title: string;
  href: string;
  icon: any;
  active: boolean;
}

const navItems = computed<NavItem[]>(() => [
  {
    title: 'وصفاتي',
    href: '/my/recipes',
    icon: ChefHat,
    active: pathname.value === '/my/recipes' || pathname.value.startsWith('/my/recipes/'),
  },
  {
    title: 'قوائمي المفضلة',
    href: '/my/lists',
    icon: Heart,
    active: pathname.value === '/my/lists' || pathname.value.startsWith('/my/lists/'),
  },
  {
    title: 'خطط الوجبات',
    href: '/my/meal-plans',
    icon: CalendarDays,
    active: pathname.value === '/my/meal-plans' || pathname.value.startsWith('/my/meal-plans/'),
  },
  {
    title: 'بلاغاتي',
    href: '/my/reports',
    icon: Flag,
    active: pathname.value === '/my/reports' || pathname.value.startsWith('/my/reports/'),
  },
  {
    title: 'إعدادات الحساب',
    href: '/settings',
    icon: Settings,
    active: pathname.value === '/settings' || pathname.value.startsWith('/settings/'),
  },
]);
</script>

<template>
  <div class="min-h-dvh bg-background font-sans antialiased flex flex-col" dir="rtl">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
    >
      تخطي إلى المحتوى الرئيسي
    </a>

    <Toaster
      position="top-center"
      :theme="toasterTheme"
      richColors
      closeButton
      :toastOptions="{
        style: {
          direction: 'rtl',
        },
      }"
    />

    <PublicHeader />

    <div class="flex-1 container max-w-7xl mx-auto px-4 md:px-8 lg:px-6 xl:px-8 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar (Desktop) -->
        <aside class="hidden md:block w-64 shrink-0">
          <div class="sticky top-24 space-y-4">
            <!-- User Info Card -->
            <div class="p-4 border border-border rounded-xl bg-card text-card-foreground shadow-2xs">
              <div class="flex items-center gap-3 mb-3">
                <Avatar class="h-10 w-10 shrink-0 border border-border/50">
                  <AvatarImage :src="user?.avatar_url || undefined" :alt="user?.name ?? ''" />
                  <AvatarFallback>{{ user?.name?.charAt(0) }}</AvatarFallback>
                </Avatar>
                <div class="min-w-0 text-start">
                  <p class="font-bold text-sm text-foreground truncate">{{ user?.name }}</p>
                  <p class="text-xs text-muted-foreground truncate">{{ user?.email }}</p>
                </div>
              </div>
              <Button as-child class="w-full gap-2" size="sm">
                <Link href="/recipes/new">
                  <Plus aria-hidden="true" class="h-4 w-4" />
                  <span>إضافة وصفة جديدة</span>
                </Link>
              </Button>
            </div>

            <!-- Navigation -->
            <div class="rounded-xl border border-border bg-card p-2 shadow-2xs">
              <nav aria-label="الحساب الشخصي" class="space-y-1">
                <Link
                  v-for="item in navItems"
                  :key="item.href"
                  :href="item.href"
                  :aria-current="item.active ? 'page' : undefined"
                  :class="
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      item.active
                        ? 'bg-primary text-primary-foreground shadow-2xs'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )
                  "
                >
                  <component :is="item.icon" aria-hidden="true" class="h-4 w-4 shrink-0" />
                  <span class="truncate">{{ item.title }}</span>
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        <!-- Mobile Sidebar Trigger -->
        <div class="md:hidden">
          <Sheet v-model:open="isSidebarOpen">
            <SheetTrigger as-child>
              <Button type="button" variant="outline" class="w-full justify-between">
                <span class="flex items-center gap-2">
                  <Menu aria-hidden="true" class="h-4 w-4" />
                  <span>القائمة الشخصية</span>
                </span>
                <span class="text-xs text-muted-foreground">اضغط للفتح</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" class="w-80 sm:w-96 pt-10" dir="rtl">
              <SheetHeader>
                <SheetTitle class="sr-only">القائمة الشخصية</SheetTitle>
              </SheetHeader>
              <div class="space-y-5">
                <!-- User Info -->
                <div class="flex items-center gap-3 pb-1">
                  <Avatar class="h-12 w-12 shrink-0 border border-border/50">
                    <AvatarImage :src="user?.avatar_url || undefined" :alt="user?.name ?? ''" />
                    <AvatarFallback>{{ user?.name?.charAt(0) }}</AvatarFallback>
                  </Avatar>
                  <div class="min-w-0 text-start">
                    <p class="font-bold text-foreground truncate">{{ user?.name }}</p>
                    <p class="text-xs text-muted-foreground truncate">{{ user?.email }}</p>
                  </div>
                </div>

                <Separator />

                <Button as-child class="w-full gap-2">
                  <Link href="/recipes/new" @click="isSidebarOpen = false">
                    <Plus aria-hidden="true" class="h-4 w-4" />
                    <span>إضافة وصفة جديدة</span>
                  </Link>
                </Button>

                <nav aria-label="الحساب الشخصي للجوال" class="space-y-1">
                  <Link
                    v-for="item in navItems"
                    :key="item.href"
                    :href="item.href"
                    :aria-current="item.active ? 'page' : undefined"
                    :class="
                      cn(
                        'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                        item.active
                          ? 'bg-primary text-primary-foreground shadow-2xs'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      )
                    "
                    @click="isSidebarOpen = false"
                  >
                    <component :is="item.icon" aria-hidden="true" class="h-5 w-5 shrink-0" />
                    <span class="truncate">{{ item.title }}</span>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <!-- Main Content -->
        <main id="main-content" tabindex="-1" class="flex-1 min-w-0 focus:outline-none">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
