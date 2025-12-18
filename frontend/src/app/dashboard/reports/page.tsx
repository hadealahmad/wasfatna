"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { ReportsTable } from "@/components/admin/reports/ReportsTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminReportsPage() {
    const { token, user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

    // State
    const [reports, setReports] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    // Fetch reports
    const fetchReports = async (page = 1) => {
        if (!token || !isAdmin) return;
        setLoading(true);
        try {
            const params: any = { page };
            if (statusFilter !== "all") params.status = statusFilter;
            if (typeFilter !== "all") params.type = typeFilter;

            const response: any = await api.admin.getReports(token, params);
            setReports(response.data);
            setPagination({
                current_page: response.current_page,
                last_page: response.last_page,
                per_page: response.per_page,
                total: response.total,
            });
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            // @ts-ignore
            toast.error(error.message || "فشل تحميل البلاغات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && isAdmin) {
            fetchReports(1);
        }
    }, [token, isAdmin, statusFilter, typeFilter]);

    if (!isAdmin) {
        return <div className="p-8 text-center text-muted-foreground">غير مصرح لك بالوصول لهذه الصفحة</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">إدارة البلاغات</h1>
                    <p className="text-muted-foreground">مراجعة وإدارة بلاغات المستخدمين</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>البلاغات</CardTitle>
                            <CardDescription>عرض {pagination.total} بلاغ</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="تصفية حسب الحالة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">كل الحالات</SelectItem>
                                    <SelectItem value="pending">قيد المراجعة</SelectItem>
                                    <SelectItem value="fixed">تم الحل</SelectItem>
                                    <SelectItem value="rejected">مرفوض</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="تصفية حسب النوع" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">كل الأنواع</SelectItem>
                                    <SelectItem value="content_issue">مشكلة محتوى</SelectItem>
                                    <SelectItem value="feedback">اقتراح / تعليق</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ReportsTable
                        reports={reports}
                        pagination={pagination}
                        onPageChange={(p) => fetchReports(p)}
                        onUpdate={() => fetchReports(pagination.current_page)}
                        loading={loading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
