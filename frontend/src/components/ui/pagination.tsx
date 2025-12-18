'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 py-8">
            {/* Previous Page - Appears on Right in RTL */}
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                asChild={currentPage > 1}
            >
                {currentPage > 1 ? (
                    <Link href={createPageURL(currentPage - 1)} aria-label="السابق">
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span aria-hidden="true">
                        <ChevronRight className="h-4 w-4" />
                    </span>
                )}
            </Button>

            <span className="text-sm font-medium mx-2">
                صفحة {currentPage} من {totalPages}
            </span>

            {/* Next Page - Appears on Left in RTL */}
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                asChild={currentPage < totalPages}
            >
                {currentPage < totalPages ? (
                    <Link href={createPageURL(currentPage + 1)} aria-label="التالي">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <span aria-hidden="true">
                        <ChevronLeft className="h-4 w-4" />
                    </span>
                )}
            </Button>
        </div>
    );
}
