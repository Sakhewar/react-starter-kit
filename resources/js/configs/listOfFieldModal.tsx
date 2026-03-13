import { TableRow } from "@/components/ui/table";
import { useGlobalStore } from "@/hooks/backoffice";
import { FieldConfig, TabConfig } from "@/lib/utils";
import { PrixVenteProduit } from "@/pages/modalsTabPane/modalsTabPane";
import { Book, BookOpen, Contact, Contact2Icon, ContactIcon, DollarSign, InfoIcon, PhoneCall } from "lucide-react";
import { FaAddressBook, FaInfoCircle } from "react-icons/fa";

export const fieldModals: Record<string, FieldConfig[] | TabConfig[]> =
{
  // Backoffice
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

  typefournisseur:
  [
    { name: "libelle",     label: "Libellé",     type: "text",     required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],

  typedepot:
  [
    { name: "libelle",     label: "Libellé",     type: "text",     required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],

  pointvente:
  [
    {
      key: "infos",
      icon: <InfoIcon />,
      label: "Infos Générales",
      fields:
      [
        { name: 'image',                 label: "",                      type: "file",      accept: "image/*" },
        { name: "libelle",               label: "Libellé",               type: "text",     required: true,                                                                  },
        { name: "email",                 label: "Email",                 type: "email",                                                                            lgColSpan: 6,   mdColSpan: 6 },
        { name: "telephone",             label: "Nº de téléphone",       type: "number",                                                          lgColSpan: 6,   mdColSpan: 6 },
        { name: "rccm",                  label: "RCCM",                  type: "text",                                                                                  },
        { name: "ninea",                 label: "Ninea",                 type: "text",                                                                                  },
        { name: "adresse",               label: "Adresse",               type: "textarea",                                                                                  },
      ],
    },
    {
      key: "contacts",
      label: "Contact(s)",
      icon: <BookOpen />,
      tableMode: true,
      fields:
      [
        { name: "email",     label: "Email",        type: "email",             required:true,            is_unique: true,      colSpan: 12,      mdColSpan: 6 },
        { name: "telephone", label: "Téléphone",    type:"number",         required:true,            is_unique: true,      colSpan: 12,      mdColSpan:5 },
      ],
    },
  ] as TabConfig[],

  depot:
  [
    { name: "libelle",     label: "Libellé",     type: "text",     required: true },
    { name: "point_vente_id",        label: "Point de vente",        type: "select",    required: true,       options: "pointventes", lgColSpan:6,  inputClassName: "w-full" },
    { name: "type_depot_id",        label: "Type de dépôt",        type: "select",    required: true,         options: "typedepots",  lgColSpan:6,  inputClassName: "w-full" },
    { name: "description", label: "Description", type: "textarea" },
  ],

  // Modal Tiers
  client:
  [
    {
      key: "infos",
      icon: <InfoIcon />,
      label: "Infos Générales",
      fields:
      [
        { name: "nom_complet",           label: "Prénom(s) et nom",      type: "text",       required: true,                                         lgColSpan: 12,  mdColSpan: 12       },
        { name: "type_client_id",        label: "Type de client",        type: "select",    required: true,         options: "typeclients",         lgColSpan: 6,   mdColSpan: 6,  inputClassName: "w-full" },
        { name: "telephone",             label: "Nº de téléphone",       type: "number",    required: true,                                         lgColSpan: 6,   mdColSpan: 6              },
        { name: "email",                 label: "Email",                 type: "email",                                                             lgColSpan: 6,   mdColSpan: 6                              },
        { name: "modalite_paiement_id",  label: "Modalité de paiement",  type: "select",    required: false,        options: "modalitepaiements",   lgColSpan: 6,   mdColSpan: 6, inputClassName: "w-full",},
        { name: "adresse",               label: "Adresse",               type: "textarea",                                                          lgColSpan: 6,   mdColSpan: 6                },
        { name: "description",           label: "Commentaire",           type: "textarea",                                                          lgColSpan: 6,   mdColSpan: 6,                                       },
        { name: "plafond",               label: "Plafond",               type: "number",                                                            lgColSpan: 3,   mdColSpan: 3                },
        { name: "remise",                label: "Remise(%)",             type: "number",                                                            lgColSpan: 3,   mdColSpan: 3                },
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
        { name: "email",     label: "Email", type:"email",required:true,            is_unique: true,      colSpan: 12,      mdColSpan: 4 },
        { name: "telephone", label: "Téléphone",  type:"number",          required:true,            is_unique: true,      colSpan: 12,      mdColSpan: 3 },
      ],
    },
  ] as TabConfig[],

  fournisseur:
  [
    {
      key: "infos",
      icon: <InfoIcon />,
      label: "Infos Générales",
      fields:
      [
        { name: "nom_complet",           label: "Prénom(s) et nom",      type: "text",     required: true,                                                                  lgColSpan: 6,   mdColSpan: 6},
        { name: "telephone",             label: "Nº de téléphone",       type: "number",   required: true,                                                                  lgColSpan: 6,   mdColSpan: 6 },
        { name: "type_fournisseur_id",   label: "Type de fournisseur",   type: "select",    required: true,         options: "typefournisseurs",         lgColSpan: 6,   mdColSpan: 6,  inputClassName: "w-full" },
        { name: "email",                 label: "Email",                 type: "email",                                                                                     lgColSpan: 6,   mdColSpan: 6 },
        { name: "adresse",               label: "Adresse",               type: "textarea",                                                                                  },
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
        { name: "email",     label: "Email",        type: "email",             required:true,            is_unique: true,      colSpan: 12,      mdColSpan: 4 },
        { name: "telephone", label: "Téléphone",  type:"number",           required:true,            is_unique: true,      colSpan: 12,      mdColSpan: 3 },
      ],
    },
  ] as TabConfig[],

  familleproduit:
  [
    { name: "libelle",     label: "Libellé",     type: "text",     required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],

  sousfamilleproduit:
  [
    { name: "libelle",     label: "Libellé",     type: "text",     required: true, lgColSpan: 6 },
    { name: "famille_produit_id",        label: "Famille de produit",        type: "select",    required: true,       options: "familleproduits2", lgColSpan:6,  inputClassName: "w-full" },
    { name: "description", label: "Description", type: "textarea" },
  ],

  marque:
  [
    { name: "libelle",     label: "Libellé",     type: "text",     required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],

  produit:
  [
    {
      key: "infos",
      icon: <InfoIcon />,
      label: "Infos Générales",
      fields:
      [
        { name: "code",                                           label: "Code",                                    type: "text",                       required: false,                                                           lgColSpan: 6,                 mdColSpan: 6                                                       },
        { name: "libelle",                                        label: "Désignation",                             type: "text",                       required: true,                                                                                                                                                             },
        { name: "famille_produit_id",                             label: "Famille de produit",                      type: "select",                     required: true,          options: "familleproduits",                       lgColSpan: 6,                 mdColSpan: 6,                             inputClassName: "w-full" },
        { name: "sous_famille_produit_id",                        label: "Sous Famille de produit",                 type: "select",                     required: false,         options: "sousfamilleproduits",                   lgColSpan: 6,                 mdColSpan: 6,                             inputClassName: "w-full" },
        { name: "marque_id",                                      label: "Marque",                                  type: "select",                     required: false,         options: "marques",                               lgColSpan: 6,                 mdColSpan: 6,                             inputClassName: "w-full" },
        { name: "description",                                    label: "Description",                             type: "textarea",                                                                                                                                                                                               }
      ],
    },
    {
      key: "prix_ventes",
      label: "Pricing",
      icon: <DollarSign />,
      tableMode: true,
      fields: <PrixVenteProduit type="produit" />
    },
  ] as TabConfig[],
};