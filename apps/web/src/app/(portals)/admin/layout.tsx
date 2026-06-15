import { DashboardNavbar } from '@/components/shared/DashboardNavbar';
import { requireRole } from '@/lib/requireRole';

export default async function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['ADMIN']);
  return (
    <div className="min-h-screen bg-[#f2f4f8]">
      <DashboardNavbar />
      {children}
    </div>
  );
}
