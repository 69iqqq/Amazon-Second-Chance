import { prisma } from '@/lib/prisma';
import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { registerSeller } from '@/actions/seller';
import Link from 'next/link';

export default async function SellerLoginPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in?redirect_url=/seller/login');
  }

  // Find user in our DB
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return <div>User not found in database. Please log in again.</div>;
  }

  // Check if SellerProfile exists
  // @ts-ignore
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
  });

  // If already a seller, redirect directly to Seller Dashboard
  if (sellerProfile) {
    redirect('/seller');
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col items-center pt-10 font-sans">
      <Link href="/" className="mb-6">
        <img src="/logos/green-a-logo.png" alt="Amazon 2nd Chance" className="h-10 w-auto object-contain" />
      </Link>

      <div className="bg-white p-8 border border-[#D5D9D9] shadow-sm rounded-none w-full max-w-[450px]">
        <h1 className="text-[28px] font-medium text-[#0f1111] mb-2 leading-tight">Register as a 2nd Chance Seller</h1>
        <p className="text-[13px] text-[#565959] mb-6">You are signed in as <strong>{user.email}</strong>. Please provide your business details to start selling pre-owned, used, and refurbished items on Amazon 2nd Chance.</p>

        <form action={registerSeller} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label htmlFor="businessName" className="text-[13px] font-bold text-[#0f1111]">Legal Business Name</label>
            <input 
              type="text" 
              id="businessName" 
              name="businessName" 
              required
              className="border border-[#a6a6a6] rounded-[3px] p-2 focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="taxId" className="text-[13px] font-bold text-[#0f1111]">Tax ID / GSTIN (Optional)</label>
            <input 
              type="text" 
              id="taxId" 
              name="taxId" 
              className="border border-[#a6a6a6] rounded-[3px] p-2 focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="storeDescription" className="text-[13px] font-bold text-[#0f1111]">Store Description (Optional)</label>
            <textarea 
              id="storeDescription" 
              name="storeDescription" 
              rows={3}
              className="border border-[#a6a6a6] rounded-[3px] p-2 focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-1.5 mt-2 text-[13px] font-bold shadow-sm"
          >
            Agree and Create Seller Account
          </button>
        </form>

        <p className="text-[11px] text-[#565959] mt-6">
          By registering, you agree to the Amazon Services Business Solutions Agreement and Amazon's Privacy Notice.
        </p>
      </div>
      
      {/* Footer Links */}
      <div className="flex gap-6 mt-8 text-[11px] text-[#007185]">
        <Link href="#" className="hover:text-[#c45500] hover:underline">Conditions of Use</Link>
        <Link href="#" className="hover:text-[#c45500] hover:underline">Privacy Notice</Link>
        <Link href="#" className="hover:text-[#c45500] hover:underline">Help</Link>
      </div>
      <p className="text-[11px] text-[#565959] mt-2">© 1996-2026, Amazon.com, Inc. or its affiliates</p>
    </div>
  );
}
