import { Tag } from "lucide-react";
import { permission } from "process";

type Tab = {
    key: number;
    attributeName: string;
    namepage: string;
    permissionName: string | null;
    icon?: React.ReactNode;
  };

export const pageWithTabs = 
{
    familleproduit : [
        {
            key           : 1,
            namepage      : 'Famille de produits',
            attributeName : 'familleproduit',
            icon          : <Tag />,
            permissionName: 'familleproduit'
        },
        {
            key           : 2,
            namepage      : 'Sous Famille de produits',
            attributeName : 'sousfamilleproduit',
            icon          : <Tag/>,
            permissionName: 'sousfamilleproduit'
        }
    ]
} as Record<string, Tab[]>;