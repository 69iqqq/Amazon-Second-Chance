"use client";

import React from 'react';
import Link from 'next/link';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';

export function DashboardNavbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
          <img
            src="/logos/amazon-logo.png"
            alt="Amazon Logo"
            className="object-contain h-[40px] w-auto"
          />
        </Link>
      </div>

      {/* Right: Action Button & Profile */}
      <div className="flex items-center gap-6">
        <Link 
          href="/second-life" 
          className="text-[#007185] hover:text-[#c45500] hover:underline font-bold text-[14px]"
        >
          Exit to Amazon Shopping
        </Link>
        <Link 
          href="/evaluate" 
          className="bg-[#ff9900] hover:bg-[#e68a00] text-black font-bold py-2 px-8 rounded-full shadow-sm transition-transform hover:scale-105 text-[15px]"
        >
          Get Device Value
        </Link>
        
        {isSignedIn && (
          <UserButton />
        )}
        {!isSignedIn && (
          <SignInButton mode="modal">
            <button className="text-[15px] font-bold text-gray-800 hover:text-[#ff9900] transition-colors">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
