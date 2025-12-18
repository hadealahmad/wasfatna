"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { useDebounce } from "@/hooks/use-debounce" // Assuming this hook exists or I will create a simple debounce

export interface Ingredient {
    id: number
    name: string
}

interface IngredientSelectorProps {
    selectedIngredients: Ingredient[]
    onSelect: (ingredient: Ingredient) => void
    onRemove: (ingredientId: number) => void
}

export function IngredientSelector({
    selectedIngredients,
    onSelect,
    onRemove,
}: IngredientSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [suggestions, setSuggestions] = React.useState<Ingredient[]>([])
    const [loading, setLoading] = React.useState(false)

    // Debounce search
    React.useEffect(() => {
        const fetchIngredients = async () => {
            if (!query || query.length < 2) {
                setSuggestions([])
                return
            }

            setLoading(true)
            try {
                const res = await api.ingredients.search(query) as { ingredients: Ingredient[] }
                setSuggestions(res.ingredients || [])
            } catch (error) {
                console.error("Failed to search ingredients", error)
                setSuggestions([])
            } finally {
                setLoading(false)
            }
        }

        const timer = setTimeout(fetchIngredients, 300)
        return () => clearTimeout(timer)
    }, [query])

    return (
        <div className="flex flex-col gap-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        اختر مكونات لاستبعادها...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="ابحث عن مكون..."
                            value={query}
                            onValueChange={setQuery}
                        />
                        <CommandList>
                            {loading && <div className="py-6 text-center text-sm text-muted-foreground">جاري التحميل...</div>}

                            {!loading && query.length >= 2 && suggestions.length === 0 && (
                                <CommandEmpty>لم يتم العثور على مكون.</CommandEmpty>
                            )}

                            {!loading && suggestions.length > 0 && (
                                <CommandGroup heading="مقترحات">
                                    {suggestions.map((ingredient) => (
                                        <CommandItem
                                            key={ingredient.id}
                                            value={ingredient.name}
                                            onSelect={() => {
                                                onSelect(ingredient)
                                                setOpen(false)
                                                setQuery("")
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedIngredients.some(i => i.id === ingredient.id) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {ingredient.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((ingredient) => (
                    <Badge key={ingredient.id} variant="secondary" className="px-3 py-1">
                        {ingredient.name}
                        <button
                            className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onClick={() => onRemove(ingredient.id)}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">إزالة {ingredient.name}</span>
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    )
}
