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
import { FaRegFileExcel, FaRegFilePdf} from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils"; // si tu as cette fonction utilitaire

import { Column, columnConfigs } from "@/configs/listOfColumnTables";
import { ModalCreateGeneric } from "./ModalCreateGeneric";

import * as Icons from "lucide-react";
import { fieldModals } from "@/configs/listOfFieldModal";
import { can, deleteElement, exportToPdfOrExcel, useGlobalStore } from "@/hooks/backoffice";

import { useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { ConfirmDialog } from "./ConfirmDialog";
import PaginationComponent from "./PaginationComponent";
import { Input } from "./ui/input";
import { useForm } from "@inertiajs/react";
import { MoreFilters } from "./MoreFilters";

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
  //Charger le state management de Zustand
  const { initialize, dataPage, isLoading: globalLoading, error: globalError, updateItem, deleteItem, scope} = useGlobalStore();

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<EntityItem[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isMoreFilterOpen, setIsMoreFilterOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [refreshList, setRefreshList] = useState(0);
  const [filters, setFilters] = useState({});
  const { data, setData, reset } = useForm({
    search: "",
  });

  const columns: Column[] = columnConfigs[attributeName] ?? [];
  
  const fieldModal = fieldModals[attributeName] ?? [];

  const goodType = !attributeName.endsWith("s") ? attributeName + "s" : attributeName;


  const permissionPages: any = dataPage['permissions'] ?? [];

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
  }, [dataPage[goodType], globalError]);

  useEffect(() =>
  {
    if (!attributeName || columns.length === 0)
    {
      setLoading(false);
      return;
    }

    initialize({
      page,
      attributeName,
      onlyPageChange: true,
      currentPage,
      pageSize,
      filters: filters,
      force: true, // Force pour refresh sur pagination
    });
  }, [attributeName, currentPage, pageSize, initialize, refreshList,filters]); 

  useEffect(()=>
  {
    setIsModalOpen(updateItem != null);
    
  },[updateItem])

  useEffect(()=>{
    setIsDialogOpen(deleteItem != null);
  },[deleteItem])

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
      <div className="flex-1 overflow-y-auto space-y-6 md:pb-20">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {PageIcon && <PageIcon className="w-5 h-5" />}
            <h1 className="text-lg font-semibold tracking-tight">{namepage}</h1>
            <Badge variant="default" className="font-normal rounded-[4px]">
              {metadata?.total ?? 0}
            </Badge>
          </div>

          {can(`creation-${attributeName}`, permissionPages) && <div className="">
            <HoverCard openDelay={80} closeDelay={150}>
                <HoverCardTrigger asChild>
                  <Button className="cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Ajouter
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-45 p-2" align="end" sideOffset={8}>
                <div className="flex flex-col">
                  <Button variant="ghost" className="justify-start px-4 py-2 rounded-none hover:bg-accent"
                    onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un item
                  </Button>

                  <Button variant="ghost" className="justify-start px-4 py-2 rounded-none hover:bg-accent" onClick={() => console.log('Export Excel cliqué')}>
                    <FaRegFileExcel className="mr-2 h-4 w-4 text-green-600" />
                    Import Excel
                  </Button>

                  <Button variant="ghost" className="justify-start px-4 py-2 rounded-none hover:bg-accent"
                    onClick={() => console.log('Trame Word cliquée')}>
                    <FaRegFileExcel className="mr-2 h-4 w-4 text-green-600" />
                    Trame Excel
                  </Button>
                </div>
                </HoverCardContent>
              </HoverCard>
          </div>}
        </div>

        {/* Filtres / exports */}
        <Card className="shadow-sm py-3 rounded-[7px]">
          <CardContent className="flex px-2 justify-between items-center">
            <div className="flex w-full gap-2 items-center">
              <form onSubmit={(e)=>{e.preventDefault(),setFilters({...filters,...data}) }} className="flex w-full max-w-lg">
                <div className="relative w-full">
                  <Input
                    type="search"
                    className="pr-9
                      [&::-webkit-search-cancel-button]:hidden
                      [&::-ms-clear]:hidden
                      rounded-md border border-gray-300 px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    "
                    value={data.search}
                    onChange={(e) => setData({ ...data, search: e.target.value })}
                    placeholder="Rechercher par libelle, description ..."
                  />
                  <Icons.Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </form>
              <Button size="sm" variant="destructive" onClick={()=>{reset(), setFilters({})}} className="cursor-pointer text-[12px]">
                Annuler
              </Button>
            </div>


            <div className="flex items-center gap-4">
              <div className="flex gap-2 items-center">
                <Button size="xs" type="button" variant="link" onClick={()=>{exportToPdfOrExcel(attributeName, 'excel', data)}}>
                  <FaRegFileExcel className="text-green-600 text-sm cursor-pointer hover:opacity-80 transition" />
                  Excel
                </Button>
                <Button size="xs" type="button" variant="link" onClick={()=>{exportToPdfOrExcel(attributeName, 'pdf', data)}}>
                  <FaRegFilePdf className="text-red-600 text-sm cursor-pointer hover:opacity-80 transition" />
                  Pdf
                </Button>
              </div>
              <Button size="xs" className="p-4 cursor-pointer hover:opacity-80 transition" variant="outline" onClick={()=>{setIsMoreFilterOpen(!isMoreFilterOpen)}}>
                Autres filtres
                <Icons.ArrowUpRightIcon />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tableau avec skeleton */}
        <Card className="shadow-sm p-0 rounded-[7px] overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-black hover:bg-black">
                    {columns.map((col) => (
                      <TableHead key={col.key} className={cn("text-center text-white", col.className)}>
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                {loading ? (
                    // Loader central au lieu de skeletons
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="mt-2 text-sm text-muted-foreground">Chargement des données...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) :  items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-20 text-center text-muted-foreground">
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
                          <TableCell key={col.key} className={cn("py-1 text-[13px] font-bold", col.className)}>
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
          "fixed bottom-0 left-0 right-0 bg-background border-t shadow-sm z-20",
          "transition-all duration-200",
          scope.collapsed ? "md:left-[72px]" : "md:left-[288px]"
        )}
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-[13.5px]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">

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

            <div className="flex items-center">
              <PaginationComponent groupSize={6} currentPage={currentPage} totalPages={metadata?.last_page} setCurrentPage={setCurrentPage} />
            </div>

          </div>
        </div>
      </div>

      <MoreFilters type={attributeName} data={data} setData={setData} reset={()=>{reset(), setFilters({})}} open = {isMoreFilterOpen} onOpenChange={()=> setIsMoreFilterOpen(!isMoreFilterOpen)} handleSubmit={()=>setFilters({...filters,...data})} />

      {/* Modal ouvert manuellement via state */}
      <ModalCreateGeneric
          page={page}
          title={namepage}
          entity={attributeName}
          fields={fieldModal}
          updateItem={updateItem}
          onSuccess={(newItem) => {
            console.log("Nouveau créé :", newItem);
            setRefreshList((prev) => prev + 1)
          }}
          isOpen={isModalOpen} // ← Contrôle via state
          onOpenChange={() => {setIsModalOpen(!isModalOpen); useGlobalStore.setState((state) => ({ ...state, updateItem: null }));}}
        />

        <ConfirmDialog
            open={isDialogOpen}
            onConfirm={()=>{deleteElement(attributeName, deleteItem?.id).then((data) => {data && data.success && (setIsDialogOpen(false),setRefreshList((prev) => prev + 1));
            })}}
            onOpenChange={() => {setIsDialogOpen(!isDialogOpen); useGlobalStore.setState((state) => ({ ...state, deleteItem: null }));}}
          />
      </div>
  );
}