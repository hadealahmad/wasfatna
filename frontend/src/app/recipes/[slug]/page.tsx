import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { api } from '@/lib/api';
import { RecipeDetailResponse, IngredientsData, StepsData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { ShareButtons } from '@/components/recipes/ShareButtons';
import { RecipeControls } from '@/components/recipes/RecipeControls';
import { RecipeRevisions } from '@/components/recipes/RecipeRevisions';
import { AddRecipeButton } from '@/components/recipes/AddRecipeButton';
import { ReportModal } from '@/components/reports/ReportModal';
import { formatTimeNeeded, getDifficultyColor, formatDate } from '@/lib/utils';
import { AddToFavoritesModal } from '@/components/features/lists/AddToFavoritesModal';
import { MapPin, Clock, Utensils, Tag as TagIcon, ChefHat, Users } from 'lucide-react';

interface RecipePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const data = await api.recipes.get(slug) as RecipeDetailResponse;
        const recipe = data.recipe;

        // Create a description from ingredients/city
        const ingredientsList = Array.isArray(recipe.ingredients)
            ? recipe.ingredients.slice(0, 3).map(i => typeof i === 'string' ? i : i.name).join('، ')
            : '';
        const description = recipe.city
            ? `وصفة ${recipe.name} من ${recipe.city}${ingredientsList ? ` - المكونات: ${ingredientsList}...` : ''}`
            : `وصفة ${recipe.name} - تعرف على طريقة التحضير والمكونات`;

        const ogImage = recipe.image_url || '/og-image.png';

        return {
            title: recipe.name,
            description: description,
            openGraph: {
                title: recipe.name,
                description: description,
                type: 'article',
                url: `/recipes/${slug}`,
                images: [
                    {
                        url: ogImage,
                        width: 1200,
                        height: 630,
                        alt: recipe.name,
                    },
                ],
                publishedTime: recipe.created_at,
                authors: recipe.user?.name ? [recipe.user.name] : undefined,
            },
            twitter: {
                card: 'summary_large_image',
                title: recipe.name,
                description: description,
                images: [ogImage],
            },
        };
    } catch {
        return {
            title: 'وصفة غير موجودة',
            description: 'الوصفة التي تبحث عنها غير موجودة',
        };
    }
}

async function getRecipe(slug: string) {
    let token: string | undefined;
    try {
        const cookieStore = await cookies();
        token = cookieStore.get('auth_token')?.value;
    } catch {
        // Ignore
    }

    try {
        return await api.recipes.get(slug, token) as RecipeDetailResponse;
    } catch {
        return null;
    }
}

const formatIngredient = (item: string | any) => {
    if (typeof item === 'string') return item;
    const parts = [item.amount, item.unit, item.name, item.descriptor].filter(Boolean);
    return parts.join(' ');
};

