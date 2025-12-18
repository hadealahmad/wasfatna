import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecipeCard as RecipeCardType } from '@/types';
import { formatTimeNeeded, getDifficultyColor } from '@/lib/utils';
import { MapPin, Clock, User, Utensils, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddToFavoritesModal } from '@/components/features/lists/AddToFavoritesModal';

interface RecipeCardProps {
    recipe: RecipeCardType;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <div className="relative group h-full">
            <Link href={`/recipes/${recipe.slug}`} className="block h-full">
                <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer py-0 gap-0 border-border/50">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {recipe.image_url ? (
                            <Image
                                src={recipe.image_url}
                                alt={recipe.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground">
                                <Utensils className="w-12 h-12 opacity-20" />
                            </div>
                        )}

                        {/* Difficulty Badge */}
                        <Badge
                            className={`absolute top-3 left-3 ${getDifficultyColor(recipe.difficulty)} shadow-sm`}
                        >
                            {recipe.difficulty}
                        </Badge>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4">
                        {/* Recipe Name */}
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {recipe.name}
                        </h3>

                        {/* Meta Info */}
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            {/* City */}
                            {recipe.city && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                    <span>{recipe.city}</span>
                                </div>
                            )}

                            {/* Time */}
                            {recipe.time_needed && (
                                <div className="flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                    <span>{formatTimeNeeded(recipe.time_needed)}</span>
                                </div>
                            )}

                            {/* Author */}
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary shrink-0" />
                                <span>{recipe.author_name}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            {/* Favorite Button - Absolute positioned outside Link */}
            <div className="absolute top-2 right-2 z-10">
                <AddToFavoritesModal
                    recipeId={recipe.id}
                    trigger={
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-muted-foreground hover:text-red-500 shadow-sm backdrop-blur-sm transition-colors"
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                    }
                />
            </div>
        </div>
    );
}
