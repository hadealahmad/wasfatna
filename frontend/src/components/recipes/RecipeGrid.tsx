import { RecipeCard as RecipeCardType } from '@/types';
import { RecipeCard } from './RecipeCard';
import { Utensils } from 'lucide-react';

interface RecipeGridProps {
    recipes: RecipeCardType[] | undefined;
    emptyMessage?: string;
}

export function RecipeGrid({ recipes, emptyMessage = 'لا توجد وصفات' }: RecipeGridProps) {
    // Ensure recipes is always an array
    const recipeList = Array.isArray(recipes) ? recipes : [];

    if (recipeList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Utensils className="w-16 h-16 mb-4 text-muted-foreground/30" />
                <p className="text-xl text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipeList.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
        </div>
    );
}
