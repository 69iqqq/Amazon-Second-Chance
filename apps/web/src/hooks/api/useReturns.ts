import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiClient, ApiResponse } from '@/lib/api-client';

export interface ReturnRequestData {
  id: string;
  productId: string;
  reason: string;
  status: string;
  requestedAt: string;
  product?: {
    name: string;
    brand: string;
  }
}

export function useGetMyReturns() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['returns', 'my'],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<ReturnRequestData[]>('/returns/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
}

export function useCreateReturn() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { productId: string; reason: string }) => {
      const token = await getToken();
      const { data } = await apiClient.post<ApiResponse<ReturnRequestData>>('/returns', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns', 'my'] });
    },
  });
}
