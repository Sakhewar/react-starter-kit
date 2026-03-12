
export function managePageDeps(currentTemplateUrl:string, getElementsNeeds:{ entity: string; fields: string; args?: any, optionals?: Record<string,any>}[])
{    
    if (currentTemplateUrl.indexOf('/client') !== -1)
    {
        getElementsNeeds.push({entity: 'typeclients',fields: 'id,libelle', args:{}});
        getElementsNeeds.push({entity: 'modalitepaiements',fields: 'id,libelle', args:{}});
    }
    else if (currentTemplateUrl.indexOf('/fournisseur') !== -1)
    {
        getElementsNeeds.push({entity: 'typefournisseurs',fields: 'id,libelle', args:{}});
    }
    else if(currentTemplateUrl.indexOf('/depot') !== -1)
    {
        getElementsNeeds.push({entity: 'typedepots',fields: 'id,libelle', args:{}});
        getElementsNeeds.push({entity: 'pointventes',fields: 'id,libelle', args:{activer:true}});
    }
    else if(currentTemplateUrl.indexOf('/familleproduit') !== -1)
    {
        getElementsNeeds.push({entity: 'familleproduits',fields: 'id,libelle', args:{activer:true}, optionals: {toType : 'familleproduits2'}});
    }

    return getElementsNeeds;

}