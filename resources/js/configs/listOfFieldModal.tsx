import { FieldConfig, TabConfig } from "@/components/ModalCreateGeneric";
import { Book, BookOpen, Contact, Contact2Icon, ContactIcon, InfoIcon, PhoneCall } from "lucide-react";
import { FaAddressBook, FaInfoCircle } from "react-icons/fa";

export const fieldModals: Record<string, FieldConfig[] | TabConfig[]> =
{
  provenance:
  [
    { name: "libelle",     label: "Libellé",     type: "text",     required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],

  modalitepaiement:
  [
    { name: "libelle",     label: "Libellé",          type: "text",     required: true, lgColSpan: 8, xlColSpan: 8 },
    { name: "nbre_jour",   label: "Nombre de jours",  type: "number",   required: true, lgColSpan: 4, xlColSpan: 4 },
    { name: "description", label: "Description",      type: "textarea" },
  ],

  modepaiement:
  [
    { name: "libelle",     label: "Libellé",     type: "text",     required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],

  typeclient:
  [
    { name: "libelle",     label: "Libellé",     type: "text",     required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],

  // Modal avec Tab Pane
  client:
  [
    {
      key: "infos",
      icon: <InfoIcon />,
      label: "Infos Générales",
      fields:
      [
        { name: "nom_complet",     label: "Nom complet",     type: "text",     required: true },
        { name: "type_client_id",  label: "Type de client",  type: "select",   required: true, options: [], inputClassName: "w-full", lgColSpan: 6, mdColSpan: 6 },
        { name: "telephone",       label: "Nº de téléphone", type: "number",   required: true, lgColSpan: 6, mdColSpan: 6 },
        { name: "email",           label: "Email",           type: "email" },
        { name: "adresse",         label: "Adresse",         type: "text" },
        { name: "commentaire",     label: "Commentaire",     type: "textarea" },
      ],
    },
    {
      key: "contacts",
      label: "Contact(s)",
      icon: <BookOpen />,
      tableMode: true,
      fields:
      [
        { name: "nom",       label: "Nom Complet",        required:true,                                  colSpan: 12,      mdColSpan: 3 },
        { name: "email",     label: "Email",              required:true,            is_unique: true,      colSpan: 12,      mdColSpan: 3 },
        { name: "telephone", label: "Téléphone",          required:true,            is_unique: true,      colSpan: 12,      mdColSpan: 3 },
      ],
    },
  ] as TabConfig[],
};