// utils/graphql.ts
import axios from 'axios';

interface GraphQLParams {
  entity: string;                  
  fields: string;                
  args?: Record<string, any>;
  callback?: (data: any) => void;
}


export async function graphqlGet<T = any>({entity,fields,args = {},callback = undefined,}: GraphQLParams): Promise<T>
{
  const fieldsString = fields;

  // Construit les arguments (page:1,count:10,search:"sen",etc.)
  let argsString = generateArgsFilters(args);

  // Détection pagination
  const hasPagination = args.page !== undefined || args.count !== undefined;

  let queryBody = '';

  if (hasPagination)
  {
    queryBody = `${entity}${argsString} { metadata{total,per_page,current_page,last_page,custom}, data{${fieldsString}} }`;
  }
  else
  {
    queryBody = `${entity}${argsString} { ${fieldsString} }`;
  }

  const query = `{ ${queryBody} }`;

  const encoded = encodeURIComponent(query.trim());
  const url = `/graphql?query=${encoded}`;

  try
  {
    const response = await axios.get(url,
    {
      headers: { Accept: 'application/json' },
    });

    const result = response.data;

    if (result.errors && result.errors.length > 0)
    {
      const msg = result.errors.map((e: any) => e.message).join('\n');
      throw new Error(`GraphQL Error: ${msg}`);
    }

    if (!result.data || !result.data[entity])
    {
      throw new Error(`Aucune donnée pour ${entity}`);
    }

    return result.data[entity] as T;
  } 
  catch (error: any)
  {
    console.error('Erreur graphqlGet:', error);
    throw error;
  }
}

export function generateArgsFilters(args:Record<string, any>, withBrace = true): string
{
  let argsString = '';
  if (Object.keys(args).length > 0)
  {
    argsString = (withBrace == true ? '(' : '') + Object.entries(args)
      .map(([key, value]) =>
      {
        if (typeof value === 'string') return `${key}:"${value.replace(/"/g, '\\"')}"`;
        if (typeof value === 'number' || typeof value === 'boolean') return `${key}:${value}`;
        if (value === null) return `${key}:null`;
        return `${key}:${JSON.stringify(value)}`;
      })
      .join(',') + (withBrace ? ')' : '');
  }  
  return argsString;
}