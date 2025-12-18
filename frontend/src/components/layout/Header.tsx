"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { User, LogOut, LayoutDashboard, PlusCircle, Settings, Menu, Moon, Sun, Laptop, Dices, BookHeart, Flag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { SearchInput } from "@/components/ui/SearchInput";
import { usePathname } from "next/navigation";

function SearchInputWrapper() {
    const pathname = usePathname();
    if (pathname === '/') return null;
    return <SearchInput />;
}

export function Header() {
    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const handleGoogleLogin = async () => {
        try {
            const response = await api.auth.getGoogleUrl() as { url: string };
            window.location.href = response.url;
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
            <div className="container mx-auto py-3 px-4 md:px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative h-10 w-32">
                                <img
                                    src="/logo-light.svg"
                                    alt="وصفاتنا"
                                    className="dark:hidden h-full w-auto object-contain"
                                />
                                <img
                                    src="/logo-dark.svg"
                                    alt="وصفاتنا"
                                    className="hidden dark:block h-full w-auto object-contain"
                                />
                            </div>
                        </Link>

                        <Link href="/cities" className="hover:text-primary transition-colors hidden md:block">
                            المدن
                        </Link>
                        <Link href="/lists" className="hover:text-primary transition-colors hidden md:block">
                            القوائم
                        </Link>
                        <Link href="/randomizer" className="hover:text-primary transition-colors flex items-center gap-1" title="شو نطبخ؟">
                            <Dices className="h-5 w-5 md:h-4 md:w-4" />
                            <span className="hidden md:inline">شو نطبخ؟</span>
                        </Link>
                    </div>

                    <div className="flex-1 max-w-xl mx-4 hidden md:block">
                        <SearchInputWrapper />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">تغيير المظهر</span>
                        </Button>

                        {isLoading ? (
                            <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
                        ) : isAuthenticated && user ? (
                            <div className="flex items-center gap-4">
                                <Button asChild className="hidden sm:flex">
                                    <Link href="/recipes/new">
                                        <PlusCircle className="ml-2 h-4 w-4" />
                                        وصفة جديدة
                                    </Link>
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <div className="flex flex-col space-y-1 p-2 text-right">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer flex flex-row-reverse w-full items-center gap-2">
                                                <User className="h-4 w-4" />
                                                <span>الملف الشخصي</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/my-recipes" className="cursor-pointer flex flex-row-reverse w-full items-center gap-2">
                                                <Settings className="h-4 w-4" />
                                                <span>وصفاتي</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        {(user.role === "admin" || user.role === "moderator") && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="cursor-pointer flex flex-row-reverse w-full items-center gap-2">
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    <span>لوحة التحكم</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href="/my-lists" className="cursor-pointer flex flex-row-reverse w-full items-center gap-2">
                                                <BookHeart className="h-4 w-4" />
                                                <span>قوائمي</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/my-reports" className="cursor-pointer flex flex-row-reverse w-full items-center gap-2">
                                                <Flag className="h-4 w-4" />
                                                <span>بلاغاتي</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600 cursor-pointer flex flex-row-reverse w-full items-center gap-2"
                                            onClick={logout}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>تسجيل الخروج</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <Button onClick={handleGoogleLogin} className="gap-2 px-2 md:px-4">
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                                <span className="hidden md:inline">تسجيل الدخول</span>
                            </Button>
                        )}

                        {/* Mobile Menu */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>القائمة</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-4 mt-8 items-center text-center">
                                    <Link href="/cities" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                                        المدن
                                    </Link>
                                    <Link href="/lists" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                                        القوائم
                                    </Link>
                                    <Link href="/randomizer" onClick={() => setIsOpen(false)} className="text-lg font-medium flex items-center gap-2">
                                        <Dices className="h-5 w-5" />
                                        شو نطبخ؟
                                    </Link>
                                    <Link href="/search" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                                        بحث
                                    </Link>
                                    {isAuthenticated && (
                                        <>
                                            <Link href="/recipes/new" onClick={() => setIsOpen(false)} className="text-lg font-medium text-primary">
                                                + وصفة جديدة
                                            </Link>
                                            <Link href="/my-recipes" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                                                وصفاتي
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header >
    );
}
