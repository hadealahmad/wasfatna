'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { PaginationControls } from '@/components/ui/PaginationControls';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { MoreHorizontal, Trash, ExternalLink, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

interface Report {
    id: number;
    user: { id: number; name: string; email: string; avatar?: string };
    reportable_type: string;
    reportable_id: number;
    reportable?: {
        id: number;
        name: string;
        slug?: string;
    };
    type: string;
    message: string;
    status: string;
    admin_note?: string;
    admin_reply?: string;
    created_at: string;
}

interface ReportsTableProps {
    reports: Report[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    onPageChange: (page: number) => void;
    onUpdate: () => void;
    loading: boolean;
}

export function ReportsTable({ reports, pagination, onPageChange, onUpdate, loading }: ReportsTableProps) {
    const { token, user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Dialogs
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [navAction, setNavAction] = useState<'pending' | 'fixed' | 'rejected'>('pending');
    const [adminNote, setAdminNote] = useState('');
    const [adminReply, setAdminReply] = useState('');

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(reports.map(r => r.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        }
    };

    const handleBulkDelete = async () => {
        if (!token || selectedIds.length === 0) return;
        if (!confirm(`هل أنت متأكد من حذف ${selectedIds.length} بلاغ؟`)) return;

        setIsLoading(true);
        try {
            await api.admin.bulkReportActions(token, selectedIds, 'delete');
            toast.success('تم الحذف بنجاح');
            setSelectedIds([]);
            onUpdate();
        } catch (error) {
            toast.error('حدث خطأ أثناء الحذف');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkStatus = async (status: string) => {
        if (!token || selectedIds.length === 0) return;

        setIsLoading(true);
        try {
            await api.admin.bulkReportActions(token, selectedIds, 'status_update', status);
            toast.success('تم تحديث الحالة بنجاح');
            setSelectedIds([]);
            onUpdate();
        } catch (error) {
            toast.error('حدث خطأ أثناء التحديث');
        } finally {
            setIsLoading(false);
        }
    };

    const openDetails = (report: Report) => {
        setSelectedReport(report);
        setNavAction(report.status as any);
        setAdminNote(report.admin_note || '');
        setAdminReply(report.admin_reply || '');
        setDetailDialogOpen(true);
    };

    const handleSaveDetails = async () => {
        if (!token || !selectedReport) return;
        setIsLoading(true);
        try {
            await api.admin.updateReport(token, selectedReport.id, {
                status: navAction,
                admin_note: adminNote,
                admin_reply: adminReply,
            });
            toast.success('تم تحديث البلاغ');
            setDetailDialogOpen(false);
            onUpdate();
        } catch (error) {
            toast.error('فشل التحديث');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSingle = async (report: Report) => {
        if (!token || !isAdmin) return;
        if (!confirm('هل أنت متأكد من حذف هذا البلاغ؟')) return;
        setIsLoading(true);
        try {
            await api.admin.deleteReport(token, report.id);
            toast.success('تم الحذف');
            onUpdate();
        } catch (error) {
            toast.error('فشل الحذف');
        } finally {
            setIsLoading(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            fixed: 'bg-green-100 text-green-800',
            pending: 'bg-amber-100 text-amber-800',
            rejected: 'bg-red-100 text-red-800',
        };
        const labels: Record<string, string> = {
            fixed: 'تم الحل',
            pending: 'قيد المراجعة',
            rejected: 'مرفوض',
        };
        return <Badge className={styles[status]}>{labels[status] || status}</Badge>;
    };

    const getReportableLink = (report: Report) => {
        if (!report.reportable) return <span className="text-muted-foreground">محتوى محذوف</span>;

        const type = report.reportable_type.includes("Recipe") ? "recipes" : "lists";
        const slug = report.reportable.slug || report.reportable.id;

        return (
            <Link href={`/${type}/${slug}`} target="_blank" className="flex items-center gap-1 text-primary hover:underline text-sm">
                {report.reportable.name}
                <ExternalLink className="w-3 h-3" />
            </Link>
        );
    };

    if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

    return (
        <div>
            {selectedIds.length > 0 && (
                <div className="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between">
                    <span className="font-medium text-sm">تم تحديد {selectedIds.length} عنصر</span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleBulkStatus('fixed')} disabled={isLoading}>
                            <CheckCircle className="ml-2 w-4 h-4" />
                            تحديد كـ "تم الحل"
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleBulkStatus('rejected')} disabled={isLoading}>
                            <XCircle className="ml-2 w-4 h-4" />
                            رفض
                        </Button>
                        {isAdmin && (
                            <Button size="sm" variant="destructive" onClick={handleBulkDelete} disabled={isLoading}>
                                <Trash className="ml-2 w-4 h-4" />
                                حذف
                            </Button>
                        )}
                    </div>
                </div>
            )}

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={reports.length > 0 && selectedIds.length === reports.length}
                                    onCheckedChange={(c) => handleSelectAll(!!c)}
                                />
                            </TableHead>
                            <TableHead>المرسل</TableHead>
                            <TableHead>المحتوى</TableHead>
                            <TableHead>النوع</TableHead>
                            <TableHead>الرسالة</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead className="text-left">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    لا توجد بلاغات
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(report.id)}
                                            onCheckedChange={(c) => handleSelectOne(report.id, !!c)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={report.user.avatar} />
                                                <AvatarFallback>{report.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{report.user.name}</span>
                                                <span className="text-xs text-muted-foreground">{report.user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getReportableLink(report)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {report.type === 'content_issue' ? 'مشكلة محتوى' : 'اقتراح'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <span className="truncate block" title={report.message}>
                                            {report.message}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={report.status} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openDetails(report)}>
                                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                            </Button>
                                            {isAdmin && (
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteSingle(report)}>
                                                    <Trash className="w-4 h-4 text-red-600" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <PaginationControls
                currentPage={pagination.current_page}
                totalPages={pagination.last_page}
                perPage={pagination.per_page}
                totalItems={pagination.total}
                onPageChange={(p) => onPageChange(p)}
                onPerPageChange={() => { }} // Not implemented in this view
            />

            {/* Details Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>تفاصيل البلاغ #{selectedReport?.id}</DialogTitle>
                    </DialogHeader>

                    {selectedReport && (
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Label className="text-muted-foreground">المرسل:</Label>
                                    <div className="font-medium">{selectedReport.user.name}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">التاريخ:</Label>
                                    <div className="font-medium">{formatRelativeTime(selectedReport.created_at)}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">النوع:</Label>
                                    <div className="font-medium">{selectedReport.type === 'content_issue' ? 'مشكلة محتوى' : 'اقتراح'}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">المحتوى:</Label>
                                    <div>{getReportableLink(selectedReport)}</div>
                                </div>
                            </div>

                            <div className="bg-muted p-4 rounded-md">
                                <Label className="mb-2 block">الرسالة:</Label>
                                <p className="text-sm whitespace-pre-wrap">{selectedReport.message}</p>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <Label>إجراءات الإدارة</Label>

                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant={navAction === 'pending' ? "default" : "outline"}
                                        onClick={() => setNavAction('pending')}
                                        size="sm"
                                    >
                                        قيد المراجعة
                                    </Button>
                                    <Button
                                        variant={navAction === 'fixed' ? "default" : "outline"}
                                        onClick={() => setNavAction('fixed')}
                                        size="sm"
                                        className={navAction === 'fixed' ? "bg-green-600 hover:bg-green-700" : ""}
                                    >
                                        تم الحل
                                    </Button>
                                    <Button
                                        variant={navAction === 'rejected' ? "default" : "outline"}
                                        onClick={() => setNavAction('rejected')}
                                        size="sm"
                                        className={navAction === 'rejected' ? "bg-red-600 hover:bg-red-700" : ""}
                                    >
                                        مرفوض
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <Label>ملاحظات إدارية (خاصة)</Label>
                                    <Textarea
                                        value={adminNote}
                                        onChange={e => setAdminNote(e.target.value)}
                                        placeholder="ملاحظات للفريق فقط..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>رد على المستخدم (سيظهر للمستخدم)</Label>
                                    <Textarea
                                        value={adminReply}
                                        onChange={e => setAdminReply(e.target.value)}
                                        placeholder="اكتب رداً للمستخدم..."
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>إغلاق</Button>
                        <Button onClick={handleSaveDetails} disabled={isLoading}>حفظ التغييرات</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
