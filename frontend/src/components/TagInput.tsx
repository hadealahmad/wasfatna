"use client"

import * as React from "react"
import { Check, Loader2, Plus, X } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import api from "@/lib/api"
import { Tag } from "@/types"

interface TagInputProps {
    value?: string[]
    onChange?: (value: string[]) => void
    placeholder?: string
}

export function TagInput({ value = [], onChange, placeholder = "Select tags..." }: TagInputProps) {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const [availableTags, setAvailableTags] = React.useState<Tag[]>([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        const fetchTags = async () => {
            setLoading(true)
            try {
                const data = await api.tags.list(inputValue) as Tag[] // Cast simple response
                setAvailableTags(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Failed to fetch tags", error)
            } finally {
                setLoading(false)
            }
        }

        const debounce = setTimeout(() => {
            fetchTags()
        }, 300)

        return () => clearTimeout(debounce)
    }, [inputValue])

    const handleUnselect = (tag: string) => {
        onChange?.(value.filter((t) => t !== tag))
    }

    const handleSelect = (tagName: string) => {
        setInputValue("")
        if (value.includes(tagName)) {
            handleUnselect(tagName)
        } else {
            onChange?.([...value, tagName])
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = inputRef.current
        if (input) {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (input.value === "" && value.length > 0) {
                    handleUnselect(value[value.length - 1])
                }
            }
            // Allow adding custom tag on Enter if it doesn't match any existing tag
            if (e.key === "Enter" && inputValue.trim() !== "") {
                e.preventDefault() // Prevent form submission
                const existingTag = availableTags.find(t => t.name.toLowerCase() === inputValue.toLowerCase())
                if (existingTag) {
                    if (!value.includes(existingTag.name)) {
                        handleSelect(existingTag.name)
                    }
                } else {
                    handleSelect(inputValue.trim())
                }
            }
        }
    }

    return (
        <CommandPrimitive className="relative overflow-visible">
            <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex flex-wrap gap-1 bg-background">
                {value.map((tag) => (
                    <Badge key={tag} variant="secondary">
                        {tag}
                        <button
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onClick={() => handleUnselect(tag)}
                            type="button"
                        >
                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                    </Badge>
                ))}
                <CommandPrimitive.Input
                    ref={inputRef}
                    value={inputValue}
                    onValueChange={setInputValue}
                    onContextMenu={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 200)}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 min-w-[50px] h-6"
                />
            </div>
            {open && (inputValue || availableTags.length > 0) && (
                <div className="absolute top-full z-10 w-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                    <CommandList>
                        {loading && (
                            <CommandItem disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </CommandItem>
                        )}

                        {!loading && availableTags.length > 0 && (
                            <CommandGroup heading="Suggestions">
                                {availableTags.map((tag) => (
                                    <CommandItem
                                        key={tag.id}
                                        onSelect={() => handleSelect(tag.name)}
                                        className="cursor-pointer"
                                    >
                                        {tag.name}
                                        {value.includes(tag.name) && (
                                            <Check className="ml-auto h-4 w-4" />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {!loading && inputValue && !availableTags.some(t => t.name.toLowerCase() === inputValue.toLowerCase()) && (
                            <CommandGroup heading="Create">
                                <CommandItem onSelect={() => handleSelect(inputValue)} className="cursor-pointer">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create "{inputValue}"
                                </CommandItem>
                            </CommandGroup>
                        )}
                    </CommandList>
                </div>
            )}
        </CommandPrimitive>
    )
}
