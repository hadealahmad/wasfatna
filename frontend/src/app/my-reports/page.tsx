"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Report {
    id: number;
    reportable_type: string;
    reportable_id: number;
    reportable?: {
        name: string;
        slug?: string;
    };
    type: string;
    message: string;
    status: "pending" | "fixed" | "rejected";
    admin_reply?: string;
    created_at: string;
}

export default function MyReportsPage() {
    const { user, token, isLoading: authLoading } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        if (!token) {
            if (!authLoading) setLoading(false);
            return;
        }

        const fetchReports = async () => {
            try {
                const response = await api.reports.mine(token, page);
                if (response.data) {
                    setReports(prev => page === 1 ? response.data : [...prev, ...response.data]);
                    setHasMore(response.current_page < response.last_page);
                }
            } catch (error) {
                console.error("Failed to fetch reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [token, authLoading, page]);

    if (authLoading || loading && page === 1) {
        return (
            <div className="container mx-auto py-16 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول</h1>
                <p className="text-muted-foreground">الرجاء تسجيل الدخول لعرض بلاغاثك.</p>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "fixed":
                return <Badge className="bg-green-500 hover:bg-green-600">تم الحل</Badge>;
            case "rejected":
                return <Badge variant="destructive">مرفوض</Badge>;
            default:
                return <Badge variant="secondary">قيد المراجعة</Badge>;
        }
    };

    const getTypeLabel = (type: string) => {
        return type === "content_issue" ? "بلاغ عن محتوى" : "تعليق / اقتراح";
    };

    const getReportableLink = (report: Report) => {
        if (!report.reportable) return <span className="text-muted-foreground">محتوى محذوف</span>;

        const type = report.reportable_type.includes("Recipe") ? "recipes" : "lists";
        // @ts-ignore
        const slug = report.reportable.slug || report.reportable.id;

        return (
            <Link href={`/${type}/${slug}`} className="flex items-center gap-1 text-primary hover:underline">
                {report.reportable.name}
                <ExternalLink className="w-3 h-3" />
            </Link>
        );
    };

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-8">بلاغاتي</h1>

            {reports.length === 0 ? (
                <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">لا توجد بلاغات</h3>
                    <p className="text-muted-foreground">لم تقم بإرسال أي بلاغات أو ملاحظات بعد.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reports.map((report) => (
                        <Card key={report.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(report.status)}
                                            <Badge variant="outline">{getTypeLabel(report.type)}</Badge>
                                        </div>
                                        <CardTitle className="text-base pt-2">
                                            بخصوص: {getReportableLink(report)}
                                        </CardTitle>
                                        <CardDescription>
                                            {formatDate(report.created_at)}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-muted/50 p-4 rounded-md text-sm">
                                    {report.message}
                                </div>

                                {report.admin_reply && (
                                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-100 dark:border-blue-900">
                                        <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            رد الإدارة
                                        </h4>
                                        <p className="text-sm text-blue-900 dark:text-blue-200">
                                            {report.admin_reply}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => p + 1)}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "تحميل المزيد"}
                    </Button>
                </div>
            )}
        </div>
    );
}
