// src/stores/globalStore.ts
import { create, useStore } from 'zustand';
import { generateArgsFilters, graphqlGet } from '@/utils/graphql';

import axios from 'axios';
import { toast, type ToastT } from 'sonner';
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
  isLoading: boolean;
  error: string | null;
  errors: Record<string, string>; // Erreurs par entity pour plus de robustesse
  lastInitialized: string | null; // attributeName pour savoir pour quelle page,
  scope: Record<any, any>

  initialize: (options: InitOptions) => Promise<void>;

  reset: () => void;

  setState: (key: keyof GlobalState, value: any) => void
}
import { persist } from "zustand/middleware";
import { managePageDeps } from './routeChange';

export const useGlobalStore = create<GlobalState>()(
  persist((set, get) => (
  {

    dataPage: {}, // Init vide
    updateItem: null,
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

      const getElementsNeeds: { entity: string; fields: string; args?: any, optionals?: Record<string,any> }[] = [];
      const pageChangeNeeds: { entity: string; fields: string; args?: any, optionals?: Record<string,any>}[] = [];
      
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
            let finalType = element.entity;
              
            if(element.optionals && element.optionals?.toType)
            { 
              finalType = element.optionals.toType;
            }
           
            try
            {
              const data = await graphqlGet<PaginatedResponse<EntityItem>>({
                entity: element.entity,
                fields: element.fields,
                args: element.args || { page: 1, count: defaultCount },
              });
              return { entity: finalType, data };
            }
            catch (err: any)
            {
              
              return { entity: finalType, error: err.message || `Erreur pour ${element.entity}` };
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
              let currentElt = getElementsNeeds[index];
              let finalType = currentElt.entity;
              
              if(currentElt.optionals && currentElt.optionals?.toType)
              {
               
                finalType = currentElt.optionals.toType;
              }
              return { entity: finalType, error: result.reason?.message || 'Erreur inconnue' };
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
        isLoading: false,
        error: null,
        errors: {},
        lastInitialized: null,
      });
    },

    setState: (key, value) => set(
      (state) => ({...state, [key]: value,})
    ),
    
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

// uniquement en dev
if (typeof window !== "undefined") {
  // @ts-ignore
  window.store = useGlobalStore;
}



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
  let goodType = type.replace('/', '');

  let scope = useGlobalStore.getState().scope;
  if(scope && scope.dataInTabPane)
  {    
    Object.entries(scope.dataInTabPane).forEach(([key, value]) =>
    {
      if(String(key).endsWith("_" + goodType))
      {
        let keyItem = key.substring(0, key.length - ("_" + goodType).length);
        data = {...data,[keyItem]: value}
      }
    });
  }

  return axios.post(type, data).then((response) =>
  { 
    if(response && response.data)
    {
      let dataRes = response.data;
      if(dataRes.errors || dataRes.data.errors)
      {
        showToast(dataRes.errors || dataRes.data.errors);
        rtr['success'] = false;
      }
      else
      { 
        showToast(`${String(data.id).length <= 0 ? 'Ajout' : 'Modification' } effectué avec succès`, 'success');
        rtr['success'] = true;
      }
    }
    return {data: rtr};
  }).catch((error) =>
  {
    if(error.response.status === 500)
    {
      showToast('Une erreur est survenue, Merci de contacter l\'administrateur');
      rtr['success'] = false;
    }
    if(error.response && error.response.data)
    {
      if(error.response.data.message)
      {
        showToast(error.response.data.message);
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
    showToast("Une erreur est survenue !");
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
        showToast(data.errors || data.data.errors);
        rtr['success'] = false;
      }
      else
      {
        showToast("Suppression Effectuée avec succés !", 'success');
        rtr['success'] = true;
      }
    }
    return rtr;
  }).catch((error) =>
  {
    if(error.response.status === 500)
    {
      showToast("Une erreur est survenue, Merci de contacter l\'administrateur");
      rtr['success'] = false;
    }

    if(error.response && error.response.data)
    {
      if(error.response.data.message)
      {
        showToast(error.response.data.message);
        rtr['success'] = false;
      }
    }
    return rtr;
  })
}

export async function changeStatut(type: string, data : Record<string, any>, route?: any, rtrMsg?: any)
{
  let rtr : Record<string, any>  = {};

  let routeAction = route ?? 'statut';

  return axios.post(`/${type}/${routeAction}`, data).then((response) =>
  { 
    if(response && response.data)
    {
      let data = response.data;
      if(data.errors || data.data.errors)
      {
        showToast(data.errors || data.data.errors);
        rtr['success'] = false;
      }
      else
      {
        showToast(rtrMsg ?? 'Changement Effectuée avec succés !', 'success')
        rtr['success'] = true;
      }
    }
    return rtr;
  }).catch((error) =>
  {
    if(error.response.status === 500)
    {
      showToast('Une erreur est survenue, Merci de contacter l\'administrateur');
      rtr['success'] = false;
    }

    if(error.response && error.response.data)
    {
      if(error.response.data.message)
      {
        showToast(error.response.data.message);
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

export function showToast(message: string, type: ToastT["type"] = "error",options: Partial<ToastT> = {})
{
  const closeButtonColorClass =
  {
    error: "!bg-red-500 !text-white !border-red-400",
    success: "!bg-green-500 !text-white !border-green-400",
    warning: "!bg-yellow-500 !text-white !border-yellow-400",
    info: "!bg-blue-500 !text-white !border-blue-400",
  }[type as string] ?? "!bg-black !text-white !border-white/20";

  //@ts-ignore
  return toast[type]?.(message,
  {
    position: "top-center",
    closeButton: true,
    classNames: {
      closeButton: `!left-auto !right-0 !translate-x-1/2 ${closeButtonColorClass}`,
    },
    ...options,
  });
}

export function emptyForm(type: string)
{
  let scope = useGlobalStore.getState().scope;
  if(scope && scope.dataInTabPane)
  {
    Object.entries(scope.dataInTabPane).forEach(([key, value]) =>
    {
      if(String(key).endsWith("_" + type))
      {
        scope.dataInTabPane[key] = [];
      }
    });
  }
}

export function checkInForm(type: string, item :Record<any,any>)
{
  let scope = useGlobalStore.getState().scope;

  console.log("diop log", scope.dataInTabPane);

  if(scope && scope.dataInTabPane)
  {
 
    Object.entries(item).forEach(([key, value]) =>
    {
      if(Array.isArray(item[key]))
      {
        let tagInTabPane = key + "_" + type;
        console.log("diop log", tagInTabPane, item[key], scope.dataInTabPane[tagInTabPane]);
        
        if(scope.dataInTabPane[tagInTabPane])
        {
          scope.dataInTabPane[tagInTabPane] = item[key];
        }
      }
    });
  }
}