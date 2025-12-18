'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AdminRecipe, Pagination } from '@/types';
import { UnifiedRecipeTable } from '@/components/admin/UnifiedRecipeTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function RecipesContent() {
    const { token } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [recipes, setRecipes] = useState<AdminRecipe[]>([]);
    const [meta, setMeta] = useState<Pagination>({ current_page: 1, last_page: 1, total: 0, per_page: 20 });
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [statusFilter, setStatusFilter] = useState<string[]>(
        searchParams.get('status')?.split(',') || []
    );

    // Sort states
    const [sortColumn, setSortColumn] = useState(searchParams.get('sort_by') || 'created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
        (searchParams.get('sort_dir') as 'asc' | 'desc') || 'desc'
    );

    const fetchRecipes = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const page = Number(searchParams.get('page')) || 1;
            const perPage = Number(searchParams.get('per_page')) || 20;

            const response = await api.admin.getAllRecipes(token, {
                page,
                per_page: perPage,
                search: searchQuery,
                status: statusFilter,
                sort_by: sortColumn,
                sort_dir: sortDirection
            }) as { recipes: { data: AdminRecipe[] }, pagination: Pagination };

            setRecipes(response.recipes.data);
            setMeta(response.pagination);
        } catch (error) {
            console.error('Failed to fetch recipes:', error);
        } finally {
            setLoading(false);
        }
    }, [token, searchParams, searchQuery, statusFilter, sortColumn, sortDirection]);

    useEffect(() => {
        // Debounce search/filter updates? 
        // For now, assume fetchRecipes is called when params change or deps change.
        // But we want to sync state to URL to allow bookmarking/sharing
        const timer = setTimeout(() => {
            fetchRecipes();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchRecipes]);

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
            page: '1' // reset page on filter change
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
                <h2 className="text-2xl font-bold tracking-tight">إدارة الوصفات</h2>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
                        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="بحث عن وصفة..."
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
                                checked={statusFilter.includes('pending')}
                                onCheckedChange={(checked) => handleStatusChange('pending', checked)}
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
                                checked={statusFilter.includes('unpublished')}
                                onCheckedChange={(checked) => handleStatusChange('unpublished', checked)}
                            >
                                غير منشورة
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={statusFilter.includes('rejected')}
                                onCheckedChange={(checked) => handleStatusChange('rejected', checked)}
                            >
                                مرفوضة
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <UnifiedRecipeTable
                recipes={recipes}
                onUpdate={fetchRecipes}
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

export default function RecipesPage() {
    return (
        <Suspense fallback={<div>جاري التحميل...</div>}>
            <RecipesContent />
        </Suspense>
    );
}
