import { useState, useMemo } from 'react';
import { PaginationState } from '@/types/campaign';

export function usePagination<T>(items: T[], initialItemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const paginationState: PaginationState = useMemo(() => ({
    currentPage,
    itemsPerPage,
    totalItems: items.length
  }), [currentPage, itemsPerPage, items.length]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const nextPage = () => goToPage(currentPage + 1);
  const previousPage = () => goToPage(currentPage - 1);

  return {
    currentItems,
    paginationState,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    changeItemsPerPage,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1
  };
}
