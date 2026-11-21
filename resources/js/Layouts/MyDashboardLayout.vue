<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { Toaster, toast } from 'vue-sonner';
import { useColorScheme } from '@/composables/useColorScheme';
import Button from '@/components/ui/Button.vue';
import Sheet from '@/components/ui/Sheet.vue';
import SheetContent from '@/components/ui/SheetContent.vue';
import SheetHeader from '@/components/ui/SheetHeader.vue';
import SheetTitle from '@/components/ui/SheetTitle.vue';
import SheetTrigger from '@/components/ui/SheetTrigger.vue';
import PublicHeader from '@/components/layout/PublicHeader.vue';
import {
  ChefHat,
  Heart,
  Flag,
  Settings,
  Menu,
  Plus,
  CalendarDays
} from 'lucide-vue-next';

const page = usePage();
const user = computed(() => page.props.auth.user);
const isSidebarOpen = ref(false);

const { toasterTheme } = useColorScheme();

// Watch for flash messages
watch(() => page.props.flash, (flash: any) => {
  if (flash?.success) toast.success(flash.success);
  if (flash?.error) toast.error(flash.error);
}, { deep: true, immediate: true });

interface NavItem {
  title: string;
  href: string;
  icon: any;
  active?: boolean;
}

const navItems = computed<NavItem[]>(() => [
  {
    title: 'وصفاتي',
    href: '/my/recipes',
    icon: ChefHat,
    active: page.url.startsWith('/my/recipes')
  },
  {
    title: 'قوائمي المفضلة',
    href: '/my/lists',
    icon: Heart,
    active: page.url.startsWith('/my/lists')
  },
  {
    title: 'خطط الوجبات',
    href: '/my/meal-plans',
    icon: CalendarDays,
    active: page.url.startsWith('/my/meal-plans')
  },
  {
    title: 'بلاغاتي',
    href: '/my/reports',
    icon: Flag,
    active: page.url.startsWith('/my/reports')
  },
  {
    title: 'إعدادات الحساب',
    href: '/settings',
    icon: Settings,
    active: page.url.startsWith('/settings')
  }
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
          direction: 'rtl'
        }
      }"
    />

    <!-- Using PublicHeader for consistency, or we could have a specific dashboard header -->
    <PublicHeader />

    <div class="flex-1 container mx-auto px-4 md:px-6 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar (Desktop) -->
        <aside class="hidden md:block w-64 shrink-0">
          <div class="sticky top-24 space-y-6">
            <!-- User Info Card -->
            <div class="p-4 border rounded-xl bg-card text-card-foreground shadow-sm">
              <div class="flex items-center gap-3 mb-3">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  <img
                    v-if="user?.avatar_url"
                    :src="user.avatar_url"
                    :alt="user.name"
                    width="40"
                    height="40"
                    loading="lazy"
                    fetchpriority="low"
                    decoding="async"
                    class="h-full w-full rounded-full object-cover"
                  />
                  <span v-else>{{ user?.name?.charAt(0) }}</span>
                </div>
                <div class="overflow-hidden">
                  <p class="font-bold truncate">{{ user?.name }}</p>
                  <p class="text-xs text-muted-foreground truncate">{{ user?.email }}</p>
                </div>
              </div>
              <Button asChild class="w-full gap-2" size="sm">
                <Link href="/recipes/new">
                  <Plus aria-hidden="true" class="w-4 h-4" />
                  إضافة وصفة جديدة
                </Link>
              </Button>
            </div>

            <!-- Navigation -->
            <nav aria-label="الحساب الشخصي" class="space-y-1">
              <Link
                v-for="item in navItems"
                :key="item.href"
                :href="item.href"
                :aria-current="item.active ? 'page' : undefined"
                :class="[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  item.active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                ]"
              >
                <component :is="item.icon" aria-hidden="true" class="w-4 h-4" />
                {{ item.title }}
              </Link>
            </nav>
          </div>
        </aside>

        <!-- Mobile Sidebar Trigger -->
        <div class="md:hidden mb-4">
          <Sheet v-model:open="isSidebarOpen">
            <SheetTrigger as-child>
              <Button variant="outline" class="w-full justify-between">
                <span class="flex items-center gap-2">
                  <Menu aria-hidden="true" class="w-4 h-4" />
                  القائمة الشخصية
                </span>
                <span class="text-xs text-muted-foreground">اضغط للفتح</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" class="w-80 sm:w-96 pt-10" dir="rtl">
              <SheetHeader>
                <SheetTitle class="sr-only">القائمة الشخصية</SheetTitle>
              </SheetHeader>
              <div class="space-y-6">
                <!-- User Info -->
                <div class="flex items-center gap-3 pb-4 border-b">
                  <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    <img
                      v-if="user?.avatar_url"
                      :src="user.avatar_url"
                      :alt="user.name"
                      width="48"
                      height="48"
                      loading="lazy"
                      fetchpriority="low"
                      decoding="async"
                      class="h-full w-full rounded-full object-cover"
                    />
                    <span v-else>{{ user?.name?.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="font-bold">{{ user?.name }}</p>
                    <p class="text-xs text-muted-foreground">{{ user?.email }}</p>
                  </div>
                </div>

                <Button asChild class="w-full gap-2">
                  <Link href="/recipes/new" @click="isSidebarOpen = false">
                    <Plus aria-hidden="true" class="w-4 h-4" />
                    إضافة وصفة جديدة
                  </Link>
                </Button>

                <nav aria-label="الحساب الشخصي للجوال" class="space-y-1">
                  <Link
                    v-for="item in navItems"
                    :key="item.href"
                    :href="item.href"
                    :aria-current="item.active ? 'page' : undefined"
                    @click="isSidebarOpen = false"
                    :class="[
                      'flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors',
                      item.active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    ]"
                  >
                    <component :is="item.icon" aria-hidden="true" class="w-5 h-5" />
                    {{ item.title }}
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
