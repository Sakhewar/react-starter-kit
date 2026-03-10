
export function managePageDeps(currentTemplateUrl:string, getElementsNeeds:{ entity: string; fields: string; args?: any }[])
{
    console.log(currentTemplateUrl);
    
    if (currentTemplateUrl.indexOf('/client') !== -1)
    {
        getElementsNeeds.push({entity: 'typeclients',fields: 'id,libelle', args:{}});
        getElementsNeeds.push({entity: 'modalitepaiements',fields: 'id,libelle', args:{}});
    }
    else if (currentTemplateUrl.indexOf('/fournisseur') !== -1)
    {
        getElementsNeeds.push({entity: 'typefournisseurs',fields: 'id,libelle', args:{}});
    }

    return getElementsNeeds;

}