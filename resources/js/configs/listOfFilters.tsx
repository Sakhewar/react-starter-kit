import { FieldConfig } from "@/lib/utils";

var listofFilters : Record<string,Record<string,string | FieldConfig[]>> = 
{

    client : {
        placeholder : "Rechercher par nom complet, email, téléphone,adresse ...",
        fields :[
            { name: "search",          label: "", placeholder: "Rechercher par nom complet, email, téléphone,adresse ...",         type: "text"},
            { name: "type_client_id",  label: "Rechercher par type de client", labelClassName:"text-[13px]",        type: "select",  options: "typeclients",  inputClassName: "w-full" },
            {
                name: "activer",
                label: "Actif ? uu",
                labelClassName: "text-[13px]",
                type: "radio-group",
                radioStyle: "minimal",
                colSpan: 12,
                radioOptions: [
                  { label: "Tout", value: null },
                  { label: "Oui",  value: true, activeClassName: "text-white text-emerald-500" },
                  { label: "Non",  value: false, activeClassName: "text-white text-red-500" },
                ],
            },
        ] 
    },
}

export default listofFilters;