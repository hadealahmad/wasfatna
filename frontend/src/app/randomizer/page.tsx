"use client"

import * as React from "react"
import { api } from "@/lib/api"
import { Ingredient, IngredientSelector } from "@/components/randomizer/ingredient-selector"
import { Recipe, RecipeSpinner } from "@/components/randomizer/recipe-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Sparkles, ChefHat, RotateCcw, ArrowLeft } from "lucide-react"

export default function RandomizerPage() {
    const [selectedIngredients, setSelectedIngredients] = React.useState<Ingredient[]>([])
    const [isSpinning, setIsSpinning] = React.useState(false)
    const [recipes, setRecipes] = React.useState<Recipe[]>([])
    const [winner, setWinner] = React.useState<Recipe | null>(null)
    const [showModal, setShowModal] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const handleIngredientSelect = (ingredient: Ingredient) => {
        if (!selectedIngredients.find(i => i.id === ingredient.id)) {
            setSelectedIngredients([...selectedIngredients, ingredient])
        }
    }

    const handleIngredientRemove = (id: number) => {
        setSelectedIngredients(selectedIngredients.filter(i => i.id !== id))
    }

    const startSpin = async () => {
        setLoading(true)
        setWinner(null)
        setShowModal(false)
        setRecipes([])

        try {
            const excludeIds = selectedIngredients.map(i => i.id)
            const res = await api.recipes.getRandom(excludeIds) as { recipes: Recipe[] }

            if (res.recipes && res.recipes.length > 0) {
                let spinRecipes = res.recipes
                while (spinRecipes.length < 30) {
                    spinRecipes = [...spinRecipes, ...res.recipes]
                }
                if (spinRecipes.length > 50) spinRecipes = spinRecipes.slice(0, 50);

                setRecipes(spinRecipes)

                setTimeout(() => {
                    setLoading(false)
                    setIsSpinning(true)
                }, 100)
            } else {
                setLoading(false)
                alert("لم يتم العثور على وصفات بهذه المعايير!")
            }
        } catch (error) {
            console.error("Failed to fetch random recipes", error)
            setLoading(false)
        }
    }

    const onSpinComplete = (wonRecipe: Recipe) => {
        setIsSpinning(false)
        setWinner(wonRecipe)
        setTimeout(() => {
            setShowModal(true)
        }, 800)
    }

    const spinAgain = () => {
        setShowModal(false)
        setWinner(null)
        setTimeout(() => {
            startSpin()
        }, 100)
    }

    return (
        <div className="container mx-auto max-w-5xl py-8 md:py-12 px-4" dir="rtl">
            <div className="mb-6 md:mb-8 text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">شو طابخين اليوم؟</h1>
                <p className="text-muted-foreground text-base md:text-lg">
                    محتار شو تطبخ؟ استبعد المكونات اللي ما بدك ياها وخلينا نختارلك!
                </p>
            </div>

            <div className="grid gap-6 md:gap-8">
                {/* Controls */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>تصفية</CardTitle>
                        <CardDescription>اختر المكونات التي تريد استبعادها من النتائج.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <IngredientSelector
                            selectedIngredients={selectedIngredients}
                            onSelect={handleIngredientSelect}
                            onRemove={handleIngredientRemove}
                        />

                        <Button
                            size="lg"
                            className="w-full text-lg font-bold h-14"
                            onClick={startSpin}
                            disabled={isSpinning || loading}
                        >
                            {loading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
                            {isSpinning ? "جاري التدوير..." : "🎲 يلا نختار!"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Spinner Area */}
                {(isSpinning || recipes.length > 0) && (
                    <div className="my-4 md:my-8">
                        <RecipeSpinner
                            recipes={recipes}
                            spinning={isSpinning}
                            onSpinComplete={onSpinComplete}
                        />
                    </div>
                )}

                {/* Button to re-open modal if closed */}
                {winner && !showModal && !isSpinning && (
                    <div className="text-center py-4">
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setShowModal(true)}
                            className="h-12"
                        >
                            <Sparkles className="ml-2 h-5 w-5" />
                            عرض الفائز
                        </Button>
                    </div>
                )}
            </div>

            {/* Winner Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent
                    className="max-w-md p-0 overflow-hidden border-2 border-primary gap-0"
                    dir="rtl"
                >
                    {winner && (
                        <div className="relative">
                            {/* Shine Animation Overlay */}
                            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg">
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    style={{
                                        animation: 'modalShine 2.5s ease-in-out infinite',
                                        transform: 'skewX(-15deg)',
                                    }}
                                />
                            </div>

                            {/* Sparkle Decorations */}
                            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                                {[...Array(6)].map((_, i) => (
                                    <Sparkles
                                        key={i}
                                        className="absolute text-yellow-400 animate-pulse"
                                        style={{
                                            top: `${15 + Math.random() * 70}%`,
                                            left: `${10 + Math.random() * 80}%`,
                                            animationDelay: `${i * 0.25}s`,
                                            opacity: 0.8,
                                            width: 14 + Math.random() * 10,
                                            height: 14 + Math.random() * 10,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Image Section */}
                            <div className="relative h-52 w-full bg-gradient-to-br from-primary/20 to-secondary/20">
                                {winner.image_url ? (
                                    <Image
                                        src={winner.image_url}
                                        alt={winner.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <ChefHat className="h-16 w-16 text-muted-foreground/30" />
                                    </div>
                                )}

                                {/* Winner Badge */}
                                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1.5 z-30">
                                    <Sparkles className="h-4 w-4" />
                                    🎉 الفائز!
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 space-y-4 bg-background">
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-bold">{winner.name}</h2>
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap">
                                        {winner.city?.name && <span>{winner.city.name}</span>}
                                        {winner.author && (
                                            <>
                                                <span>•</span>
                                                <span>بواسطة {winner.author.name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3 pt-2">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="w-full h-12 text-base font-semibold"
                                    >
                                        <Link href={`/recipes/${winner.slug}`}>
                                            <ArrowLeft className="ml-2 h-5 w-5" />
                                            عرض الوصفة
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full h-12 text-base font-semibold"
                                        onClick={spinAgain}
                                    >
                                        <RotateCcw className="ml-2 h-5 w-5" />
                                        دوّر مرة ثانية
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* CSS for modal shine animation */}
            <style jsx global>{`
                @keyframes modalShine {
                    0% { 
                        transform: translateX(-150%) skewX(-15deg); 
                    }
                    40% { 
                        transform: translateX(150%) skewX(-15deg); 
                    }
                    100% { 
                        transform: translateX(150%) skewX(-15deg); 
                    }
                }
            `}</style>
        </div>
    )
}
