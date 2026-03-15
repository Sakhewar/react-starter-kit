import { generateArgsFilters, graphqlGet } from '@/utils/graphql';

import axios from 'axios';
import { toast, type ToastT } from 'sonner';
import listofAttributes from '@/configs/listOfAttributes';
import { useGlobalStore } from '@/utils/fetchDataScope';
import { EntityItem, PaginatedResponse } from '@/lib/utils';


export function can(name: string, permissions? : any [])
{
  const perms = permissions || useGlobalStore.getState().dataPage.permissions;  

  if (Array.isArray(perms))
  {
    return perms.some((permission) => permission.name === name);
  }

  return false;
}

export async function addElement(type: string, data : Record<string, any>, canShowToast = true)
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
        throw new Error(dataRes.errors || dataRes.data.errors);
      }
      else
      { 
        canShowToast && showToast(`${String(data.id).length <= 0 ? 'Ajout' : 'Modification' } effectué avec succès`, 'success');
        rtr['success'] = true;

        let getObj = null;
        if(dataRes.data && dataRes.data[goodType + 's'])
        {
          getObj = dataRes.data[goodType + 's'][0];
        }

        rtr['data'] = getObj
      }
    }
    return {data: rtr};
  }).catch((error) =>
  {
    rtr['success'] = false;
    let message = String(error);
    if(error.response && error.response.status === 500)
    {
      message = "Une erreur est survenue, Merci de contacter l\'administrateur";
    }
    if(error.response && error.response.data)
    {
      if(error.response.data.message)
      {
        message = error.response.data.message;
      }
    }

    if(canShowToast)
    {
      showToast(message);
    }
    rtr['message'] = message;
   
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

  if(scope && scope.dataInTabPane)
  {
 
    Object.entries(item).forEach(([key, value]) =>
    {
      if(Array.isArray(item[key]))
      {
        let tagInTabPane = key + "_" + type;
        
        if(scope.dataInTabPane[tagInTabPane])
        {
          scope.dataInTabPane[tagInTabPane] = item[key];
        }
      }
    });
  }
}