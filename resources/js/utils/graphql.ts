// utils/graphql.ts
import axios from 'axios';

interface GraphQLParams {
  entity: string;                  // ex: 'pays', 'factures', 'preferences'
  fields: string[];                // ex: ['id', 'libelle', 'description']
  args?: Record<string, any>;      // ex: { page: 1, count: 10, search: 'sen' }
}

/**
 * Requête GraphQL via GET (query string)
 * - Arguments toujours inclus (page, count, search, filter, etc.)
 * - Si page et/ou count présents → structure paginée avec metadata + data
 * - Sinon → requête simple sans metadata
 */
export async function graphqlGet<T = any>({
  entity,
  fields,
  args = {},
}: GraphQLParams): Promise<T> {
  const fieldsString = fields.join(',');

  // Construit les arguments (page:1,count:10,search:"sen",etc.)
  let argsString = '';
  if (Object.keys(args).length > 0) {
    argsString = '(' + Object.entries(args)
      .map(([key, value]) => {
        // Gestion basique des types
        if (typeof value === 'string') return `${key}:"${value.replace(/"/g, '\\"')}"`;
        if (typeof value === 'number' || typeof value === 'boolean') return `${key}:${value}`;
        if (value === null) return `${key}:null`;
        // Pour objets (ex: filter: { status: 'active' })
        return `${key}:${JSON.stringify(value)}`;
      })
      .join(',') + ')';
  }

  // Détection pagination
  const hasPagination = args.page !== undefined || args.count !== undefined;

  let queryBody = '';

  if (hasPagination) {
    // Requête paginée
    queryBody = `${entity}${argsString} { metadata{total,per_page,current_page,last_page,custom}, data{${fieldsString}} }`;
  } else {
    // Requête simple
    queryBody = `${entity}${argsString} { ${fieldsString} }`;
  }

  const query = `{ ${queryBody} }`;

  console.log('Requête GraphQL générée :', query);

  const encoded = encodeURIComponent(query.trim());
  const url = `/graphql?query=${encoded}`;

  console.log('URL complète :', url);

  try {
    const response = await axios.get(url, {
      headers: { Accept: 'application/json' },
    });

    const result = response.data;

    if (result.errors && result.errors.length > 0) {
      const msg = result.errors.map((e: any) => e.message).join('\n');
      throw new Error(`GraphQL Error: ${msg}`);
    }

    if (!result.data || !result.data[entity]) {
      throw new Error(`Aucune donnée pour ${entity}`);
    }

    return result.data[entity] as T;
  } catch (error: any) {
    console.error('Erreur graphqlGet:', error);
    throw error;
  }
}