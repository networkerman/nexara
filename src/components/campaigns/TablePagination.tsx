import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaginationState } from '@/types/campaign';

interface TablePaginationProps {
  paginationState: PaginationState;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export function TablePagination({
  paginationState,
  totalPages,
  startIndex,
  endIndex,
  onPageChange,
  onItemsPerPageChange,
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious
}: TablePaginationProps) {
  const { currentPage, itemsPerPage, totalItems } = paginationState;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <Select 
          value={itemsPerPage.toString()} 
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          Previous
        </Button>
        
        {/* Page Numbers */}
        <div className="flex space-x-1">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            if (totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2) {
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="w-8"
                >
                  {page}
                </Button>
              );
            } else if (Math.abs(page - currentPage) === 3) {
              return <span key={page} className="px-2">...</span>;
            }
            return null;
          })}
        </div>

        <Button 
          variant="outline" 
          size="sm"
          onClick={onNext}
          disabled={!canGoNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
