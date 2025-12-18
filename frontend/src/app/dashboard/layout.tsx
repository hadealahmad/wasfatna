'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Clock, EyeOff, FileText, Users, MapPin, Tag, Upload, Settings, Flag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { token, canModerate, isAdmin, isLoading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) return;
        if (!canModerate) {
            router.push('/');
        }
    }, [canModerate, authLoading, router]);

    if (authLoading) {
        return (
            <div className="container mx-auto py-8">
                <Skeleton className="h-10 w-48 mb-8" />
                <div className="grid grid-cols-4 gap-4">
                    <Skeleton className="h-[500px] col-span-1" />
                    <Skeleton className="h-[500px] col-span-3" />
                </div>
            </div>
        );
    }

    if (!canModerate) return null;

    const navItems = [
        {
            href: '/dashboard',
            label: 'نظرة عامة',
            icon: LayoutDashboard,
            exact: true
        },
        {
            href: '/dashboard/recipes',
            label: 'الوصفات',
            icon: FileText
        },
        {
            href: '/dashboard/lists',
            label: 'القوائم',
            icon: FileText
        },
        ...(isAdmin ? [
            {
                href: '/dashboard/users',
                label: 'المستخدمين',
                icon: Users
            },
            {
                href: '/dashboard/cities',
                label: 'المدن',
                icon: MapPin
            },
            {
                href: '/dashboard/settings',
                label: 'الإعدادات',
                icon: Settings
            }
        ] : []),
        {
            href: '/dashboard/reports',
            label: 'البلاغات والملاحظات',
            icon: Flag
        },
        {
            href: '/dashboard/tags',
            label: 'الوسوم',
            icon: Tag
        }
    ];

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                    <nav className="flex flex-col space-y-1">
                        {navItems.map((item) => {
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted text-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="md:col-span-3">
                    {children}
                </div>
            </div>
        </div>
    );
}
