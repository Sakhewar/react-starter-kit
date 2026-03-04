// "use client";

// import * as React from "react";
// import { Plus, ChevronDown, Sheet } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
// import { Card } from "@/components/ui/card";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   SortingState,
//   getSortedRowModel,
//   VisibilityState,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import * as Icons from "lucide-react";

// // ── Types & Données fictives ────────────────────────────────────────
// type Payment = {
//   id: string;
//   amount: number;
//   status: "pending" | "processing" | "success" | "failed";
//   email: string;
//   name: string;
// };

// const payments: Payment[] = [
//   { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@yahoo.com", name: "John Doe" },
//   { id: "3u1reuv4", amount: 242, status: "processing", email: "Abe45@gmail.com", name: "Sarah Connor" },
//   { id: "derv1ws0", amount: 837, status: "failed", email: "Monserrat44@gmail.com", name: "Maria Lopez" },
//   { id: "5kma53ae", amount: 874, status: "success", email: "Silas22@gmail.com", name: "Ahmed Khan" },
//   { id: "bhqecj4p", amount: 721, status: "processing", email: "carmella_h@hotmail.com", name: "Fatima Diallo" },
//   // Ajoute-en plus si tu veux tester le scroll
// ];

// const columns: ColumnDef<Payment>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "name",
//     header: "Nom",
//     cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//   },
//   {
//     accessorKey: "status",
//     header: "Statut",
//     cell: ({ row }) => {
//       const status = row.getValue("status") as string;
//       return (
//         <div className={`capitalize ${status === "success" ? "text-green-600" : status === "failed" ? "text-red-600" : ""}`}>
//           {status}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "amount",
//     header: () => <div className="text-right">Montant</div>,
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("amount"));
//       const formatted = new Intl.NumberFormat("fr-SN", {
//         style: "currency",
//         currency: "XOF",
//       }).format(amount);

//       return <div className="text-right font-medium">{formatted}</div>;
//     },
//   },
// ];

// export default function DashboardPage({namepage, page, ...props} : { namepage: string }) {
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [rowSelection, setRowSelection] = React.useState({});
//   const [pageSize, setPageSize] = React.useState(10);

//   const PageIcon = page && page.icon ? (Icons[page.icon as keyof typeof Icons] as React.ElementType) : null;

//   const table = useReactTable({
//     data: payments,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     onSortingChange: setSorting,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       rowSelection,
//     },
//   });

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="flex flex-col gap-5 py-6 border-b">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             {/* Gauche */}
//             <div className="flex items-center gap-3">
//               {/* Remplace par ton PageIcon */}
//               <div className="h-6 w-6 flex items-center justify-center text-primary">
//                 <span className="text-sm font-bold">{PageIcon && <PageIcon />}</span>
//               </div>
//               <h1 className="text-sm` font-bold tracking-tight">{namepage}</h1>
//               <span className="text-lg font-medium text-muted-foreground">
//                 {payments.length}
//               </span>
//             </div>

//             {/* Droite : Bouton Ajouter */}
//             <HoverCard openDelay={80} closeDelay={150}>
//               <HoverCardTrigger asChild>
//                 <Button className="gap-1.5">
//                   <Plus className="h-4 w-4" />
//                   Ajouter
//                   <ChevronDown className="h-4 w-4 opacity-70" />
//                 </Button>
//               </HoverCardTrigger>
//               <HoverCardContent className="w-52 p-2" align="end" sideOffset={8}>
//                 <div className="flex flex-col gap-1 text-sm">
//                   <div className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
//                     <Plus className="h-4 w-4" />
//                     Ajouter un item
//                   </div>
//                   <div className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
//                     <Sheet className="h-4 w-4" />
//                     Fichier Excel
//                   </div>
//                   <div className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
//                     <Sheet className="h-4 w-4" />
//                     Trame Excel
//                   </div>
//                 </div>
//               </HoverCardContent>
//             </HoverCard>
//           </div>

//           {/* Filtres collapsible */}
//           <Card className="py-3">
//             <Collapsible defaultOpen={false}>
//               <CollapsibleTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-between px-5 py-2 text-base hover:bg-muted/50"
//                 >
//                   Filtres
//                   <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
//                 </Button>
//               </CollapsibleTrigger>
//               <CollapsibleContent className="px-5 pb-5 pt-3 border-t">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Statut</label>
//                     {/* Ajoute ton Select ou Input ici */}
//                     <div className="h-10 bg-muted/50 rounded-md flex items-center px-3 text-sm text-muted-foreground">
//                       Tous les statuts
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Date</label>
//                     <div className="h-10 bg-muted/50 rounded-md flex items-center px-3 text-sm text-muted-foreground">
//                       Derniers 30 jours
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Montant min.</label>
//                     <div className="h-10 bg-muted/50 rounded-md flex items-center px-3 text-sm text-muted-foreground">
//                       ≥ 0 XOF
//                     </div>
//                   </div>
//                 </div>
//               </CollapsibleContent>
//             </Collapsible>
//           </Card>
//         </div>

