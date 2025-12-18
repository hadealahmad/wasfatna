'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AdminUser, Pagination } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface UserManagementTableProps {
    users: AdminUser[];
    onUpdate: () => void;
    pagination: Pagination;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    loading: boolean;
}

export function UserManagementTable({
    users,
    onUpdate,
    pagination,
    onPageChange,
    onPerPageChange,
    loading
}: UserManagementTableProps) {
    const { token, user: currentUser } = useAuth();
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [banReason, setBanReason] = useState('');
    const [newRole, setNewRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateRole = async () => {
        if (!token || !selectedUser || !newRole) return;
        setIsLoading(true);
        try {
            await api.admin.updateUserRole(token, selectedUser.id, newRole);
            toast.success('تم تحديث صلاحيات المستخدم');
            setRoleDialogOpen(false);
            setSelectedUser(null);
            onUpdate();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل في التحديث');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBan = async () => {
        if (!token || !selectedUser || !banReason.trim()) return;
        setIsLoading(true);
        try {
            await api.admin.banUser(token, selectedUser.id, banReason);
            toast.success('تم حظر المستخدم');
            setBanDialogOpen(false);
            setBanReason('');
            setSelectedUser(null);
            onUpdate();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل في الحظر');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnban = async (user: AdminUser) => {
        if (!token) return;
        setIsLoading(true);
        try {
            await api.admin.unbanUser(token, user.id);
            toast.success('تم إلغاء حظر المستخدم');
            onUpdate();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل في إلغاء الحظر');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!token || !selectedUser) return;
        setIsLoading(true);
        try {
            await api.admin.deleteUser(token, selectedUser.id);
            toast.success('تم حذف المستخدم');
            setDeleteDialogOpen(false);
            setSelectedUser(null);
            onUpdate();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل في الحذف');
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-purple-100 text-purple-800">مسؤول</Badge>;
            case 'moderator':
                return <Badge className="bg-blue-100 text-blue-800">مشرف</Badge>;
            default:
                return <Badge variant="outline">مستخدم</Badge>;
        }
    };

    if (loading) {
        return <div className="py-8 text-center">جاري التحميل...</div>;
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                لا يوجد مستخدمين
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>المستخدم</TableHead>
                            <TableHead>الصلاحية</TableHead>
                            <TableHead>الوصفات</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>تاريخ التسجيل</TableHead>
                            <TableHead className="text-left">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={user.avatar || undefined} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{user.display_name || user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{getRoleBadge(user.role)}</TableCell>
                                <TableCell>{user.recipes_count}</TableCell>
                                <TableCell>
                                    {user.is_banned ? (
                                        <div>
                                            <Badge className="bg-red-100 text-red-800">محظور</Badge>
                                            {user.ban_reason && (
                                                <div className="text-xs text-red-600 mt-1">
                                                    {user.ban_reason}
                                                </div>
                                            )}
                                        </div>
                                    ) : user.deletion_requested ? (
                                        <Badge className="bg-orange-100 text-orange-800">طلب حذف</Badge>
                                    ) : (
                                        <Badge className="bg-green-100 text-green-800">نشط</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {formatDate(user.created_at)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {/* Don't allow editing own account or superadmin */}
                                        {currentUser?.id !== user.id && user.email !== 'hade.alahmad1@gmail.com' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setNewRole(user.role);
                                                        setRoleDialogOpen(true);
                                                    }}
                                                    disabled={isLoading}
                                                >
                                                    الصلاحية
                                                </Button>

                                                {/* Only allow ban/delete for non-admins */}
                                                {user.role !== 'admin' && (
                                                    <>
                                                        {user.is_banned ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUnban(user)}
                                                                disabled={isLoading}
                                                            >
                                                                إلغاء الحظر
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setBanDialogOpen(true);
                                                                    setNewRole(user.role); // Ensure state is reset
                                                                }}
                                                                disabled={isLoading}
                                                            >
                                                                حظر
                                                            </Button>
                                                        )}
                                                        {user.deletion_requested && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-red-600"
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setDeleteDialogOpen(true);
                                                                }}
                                                                disabled={isLoading}
                                                            >
                                                                حذف
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
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

            {/* Role Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>تغيير صلاحية المستخدم</DialogTitle>
                        <DialogDescription>
                            تغيير صلاحية &quot;{selectedUser?.name}&quot;
                        </DialogDescription>
                    </DialogHeader>
                    <Select value={newRole} onValueChange={setNewRole}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">مستخدم</SelectItem>
                            <SelectItem value="moderator">مشرف</SelectItem>
                            <SelectItem value="admin">مسؤول</SelectItem>
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
                            إلغاء
                        </Button>
                        <Button onClick={handleUpdateRole} disabled={isLoading}>
                            حفظ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Ban Dialog */}
            <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>حظر المستخدم</DialogTitle>
                        <DialogDescription>
                            يرجى توضيح سبب حظر &quot;{selectedUser?.name}&quot;
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="سبب الحظر..."
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        rows={4}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
                            إلغاء
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBan}
                            disabled={!banReason.trim() || isLoading}
                        >
                            تأكيد الحظر
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>حذف المستخدم</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من حذف &quot;{selectedUser?.name}&quot;؟
                            المستخدم لديه {selectedUser?.recipes_count} وصفة.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            إلغاء
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            تأكيد الحذف
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
