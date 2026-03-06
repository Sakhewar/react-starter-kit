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

import { Column, columnConfigs } from "@/pages/configs/attributes";
import { fetchData } from '@/utils/graphql';

// Exemple avec typage
interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersQueryResponse {
  users: User[];
}

const GET_USERS = `
  query GetPays {
    pays {
      id
      nom
      display_text
    }
  }
`;
export default function BaseContent({namepage, page, ...props} : { namepage: string, page: any }) {
  const [pageSize, setPageSize] = React.useState(10);
  const [isOpen, setIsOpen] = React.useState(false);

  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchData<UsersQueryResponse>(GET_USERS);
        setUsers(data.users);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const PageIcon = page && page.icon ? (Icons[page.icon as keyof typeof Icons] as React.ElementType) : null;


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

  var attributeName = String(page.link).replaceAll("/", '');

  console.log("diop log - attributeName:", attributeName, page.link);
  
  
  const columns: Column[] = columnConfigs[attributeName] ?? [];

  if (columns.length === 0)
  {
    return (
      <div className="p-12 text-center text-red-500">
        Aucune configuration pour <strong>{namepage}</strong>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header de la section Titre et btn Ajouter */}
      <div className="flex sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          {PageIcon && <PageIcon className="w-4 h-4" />}
          <h1 className="text-sm sm:text-sm md:text-md lg:text-lg tracking-tight">
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

       {/* Tableau des donnees */}
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
                {fraisPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Aucun résultat
                    </TableCell>
                  </TableRow>
                ) : (
                  fraisPlans.map((row: any, idx: number) => (
                    <TableRow key={row.id ?? idx} className="text-center">
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
}