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


import { ActionsConfig, cn, Column, FieldConfig, TabConfig } from "@/lib/utils";
import { columnConfigs, useRowActions } from "@/configs/listOfColumnTables";
import { fieldModals } from "@/configs/listOfFieldModal";
import {
  can, exportToPdfOrExcel, useGlobalStore,
} from "@/hooks/backoffice";
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

  // Mapping explicite pour éviter les pluralisations incorrectes
const pluralMap: Record<string, string> = {
    // ajoute ici les cas irréguliers
    // ex: "category" : "categories"
};

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
      onClick = {() => action.onClick?.(row)}
    >
      {React.isValidElement(Icon)
        ? Icon
        : Icon && <Icon className="mr-2 h-4 w-4" />}
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

    // Row survolée pour le context menu
  const [contextRow, setContextRow] = useState<EntityItem | null>(null);

  const { data, setData, reset } = useForm({ search: "" });

  const columns: Column[]    = columnConfigs[attributeName] ?? [];
  const fieldModal           = fieldModals[attributeName] ?? [];
  const isTabs               = fieldModal.some((c: any) => "key" in c);
  const goodType             = toPlural(attributeName);
  const permissionPages: any = dataPage["permissions"] ?? [];

    // ─── Actions context menu pour la ligne courante ───
    // On récupère les actions de la config de la colonne "actions"
    //
    // const contextActions = contextRow
    //   ? useRowActions(contextRow, attributeName, namepage)
    //   : [];

      // Récupère le config de la colonne actions — source de vérité unique
    const actionCol = columns.find((c) => c.key === "actions");

      // ← évaluation au moment du rendu, can() lit le store à jour
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
    <div className = "flex-1 overflow-y-auto space-y-6 md:pb-20">

        {/* Header */}
        <div className = "flex items-center justify-between gap-4 flex-wrap">
        <div className = "flex items-center gap-3">
            {PageIcon && <PageIcon className="w-4 h-4" />}
            <h1    className = "text-md font-semibold tracking-tight">{namepage}</h1>
            <Badge variant   = "default" className = "font-normal text-xs rounded-[4px]">
              {metadata?.total ?? 0}
            </Badge>
          </div>

          {can(`creation-${permissionName ?? attributeName}`, permissionPages) && (
            <HoverCard openDelay = {80} closeDelay = {150}>
              <HoverCardTrigger asChild>
                <Button className = "cursor-pointer">
                <Plus   className = "h-4 w-4" />
                  Ajouter
                  <ChevronDown className = "h-4 w-4 opacity-70" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className = "w-45 p-2" align = "end" sideOffset = {8}>
              <div              className = "flex flex-col">
                  <Button
                    variant   = "ghost"
                    className = "justify-start px-4 py-2 rounded-none hover:bg-accent"
                    onClick   = {() => setIsModalOpen(true)}
                  >
                    <Plus className = "h-4 w-4 mr-2" />
                    Ajouter un item
                  </Button>
                  <Button
                    variant   = "ghost"
                    className = "justify-start px-4 py-2 rounded-none hover:bg-accent"
                    onClick   = {() => console.log("Import Excel")}
                  >
                    <FaRegFileExcel className = "mr-2 h-4 w-4 text-green-600" />
                    Import Excel
                  </Button>
                  <Button
                    variant   = "ghost"
                    className = "justify-start px-4 py-2 rounded-none hover:bg-accent"
                    onClick   = {() => window.open(`/${attributeName}.feuille`, "_self")}
                  >
                    <FaRegFileExcel className = "mr-2 h-4 w-4 text-green-600" />
                    Trame Excel
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>

        {/* Filtres */}
        <Card        className = "shadow-sm py-3 rounded-[7px]">
        <CardContent className = "flex px-2 justify-between items-center">
        <div         className = "flex w-full gap-2 items-center">
              <form
                onSubmit  = {(e) => { e.preventDefault(); handleApplyFilters(); }}
                className = "flex w-full max-w-lg"
              >
                <div className = "relative w-full">
                  <Input
                    type        = "search"
                    className   = "pr-9 [&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value       = {data.search}
                    onChange    = {(e) => setData({ ...data, search: e.target.value })}
                    placeholder = {
                      listofFilters[attributeName]?.placeholder as string ??
                      "Rechercher par libelle, description ..."
                    }
                  />
                  <Icons.Search className = "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </form>
              <Button
                size      = "sm"
                variant   = "outline"
                onClick   = {handleResetFilters}
                className = "cursor-pointer text-[12px] text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
              >
                Annuler
              </Button>
            </div>

            <div className = "flex items-center gap-4">
            <div className = "flex gap-2 items-center">
                <Button
                  size    = "xs" type = "button" variant = "link"
                  onClick = {() => exportToPdfOrExcel(attributeName, "excel", data)}
                >
                  <FaRegFileExcel className = "text-green-600 text-sm" />
                  Excel
                </Button>
                <Button
                  size    = "xs" type = "button" variant = "link"
                  onClick = {() => exportToPdfOrExcel(attributeName, "pdf", data)}
                >
                  <FaRegFilePdf className = "text-red-600 text-sm" />
                  Pdf
                </Button>
              </div>
              <Button
                size      = "xs"
                className = "p-4 cursor-pointer hover:opacity-80 transition"
                variant   = "outline"
                onClick   = {() => setIsMoreFilterOpen(!isMoreFilterOpen)}
              >
                Autres filtres
                <Icons.ArrowUpRightIcon />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tableau */}
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Card        className = "shadow-sm p-0 rounded-[7px] overflow-hidden">
            <CardContent className = "p-0">
            <div         className = "overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className = "bg-black hover:bg-black">
                        {columns.map((col) => (
                          <TableHead
                            key       = {col.key}
                            className = {cn("text-center text-white", col.className)}
                          >
                            {col.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {loading || Object.keys(errorGraphQL).length > 0 ? (
                        <TableRow>
                          <TableCell colSpan   = {columns.length} className = "h-20 text-center">
                          <div       className = "flex flex-col items-center justify-center">
                              {loading && !errorGraphQL && (
                                <>
                                  <Icons.Loader2 className = "h-8 w-8 animate-spin text-primary" />
                                  <p             className = "mt-2 text-sm text-muted-foreground">
                                    Chargement des données...
                                  </p>
                                </>
                              )}
                              {errorGraphQL && (
                                <p className = "mt-2 text-sm text-destructive">
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
                            className = "h-20 text-center text-muted-foreground"
                          >
                            Aucun résultat trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        items?.map((row, idx) => (
                          <TableRow
                            key       = {row.id ?? idx}
                            className = {cn(
                              "transition-opacity duration-300 text-center cursor-context-menu",
                              loading ? "opacity-0": "opacity-100"
                            )}
                            onContextMenu = {() => setContextRow(row)}
                          >
                            {columns.map((col) => (
                              <TableCell
                                key       = {col.key}
                                className = {cn("py-1 text-[13px] font-bold", col.className)}
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

          {/* Context menu branché sur la ligne courante */}
          <ContextMenuContent className = "w-48">
            {contextRow && contextActions.length > 0 ? (
                //@ts-ignore
              contextActions.map((action, idx) => (
                <React.Fragment key = {action.key}>
                  {/* Séparateur avant Supprimer */}
                  {action.key === "delete" && idx > 0 && <ContextMenuSeparator />}
                  <ActionMenuItem action = {action} row = {contextRow} />
                </React.Fragment>
              ))
            ) : (
              <ContextMenuItem disabled>Aucune action disponible</ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </div>

      {/* Pagination fixe */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-background border-t shadow-sm z-20 transition-all duration-200",
          scope.collapsed ? "md:left-[72px]": "md:left-[288px]"
        )}
      >
        <div className = "max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-[13.5px]">
        <div className = "flex items-center justify-between w-full">
            <Select
              value         = {pageSize.toString()}
              onValueChange = {(v) => { setPageSize(Number(v)); setCurrentPage(1); }}
            >
              <SelectTrigger className = "w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key = {size} value = {size.toString()}>{size}</SelectItem>
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

      {/* Filtres avancés */}
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

      {/* Modal création / édition */}
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

      {/* Dialog confirmation */}
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