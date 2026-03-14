import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ContextMenu, ContextMenuContent, ContextMenuItem,
  ContextMenuSeparator, ContextMenuTrigger,
} from "./ui/context-menu";
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from "./ui/hover-card";
import { Input } from "./ui/input";
import { useForm } from "@inertiajs/react";
import * as Icons from "lucide-react";

import { ActionsConfig, cn, Column, FieldConfig, TabConfig, PaletteColors } from "@/lib/utils";
import { columnConfigs, useRowActions } from "@/configs/listOfColumnTables";
import { fieldModals } from "@/configs/listOfFieldModal";
import { can, exportToPdfOrExcel, useGlobalStore } from "@/hooks/backoffice";
import listofFilters from "@/configs/listOfFilters";

import { ConfirmDialog } from "./ConfirmDialog";
import PaginationComponent from "./PaginationComponent";
import { MoreFilters } from "./MoreFilters";
import { BaseModal } from "./BaseModal";

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

  // ─── Helpers ─────────────────────────────────────────

const pluralMap: Record<string, string> = {};

function toPlural(name: string): string {
  return pluralMap[name] ?? (name.endsWith("s") ? name : name + "s");
}

  // ─── Sub-component : ActionMenuItem ──────────────────

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
      style   = {{ color: PaletteColors.text, fontSize: 13 }}
      onClick = {() => action.onClick?.(row)}
    >
      {React.isValidElement(Icon) ? Icon : Icon && <Icon className="mr-2 h-4 w-4" />}
      <span>{action.label}</span>
    </ContextMenuItem>
  );
}

  // ─── Composant principal ──────────────────────────────

