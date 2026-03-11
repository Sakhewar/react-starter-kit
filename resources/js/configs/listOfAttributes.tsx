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

    typefournisseurs : [
        "id,libelle,description",
    ],

    clients : [
        "id,code,nom_complet,email,telephone,adresse,type_client_id,type_client{id,libelle},modalite_paiement_id,modalite_paiement{id,libelle},plafond,remise,activer,activer_fr",
        "description,contacts{id,nom,email,telephone}"
    ],
    fournisseurs : [
        "id,code,nom_complet,email,telephone,adresse,image,type_fournisseur_id,type_fournisseur{id,libelle},activer,activer_fr",
        "description,contacts{id,nom,email,telephone}"
    ],

    pointventes : [
        "id,,libelle,email,telephone,adresse,image,rccm,ninea",
        "description,contacts{id,email,telephone}"
    ],

    users : [
        "id,name,image,status,status_fr,email",
    ]
}

export default listofAttributes;