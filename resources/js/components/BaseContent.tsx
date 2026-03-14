import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaRegFileExcel } from "react-icons/fa";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useForm } from "@inertiajs/react";
import * as Icons from "lucide-react";

import { ActionsConfig, cn, Column, FieldConfig, TabConfig, PaletteProps } from "@/lib/utils";
import { columnConfigs, useRowActions } from "@/configs/listOfColumnTables";
import { fieldModals } from "@/configs/listOfFieldModal";
import { can, deleteElement, exportToPdfOrExcel, useGlobalStore } from "@/hooks/backoffice";
import listofFilters from "@/configs/listOfFilters";

import { ConfirmDialog } from "./ConfirmDialog";
import { MoreFilters } from "./MoreFilters";
import { BaseModal } from "./BaseModal";
import { FilterBar } from "./FilterBar";
import { DataTable } from "./DataTable";
import { TableFooter } from "./TableFooter";
import { useDataTable } from "@/hooks/useDataTable";

  // ─── Types ───────────────────────────────────────────

type PageProps = {
  icon ?: string;
  title?: string;
  link ?: string;
};

interface EntityItem {
  id           : number | string;
  [key: string]: any;
}

const pluralMap: Record<string, string> = {};

function toPlural(name: string): string {
  return pluralMap[name] ?? (name.endsWith("s") ? name : name + "s");
}

  // ─── Composant principal ──────────────────────────────

