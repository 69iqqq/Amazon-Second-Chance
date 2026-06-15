import { prisma } from '@/lib/prisma';
import React from 'react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export default async function ReturnsAndOrders() {
  let dbUser = null;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) {
      dbUser = await prisma.user.findUnique({ where: { clerkId } });
    }
  } catch (e) {}

  if (!dbUser) {
    dbUser = await prisma.user.findFirst();
  }

  const activeListings = dbUser ? await prisma.listing.findMany({
    where: { sellerId: dbUser.id, status: 'ACTIVE' },
    include: { product: { include: { images: true } } },
    orderBy: { createdAt: 'desc' }
  }) : [];

  return (
    <div className="min-h-screen bg-white text-[#0F1111] font-sans pb-20">
      <div className="max-w-[1000px] mx-auto px-4 py-4 pt-6">
        <div className="flex items-center text-[13px] text-[#565959] mb-4">
          <Link href="/customer" className="hover:underline text-[#007185]">Your Account</Link> 
          <span className="mx-2 text-[#565959]">&rsaquo;</span> 
          <span className="text-[#c45500] font-bold">Your Orders & Listings</span>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-[28px] font-normal text-[#0f1111]">Your Orders</h1>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <input type="text" placeholder="Search all orders" className="border border-[#888c8c] rounded-[3px] py-1.5 px-3 w-[250px] shadow-[0_1px_2px_rgba(15,17,17,0.15)_inset] text-[13px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition" />
               <button className="bg-[#303333] hover:bg-[#111111] text-white text-[13px] px-4 py-1.5 rounded-[8px] font-bold shadow-sm transition">Search Orders</button>
             </div>
             <Link href="/customer/returns/new" className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0f1111] text-[13px] px-6 py-1.5 rounded-[8px] font-bold shadow-sm transition">
               Start a Return / Drop-off
             </Link>
          </div>
        </div>

        <div className="border-b border-[#D5D9D9] flex gap-6 text-[14px] font-medium mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
           <div className="border-b-2 border-[#e77600] text-[#0f1111] pb-2 font-bold cursor-pointer">Orders</div>
           <div className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer pb-2">Buy Again</div>
           <Link href="/customer/returns/new" className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer pb-2">Return or replace items</Link>
           <div className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer pb-2">Not Yet Shipped</div>
           <div className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer pb-2">Cancelled Orders</div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[14px] font-bold text-[#0f1111]">{activeListings.length + 2} items</span> <span className="text-[14px] text-[#0f1111]">placed in</span> 
          <select className="border border-[#D5D9D9] rounded-[8px] bg-[#f0f2f2] hover:bg-[#e3e6e6] cursor-pointer text-[13px] py-1 px-2 shadow-sm font-medium transition">
             <option>past 30 days</option>
             <option>past 3 months</option>
             <option>2025</option>
          </select>
        </div>

        <div className="space-y-5">
          
          {/* Dynamic DB Listings */}
          {activeListings.map((listing: any) => (
            <div key={listing.id} className="border border-[#D5D9D9] rounded-[8px] overflow-hidden">
              <div className="bg-[#f0f2f2] border-b border-[#D5D9D9] p-3 text-[13px] text-[#565959] flex flex-wrap justify-between gap-4">
                 <div className="flex gap-8">
                   <div>
                     <div className="uppercase">Listed On</div>
                     <div className="text-[#0f1111]">{listing.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                   </div>
                   <div>
                     <div className="uppercase">Listing Price</div>
                     <div className="text-[#0f1111]">${Number(listing.price).toFixed(2)}</div>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="uppercase">Listing # {listing.id.substring(0, 15)}</div>
                   <div className="flex gap-2 justify-end text-[#007185] mt-0.5">
                     <span className="hover:text-[#C7511F] hover:underline cursor-pointer">Manage Listing</span>
                   </div>
                 </div>
              </div>
              <div className="p-4 bg-white flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                   <div className="w-[90px] shrink-0 border border-[#D5D9D9] p-1 flex items-center justify-center">
                      <img src={listing.product?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80'} className="max-h-full max-w-full object-contain" />
                   </div>
                   <div>
                     <h2 className="font-bold text-[18px] text-[#007600] mb-1">Active Listing</h2>
                     <p className="text-[14px] text-[#0f1111] mb-2 max-w-[400px]">Your item is live on Amazon 2nd Chance.</p>
                     <Link href={`/dp/${listing.id}`} className="text-[#007185] hover:text-[#C7511F] hover:underline text-[14px] font-bold block mb-1">{listing.product?.name || listing.title}</Link>
                   </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[220px]">
                   <button className="w-full bg-[#FFD814] border border-[#FCD200] rounded-[8px] py-1.5 px-3 text-[13px] shadow-sm hover:bg-[#F7CA00] font-medium transition text-center">Share Listing</button>
                   <button className="w-full bg-white border border-[#D5D9D9] rounded-[8px] py-1.5 px-3 text-[13px] shadow-sm hover:bg-[#f7fafa] font-medium transition text-center">Edit Listing</button>
                </div>
              </div>
            </div>
          ))}

          {/* Static Order 1: Return Request */}
          <div className="border border-[#D5D9D9] rounded-[8px] overflow-hidden opacity-80">
            <div className="bg-[#f0f2f2] border-b border-[#D5D9D9] p-3 text-[13px] text-[#565959] flex flex-wrap justify-between gap-4">
               <div className="flex gap-8">
                 <div>
                   <div className="uppercase">Order Placed</div>
                   <div className="text-[#0f1111]">May 10, 2025</div>
                 </div>
                 <div>
                   <div className="uppercase">Total</div>
                   <div className="text-[#0f1111]">$0.00 (Return)</div>
                 </div>
                 <div>
                   <div className="uppercase">Ship To</div>
                   <div className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">Alex Bird</div>
                 </div>
               </div>
               <div className="text-right">
                 <div className="uppercase">Order # 114-9812739-812312</div>
                 <div className="flex gap-2 justify-end text-[#007185] mt-0.5">
                   <span className="hover:text-[#C7511F] hover:underline cursor-pointer">View return/refund status</span>
                   <span className="text-[#D5D9D9]">|</span>
                   <span className="hover:text-[#C7511F] hover:underline cursor-pointer">View Invoice</span>
                 </div>
               </div>
            </div>
            <div className="p-4 bg-white flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                 <div className="w-[90px] shrink-0">
                    <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80" className="w-full object-contain" />
                 </div>
                 <div>
                   <h2 className="font-bold text-[18px] text-[#0f1111] mb-1">Return initiated</h2>
                   <p className="text-[14px] text-[#0f1111] mb-2 max-w-[400px]">Your return is in transit. We will issue your refund or Green Credits when we receive your item.</p>
                   <Link href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline text-[14px] font-bold block mb-1">Wireless Noise Cancelling Headphones</Link>
                   <p className="text-[12px] text-[#565959]">Return window closed on Jun 10, 2025</p>
                   <div className="mt-3 flex items-center gap-2">
                     <button className="bg-[#FFD814] border border-[#FCD200] rounded-[8px] py-1.5 px-3 text-[13px] shadow-sm hover:bg-[#F7CA00] font-medium transition">Track package</button>
                   </div>
                 </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[220px]">
                 <button className="w-full bg-white border border-[#D5D9D9] rounded-[8px] py-1.5 px-3 text-[13px] shadow-sm hover:bg-[#f7fafa] font-medium transition text-center">Cancel Return</button>
                 <button className="w-full bg-white border border-[#D5D9D9] rounded-[8px] py-1.5 px-3 text-[13px] shadow-sm hover:bg-[#f7fafa] font-medium transition text-center">Get product support</button>
              </div>
            </div>
          </div>

          {/* Static Order 3: Donation */}
          <div className="border border-[#D5D9D9] rounded-[8px] overflow-hidden opacity-80">
            <div className="bg-[#f0f2f2] border-b border-[#D5D9D9] p-3 text-[13px] text-[#565959] flex flex-wrap justify-between gap-4">
               <div className="flex gap-8">
                 <div>
                   <div className="uppercase">Donated On</div>
                   <div className="text-[#0f1111]">May 5, 2025</div>
                 </div>
                 <div>
                   <div className="uppercase">Green Credits Earned</div>
                   <div className="text-[#0f1111]">150</div>
                 </div>
                 <div>
                   <div className="uppercase">Donated To</div>
                   <div className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">Asha Bhawan NGO</div>
                 </div>
               </div>
               <div className="text-right">
                 <div className="uppercase">Donation # 114-4567890-123456</div>
                 <div className="flex gap-2 justify-end text-[#007185] mt-0.5">
                   <span className="hover:text-[#C7511F] hover:underline cursor-pointer">View receipt</span>
                 </div>
               </div>
            </div>
            <div className="p-4 bg-white flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                 <div className="w-[90px] shrink-0">
                    <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&q=80" className="w-full object-contain" />
                 </div>
                 <div>
                   <h2 className="font-bold text-[18px] text-[#0f1111] mb-1">Delivered</h2>
                   <p className="text-[14px] text-[#0f1111] mb-2 max-w-[400px]">Your item was successfully delivered and donated.</p>
                   <Link href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline text-[14px] font-bold block mb-1">Winter Jacket (Used)</Link>
                 </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[220px]">
                 <button className="w-full bg-white border border-[#D5D9D9] rounded-[8px] py-1.5 px-3 text-[13px] shadow-sm hover:bg-[#f7fafa] font-medium transition text-center">Donate another item</button>
                 <button className="w-full bg-white border border-[#D5D9D9] rounded-[8px] py-1.5 px-3 text-[13px] shadow-sm hover:bg-[#f7fafa] font-medium transition text-center">Share your impact</button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
