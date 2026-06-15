import { AmazonNavbar } from '@/components/shared/AmazonNavbar';

export default async function SellerPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col">
      <AmazonNavbar forceSecondLife={true} portalName="Seller Central" />
      {children}
    </div>
  );
}
