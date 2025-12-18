'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { DashboardStats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardStatsPage() {
    const { token, isAdmin } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (!token) return;
        try {
            const statsResponse = await api.admin.dashboard(token) as { stats: DashboardStats };
            setStats(statsResponse.stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-24" />
                ))}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">نظرة عامة</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">إجمالي الوصفات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_recipes}</div>
                    </CardContent>
                </Card>

                <Card className={stats.pending_recipes > 0 ? 'border-amber-200 bg-amber-50/50' : ''}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">بانتظار الموافقة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-600">{stats.pending_recipes}</div>
                    </CardContent>
                </Card>

                <Card className={stats.needs_reapproval > 0 ? 'border-orange-200 bg-orange-50/50' : ''}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">تحتاج إعادة موافقة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{stats.needs_reapproval}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">منشورة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.approved_recipes}</div>
                    </CardContent>
                </Card>

                {isAdmin && (
                    <>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">المستخدمين</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.total_users}</div>
                            </CardContent>
                        </Card>

                        <Card className={stats.deletion_requests > 0 ? 'border-red-200 bg-red-50/50' : ''}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">طلبات الحذف</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-600">{stats.deletion_requests}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">المدن</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.total_cities}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">المكونات</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.total_ingredients}</div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
