<script setup lang="ts">
import { computed, inject, onUnmounted, ref, watch } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { DialogClose } from 'radix-vue';
import {
  BookHeart,
  CalendarDays,
  ChefHat,
  ChevronDown,
  Dices,
  FileText,
  Flag,
  Grip,
  Info,
  LayoutDashboard,
  LogOut,
  MapPin,
  PlusCircle,
  Search,
  Shield,
  User as UserIcon,
  X,
} from 'lucide-vue-next';
import AppearanceMenu from '@/components/AppearanceMenu.vue';
import ProjectIcon from '@/components/ProjectIcon.vue';
import UserNav from '@/components/layout/UserNav.vue';
import GlobalSearch from '@/components/search/GlobalSearch.vue';
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
import { openGlobalSearch } from '@/composables/useGlobalSearch';
import { cn } from '@/lib/utils';

const page = usePage();
const user = computed(() => (page.props.auth as any)?.user ?? null);
const isAuthenticated = computed(() => Boolean(user.value));
const isAdminOrModerator = computed(
  () => user.value?.role === 'admin' || user.value?.role === 'moderator',
);

const routeFn = inject<((name: string, params?: any, absolute?: boolean) => string) | undefined>('route', undefined);
const logoutHref = computed(() => {
  try {
    return routeFn ? routeFn('logout') : route('logout');
  } catch {
    return '/logout';
  }
});

const pathname = computed(() => page.url.split('?')[0]);

function isNavActive(href: string): boolean {
  const current = pathname.value;
  if (href === '/') return current === '/';
  if (href === '/recipes') {
    return current === '/recipes' || (current.startsWith('/recipes/') && current !== '/recipes/new');
  }
  return current === href || current.startsWith(`${href}/`);
}

const NAV_TRIGGER_CLASS =
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-3 xl:px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50';

const primaryNavItems = [
  { href: '/cities', label: 'المدن', icon: MapPin },
  { href: '/lists', label: 'القوائم', icon: BookHeart },
  { href: '/meal-plans/browse', label: 'خطط الوجبات', icon: CalendarDays },
  { href: '/randomizer', label: 'شو نطبخ؟', icon: Dices },
] as const;

const allSectionTiles = [
  { href: '/recipes', label: 'جميع الوصفات', projectIcon: 'recipes' },
  { href: '/cities', label: 'المدن', projectIcon: 'cities' },
  { href: '/lists', label: 'القوائم', projectIcon: 'lists' },
  { href: '/meal-plans/browse', label: 'خطط الوجبات', projectIcon: 'meal_plans' },
  { href: '/randomizer', label: 'شو نطبخ؟', projectIcon: 'randomizer' },
  { href: '/search', label: 'البحث المتقدم', projectIcon: 'search' },
] as const;

const footerLinks = [
  { href: '/about', label: 'عن وصفاتنا', icon: Info },
  { href: '/privacy', label: 'سياسة الخصوصية', icon: Shield },
  { href: '/terms', label: 'الشروط والأحكام', icon: FileText },
] as const;

const mobileAccountLinks = computed(() => [
  { href: '/my/recipes', label: 'وصفاتي', icon: ChefHat },
  { href: '/my/lists', label: 'قوائمي', icon: BookHeart },
  { href: '/my/meal-plans', label: 'خطط الوجبات', icon: CalendarDays },
  { href: '/my/reports', label: 'بلاغاتي', icon: Flag },
  { href: '/settings', label: 'الملف الشخصي', icon: UserIcon },
  ...(isAdminOrModerator.value
    ? [{ href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard }]
    : []),
]);

// Mobile full-screen sheet with circular reveal from trigger button
const isMobileMenuOpen = ref(false);
const menuBtnRef = ref<HTMLElement | { $el?: HTMLElement } | null>(null);
const menuOrigin = ref({ x: 0, y: 0 });

function recordMenuOrigin(): void {
  const el =
    menuBtnRef.value instanceof HTMLElement
      ? menuBtnRef.value
      : menuBtnRef.value?.$el ?? null;
  if (!el) return;
  const r = el.getBoundingClientRect();
  menuOrigin.value = {
    x: Math.round(r.left + r.width / 2),
    y: Math.round(r.top + r.height / 2),
  };
}

function openSearchFromMobileMenu(): void {
  isMobileMenuOpen.value = false;
  openGlobalSearch();
}

// Desktop "المزيد" click-only mega panel (closes on outside click, Escape, or navigation)
const moreOpen = ref(false);
const moreBtnRef = ref<HTMLButtonElement | null>(null);
const morePanelRef = ref<HTMLDivElement | null>(null);

