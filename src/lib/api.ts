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
  email: string;
  phone: string;
  ageGroup: string;
  gender: string;
  city: string;
  country: string;
  categories: string[];
  consent: boolean;
}

export interface LeadResponse {
  lead: { id: string; name: string; email: string; categories: string[] };
}

export interface BrandSubmissionPayload {
  brandName: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  category: string;
  description: string;
  offerDetails: string;
}

export interface BrandSubmissionResponse {
  submission: { id: string; brandName: string };
}

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
};
