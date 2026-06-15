'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, ChevronUp } from 'lucide-react';

export function AmazonFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full text-white font-sans text-[13px] mt-10">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#4A5A6A] py-3.5 text-center transition-colors cursor-pointer"
      >
        Back to top
      </button>

      {/* Main Links Section */}
      <div className="bg-[#232F3E] flex justify-center py-10 px-4">
        <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-[16px] text-white mb-2">Get to Know Us</h3>
            <Link href="#" className="text-[#DDDDDD] hover:underline">About Amazon</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Careers</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Press Releases</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Amazon Science</Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-[16px] text-white mb-2">Connect with Us</h3>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Facebook</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Twitter</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Instagram</Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-[16px] text-white mb-2">Make Money with Us</h3>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Sell on Amazon</Link>
            <Link href="/seller" className="text-white font-bold hover:underline">Sell on Amazon 2nd Chance</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Sell under Amazon Accelerator</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Protect and Build Your Brand</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Amazon Global Selling</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Supply to Amazon</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Become an Affiliate</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Fulfilment by Amazon</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Advertise Your Products</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Amazon Pay on Merchants</Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-[16px] text-white mb-2">Partner with 2nd Chance</h3>
            <Link href="/ngo" className="text-[#DDDDDD] hover:underline">NGO Donation Portal</Link>
            <Link href="/kirana" className="text-[#DDDDDD] hover:underline">Kirana Hub Partner</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Recycling Partner Portal</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Corporate Fleet Trade-in</Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-[16px] text-white mb-2">Let Us Help You</h3>
            <Link href="/customer" className="text-[#DDDDDD] hover:underline">Your Account</Link>
            <Link href="/customer/returns" className="text-[#DDDDDD] hover:underline">Returns Centre</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Recalls and Product Safety Alerts</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">100% Purchase Protection</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Amazon App Download</Link>
            <Link href="#" className="text-[#DDDDDD] hover:underline">Help</Link>
          </div>

        </div>
      </div>

      {/* Locale Row */}
      <div className="bg-[#232F3E] border-t border-[#3A4553] py-8 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">
        <Link href="/" className="mb-2 sm:mb-0 hover:border hover:border-white p-1 rounded-sm border border-transparent">
          <img
            src="/logos/og-amazon.png"
            alt="Amazon Logo"
            className="object-contain h-[30px] w-auto"
          />
        </Link>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-[#848688] rounded-sm hover:border-white">
            <Globe className="w-4 h-4" />
            <span>English</span>
            <span className="text-[10px] ml-1">▼</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-[#848688] rounded-sm hover:border-white">
            <span className="w-4 h-4 rounded-full overflow-hidden bg-white flex items-center justify-center">
              🇮🇳
            </span>
            <span>India</span>
          </button>
        </div>
      </div>

      {/* Subsidiary Links */}
      <div className="bg-[#131A22] flex flex-col items-center py-8 px-4">
        <div className="max-w-[1000px] w-full grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 text-[#999999] text-[11px] mb-8">

          <div className="flex flex-col gap-1 hover:underline cursor-pointer group">
            <span className="text-[#DDDDDD] group-hover:underline">AbeBooks</span>
            <span className="leading-tight">Books, art<br />& collectibles</span>
          </div>

          <div className="flex flex-col gap-1 hover:underline cursor-pointer group">
            <span className="text-[#DDDDDD] group-hover:underline">Amazon Web Services</span>
            <span className="leading-tight">Scalable Cloud<br />Computing Services</span>
          </div>

          <div className="flex flex-col gap-1 hover:underline cursor-pointer group">
            <span className="text-[#DDDDDD] group-hover:underline">Audible</span>
            <span className="leading-tight">Download<br />Audio Books</span>
          </div>

          <div className="flex flex-col gap-1 hover:underline cursor-pointer group">
            <span className="text-[#DDDDDD] group-hover:underline">IMDb</span>
            <span className="leading-tight">Movies, TV<br />& Celebrities</span>
          </div>

          <div className="flex flex-col gap-1 hover:underline cursor-pointer group">
            <span className="text-[#DDDDDD] group-hover:underline">Shopbop</span>
            <span className="leading-tight">Designer<br />Fashion Brands</span>
          </div>

          <div className="flex flex-col gap-1 hover:underline cursor-pointer group">
            <span className="text-[#DDDDDD] group-hover:underline">Amazon Business</span>
            <span className="leading-tight">Everything For<br />Your Business</span>
          </div>

          <div className="flex flex-col gap-1 hover:underline cursor-pointer group">
            <span className="text-[#DDDDDD] group-hover:underline">Prime Now</span>
            <span className="leading-tight">2-Hour Delivery<br />on Everyday Items</span>
          </div>

          <div className="flex flex-col gap-1 hover:underline cursor-pointer group">
            <span className="text-[#DDDDDD] group-hover:underline">Amazon Prime Music</span>
            <span className="leading-tight">100 million songs, ad-free<br />Over 15 million podcast episodes</span>
          </div>

        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center text-[#DDDDDD] text-[12px]">
          <div className="flex gap-4 mb-1">
            <Link href="#" className="hover:underline">Conditions of Use & Sale</Link>
            <Link href="#" className="hover:underline">Privacy Notice</Link>
            <Link href="#" className="hover:underline">Interest-Based Ads</Link>
          </div>
          <span>© 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates</span>
        </div>
      </div>
    </footer>
  );
}
