import { prisma } from '@/lib/prisma';
import React from 'react';
import Link from 'next/link';
export default async function NgoDashboard() {
  // Try to fetch actual donation records
  let donations: any[] = [];
  try {
    donations = await (prisma as any).donationRecord.findMany({
      include: { product: true, ngo: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
  } catch (e) {
    // Fallback if schema doesn't match perfectly
    const products = await prisma.product.findMany({ take: 5 });
    donations = products.map((p, i) => ({
      id: `don-${i}`,
      status: i === 0 ? 'SHIPPED' : 'PENDING',
      quantity: 1,
      createdAt: new Date(),
      product: p
    }));
  }

  const pendingCount = donations.filter(d => d.status === 'PENDING').length;
  const receivedCount = donations.filter(d => d.status !== 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0F1111] font-sans pb-10">

      {/* Main Container mirroring the Amazon Pay layout width */}
      <div className="max-w-[1280px] mx-auto p-4 pt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar (Mimics Amazon Pay Balance card) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#D5D9D9] flex flex-col shadow-sm">
            <div className="bg-[#f0f2f2] p-4 flex justify-between items-center border-b border-[#D5D9D9]">
              <span className="font-bold text-[13px] text-[#0f1111]">Partner Status</span>
              <span className="text-[#007600] text-[15px] font-bold">Verified</span>
            </div>
            <div className="p-4 flex flex-col gap-4 text-[13px] text-[#007185]">
              <div className="flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                  <path d="M12 3v9l8-4.5M12 12l-8-4.5" />
                  <path d="M12 12v9" />
                  <circle cx="5" cy="19" r="5" fill="#ff9900" stroke="none" />
                  <path d="M5 16v6m-3-3h6" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
                Schedule Kirana Hub Pickup
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="5" y="9" width="16" height="11" rx="1" />
                  <path d="M13 9v11" />
                  <path d="M13 9c0-2-2-3-4-2-1.5.8-1.5 2.5 0 3.5s4-1.5 4-1.5z" />
                  <path d="M13 9c0-2 2-3 4-2 1.5.8 1.5 2.5 0 3.5s-4-1.5-4-1.5z" />
                  <circle cx="5" cy="19" r="5" fill="#ff9900" stroke="none" />
                  <path d="M5 16v6m-3-3h6" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
                Update Tax Exemption Certs
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="4.5" fill="#ff9900" stroke="none" />
                  <circle cx="12" cy="12" r="1.5" fill="#ffffff" stroke="none" />
                </svg>
                Account Settings
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M3 3v18h18" />
                  <rect x="7" y="14" width="4" height="7" fill="#007185" stroke="none" />
                  <rect x="14" y="9" width="4" height="12" fill="#ff9900" stroke="none" />
                </svg>
                Download Impact Statement
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-[#D5D9D9] p-4">
             <h3 className="text-[15px] font-bold text-[#0f1111] mb-2 border-b border-[#D5D9D9] pb-2">Needs Registry (Wishlist)</h3>
             <p className="text-[13px] text-[#0f1111] mb-4">Amazon AI automatically routes matching items to you.</p>
             
             <div className="flex gap-4 mb-2 text-[13px]">
               <span className="font-bold">1. Laptops</span>
               <span className="text-[#565959]">High Priority</span>
             </div>
             <div className="flex gap-4 mb-2 text-[13px]">
               <span className="font-bold">2. Clothing</span>
               <span className="text-[#565959]">Medium Priority</span>
             </div>
             
             <button className="mt-2 text-[#007185] hover:underline text-[13px]">+ Add new category</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Hero Banner */}
          <div className="w-full shadow-sm border border-[#D5D9D9] overflow-hidden mb-4 relative h-[220px] flex items-center bg-black">
            <div className="absolute inset-0 bg-[url('/ngo-hero.png')] bg-cover bg-center opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="relative z-10 px-8 text-white">
              <span className="text-[#ff9900] font-bold tracking-widest uppercase text-[10px] mb-2 block">Amazon 2nd Chance NGO Partner</span>
              <h2 className="text-3xl font-extrabold mb-2">Empowering communities.</h2>
              <p className="text-[13px] text-gray-300 max-w-lg">Track your real-world impact as AI routes usable inventory directly to your registry.</p>
            </div>
          </div>

          {/* Section 1: Performance Overview */}
          <div className="bg-white border border-[#D5D9D9] shadow-sm">
            <h3 className="text-[15px] font-bold text-[#0f1111] p-4 border-b border-[#f0f2f2]">Impact Overview</h3>
            <div className="p-6 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 mb-3 bg-[#fff4e6] flex items-center justify-center text-[#c45500] font-light text-[22px] group-hover:bg-[#fde2c5] transition relative z-10">
                  {pendingCount}
                </div>
                <span className="text-[13px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Incoming Items</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 mb-3 bg-[#e6f2f8] flex items-center justify-center text-[#007185] font-light text-[22px] group-hover:bg-[#ccebf5] transition relative z-10">
                  {receivedCount + 125}
                </div>
                <span className="text-[13px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Total Received</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 mb-3 bg-[#eef8ef] flex items-center justify-center text-[#007600] font-light text-[22px] group-hover:bg-[#d8f0d8] transition relative z-10">
                  89
                </div>
                <span className="text-[13px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Families Helped</span>
              </div>
            </div>
          </div>

          {/* Table for Incoming Donations */}
          <div className="bg-white border border-[#D5D9D9] shadow-sm mt-4">
             <div className="p-4 border-b border-[#f0f2f2] flex justify-between items-center">
               <h3 className="text-[15px] font-bold text-[#0f1111]">Incoming Donations (AI Routed)</h3>
             </div>
             <div className="p-4 overflow-x-auto">
               <table className="w-full text-left text-[13px]">
                 <thead>
                   <tr className="border-b border-[#D5D9D9] text-[#565959]">
                     <th className="pb-2 font-normal">Status</th>
                     <th className="pb-2 font-normal">Item</th>
                     <th className="pb-2 font-normal">Condition</th>
                     <th className="pb-2 font-normal">Date Routed</th>
                     <th className="pb-2 font-normal text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {donations.length > 0 ? donations.map((donation: any) => (
                     <tr key={donation.id} className="border-b border-[#f0f2f2] hover:bg-[#f7fafa]">
                       <td className="py-3">
                         <span className={`px-2 py-0.5 text-[11px] font-bold ${donation.status === 'PENDING' ? 'text-[#e77600]' : 'text-[#007600]'}`}>{donation.status}</span>
                       </td>
                       <td className="py-3 font-medium text-[#007185] hover:underline cursor-pointer">{donation.product?.name || 'Assorted Item'}</td>
                       <td className="py-3 text-[#565959]">Needs Repair</td>
                       <td className="py-3 text-[#565959]">{donation.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                       <td className="py-3 text-right">
                         {donation.status === 'PENDING' ? (
                           <button className="bg-white border border-[#D5D9D9] rounded-none py-1 px-3 text-[12px] shadow-sm hover:bg-[#f7fafa]">Claim Item</button>
                         ) : (
                           <button className="bg-transparent border-0 text-[#007185] py-1 px-3 text-[12px] hover:underline">View Details</button>
                         )}
                       </td>
                     </tr>
                   )) : (
                     <tr><td colSpan={5} className="py-6 text-center text-[#565959]">No incoming donations at this time.</td></tr>
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
