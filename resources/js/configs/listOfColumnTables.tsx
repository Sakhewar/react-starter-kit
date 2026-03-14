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

  // ─── Base actions ─────────────────────────────────────

const baseActions: Record<string, Omit<Action, "key" | "onClick">> = {
  edit  : { label: "Modifier",   icon: Pencil                        },
  clone : { label: "Cloner",     icon: Copy                          },
  delete: { label: "Supprimer",  icon: Trash2, variant: "destructive" },
};

  // ─── Hook partagé ────────────────────────────────────

export function useRowActions(
row           : any,
attributeName : string,
namepage     ?: string,
config        : ActionsConfig = {},
extraActions  : Action[] = []
)             : Action[] {
  const hasColumnActiver = columnConfigs[attributeName]?.some(
    (col) => col.key === "activer"
  );

  const shouldShowBase = (key: keyof typeof baseActions): boolean => {
    const rule = config[key];
    if (rule === undefined) return true;
    if (typeof rule === "boolean") return rule;
    return rule(row);
  };

  const baseVisible: Action[] = Object.entries(baseActions)
    .filter(([key]) => shouldShowBase(key as keyof typeof baseActions))
    .map(([key, action]) => ({
      key,
      ...action,
      onClick: () => {
        if (key === "delete") {
          useGlobalStore.setState((state) => ({
            scope: {
              ...state.scope,
              itemToChange: {
                changedItem: row,
                title      : `Suppression ${toCapitalize(namepage ?? "")}`,
                description: "Voulez-vous vraiment effectuer la suppression ?",
                confirmText: "Oui Supprimer",
                onConfirm  : async () => deleteElement(attributeName, row?.id),
              },
            },
          }));
        } else if (key === "edit" || key === "clone") {
          updateElement(attributeName, row.id).then((data) => {
            if (key === "clone") {
              data.id = null;
              Object.keys(data).forEach((k) => {
                if (Array.isArray(data[k])) {
                  data[k] = data[k].map((item: any) => {
                    delete item.id;
                    return item;
                  });
                }
              });
            }
            useGlobalStore.setState((state) => ({ ...state, updateItem: data }));
          });
        }
      },
    }));

  const extraWithActiver = [...extraActions];

  if (hasColumnActiver) {
    extraWithActiver.push({
      key  : "activer",
      label: row.activer == 1 ? "Désactiver": "Activer",
      icon : row.activer == 1
      ?       <ThumbsDown className  = "mr-2 text-red-600" />
      :       <ThumbsUp className    = "mr-2 text-green-600" />,
      variant: row.activer          == 1 ? "destructive" : "success",
      condition: () => can("statut-" + (attributeName ?? "default")),
      onClick  : (r) => {
        useGlobalStore.setState((state) => ({
          scope: {
            ...state.scope,
            itemToChange: {
              changedItem: r,
              title      : (r.activer == 1 ? "Désactiver" : "Activer") + " cet élément",
              description: 
                "Voulez-vous vraiment procéder à " +
                (r.activer == 1 ? "la désactivation" : "l'activation") + " ?",
              confirmText: "Oui " + (r.activer == 1 ? "Désactiver" : "Activer"),
              onConfirm  : async () =>
                changeStatut(
                  attributeName ?? "",
                  { id: r.id, status: r.activer == 1 ? 0 : 1 },
                  null,
                  namepage?.slice(0, -1) + " " +
                  (r.activer == 1 ? "désactivé" : "activé") + " avec succès"
                ),
            },
          },
        }));
      },
    });
  }

  const extraVisible = extraWithActiver.filter(
    (act) => !act.condition || act.condition(row)
  );

  const all = [...baseVisible, ...extraVisible];

  return [
    ...all.filter((a) => a.key !== "delete"),
    ...all.filter((a) => a.key === "delete"),
  ];
}

  // ─── RowActions component ─────────────────────────────

export const RowActions = ({
  config       = {},
  extraActions = [],
  row,
  attributeName,
  namepage,
}: {
  config       ?: ActionsConfig;
  extraActions ?: Action[];
  row           : any;
  attributeName : string;
  namepage     ?: string;
}) => {
  const sortedActions = useRowActions(row, attributeName, namepage, config, extraActions);

  if (sortedActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button      size      = "sm" variant = "ghost">
        <Settings    className = "h-4 w-4" />
        <ChevronDown className = "h-3 w-3 opacity-70 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {sortedActions.map((action) => {
          const Icon = action.icon;
          return (
            <DropdownMenuItem
              key       = {action.key}
              className = {
                action.variant === "destructive"
                  ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
                  : action.variant === "success"
                  ? "text-green-600 focus:bg-green-50 focus:text-green-600"
                  :  ""
              }
              onClick = {() => action.onClick?.(row)}
            >
              {React.isValidElement(Icon) ? Icon : Icon && <Icon className="mr-2 h-4 w-4" />}
              <span className={
                  action.variant === "destructive" ? "text-destructive"
                : action.variant === "success"   ? "text-green-600"
                :  ""
              }>
                {action.label}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
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