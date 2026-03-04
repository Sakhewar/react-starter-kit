"use client";

import * as React from "react";
import { Plus, ChevronDown, Sheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import * as Icons from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FaRegFileExcel, FaRegFileWord } from "react-icons/fa";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

import * as Attributes from "../pages/configs/attributes";

// ── Types & Données fictives ────────────────────────────────────────
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  name: string;
};

const payments: Payment[] = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@yahoo.com", name: "John Doe" },
  { id: "3u1reuv4", amount: 242, status: "processing", email: "Abe45@gmail.com", name: "Sarah Connor" },
  { id: "derv1ws0", amount: 837, status: "failed", email: "Monserrat44@gmail.com", name: "Maria Lopez" },
  { id: "5kma53ae", amount: 874, status: "success", email: "Silas22@gmail.com", name: "Ahmed Khan" },
  { id: "bhqecj4p", amount: 721, status: "processing", email: "carmella_h@hotmail.com", name: "Fatima Diallo" },
  // Ajoute-en plus si tu veux tester le scroll
];


const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className={`capitalize ${status === "success" ? "text-green-600" : status === "failed" ? "text-red-600" : ""}`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Montant</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("fr-SN", {
        style: "currency",
        currency: "XOF",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];

export default function DashboardPage({namepage, page, ...props} : { namepage: string }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageSize, setPageSize] = React.useState(10);
  const [isOpen, setIsOpen] = React.useState(false);

  const PageIcon = page && page.icon ? (Icons[page.icon as keyof typeof Icons] as React.ElementType) : null;

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const fraisPlans = [
    {
      code: "FI",
      nom: "Frais inscription",
      montant: "15,000.00 MAD",
      reduction: "—",
      net: "15,000.00 MAD",
      plan: "Intégral 1 tr.",
      statut: "Verrouillé",
    },
    {
      code: "SC",
      nom: "Scolarité",
      montant: "20,000.00 MAD",
      reduction: "2,000.00 MAD",
      net: "18,000.00 MAD",
      plan: "Mensualités 19 tr.",
      statut: "Verrouillé",
    },
  ];

  console.log("diop log",String(page.link).replaceAll("/", ''), );
  
  const columnsTable = Attributes.colonneTables[String(page.link).replaceAll("/", '')] || [];
  return (
    <div className="space-y-6">

      {/* Header de la section Titre et btn Ajouter */}
      <div className="flex sm:flex-row sm:items-center sm:justify-between gap-4">
        
        <div className="flex items-center gap-3">
          {PageIcon && <PageIcon className="w-4 h-4" />}
          <h1 className="text-lg tracking-tight">
            {namepage}
          </h1>
          <Badge className="ring-black-200 rounded-0">20</Badge>
        </div>

        <div className="">
          <HoverCard openDelay={80} closeDelay={150}>
              <HoverCardTrigger asChild>
                <Button className="cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Ajouter
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-52 p-2" align="end" sideOffset={8}>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Ajouter un item
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
                    <Sheet className="h-4 w-4" />
                    Fichier Excel
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
                    <Sheet className="h-4 w-4" />
                    Trame Excel
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
        </div>
      </div>

      
      <Card className="mt-10">
        <CardContent>
          <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Filtrer par periode</p>
              <div className="flex items-center gap-2 cursor-pointer">
                <FaRegFileExcel className="text-green-600 text-2xl" />
                <FaRegFileWord className="text-blue-600 text-2xl" />
              </div>
            </div>
        </CardContent>
      </Card>

       {/* Tableau Frais & Plans de paiement */}
       <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Code</TableHead>
                    <TableHead className="text-center">Nom</TableHead>
                    <TableHead className="text-center">Montant</TableHead>
                    <TableHead className="text-center">Réduction</TableHead>
                    <TableHead className="text-center">Net</TableHead>
                    <TableHead className="text-center">Plan</TableHead>
                    <TableHead className="flex items-center justify-center"><Icons.Menu className="w-4 h-4"/></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fraisPlans.map((item, idx) => (
                    <TableRow key={idx} className="text-center">
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.nom}</TableCell>
                      <TableCell>{item.montant}</TableCell>
                      <TableCell>
                        {item.reduction}
                      </TableCell>
                      <TableCell className="">
                        {item.net}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.plan}</Badge>
                      </TableCell>
                      <TableCell className="flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Icons.Settings className="w-4 h-4 cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <Icons.PencilIcon />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Icons.Copy />
                                Cloner
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem variant="destructive">
                                <Icons.TrashIcon />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
      </Card>

      <Card className="py-3">
        <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Afficher Par
                </span>
                <Select
                  value={`${pageSize}`}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    // Ici tu peux aussi mettre à jour table.setPageSize si tu ajoutes pagination réelle
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

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
        </CardContent>
      </Card>


    </div>
  )
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 py-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Gauche */}
            <div className="flex items-center gap-3">
              {/* Remplace par ton PageIcon */}
              <div className="h-6 w-6 flex items-center justify-center text-primary">
                <span className="text-sm font-bold">{PageIcon && <PageIcon />}</span>
              </div>
              <h1 className="text-sm` font-bold tracking-tight">{namepage}</h1>
              <span className="text-lg font-medium text-muted-foreground">
                {payments.length}
              </span>
            </div>

            {/* Droite : Bouton Ajouter */}
            <HoverCard openDelay={80} closeDelay={150}>
              <HoverCardTrigger asChild>
                <Button className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Ajouter
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-52 p-2" align="end" sideOffset={8}>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Ajouter un item
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
                    <Sheet className="h-4 w-4" />
                    Fichier Excel
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
                    <Sheet className="h-4 w-4" />
                    Trame Excel
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Filtres collapsible */}
          <Card className="py-3">
            <Collapsible defaultOpen={false}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between px-5 py-2 text-base hover:bg-muted/50"
                >
                  Filtres
                  <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-5 pb-5 pt-3 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Statut</label>
                    {/* Ajoute ton Select ou Input ici */}
                    <div className="h-10 bg-muted/50 rounded-md flex items-center px-3 text-sm text-muted-foreground">
                      Tous les statuts
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <div className="h-10 bg-muted/50 rounded-md flex items-center px-3 text-sm text-muted-foreground">
                      Derniers 30 jours
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Montant min.</label>
                    <div className="h-10 bg-muted/50 rounded-md flex items-center px-3 text-sm text-muted-foreground">
                      ≥ 0 XOF
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        {/* Data Table */}
        <div className="rounded-md border mt-6 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className={header.column.getIsSorted() ? "font-bold" : ""}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer : rows per page + pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Lignes par page
            </span>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
                // Ici tu peux aussi mettre à jour table.setPageSize si tu ajoutes pagination réelle
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

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>Page 1 sur {Math.ceil(payments.length / pageSize)}</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="outline" size="sm" disabled>
                Suivant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}