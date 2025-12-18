'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { RecipeCard as RecipeCardType, City, Tag } from '@/types';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { SearchFilters } from '@/components/recipes/SearchFilters';
import { Skeleton } from '@/components/ui/skeleton';

function SearchContent() {
    const searchParams = useSearchParams();
    const [recipes, setRecipes] = useState<RecipeCardType[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const selectedTags = searchParams.get('tags') || ''; // 'tags' param name

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch cities for filter
                const citiesResponse = await api.cities.list() as { cities: City[] };
                setCities(citiesResponse.cities);

                // Fetch tags for filter
                const tagsResponse = await api.tags.list() as Tag[];
                setTags(Array.isArray(tagsResponse) ? tagsResponse : []);

                // Fetch filtered recipes
                const recipesResponse = await api.recipes.list({
                    search: search || undefined,
                    city: city ? parseInt(city) : undefined,
                    difficulty: difficulty || undefined,
                    tags: selectedTags || undefined, // Pass tags to API
                }) as { recipes: RecipeCardType[]; pagination: { total: number } };

                setRecipes(recipesResponse.recipes);
                setTotalResults(recipesResponse.pagination.total);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [search, city, difficulty, selectedTags]);

    const handleSearch = (params: { search: string; city: string; difficulty: string; tags: string[] }) => {
        const url = new URL(window.location.href);
        if (params.search) url.searchParams.set('search', params.search);
        else url.searchParams.delete('search');

        if (params.city) url.searchParams.set('city', params.city);
        else url.searchParams.delete('city');

        if (params.difficulty) url.searchParams.set('difficulty', params.difficulty);
        else url.searchParams.delete('difficulty');

        if (params.tags && params.tags.length > 0) url.searchParams.set('tags', params.tags[0]); // Single tag for now in URL
        else url.searchParams.delete('tags');

        window.history.pushState({}, '', url);

        // Re-fetch with new params
        window.location.reload();
    };

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-8">نتائج البحث</h1>

            {/* Search Filters */}
            <div className="mb-8 p-4 bg-muted/50 rounded-lg">
                <SearchFilters
                    cities={cities}
                    tags={tags}
                    onSearch={handleSearch}
                    showSearchButton={true}
                />
            </div>

            {/* Results Count */}
            {!isLoading && (
                <p className="text-muted-foreground mb-6">
                    {totalResults > 0
                        ? `عثرنا على ${totalResults} وصفة`
                        : 'لم نجد نتائج مطابقة'}
                </p>
            )}

            {/* Results */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            ) : (
                <RecipeGrid
                    recipes={recipes}
                    emptyMessage="جرب البحث بكلمات مختلفة"
                />
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="container py-8 px-4 md:px-6">
                <Skeleton className="h-10 w-48 mb-8" />
                <Skeleton className="h-20 mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
