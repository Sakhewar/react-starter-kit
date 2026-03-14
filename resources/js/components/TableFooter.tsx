import { cn, PaletteProps } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import PaginationComponent from "./PaginationComponent";
import * as Icons from "lucide-react";

interface TableFooterProps {
  collapsed     : boolean;
  pageSize      : number;
  setPageSize   : (size: number) => void;
  setCurrentPage: (page: number) => void;
  currentPage   : number;
  totalPages    : number;
  selectedCount : number;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
  palette         : PaletteProps
}

export function TableFooter({
  collapsed,
  pageSize,
  setPageSize,
  setCurrentPage,
  currentPage,
  totalPages,
  selectedCount,
  onDeleteSelected,
  onClearSelection,
  palette
}: TableFooterProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-20 transition-all duration-200",
        collapsed ? "md:left-[56px]" : "md:left-[260px]"
      )}
      style={{
        background: palette.bg,
        borderTop : `1px solid ${palette.border}`,
      }}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-[5.5px]">
        <div className="flex items-center justify-between w-full gap-4">

          {selectedCount > 0 ? (
            // ─── Actions groupées ─────────────────────
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: palette.text }}>
                  <span style={{ color: palette.accent, fontWeight: 600 }}>
                    {selectedCount}
                  </span>
                  {" "}ligne{selectedCount > 1 ? "s" : ""} sélectionnée{selectedCount > 1 ? "s" : ""}
                </span>

                <button
                  onClick={onClearSelection}
                  className="h-7 px-2 text-xs rounded-md transition-all"
                  style={{ color: palette.text, border: `1px solid ${palette.border}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = palette.bgHover }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
                >
                  Désélectionner
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onDeleteSelected}
                  className="flex items-center gap-1.5 h-7 px-3 text-xs rounded-md transition-all"
                  style={{
                    color     : "#f87171",
                    border    : "1px solid #f87171",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
                >
                  <Icons.Trash2 className="h-3.5 w-3.5" />
                  Supprimer la sélection
                </button>
              </div>
            </>
          ) : (
            // ─── Pagination normale ───────────────────
            <>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}
              >
                <SelectTrigger
                  className="w-16 h-8 text-xs"
                  style={{
                    background: palette.bgActive,
                    border    : `1px solid ${palette.border}`,
                    color     : palette.text,
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: palette.bg,
                    border    : `1px solid ${palette.border}`,
                  }}
                >
                  {[10, 25, 50, 100].map((size) => (
                    <SelectItem
                      key={size}
                      value={size.toString()}
                      className="text-xs cursor-pointer"
                      style={{ color: palette.text }}
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div>
                <PaginationComponent
                  groupSize={6}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  palette={palette}
                />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}