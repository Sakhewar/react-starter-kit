import * as React from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  ContextMenu, ContextMenuContent, ContextMenuItem,
  ContextMenuSeparator, ContextMenuTrigger,
} from "./ui/context-menu";
import * as Icons from "lucide-react";
import { cn, Column, PaletteColors } from "@/lib/utils";
import { SortConfig } from "@/hooks/useDataTable";

  // ─── Skeleton ─────────────────────────────────────────

function SkeletonRow({ columns }: { columns: Column[] }) {
  return (
    <TableRow style = {{ borderBottom: `1px solid ${PaletteColors().border}` }}>
      {/* Checkbox */}
      <TableCell className = "w-8 py-1.5">
        <div
          className = "w-4 h-4 rounded animate-pulse mx-auto"
          style     = {{ background: PaletteColors().bgHover }}
        />
      </TableCell>
      {columns.map((col) => (
        <TableCell key = {col.key} className = "py-1.5">
          <div
            className = "h-3 rounded animate-pulse"
            style     = {{
              background: PaletteColors().bgHover,
              width     : `${Math.floor(Math.random() * 40) + 40}%`,
              margin    : "0 auto",
            }}
          />
        </TableCell>
      ))}
    </TableRow>
  )
}

  // ─── Sort icon ────────────────────────────────────────

function SortIcon({ colKey, sort }: { colKey: string; sort: SortConfig }) {
  if (sort?.key !== colKey) {
    return <Icons.ChevronsUpDown className = "h-3 w-3 ml-1 opacity-30" />
  }
  return sort.direction               === "asc"
  ?      <Icons.ChevronUp   className   = "h-3 w-3 ml-1" style = {{ color: PaletteColors().accent }} />
  :      <Icons.ChevronDown className   = "h-3 w-3 ml-1" style = {{ color: PaletteColors().accent }} />
}

  // ─── ActionMenuItem ───────────────────────────────────

function ActionMenuItem({ action, row }: { action: any; row: any }) {
  const Icon = action.icon;
  return (
    <ContextMenuItem
      className={
        action.variant === "destructive"
          ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
          : action.variant === "success"
          ? "text-green-600 focus:bg-green-50 focus:text-green-600"
          :  ""
      }
      style   = {{ color: PaletteColors().text, fontSize: 13 }}
      onClick = {() => action.onClick?.(row)}
    >
      {React.isValidElement(Icon) ? Icon : Icon && <Icon className="mr-2 h-4 w-4" />}
      <span>{action.label}</span>
    </ContextMenuItem>
  )
}

  // ─── Props ────────────────────────────────────────────

interface DataTableProps {
  columns       : Column[];
  items         : any[];
  loading       : boolean;
  errorGraphQL  : Record<string, any>;
  goodType      : string;
  namepage      : string;
  attributeName : string;
  sort          : SortConfig;
  onSort        : (key: string) => void;
  selectedRows  : Set<string | number>;
  onToggleRow   : (id: string | number) => void;
  onToggleAll   : (ids: (string | number)[]) => void;
  contextActions: any[];
  onContextMenu : (row: any) => void;
  contextRow    : any | null;
}

  // ─── Composant ────────────────────────────────────────

