'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ListCard } from '@/components/features/lists/ListCard';
import { CreateListDialog } from '@/components/features/lists/CreateListDialog';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface List {
    id: number;
    name: string;
    slug: string | null;
    description: string | null;
    cover_image: string | null;
    is_default: boolean;
    is_public: boolean;
    status: string;
    recipes_count: number;
}

export default function MyListsPage() {
    const { token, isAuthenticated, isLoading: authLoading } = useAuth();
    const [lists, setLists] = useState<List[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || !token) {
            setIsLoading(false);
            return;
        }

        fetchLists();
    }, [token, isAuthenticated, authLoading]);

    const fetchLists = async () => {
        if (!token) return;
        try {
            const data = await api.lists.list(token) as List[];
            setLists(data);
        } catch (error) {
            console.error('Failed to fetch lists:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 md:px-6">
                <div className="flex justify-between items-center mb-8">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-64 rounded-xl" />
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
                <p className="text-muted-foreground">سجّل دخولك لعرض قوائمك</p>
            </div>
        );
    }

    const defaultList = lists.find(l => l.is_default);
    const customLists = lists.filter(l => !l.is_default);

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">قوائمي</h1>
                <CreateListDialog onSuccess={(newList) => setLists([newList, ...lists])} />
            </div>

            {/* Show Default List Clearly First */}
            {defaultList && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-muted-foreground">المفضلة</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ListCard list={defaultList} href={`/lists/${defaultList.id}`} />
                    </div>
                </div>
            )}

            {/* Other Lists */}
            {customLists.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-muted-foreground">قوائم مخصصة</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customLists.map((list) => (
                            <ListCard key={list.id} list={list} href={`/lists/${list.id}`} />
                        ))}
                    </div>
                </div>
            )}

            {customLists.length === 0 && !defaultList && (
                <div className="text-center py-12 border rounded-xl bg-muted/20">
                    <p className="text-muted-foreground">لم تقم بإنشاء أي قوائم بعد.</p>
                </div>
            )}
        </div>
    );
}
