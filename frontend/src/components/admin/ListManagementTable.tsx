'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { PaginationControls } from '@/components/ui/PaginationControls';

interface List {
    id: number;
    name: string;
    description: string;
    user: { name: string };
    recipes_count: number;
    created_at: string;
    updated_at: string;
    status: string;
}

export function ListManagementTable() {
    const { token } = useAuth();
    const [lists, setLists] = useState<List[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (token) {
            fetchLists();
        }
    }, [token, page, perPage]);

    const fetchLists = async () => {
        setIsLoading(true);
        try {
            const response = await api.admin.getPendingLists(token!, { page, per_page: perPage }) as any;
            setLists(response.data);
            setTotalPages(response.last_page);
            setTotalItems(response.total);
        } catch (error) {
            console.error(error);
            toast.error('فشل في تحميل القوائم');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        if (!confirm('هل أنت متأكد من الموافقة على هذه القائمة؟')) return;
        setProcessingId(id);
        try {
            await api.admin.approveList(token!, id);
            toast.success('تمت الموافقة على القائمة');
            fetchLists();
        } catch (error) {
            toast.error('فشل في الموافقة');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: number) => {
        const reason = prompt('سبب الرفض (اختياري):');
        if (reason === null) return;

        setProcessingId(id);
        try {
            await api.admin.rejectList(token!, id, reason);
            toast.success('تم رفض القائمة');
            fetchLists();
        } catch (error) {
            toast.error('فشل في الرفض');
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    if (lists.length === 0) {
        return <div className="text-center p-8 text-muted-foreground">لا توجد قوائم بحاجة للمراجعة.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">القائمة</TableHead>
                            <TableHead className="text-right">المستخدم</TableHead>
                            <TableHead className="text-right">عدد الوصفات</TableHead>
                            <TableHead className="text-right">تاريخ الطلب</TableHead>
                            <TableHead className="text-right">إجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lists.map((list) => (
                            <TableRow key={list.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <Link href={`/lists/${list.id}`} className="hover:underline flex items-center gap-1">
                                            {list.name}
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{list.description}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{list.user.name}</TableCell>
                                <TableCell>{list.recipes_count}</TableCell>
                                <TableCell>{formatDate(list.updated_at)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 h-8 px-2"
                                            onClick={() => handleApprove(list.id)}
                                            disabled={!!processingId}
                                        >
                                            <Check className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="h-8 px-2"
                                            onClick={() => handleReject(list.id)}
                                            disabled={!!processingId}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {totalPages >= 1 && (
                <PaginationControls
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    perPage={perPage}
                    totalItems={totalItems}
                    onPerPageChange={setPerPage}
                />
            )}
        </div>
    );
}
