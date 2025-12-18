'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { UnifiedListTable } from '@/components/admin/UnifiedListTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { Pagination } from '@/types';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function ListsContent() {
    const { token } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [lists, setLists] = useState<any[]>([]);
    const [meta, setMeta] = useState<Pagination>({ current_page: 1, last_page: 1, total: 0, per_page: 20 });
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [statusFilter, setStatusFilter] = useState<string[]>(
        searchParams.get('status')?.split(',') || []
    );

    // Sort states
    const [sortColumn, setSortColumn] = useState(searchParams.get('sort_by') || 'updated_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
        (searchParams.get('sort_dir') as 'asc' | 'desc') || 'desc'
    );

    const fetchLists = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const page = Number(searchParams.get('page')) || 1;
            const perPage = Number(searchParams.get('per_page')) || 20;

            const response = await api.admin.getLists(token, {
                page,
                per_page: perPage,
                search: searchQuery,
                status: statusFilter.length > 0 ? statusFilter.join(',') : undefined,
                sort_by: sortColumn,
                sort_dir: sortDirection
            }) as { data: any[], current_page: number, last_page: number, total: number, per_page: number };

            // Map pagination data
            setLists(response.data);
            setMeta({
                current_page: response.current_page,
                last_page: response.last_page,
                total: response.total,
                per_page: response.per_page
            });
        } catch (error) {
            console.error('Failed to fetch lists:', error);
        } finally {
            setLoading(false);
        }
    }, [token, searchParams, searchQuery, statusFilter, sortColumn, sortDirection]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLists();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchLists]);

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

    const handleStatusChange = (status: string, checked: boolean) => {
        let newStatuses;
        if (checked) {
            newStatuses = [...statusFilter, status];
        } else {
            newStatuses = statusFilter.filter(s => s !== status);
        }
        setStatusFilter(newStatuses);
        updateUrl({
            status: newStatuses.length > 0 ? newStatuses.join(',') : null,
            page: '1'
        });
    };

    const handleSort = (column: string) => {
        const newDirection = sortColumn === column && sortDirection === 'desc' ? 'asc' : 'desc';
        setSortColumn(column);
        setSortDirection(newDirection);
        updateUrl({ sort_by: column, sort_dir: newDirection });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold tracking-tight">إدارة القوائم</h2>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
                        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="بحث عن قائمة..."
                            className="pr-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className={statusFilter.length > 0 ? 'border-primary text-primary' : ''}>
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={statusFilter.includes('review')}
                                onCheckedChange={(checked) => handleStatusChange('review', checked)}
                            >
                                بانتظار الموافقة
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={statusFilter.includes('approved')}
                                onCheckedChange={(checked) => handleStatusChange('approved', checked)}
                            >
                                منشورة
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={statusFilter.includes('rejected')}
                                onCheckedChange={(checked) => handleStatusChange('rejected', checked)}
                            >
                                مرفوضة
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={statusFilter.includes('private')}
                                onCheckedChange={(checked) => handleStatusChange('private', checked)}
                            >
                                خاصة
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <UnifiedListTable
                lists={lists}
                onUpdate={fetchLists}
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

export default function ListsPage() {
    return (
        <Suspense fallback={<div>جاري التحميل...</div>}>
            <ListsContent />
        </Suspense>
    );
}
