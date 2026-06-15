import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiClient } from '@/lib/api-client';

export interface AdminDashboardData {
  totalUsers: number;
  totalReturns: number;
  totalListings: number;
  co2Saved: number;
}

export function useGetAdminDashboard() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<AdminDashboardData>('/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
}
