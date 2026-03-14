import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Copy, Trash2, Settings, ThumbsDown, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { can, changeStatut, deleteElement, toCapitalize, updateElement, useGlobalStore } from "@/hooks/backoffice";
import { Action, ActionsConfig, cn, Column } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { RowActions } from "@/lib/utilsFunctiions";

  // ─── Base actions ─────────────────────────────────────

export const baseActions: Record<string, Omit<Action, "key" | "onClick">> = {
  edit  : { label: "Modifier",   icon: Pencil                        },
  clone : { label: "Cloner",     icon: Copy                          },
  delete: { label: "Supprimer",  icon: Trash2, variant: "destructive" },
};

  // ─── columnConfigs ────────────────────────────────────

export const columnConfigs: Record<string, Column[]> = {
  provenance: [
    { key: "libelle",     label: "Libellé"     },
    { key: "description", label: "Description" },
    {
      key: "actions", label: "", className: "flex items-center justify-center",
        // ← fonction pour que can() soit évalué au moment du rendu
      actionConfig: () => ({
        delete: can("suppression-provenance"),
        edit  : can("modification-provenance"),
        clone : can("creation-provenance"),
      }),
      render: (_, row, extra) => (
        <RowActions
          row           = {row}
          config        = {{ delete: can("suppression-provenance"), edit: can("modification-provenance"), clone: can("creation-provenance") }}
          attributeName = {extra?.attributeName ?? "default"}
          namepage      = {extra?.namepage}
        />
      ),
    },
  ],

  modalitepaiement: [
    { key: "libelle",     label: "Libellé"         },
    { key: "nbre_jour",   label: "Nombre de jours" },
    { key: "description", label: "Description"     },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  modepaiement: [
    { key: "libelle",     label: "Libellé"     },
    { key: "description", label: "Description" },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  typeclient: [
    { key: "libelle",     label: "Libellé"     },
    { key: "description", label: "Description" },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  typefournisseur: [
    { key: "libelle",     label: "Libellé"     },
    { key: "description", label: "Description" },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  typedepot: [
    { key: "libelle",     label: "Libellé"     },
    { key: "description", label: "Description" },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  pointvente: [
    { key: "image",     label: "Image",     render: (value) => <div className="flex items-center justify-center"><Avatar size="lg"><AvatarImage src={value} /></Avatar></div> },
    { key: "libelle",   label: "Libellé"   },
    { key: "adresse",   label: "Adresse"   },
    { key: "email",     label: "Email"     },
    { key: "telephone", label: "Téléphone" },
    { key: "rccm",      label: "RCCM"      },
    { key: "ninea",     label: "Ninea"     },
    { key: "activer",   label: "Actif",    render: (_, row) => <Badge className={cn("text-white rounded-[5px]", row?.activer ? "bg-green-600" : "bg-red-600")}>{row?.activer_fr}</Badge> },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  depot: [
    { key: "libelle",        label: "Libellé"        },
    { key: "point_vente_id", label: "Point de vente", render: (_, row) => <span>{row?.point_vente?.libelle}</span> },
    { key: "type_depot_id",  label: "Type de dépôt",  render: (_, row) => <span>{row?.type_depot?.libelle}</span>  },
    { key: "description",    label: "Description"    },
    { key: "activer",        label: "Actif",          render: (_, row) => <Badge className={cn("text-white rounded-[5px]", row?.activer ? "bg-green-600" : "bg-red-600")}>{row?.activer_fr}</Badge> },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  client: [
    { key: "code",                 label: "Code",                  render: (_, row) => <Badge color="primary" className="text-white rounded-[5px]">{row?.code}</Badge> },
    { key: "nom_complet",          label: "Nom Complet",           render: (_, row) => `${row?.nom_complet}` },
    { key: "email",                label: "Email"                  },
    { key: "telephone",            label: "Téléphone"              },
    { key: "adresse",              label: "Adresse"                },
    { key: "type_client_id",       label: "Type de client",        render: (_, row) => <span>{row?.type_client?.libelle}</span>       },
    { key: "plafond",              label: "Plafond/Remise",        render: (_, row) => `${row?.plafond ?? ""} / ${row?.remise ? `${row?.remise}%` : ""}` },
    { key: "modalite_paiement_id", label: "Modalite de paiement",  render: (_, row) => <span>{row?.modalite_paiement?.libelle}</span> },
    { key: "activer",              label: "Actif",                 render: (_, row) => <Badge className={cn("text-white rounded-[5px]", row?.activer ? "bg-green-600" : "bg-red-600")}>{row?.activer_fr}</Badge> },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  fournisseur: [
    { key: "code",                label: "Code",                   render: (_, row) => <Badge color="primary" className="text-white rounded-[5px]">{row?.code}</Badge> },
    { key: "nom_complet",         label: "Nom Complet"             },
    { key: "email",               label: "Email"                   },
    { key: "telephone",           label: "Téléphone"               },
    { key: "adresse",             label: "Adresse"                 },
    { key: "type_fournisseur_id", label: "Type de fournisseur",    render: (_, row) => <span>{row?.type_fournisseur?.libelle}</span> },
    { key: "activer",             label: "Actif",                  render: (_, row) => <Badge className={cn("text-white rounded-[5px]", row?.activer ? "bg-green-600" : "bg-red-600")}>{row?.activer_fr}</Badge> },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  familleproduit: [
    { key: "libelle",     label: "Libellé"     },
    { key: "description", label: "Description" },
    { key: "activer",     label: "Actif",       render: (_, row) => <Badge className={cn("text-white rounded-[5px]", row?.activer ? "bg-green-600" : "bg-red-600")}>{row?.activer_fr}</Badge> },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  sousfamilleproduit: [
    { key: "libelle",            label: "Libellé"           },
    { key: "famille_produit_id", label: "Famille Produit",   render: (_, row) => <span>{row?.famille_produit?.libelle}</span> },
    { key: "description",        label: "Description"       },
    { key: "activer",            label: "Actif",             render: (_, row) => <Badge className={cn("text-white rounded-[5px]", row?.activer ? "bg-green-600" : "bg-red-600")}>{row?.activer_fr}</Badge> },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  marque: [
    { key: "libelle",     label: "Libellé"     },
    { key: "description", label: "Description" },
    { key: "activer",     label: "Actif",       render: (_, row) => <Badge className={cn("text-white rounded-[5px]", row?.activer ? "bg-green-600" : "bg-red-600")}>{row?.activer_fr}</Badge> },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  produit: [
    { key: "image",                   label: "Image",                render: (value) => <div className="flex items-center justify-center"><Avatar size="lg"><AvatarImage src={value} /></Avatar></div> },
    { key: "code",                    label: "Code"                  },
    { key: "libelle",                 label: "Libellé"               },
    { key: "famille_produit_id",      label: "Famille Produit",      render: (_, row) => <span>{row?.famille_produit?.libelle}</span>      },
    { key: "sous_famille_produit_id", label: "Sous Famille Produit", render: (_, row) => <span>{row?.sous_famille_produit?.libelle}</span> },
    { key: "marque_id",               label: "Marque",               render: (_, row) => <span>{row?.marque?.libelle}</span>               },
    { key: "description",             label: "Description"           },
    { key: "activer",                 label: "Actif",                render: (_, row) => <Badge className={cn("text-white rounded-[5px]", row?.activer ? "bg-green-600" : "bg-red-600")}>{row?.activer_fr}</Badge> },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  role: [
    { key: "libelle",        label: "Libellé"             },
    { key: "nb_permissions", label: "Nbre De Permissions" },
    { key: "description",    label: "Description"         },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  user: [
    { key: "name",      label: "Nom complet"                                    },
    { key: "email",     label: "Email"                                          },
    { key: "role",      label: "Rôle",   render: (v) => <Badge>{v}</Badge>      },
    { key: "status_fr", label: "Actif",  render: (v) => <Badge>{v}</Badge>      },
    {
      key         : "actions",  label: "", className: "flex items-center justify-center",
      actionConfig: () => ({}),
      render      : (_, row, extra) => (
        <RowActions config = {{}} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],

  preference: [
    { key: "name",       label: "Nom complet"                                        },
    { key: "email",      label: "Email"                                              },
    { key: "role",       label: "Rôle",       render: (v) => <Badge>{v}</Badge>      },
    { key: "status",     label: "Actif",      render: (v) => <Badge>{v}</Badge>      },
    { key: "created_at", label: "Inscrit le", render: (v) => new Date(v).toLocaleDateString("fr-SN") },
    {
      key         : "actions",                               label: "", className: "flex items-center justify-center",
      actionConfig: () => ({ delete: false, clone: false }),
      render      : (_, row, extra) => (
        <RowActions config = {{ delete: false, clone: false }} row = {row} attributeName = {extra?.attributeName ?? "default"} namepage = {extra?.namepage} />
      ),
    },
  ],
};