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
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { MoreHorizontal, Trash, CheckCircle, EyeOff, XCircle } from 'lucide-react';
import { Pagination } from '@/types';

interface List {
    id: number;
    name: string;
    description: string;
    user: { name: string; avatar?: string };
    recipes_count: number;
    created_at: string;
    updated_at: string;
    status: string;
    is_public: boolean;
}

interface UnifiedListTableProps {
    lists: List[];
    onUpdate: () => void;
    pagination: Pagination;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    loading: boolean;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    onSort: (column: string) => void;
}

export function UnifiedListTable({
    lists,
    onUpdate,
    pagination,
    onPageChange,
    onPerPageChange,
    loading,
    sortColumn,
    sortDirection,
    onSort
}: UnifiedListTableProps) {
    const { token, user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(lists.map(l => l.id));
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

    const handleBulkAction = async (action: 'delete' | 'approve' | 'reject' | 'unpublish') => {
        if (!token || selectedIds.length === 0) return;
        if (action === 'delete' && !confirm(`هل أنت متأكد من حذف ${selectedIds.length} قائمة؟`)) return;

        setIsLoading(true);
        try {
            await api.admin.bulkListActions(token, selectedIds, action);
            toast.success('تم تنفيذ الإجراء بنجاح');
            setSelectedIds([]);
            onUpdate();
        } catch (error) {
            toast.error('حدث خطأ أثناء تنفيذ الإجراء');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (list: List) => {
        if (!token) return;
        if (!confirm('هل أنت متأكد من حذف هذه القائمة؟')) return;

        setIsLoading(true);
        try {
            await api.lists.delete(token, list.id);
            toast.success('تم حذف القائمة');
            onUpdate();
        } catch (error) {
            toast.error('فشل الحذف');
        } finally {
            setIsLoading(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            approved: 'bg-green-100 text-green-800',
            review: 'bg-amber-100 text-amber-800',
            rejected: 'bg-red-100 text-red-800',
            private: 'bg-gray-100 text-gray-800',
        };
        const labels: Record<string, string> = {
            approved: 'منشورة',
            review: 'بانتظار الموافقة',
            rejected: 'مرفوضة',
            private: 'خاصة',
        };
        return <Badge className={colors[status] || 'bg-gray-100'}>{labels[status] || status}</Badge>;
    };

    if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

    return (
        <div>
            {selectedIds.length > 0 && (
                <div className="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between">
                    <span className="font-medium text-sm">تم تحديد {selectedIds.length} عنصر</span>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleBulkAction('approve')} disabled={isLoading}>
                            موافقة
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleBulkAction('unpublish')} disabled={isLoading}>
                            إلغاء النشر
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')} disabled={isLoading}>
                            حذف
                        </Button>
                    </div>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={lists.length > 0 && selectedIds.length === lists.length}
                                    onCheckedChange={(c) => handleSelectAll(!!c)}
                                />
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('name')}>
                                القائمة {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('user')}>المستخدم</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('status')}>
                                الحالة {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('recipes_count')}>عدد الوصفات</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead>الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lists.map((list) => (
                            <TableRow key={list.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(list.id)}
                                        onCheckedChange={(c) => handleSelectOne(list.id, !!c)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Link href={`/lists/${list.id}`} className="font-medium hover:underline" target="_blank">
                                        {list.name}
                                    </Link>
                                    {list.description && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{list.description}</div>}
                                </TableCell>
                                <TableCell>
                                    {/* User (no email/link for lists as per requirement, but showing name) */}
                                    <div className="flex items-center gap-2">
                                        {list.user.avatar ? (
                                            <img src={list.user.avatar} className="w-6 h-6 rounded-full" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-gray-300" />
                                        )}
                                        <span className="text-sm">{list.user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={list.status} />
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{list.recipes_count}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {formatRelativeTime(list.updated_at)}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {/* Actions */}
                                            {list.status === 'review' && (
                                                <>
                                                    <DropdownMenuItem onClick={() => handleBulkAction('approve')}>
                                                        <CheckCircle className="h-4 w-4" /> موافقة
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleBulkAction('reject')} className="text-red-600">
                                                        <XCircle className="h-4 w-4" /> رفض
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            {list.status === 'approved' && (
                                                <DropdownMenuItem onClick={() => handleBulkAction('unpublish')}>
                                                    <EyeOff className="h-4 w-4" /> إلغاء النشر
                                                </DropdownMenuItem>
                                            )}
                                            {list.status === 'private' && (
                                                <DropdownMenuItem onClick={() => handleBulkAction('approve')}>
                                                    <CheckCircle className="h-4 w-4" /> نشر
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem onClick={() => handleDelete(list)} className="text-red-600">
                                                <Trash className="h-4 w-4" /> حذف
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <PaginationControls
                currentPage={pagination.current_page}
                totalPages={pagination.last_page}
                perPage={pagination.per_page}
                totalItems={pagination.total}
                onPageChange={onPageChange}
                onPerPageChange={onPerPageChange}
            />
        </div>
    );
}
