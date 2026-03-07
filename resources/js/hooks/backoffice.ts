// src/stores/globalStore.ts
import { create } from 'zustand';
import { graphqlGet } from '@/utils/graphql';
import listofAttributes from '@/configs/requestAttribute';

interface EntityItem {
  id: number | string;
  [key: string]: any;
}

interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

interface InitOptions {
  page: any; // Type ton objet page (ex: { link: string, title: string })
  attributeName: string;
  onlyPageChange?: boolean; // Limiter à pageChangeNeeds
  currentPage?: number;     // Page actuelle pour pagination
  pageSize?: number;        // Taille de page pour pagination
  force?: boolean;          // Pour forcer même si lastInitialized === attributeName
  // Ajoute d'autres options si besoin (filters, search, etc.)
}

interface GlobalState {
  dataPage: Record<string, PaginatedResponse<EntityItem>>;

  isLoading: boolean;
  error: string | null;
  errors: Record<string, string>; // Erreurs par entity pour plus de robustesse
  lastInitialized: string | null; // attributeName pour savoir pour quelle page

  initialize: (options: InitOptions) => Promise<void>;

  reset: () => void;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  dataPage: {}, // Init vide

  isLoading: false,
  error: null,
  errors: {}, // Erreurs spécifiques
  lastInitialized: null,

  initialize: async (options: InitOptions) => {
    const defaultCount = 10;
    const{ 
      page, 
      attributeName, 
      onlyPageChange = false, 
      currentPage = 1, 
      pageSize = defaultCount, 
      force = false 
    } = options;

    const goodType = !attributeName.endsWith("s") ? attributeName + "s" : attributeName;
    const currentTemplateUrl = page.link;

    // Évite rechargement inutile si même attributeName et pas force
    if (!force && get().lastInitialized === attributeName)
    {
      return;
    }

    set({ isLoading: true, error: null, errors: {} });

    const getElementsNeeds: { entity: string; fields: string; args?: any }[] = [];
    const pageChangeNeeds: { entity: string; fields: string; args?: any }[] = [];
    
    if (!onlyPageChange)
    {
      set({ dataPage: {} });

      //Pour vider le dataPage apres chaque changement de page
  
      getElementsNeeds.push(
        {entity: 'permissions', fields: 'id,name',args: { search: `-${attributeName}` },
      });

      if (currentTemplateUrl.indexOf('/client') !== -1)
      {
        getElementsNeeds.push({entity: 'typeclients',fields: 'id,libelle', args:{}});
      }

    }
    else
    {
      // Requête pour l'entité principale (avec pagination dynamique)
      pageChangeNeeds.push(
        {entity: goodType,fields: (listofAttributes[goodType] && listofAttributes[goodType][0]) || ["id"],args: { page: currentPage, count: pageSize }
      });

    }

    try
    {  
      let afterGetElement: { entity: string; data?: PaginatedResponse<EntityItem>; error?: string }[] = [];
      if (getElementsNeeds.length > 0)
      {
        const promises = getElementsNeeds.map(async (element) =>
        {
          try
          {
            const data = await graphqlGet<PaginatedResponse<EntityItem>>({
              entity: element.entity,
              fields: element.fields,
              args: element.args || { page: 1, count: defaultCount },
            });
            return { entity: element.entity, data };
          }
          catch (err: any)
          {
            return { entity: element.entity, error: err.message || `Erreur pour ${element.entity}` };
          }
        });

        const settled = await Promise.allSettled(promises);

        afterGetElement = settled.map((result, index) =>
        {
          if (result.status === 'fulfilled')
          {
            return result.value;
          }
          else
          {
            return { entity: getElementsNeeds[index].entity, error: result.reason?.message || 'Erreur inconnue' };
          }
        });
      }

      // Lance les spécifiques à la page de la même façon
      const promisesPage = pageChangeNeeds.map(async (element) =>
      {
        try
        {
          const data = await graphqlGet<PaginatedResponse<EntityItem>>({
            entity: element.entity,
            fields: element.fields,
            args: element.args,
          });
          return { entity: element.entity, data };
        } 
        catch (err: any)
        {
          return { entity: element.entity, error: err.message || `Erreur pour ${element.entity}` };
        }
      });
      const settledPage = await Promise.allSettled(promisesPage);
      const afterPageChanged = settledPage.map((result, index) =>
      {
        if (result.status === 'fulfilled')
        {
          return result.value;
        }
        else
        {
          return { entity: pageChangeNeeds[index].entity, error: result.reason?.message || 'Erreur inconnue' };
        }
      });

      const newDataPage = { ...get().dataPage };
      const newErrors: Record<string, string> = {};

      afterGetElement.forEach(({ entity, data, error }) =>
      {
        if (data)
        {
          newDataPage[entity] = data;
        }
        else if (error)
        {
          newErrors[entity] = error;
        }
      });

      afterPageChanged.forEach(({ entity, data, error }) =>
      {
        if (data)
        {
          newDataPage[entity] = data;
        }
        else if (error)
        {
          newErrors[entity] = error;
        }
      });

      set({
        dataPage: newDataPage,
        errors: newErrors,
        error: Object.keys(newErrors).length > 0 ? 'Erreurs partielles lors du chargement' : null,
        isLoading: false,
        lastInitialized: attributeName,
      });
    } catch (err: any)
    {
      set({
        error: err.message || 'Erreur chargement données globales',
        isLoading: false,
      });
      console.error('[globalStore] Erreur initialize:', err);
    }
  },

  reset: () => {
    set({
      dataPage: {},
      isLoading: false,
      error: null,
      errors: {},
      lastInitialized: null,
    });
  },
}));

// Reste du fichier (Optionals et can)
interface Optionals
{
  permissions?: { name: string }[];
}

export function can(name: string, optionals: Optionals = {})
{
  const permissions = optionals.permissions || [];
  
  return Array.isArray(permissions) && (permissions as { name: string }[]).some((permission) => permission.name === name);
}