export default function BaseContent({
  attributeName,
  namepage,
  page,
  permissionName,
  palette
}: {
  attributeName  : string;
  namepage       : string;
  page           : PageProps;
  permissionName?: string | null;
  palette        : PaletteProps
}) {
  
  const {
    initialize,
    dataPage,
    errors: errorGraphQL,
    updateItem,
    scope,
  } = useGlobalStore();

  const {
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    filters, applyFilters, resetFilters,
    sort, handleSort,
    selectedRows, toggleRow, toggleAll, clearSelection,
  } = useDataTable();

  const [items, setItems]                       = useState<EntityItem[]>([]);
  const [metadata, setMetadata]                 = useState<any>(null);
  const [loading, setLoading]                   = useState(true);
  const [isModalOpen, setIsModalOpen]           = useState(false);
  const [isMoreFilterOpen, setIsMoreFilterOpen] = useState(false);
  const [refreshList, setRefreshList]           = useState(0);
  const [contextRow, setContextRow]             = useState<EntityItem | null>(null);

  const searchInputRef           = useRef<HTMLInputElement>(null);
  const { data, setData, reset } = useForm({ search: "" });

  const columns: Column[]    = columnConfigs[attributeName] ?? [];
  const fieldModal           = fieldModals[attributeName] ?? [];
  const isTabs               = fieldModal.some((c: any) => "key" in c);
  const goodType             = toPlural(attributeName);
  const permissionPages: any = dataPage["permissions"] ?? [];

  const  actionCol                             = columns.find((c) => c.key === "actions");
  const  resolvedActionConfig: ActionsConfig   = 
  typeof actionCol?.actionConfig             === "function"
      ? actionCol.actionConfig()
      :  actionCol?.actionConfig ?? {};

  const contextActions = useRowActions(
    contextRow ?? {},
    attributeName,
    namepage,
    resolvedActionConfig,
    actionCol?.extraActions ?? []
  );

    // ─── Effects ──────────────────────────────────────

  const entityData = dataPage[goodType];

  useEffect(() => {
    if (entityData) {
      setItems(entityData.data);
      setMetadata(entityData.metadata);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [entityData, errorGraphQL]);

  useEffect(() => {
    if (!attributeName || columns.length === 0) {
      setLoading(false);
      return;
    }
    initialize({
      page,
      attributeName,
      onlyPageChange: true,
      currentPage,
      pageSize,
      filters,
      sort,
      force: true,
    });
  }, [attributeName, currentPage, pageSize, initialize, refreshList, filters, sort]);

  useEffect(() => {
    setIsModalOpen(updateItem != null);
  }, [updateItem]);

    // ─── Raccourcis clavier ───────────────────────────

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return

      if (e.key === "n" || e.key === "N") {
        e.preventDefault()
        setIsModalOpen(true)
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setIsModalOpen(false)
        setIsMoreFilterOpen(false)
        clearSelection()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [clearSelection])

    // ─── Handlers ─────────────────────────────────────

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    useGlobalStore.setState((s) => ({ ...s, updateItem: null }));
  }, []);

  const handleCloseConfirm = useCallback(() => {
    useGlobalStore.setState((s) => ({
      scope: { ...s.scope, itemToChange: null },
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (!scope?.itemToChange) return;
    scope.itemToChange.onConfirm().then((data: any) => {
      handleCloseConfirm();
      if (data?.success) setRefreshList((prev) => prev + 1);
    });
  }, [scope?.itemToChange, handleCloseConfirm]);

  const handleApplyFilters = useCallback(() => {
    applyFilters(data);
  }, [data, applyFilters]);

  const handleResetFilters = useCallback(() => {
    reset();
    resetFilters();
  }, [reset, resetFilters]);

  const handleDeleteSelected = useCallback(() => {
    const ids = Array.from(selectedRows);
    useGlobalStore.setState((s) => ({
      scope: {
        ...s.scope,
        itemToChange: {
          title      : `Suppression de ${ids.length} élément${ids.length > 1 ? "s" : ""}`,
          description: `Voulez-vous vraiment supprimer ${ids.length} élément${ids.length > 1 ? "s" : ""} ?`,
          confirmText: "Oui, tout supprimer",
          onConfirm  : async () => {
            const results = await Promise.all(
              ids.map((id) => deleteElement(attributeName, id as number))
            )
            clearSelection()
            return { success: results.every((r) => r?.success) }
          },
        },
      },
    }));
  }, [selectedRows, attributeName, clearSelection]);

    // ─── Render guards ────────────────────────────────

  const PageIcon = page?.icon
    ? (Icons[page.icon as keyof typeof Icons] as React.ElementType)
    :  null;

  if (columns.length === 0) {
    return (
      <div className = "p-12 text-center text-red-500">
        Aucune configuration pour <strong>{namepage}</strong>
      </div>
    );
  }

    // ─── JSX ──────────────────────────────────────────

  return (
    <div className = "flex flex-col h-full relative">
    <div className = "flex-1 overflow-y-auto space-y-4 md:pb-16">

        {/* ── Header ── */}
        <div className = "flex items-center justify-between gap-4 flex-wrap">
        <div className = "flex items-center gap-3">
            {PageIcon && (
              <PageIcon className = "w-4 h-4" style = {{ color: palette.accent }} />
            )}
            <h1
              className = "text-sm font-semibold tracking-tight"
              style     = {{ color: palette.textActive }}
            >
              {namepage}
            </h1>
            <Badge
              className = "font-normal text-xs rounded-[4px] px-2 py-0.5"
              style     = {{
                background: palette.bgActive,
                color     : palette.accent,
                border    : `1px solid ${palette.border}`,
              }}
            >
              {metadata?.total ?? 0}
            </Badge>

            {/* Raccourcis hint */}
            <span
              className = "hidden lg:flex items-center gap-2 text-[10px] ml-2"
              style     = {{ color: palette.text }}
            >
              <kbd
                className = "px-1.5 py-0.5 rounded text-[10px]"
                style     = {{ background: palette.bgActive, border: `1px solid ${palette.border}` }}
              >
                N
              </kbd> Nouveau ·
              <kbd
                className = "px-1.5 py-0.5 rounded text-[10px]"
                style     = {{ background: palette.bgActive, border: `1px solid ${palette.border}` }}
              >
                F
              </kbd> Filtrer
            </span>
          </div>

          {can(`creation-${permissionName ?? attributeName}`, permissionPages) && (
            <HoverCard openDelay = {80} closeDelay = {150}>
              <HoverCardTrigger asChild>
                <Button
                  size      = "sm"
                  className = "gap-1.5 text-xs h-8"
                  style     = {{ background: palette.accent, color: "#fff", border: "none" }}
                >
                  <Plus className = "h-3.5 w-3.5" />
                  Ajouter
                  <ChevronDown className = "h-3.5 w-3.5 opacity-70" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent
                className  = "w-48 p-1"
                align      = "end"
                sideOffset = {8}
                style      = {{
                  background: palette.bg,
                  border    : `1px solid ${palette.border}`,
                }}
              >
                <div className = "flex flex-col">
                  {[
                    {
                      icon   : <Plus className="h-3.5 w-3.5 mr-2" />,
                      label  : "Ajouter un item",
                      onClick: () => setIsModalOpen(true),
                    },
                    {
                      icon   : <FaRegFileExcel className="mr-2 h-3.5 w-3.5 text-green-500" />,
                      label  : "Import Excel",
                      onClick: () => console.log("Import Excel"),
                    },
                    {
                      icon   : <FaRegFileExcel className="mr-2 h-3.5 w-3.5 text-green-500" />,
                      label  : "Trame Excel",
                      onClick: () => window.open(`/${attributeName}.feuille`, "_self"),
                    },
                  ].map((item) => (
                    <button
                      key          = {item.label}
                      onClick      = {item.onClick}
                      className    = "flex items-center px-3 py-2 text-xs rounded-md transition-all text-left w-full"
                      style        = {{ color: palette.text }}
                      onMouseEnter = {(e) => {
                        e.currentTarget.style.background = palette.bgHover
                        e.currentTarget.style.color      = palette.textActive
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent"
                        e.currentTarget.style.color      = palette.text
                      }}
                    >
                      {item.icon}{item.label}
                    </button>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>

        {/* ── Filtres ── */}
        <FilterBar
          attributeName  = {attributeName}
          data           = {data}
          setData        = {setData}
          onSubmit       = {handleApplyFilters}
          onReset        = {handleResetFilters}
          onExportExcel  = {() => exportToPdfOrExcel(attributeName, "excel", data)}
          onExportPdf    = {() => exportToPdfOrExcel(attributeName, "pdf", data)}
          onMoreFilters  = {() => setIsMoreFilterOpen(!isMoreFilterOpen)}
          searchInputRef = {searchInputRef}
          palette        = {palette}
        />

        {/* ── Tableau ── */}
        <DataTable
          columns        = {columns}
          items          = {items}
          loading        = {loading}
          errorGraphQL   = {errorGraphQL}
          goodType       = {goodType}
          namepage       = {namepage}
          attributeName  = {attributeName}
          sort           = {sort}
          onSort         = {handleSort}
          selectedRows   = {selectedRows}
          onToggleRow    = {toggleRow}
          onToggleAll    = {toggleAll}
          contextActions = {contextActions}
          onContextMenu  = {setContextRow}
          contextRow     = {contextRow}
          palette        = {palette}
        />
      </div>

      {/* ── Footer ── */}
      <TableFooter
        collapsed        = {scope?.collapsed ?? false}
        pageSize         = {pageSize}
        setPageSize      = {setPageSize}
        setCurrentPage   = {setCurrentPage}
        currentPage      = {currentPage}
        totalPages       = {metadata?.last_page ?? 1}
        selectedCount    = {selectedRows.size}
        onDeleteSelected = {handleDeleteSelected}
        onClearSelection = {clearSelection}
        palette          = {palette}
      />

      {/* ── Filtres avancés ── */}
      <MoreFilters
        type         = {attributeName}
        fields       = {listofFilters[attributeName]?.fields as FieldConfig[] ?? []}
        data         = {data}
        setData      = {setData}
        reset        = {handleResetFilters}
        open         = {isMoreFilterOpen}
        onOpenChange = {() => setIsMoreFilterOpen(!isMoreFilterOpen)}
        handleSubmit = {handleApplyFilters}
      />

      {/* ── Modal ── */}
      <BaseModal
        page   = {page}
        title  = {namepage}
        entity = {attributeName}
        {...(isTabs
          ? { tabs: fieldModal as TabConfig[] }
          : { fields: fieldModal as FieldConfig[] })}
        updateItem   = {updateItem}
        onSuccess    = {() => { setRefreshList((prev) => prev + 1); clearSelection(); }}
        isOpen       = {isModalOpen}
        onOpenChange = {handleCloseModal}
      />

      {/* ── Confirm dialog ── */}
      <ConfirmDialog
        title        = {scope?.itemToChange?.title ?? ""}
        description  = {scope?.itemToChange?.description ?? ""}
        confirmText  = {scope?.itemToChange?.confirmText ?? ""}
        open         = {scope?.itemToChange != null}
        onConfirm    = {handleConfirm}
        onOpenChange = {handleCloseConfirm}
      />
    </div>
  );
}