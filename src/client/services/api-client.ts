const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const DEFAULT_TIMEOUT_MS = 10000;

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
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Reads the JWT token from localStorage (browser only). */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('studroom_auth_token');
}

function buildHeaders(withAuth: boolean): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export class ApiClient {
  /** Public GET — no auth header */
  static async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = buildUrl(endpoint, params);
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: buildHeaders(false),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  /** Authenticated GET — sends JWT token from localStorage */
  static async authGet<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = buildUrl(endpoint, params);
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: buildHeaders(true),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  /** Public POST — no auth header */
  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: buildHeaders(false),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /** Authenticated POST — sends JWT token */
  static async authPost<T>(endpoint: string, data: unknown): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /** Authenticated PATCH — sends JWT token */
  static async authPatch<T>(endpoint: string, data: unknown): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'PATCH',
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }

  /** Authenticated DELETE */
  static async authDelete<T>(endpoint: string): Promise<T> {
    const url = buildUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      headers: buildHeaders(true),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error?.message || `API error ${response.status}`);
    }
    return json;
  }
}
