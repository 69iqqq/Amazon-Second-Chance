import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import { requireRole } from '@/lib/requireRole';

export default async function KiranaPortalLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['KIRANA_PARTNER', 'ADMIN']);
  return (
    <div className="min-h-screen bg-[#f3f7f4]">
      <AmazonNavbar portalName="Kirana Hub Portal" />
      {children}
    </div>
  );
}
