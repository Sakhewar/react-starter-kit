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

export default function Dashboard({ page }) {
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