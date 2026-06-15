import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiClient } from '@/lib/api-client';

export interface ListingData {
  id: string;
  title: string;
  price: string;
  listingType: string;
  status: string;
  viewCount: number;
  product?: {
    brand: string;
  }
}

export function useGetListings() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<ListingData[]>('/listings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
}
