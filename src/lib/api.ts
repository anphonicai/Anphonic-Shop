const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request failed: ${res.status}`);
  return data as T;
}

export interface LeadPayload {
  name: string;
  phone: string;
  ageGroup: string;
}

export interface LeadResponse {
  lead: { id: string; name: string; phone: string };
}

export interface BrandSubmissionPayload {
  brandName: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  category: string;
  description: string;
  offerDetails: string;
}

export interface BrandSubmissionResponse {
  submission: { id: string; brandName: string };
}

export interface BrandStat {
  brandId: string;
  website: string | null;
  totalClicks: number;
  monthlyClicks: number;
}

export interface StatsResponse {
  stats: BrandStat[];
}

export const trackClickUrl = (brandId: string) => `${BASE_URL}/api/track/click?bid=${brandId}`;

export const api = {
  submitLead(payload: LeadPayload): Promise<LeadResponse> {
    return request<LeadResponse>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  submitBrand(payload: BrandSubmissionPayload): Promise<BrandSubmissionResponse> {
    return request<BrandSubmissionResponse>('/api/brand-submissions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getStats(adminKey: string): Promise<StatsResponse> {
    return request<StatsResponse>('/api/track/stats', {
      headers: { 'x-admin-key': adminKey },
    });
  },
  async exportLeadsCsv(adminKey: string): Promise<Blob> {
    const res = await fetch(`${BASE_URL}/api/leads/export`, {
      headers: { 'x-admin-key': adminKey },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? `Request failed: ${res.status}`);
    }
    return res.blob();
  },
};
