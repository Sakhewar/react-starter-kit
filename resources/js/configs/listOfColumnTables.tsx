import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Copy, Trash2, Settings, Clapperboard, Download, Fingerprint, ThumbsDown, ThumbsUp } from "lucide-react";
import { router } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { can, changeStatut, deleteElement, toCapitalize, updateElement, useGlobalStore } from "@/hooks/backoffice";
import { Action, ActionsConfig, cn, Column } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const columnConfigs: Record<string, Column[]> =
{
  provenance : [
    { key: "libelle",               label: "Libellé",         className: ""   },
    { key: "description",           label: "Description"                      },
    { key: "actions",               label: "",                className: "flex items-center justify-center",
      render: (_, row, extra) => (
        <RowActions row={row} config={{delete: can('suppression-provenance'), edit: can('modification-provenance'), clone: can('creation-provenance')}} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
        />
      ),
    },
  ],

  modalitepaiement : [
      { key: "libelle", label: "Libellé", className: "" },
      { key : "nbre_jour", label : "Nombre de jours"},
      { key: "description", label: "Description" },
      { key: "actions", label: "", className: "flex items-center justify-center",
        render: (_, row, extra) => (
          <RowActions row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
          />
        ),
      },
      
  ],

  modepaiement : [
      { key: "libelle", label: "Libellé", className: "" },
      { key: "description", label: "Description" },
      { key: "actions", label: "", className: "flex items-center justify-center",
        render: (_, row, extra) => (
          <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
          />
        ),
      },
      
  ],

  typeclient : [
      { key: "libelle", label: "Libellé", className: "" },
      { key: "description", label: "Description" },
      { key: "actions", label: "", className: "flex items-center justify-center",
        render: (_, row, extra) => (
          <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
          />
        ),
      },
      
  ],
  typefournisseur : [
    { key: "libelle", label: "Libellé", className: "" },
    { key: "description", label: "Description" },
    { key: "actions", label: "", className: "flex items-center justify-center",
      render: (_, row, extra) => (
        <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
        />
      ),
    },  
  ],

  typedepot : [
    { key: "libelle", label: "Libellé", className: "" },
    { key: "description", label: "Description" },
    { key: "actions", label: "", className: "flex items-center justify-center",
      render: (_, row, extra) => (
        <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
        />
      ),
    },  
  ],

  pointvente : [
    { key: "image", label: "Image", className: "", render: (value) => <div className="flex items-center justify-center"><Avatar size="lg"><AvatarImage src={value} /> </Avatar></div>},
    { key: "libelle", label: "Libellé", className: "" },
    { key: "adresse", label: "Adresse", className: "" },
    { key: "email", label: "Email", className: "" },
    { key: "telephone", label: "Téléphone", className: "" },
    { key: "rccm", label: "RCCM", className: "" },
    { key: "ninea", label: "Ninea", className: "" },
    { key: "actions", label: "", className: "flex items-center justify-center",
      render: (_, row, extra) => (
        <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
        />
      ),
    },  
  ],

  depot : [
    { key: "libelle", label: "Libellé", className: "" },
    { key: "point_vente_id", label: "Point de vente",render: (_,row, extra) =>  <span>{row?.point_vente?.libelle}</span>},
    { key: "type_depot_id", label: "Type de dépôt",render: (_,row, extra) =>  <span>{row?.type_depot?.libelle}</span>},
    { key: "description", label: "Description" },
    { key: "activer", label: "Actif",render: (_,row, extra) =>  <Badge className={cn("text-white rounded-[5px]", row?.activer ? "bg-green-600" : "bg-red-600")}>{row?.activer_fr}</Badge>},
    { key: "actions", label: "", className: "flex items-center justify-center",
      render: (_, row, extra) => (
        <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
        />
      ),
    },  
  ],

  client : [
      { key: "code", label: "Code", render: (_,row) =>  <Badge color="primary" className="text-white rounded-[5px]">{row?.code}</Badge>},
      { key: "nom_complet", label: "Nom Complet", className: "", render: (_,row, extra) =>  `${row?.nom_complet}`},
      { key: "email", label: "Email" },
      { key: "telephone", label: "Téléphone"},
      { key: "adresse", label: "Adresse" },
      { key: "type_client_id", label: "Type de client",render: (_,row, extra) =>  <span>{row?.type_client?.libelle}</span>},
      { key: "plafond", label: "Plafond/Remise", className: "", render: (_,row, extra) =>  `${row?.plafond ?? ''} / ${row?.remise ? `${row?.remise}%` : ''}`},
      { key: "modalite_paiement_id", label: "Modalite de paiement",render: (_,row, extra) =>  <span>{row?.modalite_paiement?.libelle}</span>},
      { key: "activer", label: "Actif",render: (_,row, extra) =>  <Badge className={cn("text-white rounded-[5px]", row?.activer ? "bg-green-600" : "bg-red-600")}>{row?.activer_fr}</Badge>},
      { key: "actions", label: "", className: "flex items-center justify-center",
        render: (_, row, extra) => (
          <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
            extraActions={
              [
                { key: "print", label:row.activer == 1 ? "Désactiver" : "Activer", icon:row.activer == 1 ? <ThumbsDown className="mr-2 text-red-600"/> : <ThumbsUp className="mr-2 text-green-600" />, variant: row.activer == 1 ? "destructive" : "success",
                  condition(r)
                  { 
                    return can('modification-client')
                  },
                  onClick(r)
                  {
                    let obj = {
                      changedItem : r,
                      title : (r.activer == 1 ? "Désactiver" : "Activer") + " ce client",
                      description : r.activer == 1 ? "Voulez-vous vraiment désactiver ce client ?" : "Voulez-vous vraiment activer ce client ?",
                      confirmText :"Oui " + (r.activer == 1 ? "Désactiver" : "Activer"),
                      onConfirm: async () =>
                      { 
                        return changeStatut('client', {id: r.id, status: r.activer == 1 ? 0 : 1}, null, ('Client ' + (r.activer == 1 ? "désactivé" : "activé") + " avec succès"));
                      },
                    };
                    useGlobalStore.setState((state) => ({scope: { ...state.scope, itemToChange: obj }}));
                  }
                },
              ]
            }
          />
        ),
      },
      
  ],

  fournisseur : [
      { key: "code", label: "Code", render: (_,row) =>  <Badge color="primary" className="text-white rounded-[5px]">{row?.code}</Badge>},
      { key: "nom_complet", label: "Nom Complet", className: "" },
      { key: "email", label: "Email" },
      { key: "telephone", label: "Téléphone"},
      { key: "adresse", label: "Adresse" },
      { key: "type_fournisseur_id", label: "Type de fournisseur",render: (_,row, extra) =>  <span>{row?.type_fournisseur?.libelle}</span>},
      { key: "activer", label: "Actif",render: (_,row, extra) =>  <Badge className={cn("text-white rounded-[5px]", row?.activer ? "bg-green-600" : "bg-red-600")}>{row?.activer_fr}</Badge>},
      { key: "actions", label: "", className: "flex items-center justify-center",
        render: (_, row, extra) => (
          <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
            extraActions={
              [
                { key: "print", label:row.activer == 1 ? "Désactiver" : "Activer", icon:row.activer == 1 ? <ThumbsDown className="mr-2 text-red-600"/> : <ThumbsUp className="mr-2 text-green-600" />, variant: row.activer == 1 ? "destructive" : "secondary",
                  condition(r)
                  { 
                    return can('modification-fournisseur')
                  },
                  onClick(r)
                  {
                    let obj = {
                      changedItem : r,
                      title : (r.activer == 1 ? "Désactiver" : "Activer") + " ce fournisseur",
                      description : r.activer == 1 ? "Voulez-vous vraiment désactiver ce fournisseur ?" : "Voulez-vous vraiment activer ce fournisseur ?",
                      confirmText :"Oui " + (r.activer == 1 ? "Désactiver" : "Activer"),
                      onConfirm: async () =>
                      { 
                        return changeStatut('fournisseur', {id: r.id, status: r.activer == 1 ? 0 : 1}, null, ('Fournisseur ' + (r.activer == 1 ? "désactivé" : "activé") + " avec succès"));
                      },
                    };
                    useGlobalStore.setState((state) => ({scope: { ...state.scope, itemToChange: obj }}));
                  }
                },
              ]
            }
          />
        ),
      },
      
  ],

  familleproduit : [
    { key: "libelle", label: "Libellé", className: "" },
    { key: "description", label: "Description" },
    { key: "actions", label: "", className: "flex items-center justify-center",
      render: (_, row, extra) => (
        <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
        />
      ),
    },  
  ],

  sousfamilleproduit : [
    { key: "libelle", label: "Libellé", className: "" },
    { key: "famille_produit_ud", label: "Famille Produit",  render : (_,row) => <span>{row?.famille_produit?.libelle}</span> },
    { key: "description", label: "Description" },
    { key: "actions", label: "", className: "flex items-center justify-center",
      render: (_, row, extra) => (
        <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
        />
      ),
    },  
  ],

  role : [
    { key: "libelle", label: "Libellé" },
    { key: "nb_permissions", label: "Nbre De Permissions" },
    { key: "description", label: "Description" },
    { key: "actions", label: "", className: "flex items-center justify-center",
      render: (_, row, extra) => (
        <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
        />
      ),
    }
  ],

  user : [
      { key: "name", label: "Nom complet" },
      { key: "email", label: "Email" },
      { key: "role", label: "Rôle", render: (v) => <Badge>{v}</Badge> },
      { key: "status_fr", label: "Actif", render: (v) => <Badge>{v}</Badge> },
      { key: "actions", label: "", className: "flex items-center justify-center",
        render: (_, row, extra) => (
          <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
          />
        ),
      }
  ],

  preference : [
    { key: "name", label: "Nom complet" },
    { key: "email", label: "Email" },
    { key: "role", label: "Rôle", render: (v) => <Badge>{v}</Badge> },
    { key: "status", label: "Actif", render: (v) => <Badge>{v}</Badge> },
    { key: "created_at",  label: "Inscrit le", render: (v) => new Date(v).toLocaleDateString("fr-SN")},
    { key: "actions", label: "", className: "flex items-center justify-center",
      render: (_, row, extra) => (
        <RowActions config={{delete: false, clone : false}} row={row} attributeName={extra?.attributeName ?? "default"} namepage={extra?.namepage}
        />
      ),
    }
],

  


  // orders: [
  //   { key: "number", label: "N° Commande" },
  //   { key: "client.nom_complet", label: "Client" },
  //   {
  //     key: "total",
  //     label: "Total",
  //     render: (v) => v ? `${Number(v).toLocaleString("fr-SN")} FCFA` : "—",
  //   },
  //   {
  //     key: "status",
  //     label: "Statut",
  //     render: (v) => (
  //       <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
  //         v === "paid" ? "bg-green-100 text-green-800" : 
  //         v === "pending" ? "bg-yellow-100 text-yellow-800" : 
  //         "bg-red-100 text-red-800"
  //       }`}>
  //         {v}
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "actions",
  //     label: "",
  //     className: "w-12 text-right",
  //     render: (_, row, extra) => (
  //       <RowActions
  //         config={{
  //           clone: false,                          // désactiver Cloner
  //           delete: (r) => r.status === "draft",   // supprimer seulement si draft
  //         }}
  //         extraActions={[
  //           {
  //             key: "print",
  //             label: "Imprimer",
  //             icon: Copy, // ou une vraie icône Printer si tu l'as
  //             onClick: (r) => window.open(`/orders/${r.id}/print`, "_blank"),
  //           },
  //         ]}
  //         row={row}
  //         attributeName={extra?.attributeName ?? "orders"}
  //       />
  //     ),
  //   },
  // ],

  // // Ajoute ici products, suppliers, invoices, etc.
  // // Exemple minimal pour products :
  // products: [
  //   // ... tes colonnes ...
  //   {
  //     key: "actions",
  //     label: "",
  //     className: "w-12 text-right",
  //     render: (_, row, extra) => (
  //       <RowActions
  //         config={{
  //           delete: (r) => r.stock <= 0,
  //         }}
  //         row={row}
  //         attributeName={extra?.attributeName ?? "products"}
  //       />
  //     ),
  //   },
  // ],
};

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

