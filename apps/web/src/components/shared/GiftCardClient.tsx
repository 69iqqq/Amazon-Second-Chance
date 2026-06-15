'use client';

import { useState } from 'react';
import { RedeemButton } from '@/components/shared/RedeemButton';

const OCCASIONS = [
  'Diwali', 'Birthday', 'Wedding', 'Congratulations', 'Thank You', 'Baby Shower',
  'House Warming', 'For Partner', 'For Colleagues', 'For Parents', 'For Siblings',
  'New Year', 'Christmas', 'Other Festivals'
];

export function GiftCardClient({ 
  initialAmount, 
  balance, 
  title, 
  images,
  isPrime
}: { 
  initialAmount: string, 
  balance: number, 
  title: string, 
  images: { src: string, name: string }[],
  isPrime: boolean
}) {
  const [selectedAmount, setSelectedAmount] = useState(initialAmount);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const numericAmount = Number(selectedAmount.replace(/,/g, ''));

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full mt-4">
      
      {/* Left Column (Card Preview) */}
      <div className="w-full lg:w-[450px] flex-shrink-0">
        <div className="bg-white border border-gray-300 rounded-sm shadow-md flex flex-col p-3 pb-4">
          {/* The cover image */}
          <div className="relative">
            <img src={images[selectedImageIndex].src} alt="Cover" className="w-full h-[280px] object-cover rounded-sm" />
            <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white text-gray-700">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
            </button>
          </div>
          
          {/* The details section */}
          <div className="flex border-t border-gray-200 mt-3 pt-4 pb-2 px-2">
            <div className="flex-1 flex flex-col items-center justify-center border-r border-gray-200 px-2 text-center">
               {isPrime ? (
                 <>
                   <div className="font-bold text-2xl tracking-tight leading-none text-[#00A8E1]">prime</div>
                   <div className="text-[13px] text-gray-700 mt-1">Subscription</div>
                   <div className="text-[11px] text-gray-400 mt-2">Activation Code:</div>
                   <div className="text-[12px] text-gray-500 tracking-widest mt-0.5">XXXX-XXXXXX</div>
                 </>
               ) : (
                 <>
                   <div className="font-bold text-xl tracking-tight leading-none text-[#0f1111]">amazon<span className="font-normal text-gray-500">pay</span></div>
                   <div className="text-[15px] text-gray-700 mt-0.5">gift card</div>
                   <div className="text-[11px] text-gray-400 mt-2">Gift Card Code:</div>
                   <div className="text-[12px] text-gray-500 tracking-widest mt-0.5">XXXX-XXXXXX-XXXX</div>
                 </>
               )}
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-2">
               <div className="text-[32px] font-normal text-[#0f1111] leading-none mb-3">₹0</div>
               <button className="bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-sm text-[11px] px-4 py-1.5 font-bold shadow-sm flex items-center gap-1 hover:from-[#f5d78e] hover:to-[#eeb933]">
                 Add to My Account <span className="bg-blue-800 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">▶</span>
               </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-4 pt-4 px-4 text-[14px] text-gray-600">
            Your personal message will appear here.
          </div>
        </div>
        <div className="text-center mt-3 text-[13px] text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">Click to see full view</div>
      </div>

      {/* Right Column (Details & Selection) */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1">
          <div className="text-[14px] text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer mb-1">Brand: Amazon Pay</div>
          <h1 className="text-2xl sm:text-[28px] font-normal text-[#0f1111] leading-tight mb-2">{title}</h1>
          <div className="text-[14px] text-[#007185] mb-2 flex items-center gap-1">
            <span>4.5</span> <span className="text-[#ffa41c]">★★★★☆</span> <span>(72,216)</span> <span className="text-gray-300">|</span> <span className="hover:text-[#c7511f] hover:underline cursor-pointer">Search this page</span>
          </div>
          <div className="mb-6 flex items-center gap-2">
            <span className="bg-[#c45500] text-white text-[12px] px-2 py-1 font-medium shadow-sm">#1 Best Seller</span>
            <span className="text-[14px] text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">in Just Because</span>
          </div>
          
          <div className="text-[32px] font-normal text-[#0f1111] mb-1 leading-none">
            {selectedAmount} <span className="text-[16px] font-bold text-emerald-600 align-top relative top-[-12px]">GC</span>
          </div>
          <div className="text-[14px] text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer mb-2">Price history</div>
          <div className="text-[14px] text-[#565959] mb-5">Inclusive of all taxes</div>

          <div className="w-full h-[1px] bg-gray-200 mb-5"></div>

          {!isPrime && (
            <>
              <div className="font-bold text-[14px] mb-2 text-[#0f1111]">Design Type: <span className="font-bold text-[#0f1111]">Standard</span></div>
              <div className="flex gap-3 mb-6">
                <button className="border-2 border-[#007185] bg-[#f2fbfa] text-[#0f1111] px-5 py-2 text-[14px] rounded-lg font-bold shadow-sm">Standard</button>
                <button className="border border-gray-300 bg-white hover:bg-gray-50 text-[#0f1111] px-5 py-2 text-[14px] rounded-lg shadow-sm font-medium transition">Add Photo</button>
              </div>

              <div className="font-bold text-[14px] mb-3 text-[#0f1111]">Occasion: <span className="font-bold text-[#0f1111]">Others</span></div>
              <div className="flex flex-wrap gap-2.5 mb-6">
                {OCCASIONS.map(occ => (
                  <button key={occ} className="border border-gray-300 bg-white hover:bg-gray-50 text-[14px] px-3.5 py-1.5 rounded-lg shadow-sm font-medium transition">{occ}</button>
                ))}
                <button className="border-2 border-[#007185] bg-[#f2fbfa] text-[#0f1111] text-[14px] px-3.5 py-1.5 rounded-lg font-bold shadow-sm">Others</button>
              </div>

              <div className="font-bold text-[14px] mb-3 text-[#0f1111]">Design Name: <span className="font-bold text-[#0f1111]">{images[selectedImageIndex].name}</span></div>
              <div className="flex flex-wrap gap-2.5 mb-8">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-[68px] h-[46px] rounded-lg p-0.5 cursor-pointer border-2 transition ${selectedImageIndex === idx ? 'border-[#e77600] ring-1 ring-[#e77600]' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={img.src} className="w-full h-full object-cover rounded-[5px]" />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="font-bold text-[14px] mb-3 text-[#0f1111]">Gift amount (10.00 GC - 10,000.00 GC):</div>
          <div className="flex items-center gap-2.5 mb-8 flex-wrap">
            {['500', '1,000', '2,000', '5,000', '7,500', '10,000'].map(amt => (
              <button 
                key={amt} 
                onClick={() => setSelectedAmount(amt)}
                className={`border rounded-lg px-4 py-2 text-[14px] transition shadow-sm ${amt === selectedAmount ? 'border-2 border-[#e77600] bg-[#fdf8f2] font-bold text-[#0f1111] px-[15px] py-[7px]' : 'border-gray-300 bg-white hover:bg-gray-50 font-medium'}`}
              >
                {amt} <span className="text-[10px] text-emerald-600 font-bold ml-0.5">GC</span>
              </button>
            ))}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden h-[38px] shadow-sm focus-within:border-[#e77600] focus-within:ring-1 focus-within:ring-[#e77600] transition">
               <div className="bg-gray-50 px-3 flex items-center border-r border-gray-300 text-[14px] font-bold text-emerald-600">GC</div>
               <input type="text" placeholder="Other amount" className="w-[120px] px-3 outline-none text-[14px]" />
            </div>
          </div>

          <div className="font-bold text-[14px] mb-3 text-[#0f1111]">Delivery:</div>
          <div className="flex gap-2.5 mb-6">
            <button className="border-2 border-[#007185] bg-[#f2fbfa] text-[14px] font-bold px-4 py-2 rounded-lg shadow-sm text-[#0f1111]">Shareable link</button>
            <button className="border border-gray-300 bg-white hover:bg-gray-50 text-[14px] font-medium px-4 py-2 rounded-lg shadow-sm transition">Email</button>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="font-bold text-[14px] text-[#0f1111]">Share your gift card using</span>
            <div className="flex -space-x-1">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] border border-white z-20">W</div>
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] border border-white z-10">M</div>
            </div>
          </div>

          <ul className="list-disc pl-5 text-[14px] text-[#0f1111] space-y-2 mb-8">
            <li>Amazon Pay Gift Cards are valid for 365 days from the date of purchase and carry no fees</li>
            <li>Gift cards have great designs for every occasion. Customers can write down their personal wishes for their loved ones</li>
            <li>Customers can choose any denomination ranging from 10 GC - 10000 GC as a gifting amount</li>
          </ul>
        </div>

        {/* Action Box (Buy Box) */}
        <div className="w-full lg:w-[280px] flex-shrink-0">
           <div className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col sticky top-4">
              <div className="text-[28px] text-[#0f1111] font-normal mb-1 flex items-center gap-1">
                {selectedAmount} <span className="text-emerald-600 font-bold text-[16px]">GC</span>
              </div>
              
              <div className="text-[14px] text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer mb-5">FREE delivery</div>

              <RedeemButton 
                 amount={numericAmount} 
                 reason={`${title} (${selectedAmount})`} 
                 disabled={balance < numericAmount}
                 className="w-full py-2.5 rounded-full text-[14px]"
              />

              <div className="w-full h-[1px] bg-gray-200 my-4"></div>

              <div className="text-[14px] text-[#565959] grid grid-cols-[100px_1fr] gap-y-2">
                 <span>Shipper / Seller</span>
                 <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">Pine Labs Pvt. Ltd.</span>
                 <span>Payment</span>
                 <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">Secure transaction</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
