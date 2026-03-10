var listofAttributes : Record<any,any> = 
{
    provenances : [
        "id,libelle,description"
    ],

    modalitepaiements : [
        "id,libelle,description,nbre_jour",
    ],

    modepaiements : [
        "id,libelle,description",
    ],

    typeclients : [
        "id,libelle,description",
    ],

    clients : [
        "id,code,nom_complet,email,telephone,adresse,type_client_id,type_client{id,libelle},modalite_paiement_id,modalite_paiement{id,libelle},plafond,remise",
        "description,contacts{id,nom,email,telephone}"
    ],
    fournisseurs : [
        "id,code,nom_complet,email,telephone,adresse,image",
        "description,contacts{id,nom,email,telephone}"
    ],

    users : [
        "id,name,image,status,status_fr,email",
    ]
}

export default listofAttributes;