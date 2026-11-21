<script setup lang="ts">
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import {
  BookHeart,
  CalendarDays,
  ChefHat,
  Flag,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from 'lucide-vue-next';
import Avatar from '@/components/ui/Avatar.vue';
import AvatarFallback from '@/components/ui/AvatarFallback.vue';
import AvatarImage from '@/components/ui/AvatarImage.vue';
import Button from '@/components/ui/Button.vue';
import DropdownMenu from '@/components/ui/DropdownMenu.vue';
import DropdownMenuContent from '@/components/ui/DropdownMenuContent.vue';
import DropdownMenuItem from '@/components/ui/DropdownMenuItem.vue';
import DropdownMenuLabel from '@/components/ui/DropdownMenuLabel.vue';
import DropdownMenuSeparator from '@/components/ui/DropdownMenuSeparator.vue';
import DropdownMenuTrigger from '@/components/ui/DropdownMenuTrigger.vue';

const page = usePage();
const user = computed(() => (page.props.auth as any)?.user ?? null);
const isAdminOrModerator = computed(
  () => user.value?.role === 'admin' || user.value?.role === 'moderator',
);

const logoutHref = computed(() => {
  try {
    return route('logout');
  } catch {
    return '/logout';
  }
});
</script>

<template>
  <DropdownMenu v-if="user" dir="rtl">
    <DropdownMenuTrigger as-child>
      <Button
        type="button"
        variant="ghost"
        aria-label="قائمة الحساب"
        class="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0"
      >
        <Avatar class="h-9 w-9 sm:h-10 sm:w-10 border border-border/50">
          <AvatarImage :src="user.avatar_url || undefined" :alt="user.name" />
          <AvatarFallback>{{ user.name?.charAt(0) }}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end" dir="rtl">
      <DropdownMenuLabel class="font-normal">
        <div class="flex flex-col space-y-1 text-start">
          <p class="text-sm font-medium leading-none truncate">{{ user.name }}</p>
          <p class="text-xs leading-none text-muted-foreground truncate">{{ user.email }}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem v-if="isAdminOrModerator" as-child class="cursor-pointer gap-0">
        <Link href="/dashboard" class="w-full text-start">
          <LayoutDashboard aria-hidden="true" class="me-2 h-4 w-4" />
          <span>لوحة التحكم</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem as-child class="cursor-pointer gap-0">
        <Link href="/settings" class="w-full text-start">
          <UserIcon aria-hidden="true" class="me-2 h-4 w-4" />
          <span>الملف الشخصي</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child class="cursor-pointer gap-0">
        <Link href="/my/recipes" class="w-full text-start">
          <ChefHat aria-hidden="true" class="me-2 h-4 w-4" />
          <span>وصفاتي</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem as-child class="cursor-pointer gap-0">
        <Link href="/my/lists" class="w-full text-start">
          <BookHeart aria-hidden="true" class="me-2 h-4 w-4" />
          <span>قوائمي</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem as-child class="cursor-pointer gap-0">
        <Link href="/my/meal-plans" class="w-full text-start">
          <CalendarDays aria-hidden="true" class="me-2 h-4 w-4" />
          <span>خطط الوجبات</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem as-child class="cursor-pointer gap-0">
        <Link href="/my/reports" class="w-full text-start">
          <Flag aria-hidden="true" class="me-2 h-4 w-4" />
          <span>بلاغاتي</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        as-child
        class="cursor-pointer gap-0 text-destructive focus:bg-destructive/10 focus:text-destructive"
      >
        <Link :href="logoutHref" method="post" as="button" class="w-full text-start">
          <LogOut aria-hidden="true" class="me-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
