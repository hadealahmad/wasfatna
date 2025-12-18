'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { RecipeCard as RecipeCardType } from '@/types';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function MyRecipesPage() {
    const { token, isAuthenticated, isLoading: authLoading } = useAuth();
    const [recipes, setRecipes] = useState<RecipeCardType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || !token) {
            setIsLoading(false);
            return;
        }

        const fetchRecipes = async () => {
            try {
                const response = await api.recipes.getMyRecipes(token) as { recipes: RecipeCardType[] };
                setRecipes(response.recipes);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, [token, isAuthenticated, authLoading]);

    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 md:px-6">
                <Skeleton className="h-10 w-32 mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto py-16 text-center px-4 md:px-6">
                <span className="text-6xl mb-4 block">🔒</span>
                <h1 className="text-2xl font-bold mb-2">يجب تسجيل الدخول</h1>
                <p className="text-muted-foreground">سجّل دخولك لعرض وصفاتك</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">وصفاتي</h1>
                <Button asChild>
                    <Link href="/recipes/new">+ إضافة وصفة</Link>
                </Button>
            </div>

            <RecipeGrid
                recipes={recipes}
                emptyMessage="لم تضف أي وصفات بعد. ابدأ بإضافة وصفتك الأولى!"
            />
        </div>
    );
}
