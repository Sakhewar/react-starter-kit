var listofAttributes : Record<any, any> = 
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

    typedepots : [
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
        "id,image,libelle,email,telephone,adresse,image,rccm,ninea,activer,activer_fr",
        "description,contacts{id,email,telephone}"
    ],

    depots : [
        "id,libelle,description,type_depot_id,type_depot{id,libelle},point_vente_id,point_vente{id,libelle},activer,activer_fr",
    ],

    familleproduits : [
        "id,libelle,description,activer,activer_fr",
    ],

    sousfamilleproduits : [
        "id,libelle,famille_produit_id,famille_produit{id,libelle},description,activer,activer_fr"
    ],

    marques : [
        "id,libelle,description,activer,activer_fr",
    ],

    produits : [
        "id,image,libelle,code,famille_produit_id,famille_produit{id,libelle},sous_famille_produit_id,sous_famille_produit{id,libelle},marque_id,marque{id,libelle},description,activer,activer_fr",
        "prix_ventes{id,point_vente_id,point_vente{id,libelle},prix_achat,frais,prix_revient,prix_vente}",
        "seuils{id,depot_id,depot{id,libelle},min,max}"
    ],


    users : [
        "id,name,image,status,status_fr,email",
    ]
}

export default listofAttributes;