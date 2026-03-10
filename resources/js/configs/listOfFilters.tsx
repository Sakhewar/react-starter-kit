import { FieldConfig } from "@/lib/utils";

var listofFilters : Record<string,Record<string,string | FieldConfig[]>> = 
{

    client : {
        placeholder : "Rechercher par nom complet, email, téléphone,adresse ...",
        fields :[
            { name: "search",          label: "", placeholder: "Rechercher par nom complet, email, téléphone,adresse ...",         type: "text"},
            { name: "type_client_id",  label: "Rechercher par type de client", labelClassName:"text-[13px]",        type: "select",  options: "typeclients",  inputClassName: "w-full" },
            { name: "",                label: "Actif ?", labelClassName:"text-[13px] text-center flex items-center justify-center",  type: "text", inputClassName:"hidden", colSpan: 12},
            { name: "activer",         label: "Oui", labelClassName:"text-[13px]",  type: "checkbox", colSpan: 4},
            { name: "activer",         label: "Non", labelClassName:"text-[13px]",  type: "checkbox", colSpan: 4},
            { name: "activer",         label: "Tout", labelClassName:"text-[13px]",  type: "checkbox", colSpan: 4}
        ] 
    },
}

export default listofFilters;