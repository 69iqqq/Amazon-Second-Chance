import { prisma } from '@/lib/prisma';
import React from 'react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
import { MiniSparkline } from '@/components/seller/MiniSparkline';

export default async function SellerCentralDashboard() {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    redirect('/sign-in?redirect_url=/seller/login');
  }

  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  
  if (!dbUser) {
    redirect('/sign-in?redirect_url=/seller/login');
  }

  // ENFORCE SELLER PROFILE EXISTENCE
  // @ts-ignore
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: dbUser.id }
  });

  if (!sellerProfile) {
    redirect('/seller/login');
  }

  // Fetch their listings as a seller
  const activeListings = dbUser ? await prisma.listing.findMany({
    where: { sellerId: dbUser.id }, // active and inactive
    include: { product: { include: { images: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10
  }) : [];

  const totalListings = activeListings.length;
  const activeCount = activeListings.filter(l => l.status === 'ACTIVE').length;
  
  // Calculate mock seller balance based on listings
  const totalValue = activeListings.reduce((sum, l) => sum + Number(l.price), 0);
  const todaysSales = totalValue * 0.1; // mock 10% sold today

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0F1111] font-sans pb-10">

      {/* Main Container mirroring the Amazon Pay layout width */}
      <div className="max-w-[1280px] mx-auto p-4 pt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar (Mimics Amazon Pay Balance card) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#D5D9D9] flex flex-col shadow-sm">
            <div className="bg-[#f0f2f2] p-4 flex justify-between items-center border-b border-[#D5D9D9]">
              <span className="font-bold text-[13px] text-[#0f1111]">Seller Balance</span>
              <span className="text-[#007600] text-[15px] font-bold">₹{Number(totalValue * 0.4).toFixed(2)}</span>
            </div>
            <div className="p-4 flex flex-col gap-4 text-[13px] text-[#007185]">
              <Link href="/seller/add-product" className="flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                  <path d="M12 3v9l8-4.5M12 12l-8-4.5" />
                  <path d="M12 12v9" />
                  <circle cx="5" cy="19" r="5" fill="#ff9900" stroke="none" />
                  <path d="M5 16v6m-3-3h6" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
                Add a Product
              </Link>
              <div className="flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="5" y="9" width="16" height="11" rx="1" />
                  <path d="M13 9v11" />
                  <path d="M13 9c0-2-2-3-4-2-1.5.8-1.5 2.5 0 3.5s4-1.5 4-1.5z" />
                  <path d="M13 9c0-2 2-3 4-2 1.5.8 1.5 2.5 0 3.5s-4-1.5-4-1.5z" />
                  <circle cx="5" cy="19" r="5" fill="#ff9900" stroke="none" />
                  <path d="M5 16v6m-3-3h6" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
                Add Gift Card
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="4.5" fill="#ff9900" stroke="none" />
                  <circle cx="12" cy="12" r="1.5" fill="#ffffff" stroke="none" />
                </svg>
                Account Settings
              </div>
              <Link href="/seller/analytics" className="flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M3 3v18h18" />
                  <rect x="7" y="14" width="4" height="7" fill="#007185" stroke="none" />
                  <rect x="14" y="9" width="4" height="12" fill="#ff9900" stroke="none" />
                </svg>
                Analytical Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area (Mimics the Travel, Recharges, Bill Payments rows) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Hero Banner */}
          <div className="w-full bg-[#fde9c5] shadow-sm border border-[#D5D9D9] overflow-hidden mb-4">
            <img src="/images/sell-refurbished-banner.png" alt="Sell Refurbished Items on Amazon" className="w-full h-auto object-contain" />
          </div>

          {/* Section 1: Performance & Sales */}
          <div className="bg-white border border-[#D5D9D9] shadow-sm">
            <h3 className="text-[15px] font-bold text-[#0f1111] p-4 border-b border-[#f0f2f2]">Performance Overview</h3>
            <div className="p-6 grid grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 mb-3 bg-[#fff4e6] flex items-center justify-center text-[#c45500] font-light text-[22px] group-hover:bg-[#fde2c5] transition relative z-10">
                  14
                </div>
                <span className="text-[13px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Open Orders</span>
                <MiniSparkline color="#ff9900" dataKey="val" data={[{val:5}, {val:8}, {val:6}, {val:11}, {val:9}, {val:14}]} />
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 mb-3 bg-[#e6f2f8] flex items-center justify-center text-[#007185] font-light text-[14px] group-hover:bg-[#ccebf5] transition relative z-10">
                  ₹{Number(todaysSales).toFixed(0)}
                </div>
                <span className="text-[13px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Today's Sales</span>
                <MiniSparkline color="#00A8E1" dataKey="val" data={[{val:200}, {val:150}, {val:400}, {val:300}, {val:600}, {val:Number(todaysSales)}]} />
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 mb-3 bg-[#eef8ef] flex items-center justify-center text-[#007600] font-light text-[22px] group-hover:bg-[#d8f0d8] transition relative z-10">
                  2
                </div>
                <span className="text-[13px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Buyer Messages</span>
                <MiniSparkline color="#007600" dataKey="val" data={[{val:0}, {val:1}, {val:0}, {val:3}, {val:1}, {val:2}]} />
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 mb-3 bg-[#f4f4f4] flex items-center justify-center text-[#565959] font-light text-[18px] group-hover:bg-[#e3e3e3] transition relative z-10">
                  84%
                </div>
                <span className="text-[13px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Buy Box Wins</span>
                <MiniSparkline color="#a6a6a6" dataKey="val" data={[{val:70}, {val:75}, {val:72}, {val:80}, {val:82}, {val:84}]} domain={[0, 100]} />
              </div>
            </div>
          </div>

          {/* Section 2: Inventory & Listings */}
          <div className="bg-white border border-[#D5D9D9] shadow-sm">
            <h3 className="text-[15px] font-bold text-[#0f1111] p-4 border-b border-[#f0f2f2]">Inventory & Listings</h3>
            <div className="p-6 grid grid-cols-4 sm:grid-cols-5 gap-4 text-center">
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-16 h-16 mb-2 flex items-center justify-center">
                  <img src="/icons/manage_listings.png" alt="Manage Listings" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <span className="text-[12px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Manage Listings</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-16 h-16 mb-2 flex items-center justify-center">
                  <img src="/icons/list_used_item.png" alt="List Used Item" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <span className="text-[12px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">List Used Item</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-16 h-16 mb-2 flex items-center justify-center">
                  <img src="/icons/pricing_dashboard.png" alt="Pricing Dashboard" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <span className="text-[12px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Pricing Dashboard</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-16 h-16 mb-2 flex items-center justify-center">
                  <img src="/icons/fba_shipments.png" alt="FBA Shipments" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <span className="text-[12px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">FBA Shipments</span>
              </div>
            </div>
          </div>

          {/* Section 3: Returns & Support */}
          <div className="bg-white border border-[#D5D9D9] shadow-sm">
            <h3 className="text-[15px] font-bold text-[#0f1111] p-4 border-b border-[#f0f2f2]">Returns & Support</h3>
            <div className="p-6 grid grid-cols-4 sm:grid-cols-5 gap-4 text-center">
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-16 h-16 mb-2 flex items-center justify-center">
                  <img src="/icons/manage_returns.png" alt="Manage Returns" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <span className="text-[12px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Manage Returns</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-16 h-16 mb-2 flex items-center justify-center">
                  <img src="/icons/a_to_z_claims.png" alt="A-to-z Claims" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <span className="text-[12px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">A-to-z Claims</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-16 h-16 mb-2 flex items-center justify-center">
                  <img src="/icons/chargebacks.png" alt="Chargebacks" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <span className="text-[12px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Chargebacks</span>
              </div>
            </div>
          </div>

          {/* Table for active listings (Moved to bottom) */}
          <div className="bg-white border border-[#D5D9D9] shadow-sm mt-4">
             <div className="p-4 border-b border-[#f0f2f2] flex justify-between items-center">
               <h3 className="text-[15px] font-bold text-[#0f1111]">Recent Pre-Owned Listings</h3>
             </div>
             <div className="p-4 overflow-x-auto">
               <table className="w-full text-left text-[13px]">
                 <thead>
                   <tr className="border-b border-[#D5D9D9] text-[#565959]">
                     <th className="pb-2 font-normal">Status</th>
                     <th className="pb-2 font-normal">Image</th>
                     <th className="pb-2 font-normal">Product Name</th>
                     <th className="pb-2 font-normal">Condition</th>
                     <th className="pb-2 font-normal text-right">Price</th>
                     <th className="pb-2 font-normal text-right">Qty</th>
                   </tr>
                 </thead>
                 <tbody>
                   {activeListings.length > 0 ? activeListings.map((listing: any) => (
                     <tr key={listing.id} className="border-b border-[#f0f2f2] hover:bg-[#f7fafa]">
                       <td className="py-3">
                         <span className={`px-2 py-0.5 text-[11px] font-bold ${listing.status === 'ACTIVE' ? 'text-[#007600]' : 'text-[#CC0C39]'}`}>{listing.status}</span>
                       </td>
                       <td className="py-3">
                         <div className="w-[40px] h-[40px] border border-[#D5D9D9] flex items-center justify-center p-0.5 bg-white">
                           <img src={listing.product?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80'} className="max-w-full max-h-full object-contain" />
                         </div>
                       </td>
                       <td className="py-3 font-medium text-[#007185] hover:underline cursor-pointer">{listing.product?.name || listing.title}</td>
                       <td className="py-3 text-[#565959]">{listing.conditionGrade || 'USED'}</td>
                       <td className="py-3 text-right">₹{Number(listing.price).toFixed(2)}</td>
                       <td className="py-3 text-right">{listing.quantity}</td>
                     </tr>
                   )) : (
                     <tr><td colSpan={6} className="py-6 text-center text-[#565959]">No inventory found.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
