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
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
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
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/utils';
import { MoreHorizontal, Trash, Shield, Ban, CheckCircle, UserX } from 'lucide-react';
import { Pagination, AdminUser } from '@/types';

interface UnifiedUserTableProps {
    users: AdminUser[];
    onUpdate: () => void;
    pagination: Pagination;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    loading: boolean;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    onSort: (column: string) => void;
}

export function UnifiedUserTable({
    users,
    onUpdate,
    pagination,
    onPageChange,
    onPerPageChange,
    loading,
    sortColumn,
    sortDirection,
    onSort
}: UnifiedUserTableProps) {
    const { token, user: currentUser } = useAuth();
    const isAdmin = currentUser?.role === 'admin';
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [banReason, setBanReason] = useState('');
    const [selectedUserForBan, setSelectedUserForBan] = useState<AdminUser | null>(null);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(users.map(u => u.id));
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

    const handleBulkAction = async (action: 'delete' | 'ban' | 'unban' | 'change_role', data?: { reason?: string; role?: string }) => {
        if (!token || selectedIds.length === 0) return;

        if (action === 'delete' && !confirm(`هل أنت متأكد من حذف ${selectedIds.length} مستخدم؟`)) return;
        if (action === 'ban' && !data?.reason) {
            // Need reason for bulk ban? Maybe prompt or basic reason
            const reason = prompt('سبب الحظر (بشكل جماعي):') || 'مخالفة الشروط';
            data = { ...data, reason };
        }

        setIsLoading(true);
        try {
            await api.admin.bulkUserActions(token, selectedIds, action, data);
            toast.success('تم تنفيذ الإجراء بنجاح');
            setSelectedIds([]);
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'حدث خطأ أثناء تنفيذ الإجراء');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (user: AdminUser) => {
        if (!token) return;
        if (user.id === currentUser?.id) {
            toast.error('لا يمكنك حذف نفسك');
            return;
        }
        if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف جميع بياناته!')) return;

        setIsLoading(true);
        try {
            await api.admin.deleteUser(token, user.id);
            toast.success('تم حذف المستخدم');
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'فشل الحذف');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBanClick = (user: AdminUser) => {
        if (user.id === currentUser?.id) return;
        setSelectedUserForBan(user);
        setBanDialogOpen(true);
    };

    const confirmBan = async () => {
        if (!token || !selectedUserForBan) return;
        setIsLoading(true);
        try {
            await api.admin.banUser(token, selectedUserForBan.id, banReason);
            toast.success('تم حظر المستخدم');
            setBanDialogOpen(false);
            setBanReason('');
            setSelectedUserForBan(null);
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'فشل الحظر');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnban = async (user: AdminUser) => {
        if (!token) return;
        setIsLoading(true);
        try {
            await api.admin.unbanUser(token, user.id);
            toast.success('تم إلغاء الحظر');
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'فشل إلغاء الحظر');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeRole = async (user: AdminUser, newRole: string) => {
        if (!token) return;
        if (user.id === currentUser?.id) {
            toast.error('لا يمكنك تغيير دورك الخاص');
            return;
        }
        setIsLoading(true);
        try {
            await api.admin.updateUserRole(token, user.id, newRole);
            toast.success('تم تحديث الدور');
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'فشل تحديث الدور');
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

    return (
        <div>
            {selectedIds.length > 0 && (
                <div className="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between">
                    <span className="font-medium text-sm">تم تحديد {selectedIds.length} مستخدم</span>
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline" disabled={isLoading}>
                                    تغيير الدور
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleBulkAction('change_role', { role: 'admin' })}>Admin</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkAction('change_role', { role: 'moderator' })}>Moderator</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkAction('change_role', { role: 'user' })}>User</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkAction('ban')} disabled={isLoading}>
                            <Ban className="w-4 h-4 mr-1" /> حظر
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')} disabled={isLoading}>
                            <Trash className="w-4 h-4 mr-1" /> حذف
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
                                    checked={users.length > 0 && selectedIds.length === users.length}
                                    onCheckedChange={(c) => handleSelectAll(!!c)}
                                />
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('name')}>
                                الاسم / البريد {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('role')}>
                                الدور {sortColumn === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('recipes_count')}>الوصفات</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('created_at')}>
                                تاريخ التسجيل {sortColumn === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(user.id)}
                                        onCheckedChange={(c) => handleSelectOne(user.id, !!c)}
                                        disabled={user.id === currentUser?.id}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {user.avatar ?
                                            <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" /> :
                                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">👤</div>
                                        }
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                                    }>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {user.recipes_count}
                                </TableCell>
                                <TableCell>
                                    {formatRelativeTime(user.created_at)}
                                </TableCell>
                                <TableCell>
                                    {user.is_banned && <Badge variant="destructive">محظور</Badge>}
                                    {user.deletion_requested && <Badge variant="secondary" className="ml-1">طلب حذف</Badge>}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" disabled={user.id === currentUser?.id}>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>تغيير الدور</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={user.role} onValueChange={(v) => handleChangeRole(user, v)}>
                                                <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="moderator">Moderator</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="user">User</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                            <DropdownMenuSeparator />
                                            {user.is_banned ? (
                                                <DropdownMenuItem onClick={() => handleUnban(user)}>
                                                    <CheckCircle className="h-4 w-4" /> إلغاء الحظر
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem onClick={() => handleBanClick(user)} className="text-red-600">
                                                    <Ban className="h-4 w-4" /> حظر
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem onClick={() => handleDelete(user)} className="text-red-600">
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

            <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>حظر المستخدم</DialogTitle>
                        <DialogDescription>يرجى ذكر سبب الحظر</DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        placeholder="سبب الحظر..."
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBanDialogOpen(false)}>إلغاء</Button>
                        <Button variant="destructive" onClick={confirmBan}>تأكيد الحظر</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
