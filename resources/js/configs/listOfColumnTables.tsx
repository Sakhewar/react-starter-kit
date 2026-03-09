import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Copy, Trash2, Settings } from "lucide-react";
import { router } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { can, updateElement, useGlobalStore } from "@/hooks/backoffice";

export const columnConfigs: Record<string, Column[]> =
{
  provenance : [
    { key: "libelle",               label: "Libellé",         className: ""   },
    { key: "description",           label: "Description"                      },
    { key: "actions",               label: "",                className: "flex items-center justify-center",
      render: (_, row, extra) => (
        <RowActions row={row} config={{delete: can('suppression-provenance'), edit: can('modification-provenance'), clone: can('creation-provenance')}} attributeName={extra?.attributeName ?? "default"}
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
          <RowActions row={row} attributeName={extra?.attributeName ?? "default"}
          />
        ),
      },
      
  ],

  modepaiement : [
      { key: "libelle", label: "Libellé", className: "" },
      { key: "description", label: "Description" },
      { key: "actions", label: "", className: "flex items-center justify-center",
        render: (_, row, extra) => (
          <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"}
          />
        ),
      },
      
  ],

  typeclient : [
      { key: "libelle", label: "Libellé", className: "" },
      { key: "description", label: "Description" },
      { key: "actions", label: "", className: "flex items-center justify-center",
        render: (_, row, extra) => (
          <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"}
          />
        ),
      },
      
  ],

  client : [
      { key: "nom", label: "Nom Complet", className: "" },
      { key: "email", label: "Email" },
      { key: "telephone", label: "Téléphone" },
      { key: "adresse", label: "Adresse" },
      { key: "actions", label: "", className: "flex items-center justify-center",
        render: (_, row, extra) => (
          <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"}
          />
        ),
      },
      
  ],

  fournisseur : [
      { key: "nom", label: "Nom Complet", className: "" },
      { key: "email", label: "Email" },
      { key: "telephone", label: "Téléphone" },
      { key: "adresse", label: "Adresse" },
      { key: "actions", label: "", className: "flex items-center justify-center",
        render: (_, row, extra) => (
          <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"}
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
        <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"}
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
          <RowActions config={{}} row={row} attributeName={extra?.attributeName ?? "default"}
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
        <RowActions config={{delete: false, clone : false}} row={row} attributeName={extra?.attributeName ?? "default"}
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
export type Action =
{
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive";
  condition?: (row: any) => boolean;
  onClick?: (row: any) => void;
};

export type ActionsConfig =
{
  edit?: boolean | ((row: any) => boolean);
  clone?: boolean | ((row: any) => boolean);
  delete?: boolean | ((row: any) => boolean);
  [key: string]: boolean | ((row: any) => boolean) | undefined;
};

export type Column = {
  key: string;
  label: string;
  className?: string;
  render?: (value: any, row: any, extra?: { namepage: string, attributeName: string }) => React.ReactNode;
};

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


export const RowActions = ({config = {}, extraActions = [], row, attributeName}: { config?: ActionsConfig; extraActions?: Action[]; row: any; attributeName: string; }) =>
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
          useGlobalStore.setState((state) => ({ ...state, deleteItem: row }));
        }
        else if (key === "edit" || key === "clone" )
        {
          updateElement(attributeName, row.id).then((data)=>
          {
            if(key === "clone")
            {
              data.id = null;
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
        {sortedActions.map((action) => (
          <DropdownMenuItem
            key={action.key}
            className={
              action.variant === "destructive"
                ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
                : ""
            }
            onClick={() => action.onClick?.(row)}
          >
            <action.icon className="mr-2 h-4 w-4" />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};











