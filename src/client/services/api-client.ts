const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const DEFAULT_TIMEOUT_MS = 10000;

/**
 * Clé localStorage pour l'état utilisateur uniquement (PAS le token).
 * Le JWT est désormais stocké dans un cookie HttpOnly géré par le serveur.
 * localStorage ne contient plus aucune donnée sensible.
 */
export const USER_STORAGE_KEY = 'studroom_user';

function buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 0) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      /**
       * credentials: 'include' est ESSENTIEL pour que le navigateur envoie
       * et reçoive automatiquement le cookie HttpOnly sur chaque requête.
       */
      credentials: 'include',
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export class ApiClient {
  static async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = buildUrl(endpoint, params);
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  static async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  /**
   * GET authentifié — le cookie HttpOnly est envoyé automatiquement via credentials: 'include'.
   * Le paramètre `token` est conservé pour la compatibilité avec les clients non-navigateurs.
   */
  static async authGet<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
    token?: string
  ): Promise<T> {
    const url = buildUrl(endpoint, params);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers,
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  /**
   * POST authentifié — le cookie HttpOnly est envoyé automatiquement via credentials: 'include'.
   */
  static async authPost<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const url = buildUrl(endpoint);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  /**
   * PATCH authentifié — le cookie HttpOnly est envoyé automatiquement via credentials: 'include'.
   */
  static async authPatch<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const url = buildUrl(endpoint);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetchWithTimeout(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  /**
   * DELETE authentifié — le cookie HttpOnly est envoyé automatiquement via credentials: 'include'.
   */
  static async authDelete<T>(endpoint: string, token?: string): Promise<T> {
    const url = buildUrl(endpoint);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      headers,
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }
}
