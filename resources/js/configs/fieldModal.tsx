import { FieldConfig } from "@/components/ModalCreateGeneric";

export const fieldModals : Record<string, FieldConfig[]> =
{
  pays : [
    { name: "libelle", label: "Libellé", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],

  modalitepaiement : [
    { name: "libelle", label: "Libellé", type: "text", required: true },
    { name: "nbre_jour", label: "Nombre de jours", type: "number", required: true },
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

}