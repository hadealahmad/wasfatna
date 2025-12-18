'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchInput({ className = '' }: { className?: string }) {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className={`relative ${className}`}>
            <Input
                type="search"
                placeholder="بحث عن وصفة..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10 h-10 w-[200px] lg:w-[300px] bg-background"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </form>
    );
}
