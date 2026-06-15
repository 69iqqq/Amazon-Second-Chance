import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import { requireRole } from '@/lib/requireRole';

export default async function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  // All signed-in users can access the customer portal
  await requireRole(['CUSTOMER', 'SELLER', 'NGO', 'KIRANA_PARTNER', 'ADMIN'], '/');
  return (
    <div className="min-h-screen bg-white">
      <AmazonNavbar forceSecondLife />
      {children}
    </div>
  );
}
