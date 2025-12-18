'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { UnifiedCityTable } from '@/components/admin/UnifiedCityTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { Pagination, City } from '@/types';

function CitiesContent() {
    const { token, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [cities, setCities] = useState<City[]>([]);
    const [meta, setMeta] = useState<Pagination>({ current_page: 1, last_page: 1, total: 0, per_page: 20 });
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    // Sort states
    const [sortColumn, setSortColumn] = useState(searchParams.get('sort_by') || 'name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
        (searchParams.get('sort_dir') as 'asc' | 'desc') || 'asc'
    );

    const fetchCities = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const page = Number(searchParams.get('page')) || 1;
            const perPage = Number(searchParams.get('per_page')) || 20;

            const response = await api.admin.getCities(token, {
                page,
                per_page: perPage,
                search: searchQuery,
                sort_by: sortColumn,
                sort_dir: sortDirection
            }) as { cities: City[], pagination: Pagination };

            setCities(response.cities);
            setMeta(response.pagination);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        } finally {
            setLoading(false);
        }
    }, [token, searchParams, searchQuery, sortColumn, sortDirection]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCities();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchCities]);

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

    const handleSort = (column: string) => {
        const newDirection = sortColumn === column && sortDirection === 'desc' ? 'asc' : 'desc';
        setSortColumn(column);
        setSortDirection(newDirection);
        updateUrl({ sort_by: column, sort_dir: newDirection });
    };

    if (user && user.role !== 'admin') {
        return <div className="p-8 text-center text-red-500">غير مصرح لك بالوصول إلى هذه الصفحة</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold tracking-tight">إدارة المدن</h2>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
                        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="بحث عن مدينة..."
                            className="pr-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
            </div>

            <UnifiedCityTable
                cities={cities}
                onUpdate={fetchCities}
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

export default function CitiesPage() {
    return (
        <Suspense fallback={<div>جاري التحميل...</div>}>
            <CitiesContent />
        </Suspense>
    );
}
