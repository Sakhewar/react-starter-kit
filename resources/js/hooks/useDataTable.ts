import { useCallback, useState } from "react";

export type SortConfig = {
  key      : string;
  direction: "asc" | "desc";
} | null;

export function useDataTable() {

  // ─── Pagination ───────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize]       = useState(10);

  // ─── Filtres ──────────────────────────────────────
  const [filters, setFilters] = useState<Record<string, any>>({});

  const applyFilters = useCallback((data: Record<string, any>) => {
    setFilters((prev) => ({ ...prev, ...data }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  // ─── Tri ──────────────────────────────────────────
  const [sort, setSort] = useState<SortConfig>(null);

  const handleSort = useCallback((key: string) => {
    setSort((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc"
          ? { key, direction: "desc" }
          : null;
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  }, []);

  // ─── Sélection ────────────────────────────────────
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  const toggleRow = useCallback((id: string | number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((ids: (string | number)[]) => {
    setSelectedRows((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      if (allSelected) return new Set();
      return new Set(ids);
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  return {
    // Pagination
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    // Filtres
    filters, applyFilters, resetFilters,
    // Tri
    sort, handleSort,
    // Sélection
    selectedRows, toggleRow, toggleAll, clearSelection,
  };
}