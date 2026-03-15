import { eltQuery } from "@/utils/fetchDataScope";

export function managePageDeps(currentTemplateUrl: string, getElementsNeeds: eltQuery[])
{    
    if (currentTemplateUrl.indexOf('/client') !== -1)
    {
        getElementsNeeds.push({ entity: 'typeclients',       fields: 'id,libelle', args: {} });
        getElementsNeeds.push({ entity: 'modalitepaiements', fields: 'id,libelle', args: {} });
        getElementsNeeds.push({ entity: 'permissions',       fields: 'id,name',    args: { search: '-typeclient' }, skipInNeeds:true, optionals: { toType: 'permissions_deps' } });
    }
    else if (currentTemplateUrl.indexOf('/fournisseur') !== -1)
    {
        getElementsNeeds.push({ entity: 'typefournisseurs', fields: 'id,libelle', args: {} });
    }
    else if (currentTemplateUrl.indexOf('/depot') !== -1)
    {
        getElementsNeeds.push({ entity: 'typedepots',  fields: 'id,libelle', args: {} });
        getElementsNeeds.push({ entity: 'pointventes', fields: 'id,libelle', args: { activer: true } });
    }
    else if (currentTemplateUrl.indexOf('/familleproduit') !== -1)
    {
        getElementsNeeds.push({ entity: 'familleproduits', fields: 'id,libelle', args: { activer: true }, optionals: { toType: 'familleproduits2' } });
    }
    else if (currentTemplateUrl.indexOf('/produit') !== -1)
    {
        getElementsNeeds.push({ entity: 'marques',            fields: 'id,libelle', args: { activer: true } });
        getElementsNeeds.push({ entity: 'pointventes',        fields: 'id,libelle', args: { activer: true } });
        getElementsNeeds.push({ entity: 'depots',             fields: 'id,libelle', args: { activer: true } });
        getElementsNeeds.push({ entity: 'familleproduits',    fields: 'id,libelle', args: { activer: true } });
        getElementsNeeds.push({ entity: 'sousfamilleproduits',fields: 'id,libelle', args: { activer: true } });
    }

    return getElementsNeeds;
}