export function DataTable({
  columns,
  items,
  loading,
  errorGraphQL,
  goodType,
  namepage,
  attributeName,
  sort,
  onSort,
  selectedRows,
  onToggleRow,
  onToggleAll,
  contextActions,
  onContextMenu,
  contextRow,
}: DataTableProps) {

  const allSelected  = items.length > 0 && items.every((r) => selectedRows.has(r.id))
  const someSelected = items.some((r) => selectedRows.has(r.id))

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card
          className = "shadow-sm p-0 rounded-[7px] overflow-hidden"
          style     = {{
            background: PaletteColors().bgActive,
            border    : `1px solid ${PaletteColors().border}`,
          }}
        >
          <CardContent className = "p-0">
          <div         className = "overflow-x-auto">
              <Table>

                {/* Header */}
                <TableHeader>
                  <TableRow
                    className = "hover:bg-transparent"
                    style     = {{ background: PaletteColors().bg }}
                  >
                    {/* Checkbox tout sélectionner */}
                    <TableHead className = "w-8 text-center" style = {{ borderBottom: `1px solid ${PaletteColors().border}` }}>
                      <input
                        type      = "checkbox"
                        checked   = {allSelected}
                        ref       = {(el) => { if (el) el.indeterminate = someSelected && !allSelected }}
                        onChange  = {() => onToggleAll(items.map((r) => r.id))}
                        className = "cursor-pointer accent-blue-500 w-3.5 h-3.5"
                      />
                    </TableHead>

                    {columns.map((col) => (
                      <TableHead
                        key       = {col.key}
                        className = {cn(
                          "text-center text-xs font-semibold select-none",
                          col.sortable && "cursor-pointer",
                          col.className
                        )}
                        style={{
                          color       : PaletteColors().text,
                          borderBottom: `1px solid ${PaletteColors().border}`,
                        }}
                        onClick = {() => col.sortable && onSort(col.key)}
                      >
                        <div className = "flex items-center justify-center">
                          {col.label}
                          {col.sortable && <SortIcon colKey={col.key} sort={sort} />}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                {/* Body */}
                <TableBody>
                  {loading ? (
                      // Skeleton 5 lignes
                    Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key = {i} columns = {columns} />
                    ))
                  ) : Object.keys(errorGraphQL).length > 0 ? (
                    <TableRow>
                      <TableCell colSpan   = {columns.length + 1} className = "h-32 text-center">
                      <p         className = "text-xs text-red-400">
                          {errorGraphQL[goodType] ?? "Une erreur est survenue"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan   = {columns.length + 1}
                        className = "h-32 text-center text-xs"
                        style     = {{ color: PaletteColors().text }}
                      >
                        <div           className = "flex flex-col items-center gap-2">
                        <Icons.SearchX className = "h-6 w-6" style = {{ color: PaletteColors().text }} />
                          Aucun résultat trouvé
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((row, idx) => {
                      const isSelected = selectedRows.has(row.id)
                      return (
                        <TableRow
                          key       = {row.id ?? idx}
                          className = "transition-all duration-150 text-center cursor-context-menu"
                          style     = {{
                            borderBottom: `1px solid ${PaletteColors().border}`,
                            background  : isSelected
                              ? `${PaletteColors().accent}18`
                              :  "transparent",
                          }}
                          onContextMenu = {() => onContextMenu(row)}
                          onMouseEnter  = {(e) => {
                            if (!isSelected)
                              e.currentTarget.style.background = PaletteColors().bgHover
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected)
                              e.currentTarget.style.background = "transparent"
                          }}
                        >
                          {/* Checkbox ligne */}
                          <TableCell className = "w-8 py-1.5 text-center">
                            <input
                              type      = "checkbox"
                              checked   = {isSelected}
                              onChange  = {() => onToggleRow(row.id)}
                              className = "cursor-pointer accent-blue-500 w-3.5 h-3.5"
                              onClick   = {(e) => e.stopPropagation()}
                            />
                          </TableCell>

                          {columns.map((col) => (
                            <TableCell
                              key       = {col.key}
                              className = {cn("py-1.5 text-[12px]", col.className)}
                              style     = {{ color: PaletteColors().textActive }}
                            >
                              {col.render
                                ? col.render(row[col.key], row, { namepage, attributeName })
                                : (row[col.key] ?? "—")}
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>

      {/* Context menu */}
      <ContextMenuContent
        className = "w-48"
        style     = {{
          background: PaletteColors().bg,
          border    : `1px solid ${PaletteColors().border}`,
        }}
      >
        {contextRow && contextActions.length > 0 ? (
          contextActions.map((action: any, idx: number) => (
            <React.Fragment key = {action.key}>
              {action.key === "delete" && idx > 0 && (
                <ContextMenuSeparator style = {{ background: PaletteColors().border }} />
              )}
              <ActionMenuItem action = {action} row = {contextRow} />
            </React.Fragment>
          ))
        ) : (
          <ContextMenuItem disabled style = {{ color: PaletteColors().text, fontSize: 13 }}>
            Aucune action disponible
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}