function renderIngredients(ingredients: IngredientsData) {
    // If grouped object (legacy or other sources)
    if (!Array.isArray(ingredients)) {
        return (
            <div className="space-y-6">
                {Object.entries(ingredients).map(([group, items]) => (
                    <div key={group}>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">{group}</h4>
                        <ul className="space-y-2">
                            {items.map((ingredient, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{formatIngredient(ingredient)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }

    // Check if it's an array of objects that needs grouping
    const isStructured = ingredients.length > 0 && typeof ingredients[0] !== 'string';

    // Check if it's an array of objects that needs grouping (New Ordered Format)
    if (isStructured && typeof ingredients[0] === 'object' && 'name' in ingredients[0] && 'items' in ingredients[0]) {
        return (
            <div className="space-y-6">
                {(ingredients as { name: string; items: any[] }[]).map((group, idx) => (
                    <div key={idx}>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">{group.name || 'المكونات'}</h4>
                        <ul className="space-y-2">
                            {group.items.map((ingredient, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{formatIngredient(ingredient)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }

    if (isStructured) {
        // Group by 'group' field (New API Flattened - Legacy fallback logic if needed, though we prefer the above)
        // ... (Existing logic for flattened array with group property if needed, but the new format is array of groups)
        // For now, let's keep the existing logic for "flattened array with group field" just in case:
        const grouped: Record<string, any[]> = {};
        const flat: any[] = [];
        const groupsOrder: string[] = [];

        (ingredients as any[]).forEach(item => {
            if (item.group) {
                if (!grouped[item.group]) {
                    grouped[item.group] = [];
                    groupsOrder.push(item.group);
                }
                grouped[item.group].push(item);
            } else {
                flat.push(item);
            }
        });

        // If we have groups, render grouped view
        if (Object.keys(grouped).length > 0) {
            return (
                <div className="space-y-6">
                    {/* Render grouped items in order they appeared */}
                    {groupsOrder.map(group => (
                        <div key={group}>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-2">{group}</h4>
                            <ul className="space-y-2">
                                {grouped[group].map((ingredient, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{formatIngredient(ingredient)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Render flat items in a default group if any */}
                    {flat.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-2">المكونات</h4>
                            <ul className="space-y-2">
                                {flat.map((ingredient, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{formatIngredient(ingredient)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );
        }
    }

    // Default flat list (strings or structured without groups)
    return (
        <ul className="space-y-2">
            {ingredients.map((ingredient, idx) => (
                <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{formatIngredient(ingredient)}</span>
                </li>
            ))}
        </ul>
    );
}

function renderSteps(steps: StepsData) {
    if (Array.isArray(steps)) {
        // Check for New Ordered Group Format
        if (steps.length > 0 && typeof steps[0] === 'object' && 'name' in steps[0] && 'items' in steps[0]) {
            return (
                <div className="space-y-8">
                    {(steps as { name: string; items: string[] }[]).map((group, groupIdx) => (
                        <div key={groupIdx}>
                            <h4 className="font-semibold text-lg mb-4 text-primary">{group.name || 'الخطوات'}</h4>
                            <ol className="space-y-4">
                                {group.items.map((step, idx) => (
                                    <li key={idx} className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </span>
                                        <p className="pt-1">{step}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <ol className="space-y-4">
                {(steps as string[]).map((step, idx) => (
                    <li key={idx} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                        </span>
                        <p className="pt-1">{step}</p>
                    </li>
                ))}
            </ol>
        );
    }

    // Grouped steps
    return (
        <div className="space-y-8">
            {Object.entries(steps).map(([group, items]) => (
                <div key={group}>
                    <h4 className="font-semibold text-lg mb-4 text-primary">{group}</h4>
                    <ol className="space-y-4">
                        {items.map((step, idx) => (
                            <li key={idx} className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                    {idx + 1}
                                </span>
                                <p className="pt-1">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            ))}
        </div>
    );
}

export default async function RecipePage({ params }: RecipePageProps) {
    const { slug } = await params;
    const data = await getRecipe(slug);

    if (!data) {
        notFound();
    }

    const { recipe, has_variations, variations_count, similar_recipes } = data;

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content - 70% */}
                <div className="flex-1 lg:w-[70%]">
                    {/* Recipe Header */}
                    <div className="mb-8">
                        {/* Recipe Image */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                            {recipe.image_url ? (
                                <Image
                                    src={recipe.image_url}
                                    alt={recipe.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
                                    <span className="text-9xl">🍽️</span>
                                </div>
                            )}
                        </div>

                        {/* Recipe Title & Actions */}
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <h1 className="text-3xl md:text-4xl font-bold">{recipe.name}</h1>
                            <div className="flex items-center gap-2">
                                <AddToFavoritesModal recipeId={recipe.id} />
                                <ReportModal
                                    reportableId={recipe.id}
                                    reportableType="recipe"
                                />
                            </div>
                        </div>

                        {/* Variations Alert */}
                        {has_variations && (
                            <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                <p className="text-amber-800 dark:text-amber-200">
                                    يوجد {variations_count} طريقة أخرى لتحضير هذا الطبق!{' '}
                                    <Link
                                        href={`/recipes/${recipe.slug}/variations`}
                                        className="font-semibold underline"
                                    >
                                        شاهد جميع الطرق
                                    </Link>
                                </p>
                            </div>
                        )}

                        {/* Meta Info */}
                        {/* Meta Info */}
                        <div className="flex flex-col gap-4 mb-6">
                            {/* City and Tags Group */}
                            {(recipe.city || (recipe.tags && recipe.tags.length > 0)) && (
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    {recipe.city && (
                                        <Link href={`/cities/${recipe.city_slug}`}>
                                            <Badge variant="secondary" className="cursor-pointer hover:bg-muted gap-1 px-3 py-1 bg-muted/50 border-muted-foreground/20">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {recipe.city}
                                            </Badge>
                                        </Link>
                                    )}

                                    {recipe.tags?.map((tag: any) => (
                                        <Link key={tag.id} href={`/search?tags=${tag.slug}`}>
                                            <Badge variant="outline" className="cursor-pointer hover:bg-muted gap-1 px-3 py-1 border-muted-foreground/20">
                                                <TagIcon className="w-3.5 h-3.5" />
                                                {tag.name}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Time and Servings Group */}
                            {(recipe.time_needed || recipe.servings) && (
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                    {recipe.time_needed && (
                                        <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <div className="flex gap-1.5 flex-wrap">
                                                {Array.isArray(recipe.time_needed) ? (
                                                    recipe.time_needed.map((time: string, idx: number) => (
                                                        <span key={idx} className="bg-background px-2 py-0.5 rounded-md border text-xs font-medium shadow-sm">
                                                            {time}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="font-medium">{formatTimeNeeded(recipe.time_needed)}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {recipe.servings && (
                                        <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                                            <Utensils className="w-4 h-4 text-primary" />
                                            <span className="font-medium">{recipe.servings} أشخاص</span>
                                        </div>
                                    )}

                                    <Badge className={`mr-auto ${getDifficultyColor(recipe.difficulty)}`}>
                                        {recipe.difficulty}
                                    </Badge>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <RecipeControls
                                recipeId={recipe.id}
                                recipeSlug={recipe.slug}
                                ownerId={recipe.user?.id}
                                status={recipe.status}
                            />
                            <RecipeRevisions
                                slug={recipe.slug}
                                recipeId={recipe.id}
                            />
                        </div>

                        {/* Author */}
                        {recipe.user && !recipe.is_anonymous && (
                            <Link href={`/users/${recipe.user.id}`}>
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                    <Avatar>
                                        <AvatarImage src={recipe.user.avatar || undefined} />
                                        <AvatarFallback>{recipe.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{recipe.user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            نُشرت في {formatDate(recipe.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>

                    <Separator className="my-8" />

                    {/* Ingredients & Steps Side by Side on larger screens */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Ingredients */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>🥗</span>
                                    المكونات
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {renderIngredients(recipe.ingredients)}
                            </CardContent>
                        </Card>

                        {/* Steps */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>📝</span>
                                    طريقة التحضير
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {renderSteps(recipe.steps)}
                            </CardContent>
                        </Card>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 p-8 rounded-2xl bg-muted/30 border border-border/50 text-center space-y-4">
                        <h3 className="text-xl font-bold">لديك وصفة مميزة؟</h3>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            شارك وصفاتك مع مجتمعنا وساعد الآخرين على اكتشاف نكهات جديدة من مطبخك.
                        </p>
                        <AddRecipeButton className="mt-4" size="lg">
                            أضف وصفتك الخاصة
                        </AddRecipeButton>
                    </div>
                </div>


                {/* Sidebar - 30% */}
                <aside className="lg:w-[30%]">
                    <div className="sticky top-24 space-y-6">
                        {/* Similar Recipes */}
                        {similar_recipes.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">وصفات مشابهة</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {similar_recipes.slice(0, 3).map((similarRecipe) => (
                                        <Link
                                            key={similarRecipe.id}
                                            href={`/recipes/${similarRecipe.slug}`}
                                            className="block"
                                        >
                                            <div className="flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                    {similarRecipe.image_url ? (
                                                        <Image
                                                            src={similarRecipe.image_url}
                                                            alt={similarRecipe.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                                            🍽️
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium line-clamp-2 text-sm">
                                                        {similarRecipe.name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {similarRecipe.author_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Share Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">مشاركة الوصفة</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ShareButtons />
                            </CardContent>
                        </Card>


                    </div>
                </aside>
            </div>
        </div >
    );
}
