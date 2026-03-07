import { FieldConfig } from "@/components/ModalCreateGeneric";

export const fieldModals : Record<string, FieldConfig[]> =
{
  pays : [
    { name: "libelle", label: "Libellé", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
  ]

}