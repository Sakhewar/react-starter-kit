// src/stores/globalStore.ts
import { create, useStore } from 'zustand';
import { generateArgsFilters, graphqlGet } from '@/utils/graphql';

import axios from 'axios';
import { toast } from 'sonner';
import listofAttributes from '@/configs/listOfAttributes';


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
  filters?: Record<string, any>;
  // Ajoute d'autres options si besoin (filters, search, etc.)
}

interface GlobalState {
  dataPage: Record<string, PaginatedResponse<EntityItem>>;
  updateItem: any;
  deleteItem: any;
  isLoading: boolean;
  error: string | null;
  errors: Record<string, string>; // Erreurs par entity pour plus de robustesse
  lastInitialized: string | null; // attributeName pour savoir pour quelle page,
  scope: Record<any, any>

  initialize: (options: InitOptions) => Promise<void>;

  reset: () => void;
}
import { persist } from "zustand/middleware";
import { managePageDeps } from './routeChange';

export const useGlobalStore = create<GlobalState>()(
  persist((set, get) => ({

    dataPage: {}, // Init vide
    updateItem: null,
    deleteItem: null,
    isLoading: false,
    error: null,
    errors: {}, // Erreurs spécifiques
    lastInitialized: null,
    scope: {},

    initialize: async (options: InitOptions) => {
      const defaultCount = 10;
      const{ 
        page, 
        attributeName, 
        onlyPageChange = false, 
        currentPage = 1, 
        pageSize = defaultCount, 
        force = false,
        filters = {}
      } = options;

      const goodType = !attributeName.endsWith("s") ? attributeName + "s" : attributeName;
      const currentTemplateUrl = page?.link;

      // Évite rechargement inutile si même attributeName et pas force
      if (!force && get().lastInitialized === attributeName)
      {
        return;
      }

      if(!currentTemplateUrl)
      {
        return;
      }

      set({ isLoading: true, error: null, errors: {} });

      const getElementsNeeds: { entity: string; fields: string; args?: any }[] = [];
      const pageChangeNeeds: { entity: string; fields: string; args?: any }[] = [];
      
      if (!onlyPageChange)
      {
        set({ dataPage: {}, updateItem: null});

        //Pour vider le dataPage apres chaque changement de page
    
        getElementsNeeds.push(
          {entity: 'permissions', fields: 'id,name',args: { search: `-${attributeName}` },
        });

        let needsEltsDeps: { entity: string; fields: string; args?: any }[] = [];

        needsEltsDeps = managePageDeps(currentTemplateUrl, needsEltsDeps);

        getElementsNeeds.push(...needsEltsDeps);

      }
      else
      {
        // Requête pour l'entité principale (avec pagination dynamique)
        pageChangeNeeds.push(
          {entity: goodType,fields: (listofAttributes[goodType] && listofAttributes[goodType][0]) || ["id"],args: {...filters, page: currentPage, count: pageSize }
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
          errors:{...get().errors, ...newErrors},
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
        updateItem: null,
        deleteItem: null,
        isLoading: false,
        error: null,
        errors: {},
        lastInitialized: null,
      });
    },
    
    }),
    {
      name: "global-store",
      partialize: (state) => ({
        scope: {
          collapsed: state.scope?.collapsed ?? false,
        },
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState, // garde tout le state initial
        scope: {
          ...currentState.scope,
          collapsed: persistedState?.scope?.collapsed ?? false, // écrase uniquement collapsed
        },
      }),
    }
  )
);



export function can(name: string, permissions? : any [])
{
  const perms = permissions || useGlobalStore.getState().dataPage.permissions;

  if (Array.isArray(perms))
  {
    return perms.some((permission) => permission.name === name);
  }

  return false;
}

export async function addElement(type: string, data : Record<string, any>)
{
  let rtr : Record<string, any>  = {};

  return axios.post(type, data).then((response) =>
  { 
    if(response && response.data)
    {
      let dataRes = response.data;
      if(dataRes.errors || dataRes.data.errors)
      {
        toast.error(dataRes.errors || dataRes.data.errors, {position:'top-center'})
        rtr['success'] = false;
      }
      else
      { 
        toast.success(`${String(data.id).length <= 0 ? 'Ajout' : 'Modification' } effectué avec succès`, {position:'top-center'})
        rtr['success'] = true;
      }
    }
    return {data: rtr};
  }).catch((error) =>
  {
    if(error.response.status === 500)
    {
      toast.error('Une erreur est survenue, Merci de contacter l\'administrateur', {position:'top-center'});
      rtr['success'] = false;
    }
    if(error.response && error.response.data)
    {
      if(error.response.data.message)
      {
        toast.error(error.response.data.message, {position:'top-center'});
        rtr['success'] = false;
      }
    }
    return {data: rtr};
  })
} 

export async function updateElement(type: string, id: number)
{
  const goodType = !type.endsWith("s") ? type + "s" : type;
  const data = await graphqlGet<PaginatedResponse<EntityItem>>({
    entity: goodType,
    fields: listofAttributes[goodType],
    args: { id: id },
  });

  if(data && Array.isArray(data) && data.length === 1)
  {
    return data[0];
  }
  else
  {
    toast.error("Une erreur est survenue !", {position:'top-center'});
  }
}

export async function deleteElement(type: string, id: number)
{
  let rtr : Record<string, any>  = {};

  return axios.post(`/${type}/delete/${id}`).then((response) =>
  { 
    if(response && response.data)
    {
      let data = response.data;
      if(data.errors || data.data.errors)
      {
        toast.error(data.errors || data.data.errors, {position:'top-center'})
        rtr['success'] = false;
      }
      else
      {
        toast.success('Suppression Effectuée avec succés !', {position:'top-center'})
        rtr['success'] = true;
      }
    }
    return rtr;
  }).catch((error) =>
  {
    if(error.response && error.response.data)
    {
      if(error.response.data.message)
      {
        toast.error(error.response.data.message, {position:'top-center'});
        rtr['success'] = false;
      }
    }
    return rtr;
  })
}

export async function exportToPdfOrExcel(type: string, typeExport: string, args: Record<string, any>)
{
  const goodType = !type.endsWith("s") ? type + "s" : type;

  let attrs = Object.entries({attrs: listofAttributes[goodType][0]}).map(([key,value])=>
  {
    return `${key}:${JSON.stringify(value)}`;
  });
  
  const url = `/generate-${goodType}-${typeExport}?${attrs + ','+ generateArgsFilters(args, false)}`;

  window.open(url, '_blank');
  
}

export function toCapitalize(str:String)
{
  if (typeof str !== 'string' || str.length === 0)
  {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}