//         {/* Data Table */}
//         <div className="rounded-md border mt-6 overflow-hidden">
//           <Table>
//             <TableHeader className="bg-muted/40">
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <TableHead key={header.id} className={header.column.getIsSorted() ? "font-bold" : ""}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(header.column.columnDef.header, header.getContext())}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     data-state={row.getIsSelected() && "selected"}
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>
//                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={columns.length} className="h-24 text-center">
//                     Aucun résultat.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Footer : rows per page + pagination */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t">
//           <div className="flex items-center gap-3">
//             <span className="text-sm text-muted-foreground whitespace-nowrap">
//               Lignes par page
//             </span>
//             <Select
//               value={`${pageSize}`}
//               onValueChange={(value) => {
//                 setPageSize(Number(value));
//                 // Ici tu peux aussi mettre à jour table.setPageSize si tu ajoutes pagination réelle
//               }}
//             >
//               <SelectTrigger className="w-20">
//                 <SelectValue placeholder={pageSize} />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="10">10</SelectItem>
//                 <SelectItem value="20">20</SelectItem>
//                 <SelectItem value="30">30</SelectItem>
//                 <SelectItem value="50">50</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex items-center gap-4 text-sm text-muted-foreground">
//             <div>Page 1 sur {Math.ceil(payments.length / pageSize)}</div>
//             <div className="flex gap-1">
//               <Button variant="outline" size="sm" disabled>
//                 Précédent
//               </Button>
//               <Button variant="outline" size="sm" disabled>
//                 Suivant
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// Exemple : components/FinanceFALLDame.tsx  (ou ton nom de vue dynamique)

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronDown, Plus, Search, FileText } from "lucide-react";

// Données fictives (à remplacer par tes props Inertia)
const stats = {
  total: "19,500.00 MAD",
  paye: "15,000.00 MAD",
  rembourse: "500.00 MAD",
  reste: "5,000.00 MAD",
};

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

const paiements = [
  {
    date: "19/02/2026",
    recu: "REC-826082",
    methode: "Espèces",
    montant: "15,000.00 MAD",
    statut: "Confirmé",
    reference: "—",
  },
  {
    date: "18/02/2026",
    recu: "REC-826081",
    methode: "Espèces",
    montant: "15,000.00 MAD",
    statut: "Annulé",
    reference: "test",
  },
];

export default function FinanceFALLDame({ page }) {
  return (
    <div className="space-y-6">
      {/* Header de la section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Finance — FALL Dame
          </h1>
          <p className="text-muted-foreground">
            Primaire · 1ère Année Dame
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-black hover:bg-black/90 text-white">
            <Plus className="h-4 w-4" />
            Enregistrer un paiement
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Facture
          </Button>
        </div>
      </div>

      {/* Cartes stats récap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total frais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Payé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paye}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remboursé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {stats.rembourse}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reste à payer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.reste}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau Frais & Plans de paiement */}
      <Card>
        <CardHeader>
          <CardTitle>Frais & Plans de paiement</CardTitle>
          <p className="text-sm text-muted-foreground">
            Chaque frais a son propre échéancier.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-right">Réduction</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fraisPlans.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.code}</TableCell>
                  <TableCell>{item.nom}</TableCell>
                  <TableCell className="text-right">{item.montant}</TableCell>
                  <TableCell className="text-right text-red-600">
                    {item.reduction}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.net}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.statut}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2">
                <TableCell colSpan={4} className="font-bold text-right">
                  Total net
                </TableCell>
                <TableCell className="text-right font-bold">
                  19,500.00 MAD
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Historique des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
          <p className="text-sm text-muted-foreground">
            Historique des encaissements.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[220px]">
              <div className="text-sm text-muted-foreground">Payé</div>
              <div className="text-xl font-bold text-green-600">
                15,000.00 MAD
              </div>
            </div>
            <div className="flex-1 min-w-[220px]">
              <div className="text-sm text-muted-foreground">Remboursé</div>
              <div className="text-xl font-bold text-orange-500">
                500.00 MAD
              </div>
            </div>
            <div className="flex-1 min-w-[220px]">
              <div className="text-sm text-muted-foreground">Solde dû</div>
              <div className="text-xl font-bold text-red-600">
                5,000.00 MAD
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reçu</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paiements.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>{p.recu}</TableCell>
                  <TableCell>{p.methode}</TableCell>
                  <TableCell className="text-right font-medium">
                    {p.montant}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={p.statut === "Confirmé" ? "default" : "destructive"}
                    >
                      {p.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.reference}</TableCell>
                  <TableCell>
                    {/* Icônes actions – à remplacer par tes boutons */}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Plus className="h-4 w-4 rotate-45" /> {/* ≈ annuler */}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}