const baseActions: Record<string, Omit<Action, "key" | "onClick">> = {
  edit: {
    label: "Modifier",
    icon: Pencil,
  },
  clone: {
    label: "Cloner",
    icon: Copy,
  },
  delete: {
    label: "Supprimer",
    icon: Trash2,
    variant: "destructive",
  },
};


export const RowActions = ({config = {}, extraActions = [], row, attributeName, namepage}: { config?: ActionsConfig; extraActions?: Action[]; row: any; attributeName: string; namepage?: string; }) =>
{
  const shouldShowBase = (key: keyof typeof baseActions): boolean =>
  {
    const rule = config[key];
    if (rule === undefined) return true;
    if (typeof rule === "boolean") return rule;
    return rule(row);
  };


  const baseVisible: Action[] = Object.entries(baseActions).filter(([key]) => shouldShowBase(key as keyof typeof baseActions))
    .map(([key, action]) => ({ key, ...action,
      onClick: () => {
        if (key === "delete")
        {
          let obj = {
            changedItem : row,
            title :`Suppression ${toCapitalize(namepage ?? '')}`,
            description : "Voulez-vous vraiment effectuer la suppression ?",
            confirmText :"Oui Supprimer",
            onConfirm: async () =>
            { 
              return deleteElement(attributeName, row?.id);
            },
          };
          
          useGlobalStore.setState((state) => ({scope: { ...state.scope, itemToChange: obj }}));
        }
        else if (key === "edit" || key === "clone" )
        {
          updateElement(attributeName, row.id).then((data)=>
          {
            if(key === "clone")
            {
              data.id = null;
              Object.keys(data).forEach((key)=>
              {
                if(Array.isArray(data[key]))
                {
                  data[key] = data[key].map((item: any)=>
                  {
                    delete item.id;
                    return item;
                  })
                }
              })
            }
            useGlobalStore.setState((state) => ({ ...state, updateItem: data }));
          });
        }
      },
    }));


  const extraVisible = extraActions.filter(
    (act) => !act.condition || act.condition(row)
  );

  // Toutes les actions (base + extra)
  const allActions = [...baseVisible, ...extraVisible];

  // Supprimer toujours en dernier si présent
  const sortedActions = [
    ...allActions.filter((a) => a.key !== "delete"),
    ...allActions.filter((a) => a.key === "delete"),
  ];

  if (sortedActions.length === 0) return null;
  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <Settings className="h-4 w-4" />
          <ChevronDown className="h-3 w-3 opacity-70 ml-1" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
  {sortedActions.map((action) => {
    const Icon = action.icon;

    return (
      <DropdownMenuItem
        key={action.key}
        className={
          action.variant === "destructive"
            ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
            : action.variant === "success" ? "text-success focus:bg-success/10 focus:text-success"
            : ""
        }
        onClick={() => action.onClick?.(row)}
      >
        {React.isValidElement(Icon) ? (Icon) : (Icon && <Icon className="mr-2 h-4 w-4" />)}
        <span className={action.variant === "destructive" ? "text-destructive" : action.variant === "success" ? "text-green-600" : ""}>{action.label}</span>
      </DropdownMenuItem>
    );
  })}
</DropdownMenuContent>
    </DropdownMenu>
  );
};