function handleOutsidePointerDown(e: PointerEvent): void {
  const target = e.target as Node | null;
  if (!target) return;
  if (morePanelRef.value?.contains(target) || moreBtnRef.value?.contains(target)) {
    return;
  }
  moreOpen.value = false;
}

function handleMoreKeyDown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    moreOpen.value = false;
    moreBtnRef.value?.focus();
  }
}

watch(moreOpen, (open) => {
  if (typeof document === 'undefined') return;
  if (open) {
    document.addEventListener('pointerdown', handleOutsidePointerDown);
    document.addEventListener('keydown', handleMoreKeyDown);
  } else {
    document.removeEventListener('pointerdown', handleOutsidePointerDown);
    document.removeEventListener('keydown', handleMoreKeyDown);
  }
});

watch(pathname, () => {
  moreOpen.value = false;
  isMobileMenuOpen.value = false;
});

onUnmounted(() => {
  if (typeof document === 'undefined') return;
  document.removeEventListener('pointerdown', handleOutsidePointerDown);
  document.removeEventListener('keydown', handleMoreKeyDown);
});
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div
      class="container relative flex h-16 max-w-7xl mx-auto items-center px-4 md:px-8 lg:px-6 xl:px-8 justify-between lg:justify-normal"
      dir="rtl"
    >
      <!-- Mobile Menu Trigger -->
      <div class="flex items-center lg:hidden">
        <Sheet v-model:open="isMobileMenuOpen">
          <SheetTrigger as-child>
            <Button
              ref="menuBtnRef"
              type="button"
              aria-label="فتح القائمة"
              variant="ghost"
              size="icon"
              class="h-9 w-9 sm:h-10 sm:w-10"
              @click="recordMenuOrigin"
            >
              <Grip aria-hidden="true" class="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            :show-close="false"
            dir="rtl"
            class="sz-menu-reveal sz-scroll flex flex-col w-full max-w-full border-0 bg-background p-0 overflow-y-auto sm:max-w-full"
            :style="{ '--sz-menu-x': `${menuOrigin.x}px`, '--sz-menu-y': `${menuOrigin.y}px` }"
          >
            <SheetHeader
              class="flex-row items-center justify-between gap-2 space-y-0 px-4 pt-4 pb-2 text-start shrink-0"
            >
              <SheetTitle class="flex h-10 items-center">
                <Link href="/" class="flex items-center" @click="isMobileMenuOpen = false">
                  <img
                    src="/logo-light.svg"
                    alt="وصفاتنا"
                    width="128"
                    height="40"
                    decoding="async"
                    class="logo-light h-8 w-auto object-contain"
                  />
                  <img
                    src="/logo-dark.svg"
                    alt="وصفاتنا"
                    width="128"
                    height="40"
                    decoding="async"
                    class="logo-dark h-8 w-auto object-contain"
                  />
                </Link>
              </SheetTitle>
              <DialogClose as-child>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="h-10 w-10 shrink-0"
                  title="إغلاق"
                  aria-label="إغلاق القائمة"
                >
                  <X aria-hidden="true" class="h-6 w-6" />
                </Button>
              </DialogClose>
            </SheetHeader>

            <div class="flex flex-1 flex-col justify-between gap-6 px-6 sm:px-10 pb-6 pt-2">
              <div class="flex flex-col gap-5">
                <!-- Mobile Quick Search Trigger -->
                <button
                  type="button"
                  aria-label="بحث سريع في وصفاتنا"
                  class="flex w-full items-center gap-2.5 rounded-2xl border border-border/80 bg-muted/40 px-4 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  @click="openSearchFromMobileMenu"
                >
                  <Search aria-hidden="true" class="h-4 w-4 text-primary shrink-0" />
                  <span class="truncate">ابحث عن وصفة، مدينة، قائمة، أو مكون...</span>
                </button>

                <!-- Sections Tile Grid -->
                <nav aria-label="التصفح الرئيسي للجوال" class="px-1">
                  <p class="mb-2 px-1 text-xs font-bold text-muted-foreground/80">
                    أقسام وصفاتنا
                  </p>
                  <ul class="grid grid-cols-3 gap-x-2 gap-y-3 py-1">
                    <li v-for="item in allSectionTiles" :key="item.href">
                      <Link
                        :href="item.href"
                        prefetch
                        :aria-current="isNavActive(item.href) ? 'page' : undefined"
                        class="group flex h-full select-none flex-col items-center gap-2 rounded-lg px-1 py-2.5 text-center no-underline outline-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                        @click="isMobileMenuOpen = false"
                      >
                        <ProjectIcon
                          :name="item.projectIcon"
                          :class="
                            cn(
                              'h-9 w-9 shrink-0 motion-safe:transition-transform group-hover:scale-110',
                              isNavActive(item.href) && 'scale-105',
                            )
                          "
                        />
                        <span
                          :class="
                            cn(
                              'line-clamp-2 text-xs font-medium leading-tight transition-colors',
                              isNavActive(item.href)
                                ? 'text-primary'
                                : 'text-foreground group-hover:text-primary',
                            )
                          "
                        >
                          {{ item.label }}
                        </span>
                      </Link>
                    </li>
                  </ul>
                </nav>

                <!-- Account Area -->
                <div class="space-y-3">
                  <Separator />
                  <template v-if="isAuthenticated && user">
                    <div
                      class="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3"
                    >
                      <div class="flex items-center gap-3 min-w-0">
                        <Avatar class="h-10 w-10 shrink-0 border border-border/50">
                          <AvatarImage :src="user.avatar_url || undefined" :alt="user.name" />
                          <AvatarFallback>{{ user.name?.charAt(0) }}</AvatarFallback>
                        </Avatar>
                        <div class="min-w-0 text-start">
                          <p class="text-sm font-semibold text-foreground truncate">
                            {{ user.name }}
                          </p>
                          <p class="text-xs text-muted-foreground truncate">
                            {{ user.email }}
                          </p>
                        </div>
                      </div>
                      <Button as-child size="sm" class="shrink-0 gap-1.5">
                        <Link href="/recipes/new" @click="isMobileMenuOpen = false">
                          <PlusCircle aria-hidden="true" class="h-4 w-4" />
                          <span>وصفة جديدة</span>
                        </Link>
                      </Button>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <Link
                        v-for="item in mobileAccountLinks"
                        :key="item.href"
                        :href="item.href"
                        :aria-current="isNavActive(item.href) ? 'page' : undefined"
                        :class="
                          cn(
                            'flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2.5 text-sm font-medium transition-colors',
                            isNavActive(item.href)
                              ? 'border-primary/40 bg-accent text-primary'
                              : 'bg-card/50 text-foreground hover:bg-accent hover:text-accent-foreground',
                          )
                        "
                        @click="isMobileMenuOpen = false"
                      >
                        <component :is="item.icon" aria-hidden="true" class="h-4 w-4 shrink-0" />
                        <span class="truncate">{{ item.label }}</span>
                      </Link>
                    </div>

                    <Link
                      :href="logoutHref"
                      method="post"
                      as="button"
                      class="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      @click="isMobileMenuOpen = false"
                    >
                      <LogOut aria-hidden="true" class="h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </Link>
                  </template>

                  <template v-else>
                    <div
                      class="flex flex-col items-center gap-3 rounded-xl border border-border/70 bg-card p-4 text-center"
                    >
                      <p class="text-xs text-muted-foreground">
                        سجّل الدخول بحساب Google لمشاركة وصفاتك وحفظ قوائمك وخطط وجباتك
                      </p>
                      <Button as-child variant="outline" class="w-full gap-2">
                        <a href="/auth/google/redirect">
                          <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span>تسجيل الدخول بحساب Google</span>
                        </a>
                      </Button>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Secondary Footer Links -->
              <div>
                <Separator class="my-2" />
                <div
                  class="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 px-2 pt-2 pb-2 text-xs text-muted-foreground"
                >
                  <Link
                    v-for="link in footerLinks"
                    :key="link.href"
                    :href="link.href"
                    class="flex items-center gap-1.5 hover:text-primary transition-colors"
                    @click="isMobileMenuOpen = false"
                  >
                    <component :is="link.icon" aria-hidden="true" class="h-3.5 w-3.5" />
                    <span>{{ link.label }}</span>
                  </Link>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <!-- Logo (centred on mobile, start on desktop) -->
      <div
        class="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex shrink-0 lg:me-3 xl:me-8"
      >
        <Link href="/" class="flex items-center gap-2">
          <img
            src="/logo-light.svg"
            alt="وصفاتنا"
            width="128"
            height="40"
            decoding="async"
            class="logo-light h-8 sm:h-10 w-auto object-contain"
          />
          <img
            src="/logo-dark.svg"
            alt="وصفاتنا"
            width="128"
            height="40"
            decoding="async"
            class="logo-dark h-8 sm:h-10 w-auto object-contain"
          />
        </Link>
      </div>

      <!-- Desktop Navigation -->
      <nav aria-label="التصفح الرئيسي" class="hidden lg:flex items-center gap-0.5 xl:gap-1" dir="rtl">
        <Link
          v-for="item in primaryNavItems"
          :key="item.href"
          :href="item.href"
          prefetch
          :aria-current="isNavActive(item.href) ? 'page' : undefined"
          :class="cn(NAV_TRIGGER_CLASS, isNavActive(item.href) && 'text-primary bg-accent/50')"
        >
          <component :is="item.icon" aria-hidden="true" class="h-4 w-4 me-2" />
          <span>{{ item.label }}</span>
        </Link>

        <!-- Click-only "المزيد" Mega Panel Trigger -->
        <button
          ref="moreBtnRef"
          type="button"
          :aria-expanded="moreOpen"
          aria-controls="wasfatna-more-panel"
          :class="cn(NAV_TRIGGER_CLASS, moreOpen && 'text-accent-foreground bg-accent/50')"
          @click="moreOpen = !moreOpen"
        >
          <Grip aria-hidden="true" class="h-4 w-4 me-2" />
          <span>المزيد</span>
          <ChevronDown
            aria-hidden="true"
            :class="cn('h-3 w-3 ms-1 transition-transform duration-200', moreOpen && 'rotate-180')"
          />
        </button>
      </nav>

      <!-- Desktop "المزيد" Mega Panel (kept in DOM for crawlers, hidden until opened) -->
      <div
        ref="morePanelRef"
        :class="cn('fixed inset-x-0 top-16 z-50 justify-center', moreOpen ? 'flex' : 'hidden')"
      >
        <div class="sz-menu-pop">
          <div
            id="wasfatna-more-panel"
            role="region"
            aria-label="المزيد من أقسام الموقع"
            class="w-[min(720px,92vw)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow"
          >
            <div class="p-4">
              <ul class="grid grid-cols-3 sm:grid-cols-6 gap-1">
                <li v-for="item in allSectionTiles" :key="item.href">
                  <Link
                    :href="item.href"
                    prefetch
                    :aria-current="isNavActive(item.href) ? 'page' : undefined"
                    class="group flex h-full select-none flex-col items-center gap-2 rounded-lg px-1 py-2.5 text-center no-underline outline-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    @click="moreOpen = false"
                  >
                    <ProjectIcon
                      :name="item.projectIcon"
                      :class="
                        cn(
                          'h-9 w-9 shrink-0 motion-safe:transition-transform group-hover:scale-110',
                          isNavActive(item.href) && 'scale-105',
                        )
                      "
                    />
                    <span
                      :class="
                        cn(
                          'line-clamp-2 text-xs font-medium leading-tight transition-colors',
                          isNavActive(item.href)
                            ? 'text-primary'
                            : 'text-foreground group-hover:text-primary',
                        )
                      "
                    >
                      {{ item.label }}
                    </span>
                  </Link>
                </li>
              </ul>

              <Separator class="my-4" />
              <div class="flex flex-wrap justify-center gap-4 py-1 text-xs text-muted-foreground">
                <template v-for="(link, index) in footerLinks" :key="link.href">
                  <span v-if="index > 0" aria-hidden="true">•</span>
                  <Link
                    :href="link.href"
                    class="flex items-center gap-1 transition-colors hover:text-primary"
                    @click="moreOpen = false"
                  >
                    <component :is="link.icon" aria-hidden="true" class="h-3.5 w-3.5" />
                    <span>{{ link.label }}</span>
                  </Link>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls: Search, Appearance, Separator, Account/Login -->
      <div class="flex flex-1 items-center justify-end gap-1.5 sm:gap-2">
        <GlobalSearch variant="icon" class="lg:hidden" />
        <GlobalSearch class="hidden lg:inline-flex" />
        <AppearanceMenu />
        <div class="w-px h-6 bg-border shrink-0" />

        <template v-if="isAuthenticated">
          <Button
            as-child
            size="sm"
            class="hidden sm:inline-flex h-9 w-9 px-0 xl:w-auto xl:px-3 gap-1.5"
          >
            <Link href="/recipes/new" aria-label="إضافة وصفة جديدة" title="إضافة وصفة جديدة">
              <PlusCircle aria-hidden="true" class="h-4 w-4" />
              <span class="sr-only xl:not-sr-only">وصفة جديدة</span>
            </Link>
          </Button>
          <UserNav />
        </template>

        <template v-else>
          <Button
            as-child
            variant="outline"
            class="h-9 w-9 gap-2 px-0 sm:h-10 sm:w-10 xl:w-auto xl:px-4"
          >
            <a href="/auth/google/redirect" aria-label="تسجيل الدخول" class="flex items-center gap-2">
              <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span class="sr-only xl:not-sr-only">تسجيل الدخول</span>
            </a>
          </Button>
        </template>
      </div>
    </div>
  </header>
</template>
