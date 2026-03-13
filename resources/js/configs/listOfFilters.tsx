import { FieldConfig } from "@/lib/utils";
import { Check } from "lucide-react";

var listofFilters : Record<string, Record<string, string | FieldConfig[]>> = 
{
    depot: 
    {
        placeholder: "Rechercher par libellé, description ...",
        fields     : [
            { name: "search",          label: "", placeholder: "Rechercher par libellé, description ...",         type: "text"},
            { name: "point_vente_id",  label: "Point de vente", labelClassName:"text-[13px]",        type: "select",  options: "pointventes",  inputClassName: "w-full" },
            { name: "type_depot_id",  label: "Type de dépôt", labelClassName:"text-[13px]",        type: "select",  options: "typedepots",  inputClassName: "w-full" },
            {
                name          : "activer",
                label         : "Actif ?",
                labelClassName: "text-[14px] font-bold",
                type          : "radio-group",
                radioStyle    : "minimal",
                colSpan       : 12,
                radioOptions  : [
                  { label: "Oui",  value: true, activeClassName: "border-emerald-500", radioActiveClassName: "bg-emerald-500", labelClassName: "text-emerald-500 font-bold"},
                  { label: "Non",  value: false, activeClassName: "border-red-500", radioActiveClassName: "bg-red-500", labelClassName: "text-red-500 font-bold"},
                  { label: "Tout", value: null, labelClassName: "font-bold"},
                ],
            },
        ] 
    },

    client: 
    {
        placeholder: "Rechercher par nom complet, email, téléphone,adresse ...",
        fields     : [
            { name: "search",          label: "", placeholder: "Rechercher par nom complet, email, téléphone,adresse ...",         type: "text"},
            { name: "type_client_id",  label: "Type de client", labelClassName:"text-[13px]",        type: "select",  options: "typeclients",  inputClassName: "w-full" },
            {
                name          : "activer",
                label         : "Actif ?",
                labelClassName: "text-[13px]",
                type          : "radio-group",
                radioStyle    : "minimal",
                colSpan       : 12,
                radioOptions  : [
                    { label: "Oui",  value: true, activeClassName: "border-emerald-500", radioActiveClassName: "bg-emerald-500", labelClassName: "text-emerald-500 font-bold"},
                    { label: "Non",  value: false, activeClassName: "border-red-500", radioActiveClassName: "bg-red-500", labelClassName: "text-red-500 font-bold"},
                    { label: "Tout", value: null, labelClassName: "font-bold"},
                ],
            },
        ] 
    },
    fournisseur: 
    {
        placeholder: "Rechercher par nom complet, email, téléphone,adresse ...",
        fields     : [
            { name: "search",          label: "", placeholder: "Rechercher par nom complet, email, téléphone,adresse ...",         type: "text"},
            { name: "type_fournisseur_id",  label: "Type de fournisseur", labelClassName:"text-[13px]",        type: "select",  options: "typefournisseurs",  inputClassName: "w-full" },
            {
                name          : "activer",
                label         : "Actif ?",
                labelClassName: "text-[13px]",
                type          : "radio-group",
                radioStyle    : "minimal",
                colSpan       : 12,
                radioOptions  : [
                    { label: "Oui",  value: true, activeClassName: "border-emerald-500", radioActiveClassName: "bg-emerald-500", labelClassName: "text-emerald-500 font-bold"},
                    { label: "Non",  value: false, activeClassName: "border-red-500", radioActiveClassName: "bg-red-500", labelClassName: "text-red-500 font-bold"},
                    { label: "Tout", value: null, labelClassName: "font-bold"},
                ],
            },
        ] 
    },
    familleproduit: 
    {
        placeholder: "Rechercher par libellé, description ...",
        fields     : [
            { name: "search",          label: "", placeholder: "Rechercher par libellé, description ...",         type: "text"},
            {
                name          : "activer",
                label         : "Actif ?",
                labelClassName: "text-[13px]",
                type          : "radio-group",
                radioStyle    : "minimal",
                colSpan       : 12,
                radioOptions  : [
                    { label: "Oui",  value: true, activeClassName: "border-emerald-500", radioActiveClassName: "bg-emerald-500", labelClassName: "text-emerald-500 font-bold"},
                    { label: "Non",  value: false, activeClassName: "border-red-500", radioActiveClassName: "bg-red-500", labelClassName: "text-red-500 font-bold"},
                    { label: "Tout", value: null, labelClassName: "font-bold"},
                ],
            },
        ] 
    },
    sousfamilleproduit: 
    {
        placeholder: "Rechercher libellé, description ...",
        fields     : [
            { name: "search",          label: "", placeholder: "Rechercher libellé, description ...",         type: "text"},
            { name: "famille_produit_id",  label: "Famille de produit", labelClassName:"text-[13px]",        type: "select",  options: "familleproduits2",  inputClassName: "w-full" },
            {
                name          : "activer",
                label         : "Actif ?",
                labelClassName: "text-[13px]",
                type          : "radio-group",
                radioStyle    : "minimal",
                colSpan       : 12,
                radioOptions  : [
                    { label: "Oui",  value: true, activeClassName: "border-emerald-500", radioActiveClassName: "bg-emerald-500", labelClassName: "text-emerald-500 font-bold"},
                    { label: "Non",  value: false, activeClassName: "border-red-500", radioActiveClassName: "bg-red-500", labelClassName: "text-red-500 font-bold"},
                    { label: "Tout", value: null, labelClassName: "font-bold"},
                ],
            },
        ] 
    },
}

export default listofFilters;