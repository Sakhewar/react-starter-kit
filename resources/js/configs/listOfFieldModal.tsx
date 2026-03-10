import { useGlobalStore } from "@/hooks/backoffice";
import { FieldConfig, TabConfig } from "@/lib/utils";
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
        { name: "prenom",                label: "Prénom",                type: "text",     required: true,                                        lgColSpan: 6, mdColSpan: 6  },
        { name: "nom",                   label: "Nom",                   type: "text",     required: true,                                        lgColSpan: 6, mdColSpan: 6  },
        { name: "type_client_id",        label: "Type de client",        type: "select",   required: true,       options: "typeclients",          lgColSpan: 6, mdColSpan: 6,  inputClassName: "w-full" },
        { name: "telephone",             label: "Nº de téléphone",       type: "number",   required: true,                                        lgColSpan: 6, mdColSpan: 6 },
        { name: "email",                 label: "Email",                 type: "email",                                                           lgColSpan: 6, mdColSpan: 6 },
        { name: "modalite_paiement_id",  label: "Modalité de paiement",  type: "select",   required: false,       options: "modalitepaiements",   lgColSpan: 6, mdColSpan: 6, inputClassName: "w-full",},
        { name: "adresse",               label: "Adresse",               type: "text",                                                            lgColSpan: 6, mdColSpan: 6                },
        { name: "plafond",               label: "Plafond",               type: "number",                                                          lgColSpan: 3, mdColSpan: 3                },
        { name: "remise",                label: "Remise(%)",             type: "number",                                                          lgColSpan: 3, mdColSpan: 3                },
        { name: "description",           label: "Commentaire",           type: "textarea"                                                                                                   },
      ],
    },
    {
      key: "contacts",
      label: "Contact(s)",
      icon: <BookOpen />,
      tableMode: true,
      fields:
      [
        { name: "nom",       label: "Nom Complet",        required:true,                                  colSpan: 12,      mdColSpan: 4 },
        { name: "email",     label: "Email",              required:true,            is_unique: true,      colSpan: 12,      mdColSpan: 4 },
        { name: "telephone", label: "Téléphone",          required:true,            is_unique: true,      colSpan: 12,      mdColSpan: 3 },
      ],
    },
  ] as TabConfig[],
};