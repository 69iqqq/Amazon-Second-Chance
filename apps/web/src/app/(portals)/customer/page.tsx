import { prisma } from '@/lib/prisma';
import React from 'react';
import Link from 'next/link';
import { Leaf, Star, Cloud, Heart, Recycle } from 'lucide-react';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { auth } from '@clerk/nextjs/server';
import MapWrapper from '@/components/shared/MapWrapper';

export default async function CustomerDashboard() {
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

  const refurbishedListings = await (prisma.listing as any).findMany({
    where: { status: 'ACTIVE', listingType: 'REFURBISHED' },
    include: { product: { include: { images: true } } },
    orderBy: { price: 'desc' },
    take: 15,
  });

  const affordableListings = await (prisma.listing as any).findMany({
    where: { status: 'ACTIVE', listingType: 'PRE_OWNED' },
    include: { product: { include: { images: true } } },
    orderBy: { price: 'asc' },
    take: 15,
  });

  const recentInteractions = await (prisma as any).userInteraction.findMany({
    where: { userId: dbUser?.id, action: 'VIEWED' },
    include: { product: { include: { images: true, listings: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const uniqueRecentProducts = Array.from(new Set(recentInteractions.map((i: any) => i.productId)))
    .map(id => recentInteractions.find((i: any) => i.productId === id)?.product)
    .filter(Boolean)
    .slice(0, 10);

  const nearbyPartnersRaw = await prisma.partner.findMany({
    where: {
      type: { in: ['KIRANA_HUB', 'NGO'] },
      status: 'ACTIVE'
    },
    take: 6
  });

  const nearbyPartners = nearbyPartnersRaw.map(p => ({
    ...p,
    latitude: p.latitude ? Number(p.latitude) : null,
    longitude: p.longitude ? Number(p.longitude) : null,
  }));

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#0F1111] font-sans pb-20">
      {/* Dashboard Hero Section */}
      <div className="bg-white border-b border-[#D5D9D9] pb-6 pt-4">
        <div className="max-w-[1500px] mx-auto px-4 relative z-10">
          <div className="flex items-center text-[13px] text-[#565959] mb-3">
            <Link href="#" className="hover:underline text-[#007185]">Your Account</Link> 
            <span className="mx-2 text-[#565959]">&rsaquo;</span> 
            <span className="text-[#c45500] font-bold">Amazon 2nd Chance</span>
          </div>
          <h1 className="text-[32px] font-medium text-[#0f1111] mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Donut Chart Breakdown */}
            <div className="lg:col-span-4 bg-white border-0 shadow-md rounded-none p-6 flex flex-col items-center justify-center relative overflow-hidden group">
              {/* Generated Abstract Background */}
              <img src="/images/bg-gray.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000 pointer-events-none mix-blend-multiply" />
              
              <h2 className="text-[17px] font-bold text-[#0f1111] mb-6 w-full text-left relative z-10 uppercase tracking-wide">Items Processed</h2>
              <div className="relative w-48 h-48 flex items-center justify-center z-10">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-md">
                  {/* Background Ring */}
                  <path className="text-gray-200" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" strokeWidth="4" fill="none" />
                  {/* Recycled (41.2%) */}
                  <path className="text-[#007600]" strokeDasharray="41.2, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                  {/* Resold (35.3%) */}
                  <path className="text-[#007185]" strokeDasharray="35.3, 100" strokeDashoffset="-41.2" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                  {/* Donated (23.5%) */}
                  <path className="text-[#C7511F]" strokeDasharray="23.5, 100" strokeDashoffset="-76.5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[32px] font-bold text-[#0f1111] leading-none">34</span>
                  <span className="text-[12px] text-[#565959]">Total Items</span>
                </div>
              </div>
              <div className="w-full flex justify-between mt-6 px-2 text-[13px] font-medium">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#007600]" />Recycled</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#007185]" />Resold</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#C7511F]" />Donated</div>
              </div>
            </div>

            {/* Right: Key Stats Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Green Credits Card */}
              <div className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-none p-6 relative overflow-hidden cursor-pointer group">
                <img src="/images/bg-green.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 pointer-events-none mix-blend-multiply" />
                <div className="relative z-10 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-[15px] font-medium text-[#565959] mb-1">Total Green Credits</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[42px] font-bold text-[#007600] tracking-tight">250</span>
                      <span className="text-[13px] font-bold text-[#007600] bg-[#007600]/10 px-2 py-1 rounded-full">+100 this week</span>
                    </div>
                    <p className="text-[13px] text-[#565959] mt-3">Redeemable for ₹250 off your next Amazon Renewed purchase.</p>
                  </div>
                  <img src="/icons/green-credits.png" alt="Green Credits" className="w-20 h-20 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>

              {/* CO2 Emissions Card */}
              <div className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-none p-6 relative overflow-hidden cursor-pointer group">
                <img src="/images/bg-blue.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 pointer-events-none mix-blend-multiply" />
                <div className="relative z-10 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-[15px] font-medium text-[#565959] mb-1">CO₂ Emissions Saved</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[42px] font-bold text-[#0f1111] tracking-tight">45.2</span>
                      <span className="text-[15px] font-medium text-[#565959]">kg</span>
                    </div>
                    <p className="text-[13px] text-[#565959] mt-3">Equivalent to planting 2 trees or driving 180 fewer miles.</p>
                  </div>
                  <img src="/icons/co2.png" alt="CO2 Emissions" className="w-20 h-20 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>

              {/* Recycled Weight Card */}
              <div className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-none p-6 relative overflow-hidden cursor-pointer group">
                <img src="/images/bg-gray.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 pointer-events-none mix-blend-multiply" />
                <div className="relative z-10 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-[15px] font-medium text-[#565959] mb-1">E-Waste Recycled</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[42px] font-bold text-[#0f1111] tracking-tight">8.4</span>
                      <span className="text-[15px] font-medium text-[#565959]">lbs</span>
                    </div>
                    <p className="text-[13px] text-[#565959] mt-3">Diverted from landfills via Kirana Hub drop-offs.</p>
                  </div>
                  <img src="/icons/ewaste.png" alt="E-Waste Recycled" className="w-20 h-20 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>

              {/* Value Recovered Card */}
              <div className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-none p-6 relative overflow-hidden cursor-pointer group">
                <img src="/images/bg-orange.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 pointer-events-none mix-blend-multiply" />
                <div className="relative z-10 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-[15px] font-medium text-[#565959] mb-1">Total Value Recovered</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[42px] font-bold text-[#0f1111] tracking-tight">₹12,450</span>
                    </div>
                    <p className="text-[13px] text-[#565959] mt-3">From reselling and trading in your pre-owned electronics.</p>
                  </div>
                  <img src="/icons/value.png" alt="Value Recovered" className="w-20 h-20 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Feed Section (Amazon Base App Aesthetic) */}
      <main className="max-w-[1500px] mx-auto px-4 mt-6">

        {/* Map Section: Locate Nearby Hubs */}
        <div className="w-full bg-white border-0 shadow-md rounded-none p-6 pt-5 pb-8 mb-5 relative overflow-hidden">
          <img src="/images/bg-gray.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none mix-blend-multiply" />
          
          <div className="flex items-baseline gap-4 mb-5 relative z-10">
            <h2 className="text-[21px] font-bold text-[#0F1111] uppercase tracking-wide">Locate Kirana Hub and NGO near you</h2>
            <Link href="#" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline uppercase tracking-wide font-bold">View full map</Link>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 relative z-10">
            <div className="w-full md:w-[65%] rounded-none overflow-hidden shadow-sm relative h-[400px] border-0">
              {/* Custom Leaflet Map Centered on Agartala with Only Relevant Pins */}
              <MapWrapper partners={nearbyPartners} />
            </div>
            
            <div className="w-full md:w-[35%] flex flex-col gap-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="font-bold text-[15px] text-[#0f1111] sticky top-0 bg-white z-10 pb-3 mb-2 border-b border-[#f0f2f2] uppercase tracking-wide">
                Nearest Drop-off Points
              </h3>
              {nearbyPartners.length > 0 ? nearbyPartners.map((partner: any) => (
                <div key={partner.id} className="bg-white hover:bg-[#f7fafa] p-4 transition-colors cursor-pointer flex flex-col shrink-0 border-b border-[#f0f2f2] min-h-[90px]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[#007185] text-[14px] leading-tight hover:text-[#C7511F] hover:underline pr-2">{partner.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 whitespace-nowrap bg-[#f0f2f2] text-[#0f1111] border border-[#D5D9D9] rounded-sm">
                      {partner.type === 'NGO' ? 'NGO' : 'Kirana Hub'}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#565959] leading-snug block mb-1">{partner.address}, {partner.city}</span>
                  <div className="mt-auto text-[12px] font-bold text-[#0f1111] flex items-center gap-1 pt-1">
                    <span className="text-[#007600]">Open now</span> • {(Math.random() * 3 + 0.5).toFixed(1)} km
                  </div>
                </div>
              )) : (
                <div className="text-[13px] text-[#565959]">No locations found nearby.</div>
              )}
            </div>
          </div>
        </div>

        {/* Row 1: Premium Pre-Owned & Refurbished */}
        {refurbishedListings.length > 0 && (
          <div className="w-full bg-white border border-[#D5D9D9] rounded-none p-5 pt-4 pb-6 mb-5 relative">
            <div className="flex items-baseline gap-4 mb-2">
              <h2 className="text-[21px] font-bold text-[#0F1111]">Premium Pre-Owned & Refurbished</h2>
              <Link href="/second-life/buy" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline">Explore all</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {refurbishedListings.map((item: any, idx: number) => (
                <Link href={`/dp/${item.id}?ref=second-life`} key={idx} className="min-w-[200px] w-[200px] flex flex-col items-center cursor-pointer group snap-start relative">
                  <div className="w-full h-[200px] bg-[#f7f7f7] mb-2 flex items-center justify-center p-2 relative overflow-hidden rounded-none">
                    <ImageWithFallback src={item.product?.images?.[0]?.imageUrl} alt="Product" className="max-h-[160px] max-w-[160px] object-contain group-hover:scale-105 transition" />
                    <span className="absolute bottom-2 left-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-none shadow-sm">Amazon Certified</span>
                  </div>
                  <span className="text-[13px] text-[#007185] line-clamp-2 w-full leading-snug group-hover:text-[#C7511F] group-hover:underline">{item.title}</span>
                  <div className="w-full flex text-[#ffa41c] text-[12px] my-0.5">★★★★☆ <span className="text-[#007185] ml-1">4.5</span></div>
                  <span className="text-[#B12704] text-[17px] font-medium mt-auto w-full text-left">₹{Number(item.price).toFixed(2)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-white border border-[#D5D9D9] rounded-none p-5 flex flex-col z-20 shadow-sm relative">
            <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Start a Return</h2>
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
               <img src="/icons/return.png" className="w-28 h-28 mb-4 mix-blend-multiply" />
               <p className="text-[13px] text-[#565959]">Use our AI tool to quickly identify items from your orders and recommend resale, donation, or recycling.</p>
            </div>
            <Link href="/customer/returns/new" className="text-center w-full bg-[#FFD814] border border-[#FCD200] rounded-none py-1.5 text-[13px] shadow-sm hover:bg-[#F7CA00] mt-4 font-medium">
              Start now
            </Link>
          </div>

          <div className="bg-white border border-[#D5D9D9] rounded-none p-5 flex flex-col z-20 shadow-sm relative">
            <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Sell Your Items</h2>
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
               <img src="/icons/sell.png" className="w-28 h-28 mb-4 mix-blend-multiply" />
               <p className="text-[13px] text-[#565959]">Turn your unused electronics and goods into cash by listing them on Amazon 2nd Chance.</p>
            </div>
            <Link href="/second-life/sell" className="text-center w-full border border-[#D5D9D9] rounded-none py-1.5 text-[13px] shadow-sm hover:bg-[#f7fafa] mt-4 font-medium">
              Create a listing
            </Link>
          </div>

          <div className="bg-white border border-[#D5D9D9] rounded-none p-5 flex flex-col z-20 shadow-sm relative">
            <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Manage Orders</h2>
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
               <img src="/icons/package.png" className="w-28 h-28 mb-4 mix-blend-multiply" />
               <p className="text-[13px] text-[#565959]">Track your packages, manage returns, and view your Amazon 2nd Chance order history.</p>
            </div>
            <Link href="/customer/returns" className="text-center w-full border border-[#D5D9D9] rounded-none py-1.5 text-[13px] shadow-sm hover:bg-[#f7fafa] mt-4 font-medium">
              View your orders
            </Link>
          </div>

          <div className="bg-white border border-[#D5D9D9] rounded-none p-5 flex flex-col z-20 shadow-sm relative">
            <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Green Credits</h2>
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
               <img src="/icons/earnings.png" className="w-28 h-28 mb-4 mix-blend-multiply" />
               <p className="text-[13px] text-[#565959]">Redeem your 250 credits for discounts on future Amazon purchases.</p>
            </div>
            <Link href="/customer/credits" className="text-center w-full border border-[#D5D9D9] rounded-none py-1.5 text-[13px] shadow-sm hover:bg-[#f7fafa] mt-4 font-medium">
              View balance
            </Link>
          </div>
        </div>

        {/* Row 1.5: Your Recent Activity */}
        {uniqueRecentProducts.length > 0 && (
          <div className="w-full bg-white border border-[#D5D9D9] rounded-none p-5 pt-4 pb-6 mb-5 relative">
            <div className="flex items-baseline gap-4 mb-2">
              <h2 className="text-[21px] font-bold text-[#0F1111]">Your Recent Activity</h2>
              <Link href="#" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline">View history</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {uniqueRecentProducts.map((product: any, idx: number) => {
                const minPrice = product.listings?.[0]?.price || product.currentValue || product.originalPrice;
                return (
                  <Link href={`/dp/${product.listings?.[0]?.id || product.id}?ref=second-life`} key={idx} className="min-w-[200px] w-[200px] flex flex-col items-center cursor-pointer group snap-start relative">
                    <div className="w-full h-[200px] bg-white mb-2 flex items-center justify-center p-2 relative overflow-hidden rounded-none border border-[#D5D9D9]">
                      <ImageWithFallback src={product.images?.[0]?.imageUrl} alt="Product" className="max-h-[160px] max-w-[160px] object-contain group-hover:scale-105 transition" />
                    </div>
                    <span className="text-[13px] text-[#007185] line-clamp-2 w-full leading-snug group-hover:text-[#C7511F] group-hover:underline">{product.name}</span>
                    <span className="text-[#B12704] text-[17px] font-medium mt-auto w-full text-left">From ₹{Number(minPrice).toFixed(2)}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Row 2: Affordable Pre-Owned Items */}
        {affordableListings.length > 0 && (
          <div className="w-full bg-white border border-[#D5D9D9] rounded-none p-5 pt-4 pb-6 mb-5 relative">
            <div className="flex items-baseline gap-4 mb-2">
              <h2 className="text-[21px] font-bold text-[#0F1111]">Affordable Pre-Owned Finds</h2>
              <Link href="/second-life/buy" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline">Explore more</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {affordableListings.map((item: any, idx: number) => (
                <Link href={`/dp/${item.id}?ref=second-life`} key={idx} className="min-w-[200px] w-[200px] flex flex-col items-center cursor-pointer group snap-start relative">
                  <div className="w-full h-[200px] bg-[#f7f7f7] mb-2 flex items-center justify-center p-2 relative overflow-hidden rounded-none">
                    <ImageWithFallback src={item.product?.images?.[0]?.imageUrl} alt="Product" className="max-h-[160px] max-w-[160px] object-contain group-hover:scale-105 transition" />
                  </div>
                  <span className="text-[13px] text-[#007185] line-clamp-2 w-full leading-snug group-hover:text-[#C7511F] group-hover:underline">{item.title}</span>
                  <div className="w-full flex text-[#ffa41c] text-[12px] my-0.5">★★★☆☆ <span className="text-[#007185] ml-1">3.8</span></div>
                  <span className="text-[#B12704] text-[17px] font-medium mt-auto w-full text-left">₹{Number(item.price).toFixed(2)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
