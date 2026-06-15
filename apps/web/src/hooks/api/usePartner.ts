import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiClient } from '@/lib/api-client';

export interface PartnerInventoryData {
  id: string;
  name: string;
  quantity: number;
  status: string;
}

export function useGetKiranaInventory() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['kirana', 'inventory'],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<PartnerInventoryData[]>('/kirana/inventory', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
}

export function useGetNgoDonations() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['ngo', 'donations'],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<PartnerInventoryData[]>('/ngo/donations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
}
