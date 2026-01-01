<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  Menu, 
  Moon, 
  Sun, 
  Dices, 
  BookHeart, 
  Flag 
} from 'lucide-vue-next';
import { useDark, useToggle } from '@vueuse/core';
import Avatar from '@/components/ui/Avatar.vue';
import AvatarFallback from '@/components/ui/AvatarFallback.vue';
import AvatarImage from '@/components/ui/AvatarImage.vue';
import Button from '@/components/ui/Button.vue';
import DropdownMenu from '@/components/ui/DropdownMenu.vue';
import DropdownMenuContent from '@/components/ui/DropdownMenuContent.vue';
import DropdownMenuItem from '@/components/ui/DropdownMenuItem.vue';
import DropdownMenuSeparator from '@/components/ui/DropdownMenuSeparator.vue';
import DropdownMenuTrigger from '@/components/ui/DropdownMenuTrigger.vue';
import Sheet from '@/components/ui/Sheet.vue';
import SheetContent from '@/components/ui/SheetContent.vue';
import SheetHeader from '@/components/ui/SheetHeader.vue';
import SheetTitle from '@/components/ui/SheetTitle.vue';
import SheetTrigger from '@/components/ui/SheetTrigger.vue';
import SearchInput from '@/components/ui/SearchInput.vue';

const page = usePage();
const user = computed(() => page.props.auth?.user);
const isAuthenticated = computed(() => !!user.value);
const isMobileMenuOpen = ref(false);

const isAdminOrModerator = computed(() => {
  return user.value?.role === 'admin' || user.value?.role === 'moderator';
});

const pathname = computed(() => page.url);
const showSearchInHeader = computed(() => pathname.value !== '/');

const handleLogout = () => {
  // We'll use the logout route we defined
};

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <header class="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
    <div class="container mx-auto py-3 px-4 md:px-6">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo & Navigation -->
        <div class="flex items-center gap-8">
          <Link href="/" class="flex items-center gap-2 shrink-0">
            <div class="relative h-10 w-32">
              <img src="/logo-light.svg" alt="وصفاتنا" class="dark:hidden h-full w-auto object-contain" />
              <img src="/logo-dark.svg" alt="وصفاتنا" class="hidden dark:block h-full w-auto object-contain" />
            </div>
          </Link>

          <nav class="hidden md:flex items-center gap-6">
            <Link href="/cities" class="text-sm font-medium hover:text-primary transition-colors">المدن</Link>
            <Link href="/lists" class="text-sm font-medium hover:text-primary transition-colors">القوائم</Link>
            <Link href="/randomizer" class="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Dices class="h-4 w-4" />
              <span>شو نطبخ؟</span>
            </Link>
          </nav>
        </div>

        <!-- Search Bar (Desktop) -->
        <div class="flex-1 max-w-xl hidden md:block" v-if="showSearchInHeader">
          <SearchInput />
        </div>

        <!-- User Actions -->
        <div class="flex items-center gap-4">
          <!-- Theme Toggle -->
          <Button
            variant="ghost"
            size="icon"
            class="h-9 w-9"
            @click="toggleDark()"
          >
            <Sun class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span class="sr-only">تغيير المظهر</span>
          </Button>

          <template v-if="isAuthenticated">
            <Link href="/recipes/new" class="hidden sm:flex">
              <Button size="sm">
                <PlusCircle class="ml-2 h-4 w-4" />
                وصفة جديدة
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" class="relative h-9 w-9 rounded-full">
                  <Avatar class="h-9 w-9 border border-border/50">
                    <AvatarImage :src="user.avatar || undefined" :alt="user.name" />
                    <AvatarFallback>{{ user.name?.charAt(0) }}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-56" align="end">
                <div class="flex flex-col space-y-1 p-2 text-right">
                  <p class="text-sm font-medium leading-none">{{ user.name }}</p>
                  <p class="text-xs leading-none text-muted-foreground">{{ user.email }}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" class="cursor-pointer flex items-center justify-end gap-2 text-right w-full">
                    <span>الملف الشخصي</span>
                    <User class="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my/recipes" class="cursor-pointer flex items-center justify-end gap-2 text-right w-full">
                    <span>وصفاتي</span>
                    <Settings class="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my/lists" class="cursor-pointer flex items-center justify-end gap-2 text-right w-full">
                    <span>قوائمي</span>
                    <BookHeart class="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my/reports" class="cursor-pointer flex items-center justify-end gap-2 text-right w-full">
                    <span>بلاغاتي</span>
                    <Flag class="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild v-if="isAdminOrModerator">
                  <Link href="/dashboard" class="cursor-pointer flex items-center justify-end gap-2 text-right w-full">
                    <span>لوحة التحكم</span>
                    <LayoutDashboard class="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link :href="route('logout')" method="post" as="button" class="cursor-pointer flex items-center justify-end gap-2 text-right w-full text-red-600">
                    <span>تسجيل الخروج</span>
                    <LogOut class="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </template>

          <template v-else>
            <a href="/auth/google/redirect">
              <Button class="gap-2 px-2 md:px-4">
                  <svg class="w-4 h-4" viewBox="0 0 24 24">
                      <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                      />
                      <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                      />
                      <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                      />
                      <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                      />
                  </svg>
                <span class="hidden md:inline">تسجيل الدخول</span>
              </Button>
            </a>
          </template>

          <!-- Mobile Menu Trigger -->
          <Sheet v-model:open="isMobileMenuOpen">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" class="md:hidden">
                <Menu class="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" class="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle class="text-right">القائمة</SheetTitle>
              </SheetHeader>
              <nav class="flex flex-col gap-4 mt-8">
                <Link href="/cities" @click="isMobileMenuOpen = false" class="text-lg font-medium text-right hover:text-primary transition-colors">المدن</Link>
                <Link href="/lists" @click="isMobileMenuOpen = false" class="text-lg font-medium text-right hover:text-primary transition-colors">القوائم</Link>
                <Link href="/randomizer" @click="isMobileMenuOpen = false" class="text-lg font-medium text-right hover:text-primary transition-colors flex items-center justify-end gap-2">
                  <span>شو نطبخ؟</span>
                  <Dices class="h-5 w-5" />
                </Link>
                <Link href="/recipes" @click="isMobileMenuOpen = false" class="text-lg font-medium text-right hover:text-primary transition-colors">بحث</Link>
                <div class="h-px bg-border my-2"></div>
                <template v-if="isAuthenticated">
                   <Link href="/recipes/new" @click="isMobileMenuOpen = false" class="text-lg font-medium text-right text-primary hover:text-primary/80 transition-colors">+ وصفة جديدة</Link>
                   <Link href="/my/recipes" @click="isMobileMenuOpen = false" class="text-lg font-medium text-right hover:text-primary transition-colors">وصفاتي</Link>
                   <Link href="/my/lists" @click="isMobileMenuOpen = false" class="text-lg font-medium text-right hover:text-primary transition-colors">قوائمي</Link>
                   <Link href="/settings" @click="isMobileMenuOpen = false" class="text-lg font-medium text-right hover:text-primary transition-colors">الملف الشخصي</Link>
                   <Link :href="route('logout')" method="post" as="button" class="text-lg font-medium text-right text-red-600">تسجيل الخروج</Link>
                </template>
                <template v-else>
                  <a href="/auth/google/redirect" class="text-lg font-medium text-right text-primary">تسجيل الدخول</a>
                </template>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </header>
</template>
