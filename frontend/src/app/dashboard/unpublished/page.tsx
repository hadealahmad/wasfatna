'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AdminRecipe, Pagination } from '@/types';
import { RecipeManagementTable } from '@/components/admin/RecipeManagementTable';

export default function UnpublishedRecipesPage() {
    const { token } = useAuth();
    const [recipes, setRecipes] = useState<AdminRecipe[]>([]);
    const [meta, setMeta] = useState<Pagination>({ current_page: 1, last_page: 1, total: 0, per_page: 20 });
    const [loading, setLoading] = useState(true);

    const fetchRecipes = useCallback(async (page = 1, perPage = 20) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await api.admin.getAllRecipes(token, { status: 'unpublished', page, per_page: perPage }) as { recipes: { data: AdminRecipe[] }, pagination: Pagination };
            setRecipes(response.recipes.data);
            setMeta(response.pagination);
        } catch (error) {
            console.error('Failed to fetch unpublished recipes:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">وصفات غير منشورة</h2>
            <RecipeManagementTable
                recipes={recipes}
                onUpdate={() => fetchRecipes(meta.current_page, meta.per_page)}
                pagination={meta}
                onPageChange={(page) => fetchRecipes(page, meta.per_page)}
                onPerPageChange={(perPage) => fetchRecipes(1, perPage)}
                loading={loading}
            />
        </div>
    );
}
