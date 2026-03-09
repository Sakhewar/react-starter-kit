import { FieldConfig } from "@/components/ModalCreateGeneric";

export const fieldModals : Record<string, FieldConfig[]> =
{
  provenance : [
    { name: "libelle", label: "Libellé", type: "text", required: true},
    { name: "description", label: "Description", type: "textarea" },
  ],

  modalitepaiement : [
    { name: "libelle", label: "Libellé", type: "text", required: true,             lgColSpan: 8, xlColSpan:8 },
    { name: "nbre_jour", label: "Nombre de jours", type: "number", required: true ,lgColSpan: 4, xlColSpan:4 },
    { name: "description", label: "Description", type: "textarea" },
  ],

  modepaiement : [
    { name: "libelle", label: "Libellé", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],

  typeclient : [
    { name: "libelle", label: "Libellé", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],

  client : [
    { name: "nom_complet", label: "Nom complet", type: "text", required: true},
    { name: "type_client_id", label: "Type de client", type: "select", required: true, options: [],inputClassName: "w-full", lgColSpan: 6, mdColSpan: 6},
    { name: "telephone", label: "Nº de téléphone", type: "number", required: true, lgColSpan: 6, mdColSpan: 6},
    { name: "email", label: "Email", type: "email"},
    { name: "adresse", label: "Adresse", type: "text"},
    { name: "commentaire", label: "Commentaire", type: "textarea" },
  ],

}