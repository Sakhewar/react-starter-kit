import { Tag } from "lucide-react";
import { permission } from "process";

export const pageWithTabs =
{
    familleproduit : [
        {
            key : 1,
            namepage: 'Famille de produit',
            attributeName: 'familleproduit',
            icon : <Tag />,
            permissionName : 'familleproduit'
        },
        {
            key : 2,
            namepage: 'Sous Famille de produit',
            attributeName: 'sousfamilleproduit',
            icon: <Tag/>,
            permissionName : 'familleproduit'
        }
    ]
}