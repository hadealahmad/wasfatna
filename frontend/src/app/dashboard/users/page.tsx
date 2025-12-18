'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { UnifiedUserTable } from '@/components/admin/UnifiedUserTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { Pagination, AdminUser } from '@/types';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function UsersContent() {
    const { token, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [meta, setMeta] = useState<Pagination>({ current_page: 1, last_page: 1, total: 0, per_page: 20 });
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [roleFilter, setRoleFilter] = useState<string>(searchParams.get('role') || '');

    // Sort states
    const [sortColumn, setSortColumn] = useState(searchParams.get('sort_by') || 'created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
        (searchParams.get('sort_dir') as 'asc' | 'desc') || 'desc'
    );

    const fetchUsers = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const page = Number(searchParams.get('page')) || 1;
            const perPage = Number(searchParams.get('per_page')) || 20;

            const response = await api.admin.getUsers(token, {
                page,
                per_page: perPage,
                search: searchQuery,
                role: roleFilter || undefined,
                sort_by: sortColumn,
                sort_dir: sortDirection
            }) as { users: { data: AdminUser[] }, pagination: Pagination };

            // Note: Api returns { users: {data: ...}, pagination: ... } format (check AdminController)
            // Or maybe { users: { data: ... }, ... } depending on exact format. 
            // Previous check of AdminController::users showed it returns { users: ResourceCollection, pagination: ... }
            // Resource collection usually wraps data in 'data' if using collection, or direct array if using through without collection wrapper.
            // Let's assume response.users.data if it's paginated collection, or response.users if direct array.
            // Actually AdminController says: 'users' => $users->through(...)
            // $users (paginator) -> through -> collection.
            // Paginator JSON serialization: { data: [...], ... }
            // But here we return explicit shape: { users: ..., pagination: ... }
            // So response.users should be the array?
            // "users" => $users->through(...) which returns a collection.
            // Wait, paginator `through` returns a paginator (or similar) that maps the items?
            // No, `through` returns the paginator with modified collection? Yes.
            // But `response()->json(['users' => ...])` will serialize the paginator object.
            // Paginator object contains `data` property.
            // So `response.users.data` is likely correct.

            // Let's assume simpler structure if my reading is wrong, but based on typical Laravel:
            // Paginator serializes to full object.
            // But here I'm putting paginator inside 'users' key?
            // Wait, Look at AdminController::users again:
            /*
             return response()->json([
                'users' => $users->through(fn($u) => $this->formatAdminUser($u)),
                'pagination' => [ ... ]
            ]);
            */
            // $users->through returns a Paginator instance (or LengthAwarePaginator).
            // When serialized to JSON, a Paginator usually outputs { current_page, data: [...], ... }.
            // So `response.users` will be that object. So `response.users.data` is likely the array.

            const usersData = (response.users as any).data || response.users;
            setUsers(Array.isArray(usersData) ? usersData : []);
            setMeta(response.pagination);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            // toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [token, searchParams, searchQuery, roleFilter, sortColumn, sortDirection]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchUsers]);

    const updateUrl = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateUrl({ search: searchQuery, page: '1' });
    };

    const handleRoleChange = (role: string, checked: boolean) => {
        // Single select for role filter for simplicity, or toggle
        if (checked) {
            setRoleFilter(role);
            updateUrl({ role: role, page: '1' });
        } else {
            if (roleFilter === role) {
                setRoleFilter('');
                updateUrl({ role: null, page: '1' });
            }
        }
    };

    const handleSort = (column: string) => {
        const newDirection = sortColumn === column && sortDirection === 'desc' ? 'asc' : 'desc';
        setSortColumn(column);
        setSortDirection(newDirection);
        updateUrl({ sort_by: column, sort_dir: newDirection });
    };

    // Redirect if not admin? (Already handled by Layout/API, but good for UX)
    if (user && user.role !== 'admin') {
        return <div className="p-8 text-center text-red-500">غير مصرح لك بالوصول إلى هذه الصفحة</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold tracking-tight">إدارة المستخدمين</h2>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
                        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="بحث عن مستخدم..."
                            className="pr-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className={roleFilter ? 'border-primary text-primary' : ''}>
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>تصفية حسب الدور</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={roleFilter === 'admin'}
                                onCheckedChange={(checked) => handleRoleChange('admin', checked)}
                            >
                                Admin
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={roleFilter === 'moderator'}
                                onCheckedChange={(checked) => handleRoleChange('moderator', checked)}
                            >
                                Moderator
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={roleFilter === 'user'}
                                onCheckedChange={(checked) => handleRoleChange('user', checked)}
                            >
                                User
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <UnifiedUserTable
                users={users}
                onUpdate={fetchUsers}
                pagination={meta}
                onPageChange={(page) => updateUrl({ page: String(page) })}
                onPerPageChange={(perPage) => updateUrl({ per_page: String(perPage), page: '1' })}
                loading={loading}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
            />
        </div>
    );
}

export default function UsersPage() {
    return (
        <Suspense fallback={<div>جاري التحميل...</div>}>
            <UsersContent />
        </Suspense>
    );
}
