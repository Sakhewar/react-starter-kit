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
  {}
];

const paiements = [
  {}
];

export default function Dashboard({ page }) {
  return (
    <div className="space-y-6">
      {/* Header de la section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Donnees d'analyse non synthetise
          </p>
        </div>
      </div>

      {/* Cartes stats récap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              NB Ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nb Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">200</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CA Encaissé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              200 000 FCFA
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
             CA Encaissé sur les ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">150 000 FCFA</div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau Frais & Plans de paiement */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des ventes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Les ventes du jour
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fraisPlans.map((item, idx) => (
                <TableRow key={idx}>
                </TableRow>
              ))}
              <TableRow className="border-t-2">
                <TableCell colSpan={3} className="font-bold text-right">
                  Total net
                </TableCell>
                <TableCell className="text-right font-bold">
                  500 000 FCFA
                </TableCell>
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
            Historique des encaissements du jour.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[220px]">
              <div className="text-sm text-muted-foreground">Payé</div>
              <div className="text-xl font-bold text-green-600">
                15 000 FCFA
              </div>
            </div>
            <div className="flex-1 min-w-[220px]">
              <div className="text-sm text-muted-foreground">Remboursé</div>
              <div className="text-xl font-bold text-orange-500">
                5 000 FCFA
              </div>
            </div>
            <div className="flex-1 min-w-[220px]">
              <div className="text-sm text-muted-foreground">Solde dû</div>
              <div className="text-xl font-bold text-red-600">
                5 000 FCFA
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {paiements.map((p, idx) => (
                <TableRow key={idx}>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}