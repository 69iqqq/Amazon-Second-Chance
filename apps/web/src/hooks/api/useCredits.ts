import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiClient } from '@/lib/api-client';

export interface WalletData {
  id: string;
  balance: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
}

export function useGetWallet() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['credits', 'wallet'],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<WalletData>('/credits/wallet', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
}
