// utils/graphql.ts
import axios, { AxiosError } from 'axios';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, any>;
  }>;
}

interface FetchDataOptions<V = any> {
  query: string;
  variables?: V;
  headers?: Record<string, string>;
}

/**
 * Fonction générique pour faire des requêtes GraphQL
 * @param query La requête GraphQL (string)
 * @param variables Les variables optionnelles
 * @param options.headers Headers supplémentaires (ex: Authorization)
 * @returns Les données typées ou throw une erreur
 */
export async function fetchData<T = any, V = any>(
  query: string,
  variables?: V,
  options: FetchDataOptions<V> = {}
): Promise<T> {
  const { headers = {} } = options;

  try {
    const response = await axios.post<GraphQLResponse<T>>(
      '/graphql', // ou import.meta.env.VITE_GRAPHQL_ENDPOINT || '/graphql'
      {
        query,
        variables,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      }
    );

    const { data, errors } = response.data;

    // Gestion des erreurs GraphQL (erreurs dans la réponse)
    if (errors && errors.length > 0) {
      const errorMessages = errors.map(e => e.message).join('\n');
      throw new Error(`Erreur GraphQL: ${errorMessages}`);
    }

    // Si pas de data → erreur inattendue
    if (!data) {
      throw new Error('Aucune donnée retournée par le serveur GraphQL');
    }

    return data;

  } catch (error) {
    // Gestion des erreurs réseau / Axios
    if (error instanceof AxiosError) {
      const serverMessage = error.response?.data?.errors?.[0]?.message;
      throw new Error(
        serverMessage || error.message || 'Erreur lors de la requête GraphQL'
      );
    }

    throw error;
  }
}