export default function BaseContent({
  attributeName,
  namepage,
  page,
  permissionName,
}: {
  attributeName  : string;
  namepage       : string;
  page           : PageProps;
  permissionName?: string | null;
}) {
  const {
    initialize,
    dataPage,
    isLoading: globalLoading,
    errors   : errorGraphQL,
    updateItem,
    scope,
  } = useGlobalStore();

  const [pageSize, setPageSize]                 = useState(10);
  const [currentPage, setCurrentPage]           = useState(1);
  const [items, setItems]                       = useState<EntityItem[]>([]);
  const [metadata, setMetadata]                 = useState<any>(null);
  const [loading, setLoading]                   = useState(true);
  const [isModalOpen, setIsModalOpen]           = useState(false);
  const [isMoreFilterOpen, setIsMoreFilterOpen] = useState(false);
  const [refreshList, setRefreshList]           = useState(0);
  const [filters, setFilters]                   = useState({});
  const [contextRow, setContextRow]             = useState<EntityItem | null>(null);

  const { data, setData, reset } = useForm({ search: "" });

  const columns: Column[]    = columnConfigs[attributeName] ?? [];
  const fieldModal           = fieldModals[attributeName] ?? [];
  const isTabs               = fieldModal.some((c: any) => "key" in c);
  const goodType             = toPlural(attributeName);
  const permissionPages: any = dataPage["permissions"] ?? [];

  const actionCol = columns.find((c) => c.key === "actions");

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
      force: true,
    });
  }, [attributeName, currentPage, pageSize, initialize, refreshList, filters]);

  useEffect(() => {
    setIsModalOpen(updateItem != null);
  }, [updateItem]);

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
    setFilters((prev) => ({ ...prev, ...data }));
  }, [data]);

  const handleResetFilters = useCallback(() => {
    reset();
    setFilters({});
  }, [reset]);

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
    <div className = "flex-1 overflow-y-auto space-y-4 md:pb-20">

        {/* ── Header ── */}
        <div className = "flex items-center justify-between gap-4 flex-wrap">
        <div className = "flex items-center gap-3">
            {PageIcon && (
              <PageIcon className = "w-4 h-4" style = {{ color: PaletteColors.accent }} />
            )}
            <h1
              className = "text-sm font-semibold tracking-tight"
              style     = {{ color: PaletteColors.textActive }}
            >
              {namepage}
            </h1>
            <Badge
              className = "font-normal text-xs rounded-[4px] px-2 py-0.5"
              style     = {{
                background: PaletteColors.bgActive,
                color     : PaletteColors.accent,
                border    : `1px solid ${PaletteColors.border}`,
              }}
            >
              {metadata?.total ?? 0}
            </Badge>
          </div>

          {can(`creation-${permissionName ?? attributeName}`, permissionPages) && (
            <HoverCard openDelay = {80} closeDelay = {150}>
              <HoverCardTrigger asChild>
                <Button
                  size      = "sm"
                  className = "gap-1.5 text-xs h-8"
                  style     = {{
                    background: PaletteColors.accent,
                    color     : "#fff",
                    border    : "none",
                  }}
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
                  background: PaletteColors.bg,
                  border    : `1px solid ${PaletteColors.border}`,
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
                      style        = {{ color: PaletteColors.text }}
                      onMouseEnter = {(e) => {
                        e.currentTarget.style.background = PaletteColors.bgHover
                        e.currentTarget.style.color      = PaletteColors.textActive
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent"
                        e.currentTarget.style.color      = PaletteColors.text
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>

        {/* ── Filtres ── */}
        <Card
          className = "shadow-sm py-2 rounded-[7px]"
          style     = {{
            background: PaletteColors.bgActive,
            border    : `1px solid ${PaletteColors.border}`,
          }}
        >
          <CardContent className = "flex px-3 justify-between items-center gap-3 flex-wrap">
          <div         className = "flex flex-1 gap-2 items-center min-w-0">
              <form
                onSubmit  = {(e) => { e.preventDefault(); handleApplyFilters(); }}
                className = "flex flex-1 min-w-0"
              >
                <div className = "relative w-full">
                  <Input
                    type      = "search"
                    className = "pr-9 h-8 text-xs [&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden"
                    style     = {{
                      background: PaletteColors.bg,
                      border    : `1px solid ${PaletteColors.border}`,
                      color     : PaletteColors.textActive,
                    }}
                    value       = {data.search}
                    onChange    = {(e) => setData({ ...data, search: e.target.value })}
                    placeholder = {
                      listofFilters[attributeName]?.placeholder as string ??
                      "Rechercher..."
                    }
                  />
                  <Icons.Search
                    className = "absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
                    style     = {{ color: PaletteColors.text }}
                  />
                </div>
              </form>

              <button
                onClick   = {handleResetFilters}
                className = "h-8 px-3 text-xs rounded-md transition-all flex-shrink-0"
                style     = {{
                  color     : "#f87171",
                  border    : "1px solid #f87171",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                }}
              >
                Annuler
              </button>
            </div>

            <div className = "flex items-center gap-2 flex-shrink-0">
              <button
                onClick      = {() => exportToPdfOrExcel(attributeName, "excel", data)}
                className    = "flex items-center gap-1.5 h-8 px-2 text-xs rounded-md transition-all"
                style        = {{ color: PaletteColors.text, background: "transparent" }}
                onMouseEnter = {(e) => {
                  e.currentTarget.style.background = PaletteColors.bgHover
                  e.currentTarget.style.color      = PaletteColors.textActive
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color      = PaletteColors.text
                }}
              >
                <FaRegFileExcel className = "text-green-500 text-sm" />
                Excel
              </button>

              <button
                onClick      = {() => exportToPdfOrExcel(attributeName, "pdf", data)}
                className    = "flex items-center gap-1.5 h-8 px-2 text-xs rounded-md transition-all"
                style        = {{ color: PaletteColors.text, background: "transparent" }}
                onMouseEnter = {(e) => {
                  e.currentTarget.style.background = PaletteColors.bgHover
                  e.currentTarget.style.color      = PaletteColors.textActive
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color      = PaletteColors.text
                }}
              >
                <FaRegFilePdf className = "text-red-400 text-sm" />
                Pdf
              </button>

              <div
                className = "w-px h-5 mx-1"
                style     = {{ background: PaletteColors.border }}
              />

              <button
                onClick   = {() => setIsMoreFilterOpen(!isMoreFilterOpen)}
                className = "flex items-center gap-1.5 h-8 px-3 text-xs rounded-md transition-all"
                style     = {{
                  color     : PaletteColors.text,
                  border    : `1px solid ${PaletteColors.border}`,
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = PaletteColors.bgHover
                  e.currentTarget.style.color      = PaletteColors.textActive
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color      = PaletteColors.text
                }}
              >
                Autres filtres
                <Icons.ArrowUpRightIcon className = "h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* ── Tableau ── */}
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Card
              className = "shadow-sm p-0 rounded-[7px] overflow-hidden"
              style     = {{
                background: PaletteColors.bgActive,
                border    : `1px solid ${PaletteColors.border}`,
              }}
            >
              <CardContent className = "p-0">
              <div         className = "overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow
                        className = "hover:bg-transparent"
                        style     = {{ background: PaletteColors.bg }}
                      >
                        {columns.map((col) => (
                          <TableHead
                            key       = {col.key}
                            className = {cn("text-center text-xs font-semibold", col.className)}
                            style     = {{
                              color       : PaletteColors.text,
                              borderBottom: `1px solid ${PaletteColors.border}`,
                            }}
                          >
                            {col.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {loading || Object.keys(errorGraphQL).length > 0 ? (
                        <TableRow>
                          <TableCell colSpan   = {columns.length} className = "h-32 text-center">
                          <div       className = "flex flex-col items-center justify-center gap-2">
                              {loading && !errorGraphQL && (
                                <>
                                  <Icons.Loader2
                                    className = "h-6 w-6 animate-spin"
                                    style     = {{ color: PaletteColors.accent }}
                                  />
                                  <p className = "text-xs" style = {{ color: PaletteColors.text }}>
                                    Chargement des données...
                                  </p>
                                </>
                              )}
                              {errorGraphQL && (
                                <p className = "text-xs text-red-400">
                                  {errorGraphQL[goodType] ?? ""}
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : items?.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan   = {columns.length}
                            className = "h-32 text-center text-xs"
                            style     = {{ color: PaletteColors.text }}
                          >
                            Aucun résultat trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        items?.map((row, idx) => (
                          <TableRow
                            key       = {row.id ?? idx}
                            className = {cn(
                              "transition-all duration-200 text-center cursor-context-menu",
                              loading ? "opacity-0": "opacity-100"
                            )}
                            style         = {{ borderBottom: `1px solid ${PaletteColors.border}` }}
                            onContextMenu = {() => setContextRow(row)}
                            onMouseEnter  = {(e) => {
                              e.currentTarget.style.background = PaletteColors.bgHover
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent"
                            }}
                          >
                            {columns.map((col) => (
                              <TableCell
                                key       = {col.key}
                                className = {cn("py-1.5 text-[12px]", col.className)}
                                style     = {{ color: PaletteColors.textActive }}
                              >
                                {col.render
                                  ? col.render(row[col.key], row, { namepage, attributeName })
                                  : (row[col.key] ?? "—")}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
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
              background: PaletteColors.bg,
              border    : `1px solid ${PaletteColors.border}`,
            }}
          >
            {contextRow && contextActions.length > 0 ? (
                // @ts-ignore
              contextActions.map((action, idx) => (
                <React.Fragment key = {action.key}>
                  {action.key === "delete" && idx > 0 && (
                    <ContextMenuSeparator style = {{ background: PaletteColors.border }} />
                  )}
                  <ActionMenuItem action = {action} row = {contextRow} />
                </React.Fragment>
              ))
            ) : (
              <ContextMenuItem
                disabled
                style = {{ color: PaletteColors.text, fontSize: 13 }}
              >
                Aucune action disponible
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </div>

      {/* ── Pagination fixe ── */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-20 transition-all duration-200",
          scope.collapsed ? "md:left-[56px]": "md:left-[260px]"
        )}
        style={{
          background: PaletteColors.bg,
          borderTop : `1px solid ${PaletteColors.border}`,
        }}
      >
        <div className = "max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className = "flex items-center justify-between w-full">

            <Select
              value         = {pageSize.toString()}
              onValueChange = {(v) => { setPageSize(Number(v)); setCurrentPage(1); }}
            >
              <SelectTrigger
                className = "w-16 h-8 text-xs"
                style     = {{
                  background: PaletteColors.bgActive,
                  border    : `1px solid ${PaletteColors.border}`,
                  color     : PaletteColors.text,
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: PaletteColors.bg,
                  border    : `1px solid ${PaletteColors.border}`,
                }}
              >
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem
                    key       = {size}
                    value     = {size.toString()}
                    className = "text-xs cursor-pointer"
                    style     = {{ color: PaletteColors.text }}
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <PaginationComponent
              groupSize      = {6}
              currentPage    = {currentPage}
              totalPages     = {metadata?.last_page}
              setCurrentPage = {setCurrentPage}
            />
          </div>
        </div>
      </div>

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
        onSuccess    = {() => setRefreshList((prev) => prev + 1)}
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