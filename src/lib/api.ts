// G2G API Client

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Provider APIs
export const providersApi = {
  list: async (params?: { status?: string; capability?: string; limit?: number; offset?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.capability) query.set('capability', params.capability);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    
    const queryString = query.toString();
    const url = `${API_BASE}/providers${queryString ? `?${queryString}` : ''}`;
    return fetchJson<{ success: boolean; data: { providers: any[]; pagination: any } }>(url);
  },

  get: async (id: string) => {
    return fetchJson<{ success: boolean; data: any }>(`${API_BASE}/providers/${id}`);
  },
};

// Session APIs
export const sessionsApi = {
  create: async (data: { provider_id: string; user_id?: string; message?: string }) => {
    return fetchJson<{ success: boolean; message: string; data: any }>(`${API_BASE}/sessions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  get: async (id: string) => {
    return fetchJson<{ success: boolean; data: any }>(`${API_BASE}/sessions/${id}`);
  },

  end: async (id: string) => {
    return fetchJson<{ success: boolean; message: string; data: any }>(`${API_BASE}/sessions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthApi = {
  check: async () => {
    return fetchJson<{ status: string; service: string; version: string }>(`${API_BASE}/health`);
  },
};