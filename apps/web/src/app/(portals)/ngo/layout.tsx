import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import { requireRole } from '@/lib/requireRole';

export default async function NgoPortalLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['NGO', 'ADMIN']);
  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col">
      <AmazonNavbar forceSecondLife={true} portalName="NGO Partner Network" />
      {children}
    </div>
  );
}
