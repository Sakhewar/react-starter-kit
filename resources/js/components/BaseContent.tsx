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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import * as Icons from "lucide-react";

import { Column, columnConfigs } from "@/configs/columnTables";
import { graphqlGet } from '@/utils/graphql'; // ← ta fonction GET

// Import du modal générique
import { ModalCreateGeneric } from "./ModalCreateGeneric";

// Typage générique pour les données (à affiner par entité si besoin)
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

export default function BaseContent({namepage, page, ...props} : { namepage: string, page: any }) {
  const [pageSize, setPageSize] = React.useState(10);
  const [isOpen, setIsOpen] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [metadata, setMetadata] = React.useState<any>(null);
  const [items, setItems] = React.useState<EntityItem[]>([]);



  const attributeName = String(page?.link || "").replaceAll("/", "");

  const columns: Column[] = columnConfigs[attributeName] ?? [];

  console.log("diop log - attributeName:", attributeName, page?.link);

  
  React.useEffect(() => {
    async function loadData() {
      if (!attributeName || columns.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Champs à récupérer (on filtre les clés simples, on gère les relations imbriquées dans le rendu)
        const fields = columns
          .map((col) => col.key)
          .filter((key) => key !== "actions" && !key.includes("."));

        const result = await graphqlGet<PaginatedResponse<EntityItem>>({
          entity: attributeName,
          fields,
          args: {
            page: currentPage,
            count: pageSize,
            // Ajoute ici tes filtres dynamiques si besoin
            // search: searchValue,
            // filter: { status: 'active' }
          },
        });

        setItems(result.data);
        setMetadata(result.metadata);

        console.log("diop log - items:", result.data);
        console.log("diop log - metadata:", result.metadata);
        console.log("diop log - totalPages:", result.metadata?.last_page);

      } catch (err: any) {
        setError(err.message || `Erreur lors du chargement de ${namepage}`);
        console.error("Erreur GraphQL :", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [attributeName, currentPage, pageSize, columns]);

  console.log("diop log - users:", items);

  const PageIcon = page && page.icon ? (Icons[page.icon as keyof typeof Icons] as React.ElementType) : null;





  if (columns.length === 0) {
    return (
      <div className="p-12 text-center text-red-500">
        Aucune configuration pour <strong>{namepage}</strong>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-20"> {/* pb-20 pour laisser de la place au footer fixe */}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {PageIcon && <PageIcon className="w-4 h-4" />}
            <h1 className="text-sm sm:text-sm md:text-md lg:text-lg tracking-tight">
              {namepage}
            </h1>
            <Badge className="ring-black-200 rounded-0">{metadata?.total ? metadata?.total: 0}</Badge>
          </div>

          <div className="">
            {/* Appel au modal générique au lieu de HoverCard */}
            <ModalCreateGeneric
              title={`Ajouter un ${namepage}`}
              description={`Remplissez les informations pour créer un nouveau ${namepage.toLowerCase()}.`}
              entity={attributeName} // ex: 'pays'
              fields={[
                { name: "libelle", label: "Libellé", type: "text", required: true },
                { name: "description", label: "Description", type: "textarea" },
                // Ajoute tes champs ici selon columns
              ]}
              onSuccess={(newItem) => {
                console.log("Nouveau créé :", newItem);
                // Optionnel : recharge la liste
                // loadUsers();
              }}
            >
              <Button>
                <Plus className="h-4 w-4" />
                Ajouter
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </ModalCreateGeneric>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Filtrer par periode</p>
              <div className="flex items-center gap-2 cursor-pointer">
                <FaRegFileExcel className="text-green-600 text-2xl" />
                <FaRegFileWord className="text-blue-600 text-2xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau scrollable interne si besoin */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.key} className={col.className + " text-center"}>
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {items?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Aucun résultat
                    </TableCell>
                  </TableRow>
                ) : (
                  items?.map((row: any, idx: number) => (
                    <TableRow key={row.id ?? idx}>
                      {columns.map((col) => (
                        <TableCell key={col.key} className={col.className}>
                          {col.render ? col.render(row[col.key], row, {namepage: namepage, attributeName : attributeName}) : (row[col.key] ?? "—")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Pagination fixe en bas */}
      <div className="fixed bottom-0 w-[78%] bg-background border-t shadow-md p-4 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Afficher Par
            </span>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination>
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

                  {Array.from({ length: Math.min(metadata?.last_page, 5) }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {metadata?.last_page > 5 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < metadata?.last_page) setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
        </div>
      </div>
    </div>
  );
}