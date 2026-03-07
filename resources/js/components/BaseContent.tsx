"use client";

import * as React from "react";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FaRegFileExcel, FaRegFileWord } from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; // ← important !
import { cn } from "@/lib/utils"; // si tu as cette fonction utilitaire

import { Column, columnConfigs } from "@/configs/columnTables";
import { graphqlGet } from '@/utils/graphql';
import { ModalCreateGeneric } from "./ModalCreateGeneric";

import * as Icons from "lucide-react";
import { fieldModals } from "@/configs/fieldModal";
import { can, useGlobalStore } from "@/hooks/backoffice";

import { useEffect, useState } from "react";

interface EntityItem {
  id: number | string;
  [key: string]: any;
}

interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    custom?: any;
  };
}

export default function BaseContent({attributeName, namepage,page,...props}:{attributeName:string, namepage: string;page: any;})
{
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<EntityItem[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns: Column[] = columnConfigs[attributeName] ?? [];
  
  const fieldModal = fieldModals[attributeName] ?? [];

  const goodType = !attributeName.endsWith("s") ? attributeName + "s" : attributeName;

  const { initialize, dataPage, isLoading: globalLoading, error: globalError } = useGlobalStore();

  // Premier effect : synchronisation des states locaux quand dataPage[goodType] change
  useEffect(() =>
  {
    const entityData = dataPage[goodType];
    if (entityData)
    {
      setItems(entityData.data);
      setMetadata(entityData.metadata);
      setLoading(false);
    }
    else
    {
      setLoading(true);
    }
    setError(globalError);
  }, [dataPage[goodType], globalError]);

  useEffect(() =>
  {
    if (!attributeName || columns.length === 0)
    {
      setLoading(false);
      return;
    }

    const entityData = dataPage[goodType];
    initialize({
      page,
      attributeName,
      onlyPageChange: true,
      currentPage,
      pageSize,
      force: true, // Force pour refresh sur pagination
    });
  }, [attributeName, currentPage, pageSize, initialize]); 

  const PageIcon = page?.icon ? (Icons[page.icon as keyof typeof Icons] as React.ElementType) : null;

  if (columns.length === 0) {
    return (
      <div className="p-12 text-center text-red-500">
        Aucune configuration pour <strong>{namepage}</strong>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Contenu principal scrollable */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-24 md:pb-20">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {PageIcon && <PageIcon className="w-5 h-5" />}
            <h1 className="text-lg font-semibold tracking-tight">{namepage}</h1>
            <Badge variant="outline" className="font-normal">
              {metadata?.total ?? 0}
            </Badge>
          </div>

          {can(`creation-${attributeName}`, {permissions: Array.isArray(dataPage['permissions']) ? dataPage['permissions'] : []}) && <ModalCreateGeneric
            title={`Ajouter un ${namepage}`}
            description={`Remplissez les informations pour créer un nouveau ${namepage.toLowerCase()}.`}
            entity={attributeName}
            fields={fieldModal}
            onSuccess={(newItem) => {
              // Tu peux ici soit : recharger la page courante, soit ajouter en premier
              setCurrentPage(1); // le plus simple pour l'instant
            }}
          >
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </ModalCreateGeneric>}
        </div>

        {/* Filtres / exports */}
        <Card className="shadow-sm">
          <CardContent className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Filtrer par période</p>
            <div className="flex gap-3">
              <FaRegFileExcel className="text-green-600 text-2xl cursor-pointer hover:opacity-80 transition" />
              <FaRegFileWord className="text-blue-600 text-2xl cursor-pointer hover:opacity-80 transition" />
            </div>
          </CardContent>
        </Card>

        {/* Tableau avec skeleton */}
        <Card className="shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    {columns.map((col) => (
                      <TableHead key={col.key} className={cn("text-center", col.className)}>
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                {loading ? (
                    // Loader central au lieu de skeletons
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="mt-2 text-sm text-muted-foreground">Chargement des données...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) :  items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                        Aucun résultat trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Données avec légère animation d'apparition
                    items.map((row, idx) => (
                      <TableRow
                        key={row.id ?? idx}
                        className={cn(
                          "transition-opacity duration-300 text-center",
                          loading ? "opacity-0" : "opacity-100"
                        )}
                      >
                        {columns.map((col) => (
                          <TableCell key={col.key} className={cn("py-3", col.className)}>
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
      </div>

      {/* Pagination fixe en bas – largeur totale moins sidebar */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 md:left-[var(--sidebar-width,280px)] bg-background border-t shadow-sm z-20",
          "transition-all duration-200"
        )}
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Gauche : select page size */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
                Lignes par page
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pagination */}
            <Pagination className="justify-center sm:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(metadata?.last_page ?? 1, 7) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {metadata?.last_page > 7 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < (metadata?.last_page ?? 1))
                        setCurrentPage(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}