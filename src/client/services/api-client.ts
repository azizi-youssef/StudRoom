const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const DEFAULT_TIMEOUT_MS = 10000;
const TOKEN_KEY = 'studroom_auth_token';

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

function getAuthHeader(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
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
   * Authenticated GET — sends JWT Authorization header
   */
  static async authGet<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
    token?: string
  ): Promise<T> {
    const url = buildUrl(endpoint, params);
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : getAuthHeader();
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  /**
   * Authenticated POST — sends JWT Authorization header
   */
  static async authPost<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const url = buildUrl(endpoint);
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : getAuthHeader();
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  /**
   * Authenticated PATCH — sends JWT Authorization header
   */
  static async authPatch<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const url = buildUrl(endpoint);
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : getAuthHeader();
    const response = await fetchWithTimeout(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  /**
   * Authenticated DELETE — sends JWT Authorization header
   */
  static async authDelete<T>(endpoint: string, token?: string): Promise<T> {
    const url = buildUrl(endpoint);
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : getAuthHeader();
    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }
}
