import { useQuery, useMutation, type UseQueryOptions } from '@tanstack/react-query';
import { customFetch } from './generated/api';
import type { Wilaya } from './generated/api.schemas';

// NOTE: Commune/Center field names are inferred from how OrderForm.tsx
// and BookShowcase.tsx use them. Verify against the actual Guepex response
// once this is live — adjust field names below if anything doesn't match.
export interface Commune {
  id: number;
  name: string;
  wilaya_id: number;
  is_deliverable: number;
}

export interface Center {
  center_id: number;
  name: string;
  commune_id: number;
  commune_name: string;
  wilaya_id?: number;
}

export interface CreateOrderInput {
  firstname: string;
  familyname: string;
  contact_phone: string;
  address?: string | null;
  to_wilaya_name: string;
  to_commune_name: string;
  is_stopdesk: boolean;
  stopdesk_id?: number | null;
  delivery_price: number;
}

export interface CreateOrderResult {
  success: boolean;
  tracking: string | null;
  label: string | null;
  message: string | null;
}

export const getGetCommunesQueryKey = (params: { wilaya_id: number }) =>
  ['communes', params.wilaya_id] as const;

export const getGetCentersQueryKey = (params: { wilaya_id: number }) =>
  ['centers', params.wilaya_id] as const;

export function useGetWilayas() {
  return useQuery({
    queryKey: ['wilayas'] as const,
    queryFn: () => customFetch<Wilaya[]>('/api/wilayas'),
  });
}

export function useGetCommunes(
  params: { wilaya_id: number },
  options?: { query?: Partial<UseQueryOptions<Commune[]>> }
) {
  return useQuery({
    queryKey: getGetCommunesQueryKey(params),
    queryFn: () => customFetch<Commune[]>(`/api/communes?wilaya_id=${params.wilaya_id}`),
    enabled: !!params.wilaya_id,
    ...options?.query,
  });
}

export function useGetCenters(
  params: { wilaya_id: number },
  options?: { query?: Partial<UseQueryOptions<Center[]>> }
) {
  return useQuery({
    queryKey: getGetCentersQueryKey(params),
    queryFn: () => customFetch<Center[]>(`/api/centers?wilaya_id=${params.wilaya_id}`),
    enabled: !!params.wilaya_id,
    ...options?.query,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (variables: { data: CreateOrderInput }) =>
      customFetch<CreateOrderResult>('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables.data),
      }),
  });
}
