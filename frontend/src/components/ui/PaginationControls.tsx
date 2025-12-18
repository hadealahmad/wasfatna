'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    perPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    className?: string;
}

export function PaginationControls({
    currentPage,
    totalPages,
    perPage,
    totalItems,
    onPageChange,
    onPerPageChange,
    className = '',
}: PaginationControlsProps) {
    if (totalPages <= 1 && totalItems <= perPage) return null;

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>عرض</span>
                <Select
                    value={perPage.toString()}
                    onValueChange={(value) => onPerPageChange(Number(value))}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={perPage.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
                <span>من أصل {totalItems}</span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 mx-2 text-sm font-medium">
                    <span>صفحة</span>
                    <span className="px-2 py-1 rounded-md bg-muted">{currentPage}</span>
                    <span>من {totalPages}</span>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
