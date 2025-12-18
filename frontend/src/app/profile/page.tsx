'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function ProfilePage() {
    const router = useRouter();
    const { user, token, isAuthenticated, isLoading, updateUser, logout } = useAuth();
    const [displayName, setDisplayName] = useState(user?.display_name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 max-w-2xl px-4 md:px-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-muted rounded w-1/3" />
                    <div className="h-64 bg-muted rounded" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        router.push('/');
        return null;
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setIsSaving(true);
        try {
            const response = await api.auth.updateProfile(token, displayName) as { user: User };
            updateUser(response.user);
            toast.success('تم حفظ الملف الشخصي');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل في الحفظ');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRequestDeletion = async () => {
        if (!token) return;

        if (!confirm('هل أنت متأكد من طلب حذف حسابك؟ ستتم مراجعة الطلب من قبل المسؤول.')) {
            return;
        }

        setIsRequestingDeletion(true);
        try {
            await api.auth.requestDeletion(token);
            updateUser({ ...user, deletion_requested: true });
            toast.success('تم إرسال طلب حذف الحساب');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل في إرسال الطلب');
        } finally {
            setIsRequestingDeletion(false);
        }
    };

    const handleCancelDeletion = async () => {
        if (!token) return;

        setIsRequestingDeletion(true);
        try {
            await api.auth.cancelDeletion(token);
            updateUser({ ...user, deletion_requested: false });
            toast.success('تم إلغاء طلب حذف الحساب');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل في الإلغاء');
        } finally {
            setIsRequestingDeletion(false);
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-2xl px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-8">الملف الشخصي</h1>

            {/* Profile Info */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <Label htmlFor="displayName">الاسم المعروض</Label>
                            <Input
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="اترك فارغاً لاستخدام اسم Google"
                                className="h-12 text-lg bg-background"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                هذا الاسم سيظهر في وصفاتك
                            </p>
                        </div>
                        <Button type="submit" disabled={isSaving} size="xl">
                            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>معلومات الحساب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">الصلاحية</span>
                        <span className="font-medium">
                            {user.role === 'admin' ? 'مسؤول' : user.role === 'moderator' ? 'مشرف' : 'مستخدم'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">تاريخ التسجيل</span>
                        <span className="font-medium">
                            {new Date(user.created_at).toLocaleDateString('ar-SA')}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Separator className="my-8" />

            {/* Danger Zone */}
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-600">منطقة الخطر</CardTitle>
                    <CardDescription>
                        إجراءات لا يمكن التراجع عنها
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant="outline"
                        onClick={logout}
                        className="w-full"
                        size="xl"
                    >
                        تسجيل الخروج
                    </Button>

                    {user.deletion_requested ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 mb-4">
                                تم إرسال طلب حذف حسابك. سيتم مراجعته من قبل المسؤول.
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleCancelDeletion}
                                disabled={isRequestingDeletion}
                                size="xl"
                            >
                                إلغاء طلب الحذف
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="destructive"
                            onClick={handleRequestDeletion}
                            disabled={isRequestingDeletion}
                            className="w-full"
                            size="xl"
                        >
                            طلب حذف الحساب
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
