'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Combobox } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';
import { City, Tag } from '@/types';
import { Check, ChevronsUpDown } from 'lucide-react';

interface SearchFiltersProps {
    cities: City[];
    tags?: Tag[];
    onSearch?: (params: { search: string; city: string; difficulty: string; tags: string[] }) => void;
    showSearchButton?: boolean;
}

const difficulties = [
    { value: '', label: 'كل المستويات' },
    { value: 'سهلة جداً', label: 'سهلة جداً' },
    { value: 'سهلة', label: 'سهلة' },
    { value: 'متوسطة', label: 'متوسطة' },
    { value: 'صعبة', label: 'صعبة' },
    { value: 'صعبة جداً', label: 'صعبة جداً' },
];

export function SearchFilters({ cities, tags = [], onSearch, showSearchButton = false }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');

    // Support multiple tags selection? or single. "dropdown filter" suggests single usually if it's "select".
    // But conceptually tags are usually multi-select. 
    // The previous implementation of RecipeController handles `tags` as array.
    // Let's implement single select for simplicity using Dropdown/Command first, maybe extend to multi.
    // Actually, user said "add a dropdown filter". Just "a" filter.
    // Let's do single select tag filter for now. "search sections" usually imply simple filters.
    // If I want multi-select in dropdown, I need to prevent close on select and show checkboxes.
    // I'll stick to single select tag for the search filter for now.

    const [selectedTag, setSelectedTag] = useState<string>(searchParams.get('tags') || ''); // Using 'tags' param generally for consistency, though it refers to slug

    // Debounced search for instant filtering
    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        if (!showSearchButton && onSearch) {
            onSearch({ search: value, city, difficulty, tags: selectedTag ? [selectedTag] : [] });
        }
    }, [city, difficulty, selectedTag, onSearch, showSearchButton]);

    const handleCityChange = useCallback((value: string) => {
        const newCity = value === 'all' ? '' : value;
        setCity(newCity);
        if (onSearch) {
            onSearch({ search, city: newCity, difficulty, tags: selectedTag ? [selectedTag] : [] });
        }
    }, [search, difficulty, selectedTag, onSearch]);

    const handleDifficultyChange = useCallback((value: string) => {
        const newDifficulty = value === 'all' ? '' : value;
        setDifficulty(newDifficulty);
        if (onSearch) {
            onSearch({ search, city, difficulty: newDifficulty, tags: selectedTag ? [selectedTag] : [] });
        }
    }, [search, city, selectedTag, onSearch]);

    const handleTagSelect = useCallback((value: string) => {
        const newTag = value === selectedTag ? '' : value; // Toggle off if clicked again? Or just select.
        setSelectedTag(newTag);
        if (onSearch) {
            onSearch({ search, city, difficulty, tags: newTag ? [newTag] : [] });
        }
    }, [search, city, difficulty, selectedTag, onSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Navigate to search results page
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (city) params.set('city', city);
        if (difficulty) params.set('difficulty', difficulty);
        if (selectedTag) params.set('tags', selectedTag); // We use 'tags' query param as array-like on backend, but here single value

        router.push(`/search?${params.toString()}`);
    };

    // Find tag name for display
    const selectedTagName = tags.find(t => t.slug === selectedTag)?.name;

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className={`flex flex-col gap-4 ${showSearchButton ? '' : 'md:flex-row'}`}>
                {/* Search Input */}
                <div className={`flex-1 ${showSearchButton ? 'w-full' : ''}`}>
                    <Input
                        type="search"
                        placeholder="ابحث عن وصفة..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="h-12 text-lg bg-background"
                        dir="rtl"
                    />
                </div>

                <div className={`flex flex-col md:flex-row gap-4 ${showSearchButton ? 'w-full' : ''}`}>
                    {/* City Filter */}
                    <Combobox
                        options={[
                            { value: 'all', label: 'كل المدن' },
                            ...cities.map(c => ({ value: String(c.id), label: c.name }))
                        ]}
                        value={city || 'all'}
                        onChange={handleCityChange}
                        placeholder="اختر المدينة"
                        searchPlaceholder="بحث في المدن..."
                        className={`h-12 bg-background ${showSearchButton ? 'w-full md:flex-1' : 'w-full md:w-48'}`}
                    />

                    {/* Tags Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={`justify-between h-12 bg-background font-normal ${showSearchButton ? 'w-full md:flex-1' : 'w-full md:w-48'}`}
                            >
                                {selectedTagName || "كل الوسوم"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="بحث عن وسم..." />
                                <CommandList>
                                    <CommandEmpty>لا يوجد نتائج.</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            value="all"
                                            onSelect={() => handleTagSelect('')}
                                            className="cursor-pointer"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    !selectedTag ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            كل الوسوم
                                        </CommandItem>
                                        {tags.map((tag) => (
                                            <CommandItem
                                                key={tag.id}
                                                value={tag.name}
                                                onSelect={() => handleTagSelect(tag.slug)}
                                                className="cursor-pointer"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedTag === tag.slug ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {tag.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Difficulty Filter */}
                    <Select value={difficulty || 'all'} onValueChange={handleDifficultyChange}>
                        <SelectTrigger size="lg" className={`bg-background ${showSearchButton ? 'w-full md:flex-1' : 'w-full md:w-48'}`}>
                            <SelectValue placeholder="مستوى الصعوبة" />
                        </SelectTrigger>
                        <SelectContent>
                            {difficulties.map((d) => (
                                <SelectItem key={d.value || 'all'} value={d.value || 'all'}>
                                    {d.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Search Button (for hero section) */}
                    {showSearchButton && (
                        <Button type="submit" size="xl" className="w-full md:w-auto px-8">
                            بحث
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
}
