'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { MapPin, ShieldCheck, RefreshCcw, Truck, Award } from 'lucide-react';

export default function ClientPDP({ listing, relatedListings }: { listing: any, relatedListings: any[] }) {
  const [mainImage, setMainImage] = useState(listing.product.images[0]?.imageUrl || 'https://via.placeholder.com/600');
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [optInReturn, setOptInReturn] = useState(false);

  const originalPrice = Number(listing.product.originalPrice);
  const currentPrice = Number(listing.price);
  const discount = originalPrice > currentPrice ? Math.round((1 - currentPrice / originalPrice) * 100) : 0;
  
  // Transit Fee Logic: Small items = ₹150, Big items (>₹5000) = ₹350
  const returnFeeAmount = currentPrice > 5000 ? 350 : 150;

  const handleAddToCart = () => {
    addToCart({
      id: listing.id,
      title: listing.title,
      price: currentPrice,
      imageUrl: mainImage,
      quantity,
      sellerId: listing.sellerId,
      isReturnable: optInReturn,
      returnFee: optInReturn ? returnFeeAmount : 0
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="max-w-[1500px] mx-auto p-4 flex flex-col lg:flex-row gap-6 mt-4 pb-20">
      {/* LEFT COLUMN: Images & Rufus */}
      <div className="w-full lg:w-[40%] flex gap-4">
        {/* Thumbnails */}
        <div className="flex flex-col gap-2 w-[50px]">
          {listing.product.images.map((img: any, idx: number) => (
            <button 
              key={idx} 
              onMouseEnter={() => setMainImage(img.imageUrl)}
              className={`border rounded-md p-1 bg-white ${mainImage === img.imageUrl ? 'border-[#007185] shadow-[0_0_3px_#007185]' : 'border-gray-300'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt="Thumbnail" className="w-full h-auto object-contain aspect-square" />
            </button>
          ))}
        </div>
        
        {/* Main Image */}
        <div className="flex-1 flex flex-col">
          <div className="relative w-full aspect-square flex items-center justify-center bg-white border border-gray-100 rounded-md p-4">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mainImage} alt={listing.title} className="max-w-full max-h-full object-contain" />
            <div className="absolute top-2 left-2 bg-[#CC0C39] text-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
              {listing.listingType}
            </div>
            <button className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
          
          <div className="text-center mt-2 text-xs text-[#007185] hover:underline cursor-pointer">
            Click to see full view
          </div>

          {/* Ask Rufus Placeholder */}
          <div className="mt-8 border-t border-gray-200 pt-4">
            <h3 className="flex items-center gap-2 font-bold text-[#0f1111] mb-3">
              <span className="text-[#3b82f6] text-lg">❖</span> Ask Rufus
            </h3>
            <div className="flex flex-wrap gap-2 text-sm">
              <button className="bg-[#f0f2f2] hover:bg-[#e3e6e6] text-[#0f1111] px-3 py-1.5 rounded-full shadow-sm border border-[#d5d9d9]">What devices is it compatible with?</button>
              <button className="bg-[#f0f2f2] hover:bg-[#e3e6e6] text-[#0f1111] px-3 py-1.5 rounded-full shadow-sm border border-[#d5d9d9]">Is it comfortable for long use?</button>
              <button className="bg-[#f0f2f2] hover:bg-[#e3e6e6] text-[#0f1111] px-3 py-1.5 rounded-full shadow-sm border border-[#d5d9d9]">Does it come with a carrying case?</button>
              <button className="bg-[#232f3e] hover:bg-[#131921] text-white px-3 py-1.5 rounded-full shadow-sm border border-[#232f3e]">Ask something else</button>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER COLUMN: Details */}
      <div className="w-full lg:w-[40%] flex flex-col">
        <h1 className="text-xl md:text-[24px] text-[#0f1111] font-medium leading-snug">
          {listing.title}
        </h1>
        <div className="text-sm text-[#007185] hover:underline cursor-pointer mt-1">
          Brand: {listing.product.category?.name || 'Generic'}
        </div>
        
        {/* Ratings block */}
        <div className="flex items-center gap-4 mt-2 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-1 text-[#007185]">
            4.3 <span className="text-[#ffa41c]">★★★★☆</span> <span className="text-gray-400">|</span> <span className="hover:underline cursor-pointer">3,019 ratings</span>
          </div>
        </div>

        {/* Price block */}
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-medium text-[#0f1111]">
              <span className="text-sm align-top">₹</span>{currentPrice.toLocaleString('en-IN')}
            </span>
          </div>
          {originalPrice > currentPrice && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              M.R.P.: <span className="line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
              <span className="text-[#cc0c39] font-medium">({discount}% off)</span>
            </div>
          )}
          <div className="text-sm font-bold mt-1">Inclusive of all taxes</div>
          <div className="text-sm font-bold mt-1">EMI starts at ₹{Math.round(currentPrice / 6)}. No Cost EMI available <span className="text-[#007185] hover:underline cursor-pointer">EMI options</span></div>
        </div>

        {/* Offers */}
        <div className="mt-4">
          <h3 className="font-bold flex items-center gap-2 text-sm mb-2">
            <span className="w-5 h-5 bg-[#ffe2c2] text-[#c7511f] rounded-full flex items-center justify-center font-bold text-xs">%</span> Offers
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <div className="min-w-[140px] border border-gray-300 p-3 rounded-md shadow-sm bg-white">
              <h4 className="font-bold text-sm">Cashback</h4>
              <p className="text-xs mt-1">Upto ₹112.00 cashback as Amazon Pay Balance</p>
              <a href="#" className="text-xs text-[#007185] hover:underline mt-2 inline-block">1 offer</a>
            </div>
            <div className="min-w-[140px] border border-gray-300 p-3 rounded-md shadow-sm bg-white">
              <h4 className="font-bold text-sm">No Cost EMI</h4>
              <p className="text-xs mt-1">Upto ₹450.00 EMI interest savings on Amazon Pay</p>
              <a href="#" className="text-xs text-[#007185] hover:underline mt-2 inline-block">2 offers</a>
            </div>
            <div className="min-w-[140px] border border-gray-300 p-3 rounded-md shadow-sm bg-white">
              <h4 className="font-bold text-sm">Bank Offer</h4>
              <p className="text-xs mt-1">Upto ₹1,000.00 discount on select Credit Cards</p>
              <a href="#" className="text-xs text-[#007185] hover:underline mt-2 inline-block">25 offers</a>
            </div>
          </div>
        </div>

        <div className="mt-4 border border-gray-300 rounded-md p-3 flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#007185] font-bold">Earn 💎 1,000 worth ₹100 on this item</span>
          </div>
          <span className="text-gray-400">›</span>
        </div>

        {/* Trust Badges */}
        <div className="flex items-start justify-between border-t border-b border-gray-200 py-3 mt-4 text-[11px] text-[#007185] text-center">
           <div className="flex flex-col items-center gap-1 w-[20%] hover:underline cursor-pointer">
             <RefreshCcw className="w-8 h-8 p-1.5 border border-gray-300 rounded-full" />
             <span>10 days Replacement</span>
           </div>
           <div className="flex flex-col items-center gap-1 w-[20%] hover:underline cursor-pointer">
             <Truck className="w-8 h-8 p-1.5 border border-gray-300 rounded-full" />
             <span>Free Delivery</span>
           </div>
           <div className="flex flex-col items-center gap-1 w-[20%] hover:underline cursor-pointer">
             <Award className="w-8 h-8 p-1.5 border border-gray-300 rounded-full" />
             <span>Warranty Policy</span>
           </div>
           <div className="flex flex-col items-center gap-1 w-[20%] hover:underline cursor-pointer">
             <ShieldCheck className="w-8 h-8 p-1.5 border border-gray-300 rounded-full" />
             <span>Secure transaction</span>
           </div>
        </div>

        {/* Product Description */}
        <div className="mt-4 border-b border-gray-200 pb-4">
          <h3 className="font-bold text-lg mb-2">Product Information</h3>
          <p className="text-sm text-[#0f1111] mb-2">{listing.product.description}</p>
          <div className="text-xs text-[#0f1111] space-y-1">
            <p><strong>Brand:</strong> {listing.product.category?.name || 'Generic'}</p>
            <p><strong>Model:</strong> {listing.product.sku}</p>
            <p><strong>Condition:</strong> Amazon Certified {listing.listingType === 'PRE_OWNED' ? 'Pre-Owned' : 'Refurbished'}</p>
            <p><strong>Warranty:</strong> 6 Months Amazon Guarantee</p>
          </div>
        </div>

        <div className="mt-4 border-b border-gray-200 pb-4">
          <h3 className="font-bold text-lg mb-2">What is in the box?</h3>
          <ul className="list-disc pl-5 text-sm text-[#0f1111]">
             <li>Main Product unit</li>
             <li>Compatible charging cable/adapter (if applicable)</li>
             <li>Testing & Certification Document</li>
          </ul>
        </div>
      </div>

      {/* RIGHT COLUMN: Buy Box */}
      <div className="w-full lg:w-[20%]">
        <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm sticky top-28">
          <div className="text-2xl font-medium text-[#0f1111]">
            <span className="text-sm align-top">₹</span>{currentPrice.toLocaleString('en-IN')}
          </div>
          
          <div className="text-sm mt-3">
             <span className="text-[#007185] font-bold">FREE delivery</span> <strong>Saturday, 20 June.</strong>
             <br/>
             <a href="#" className="text-[#007185] hover:underline mt-1 inline-block">Details</a>
          </div>
          
          <div className="flex flex-col text-sm mt-3 text-[#0f1111]">
            <div className="flex items-start gap-1">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <span className="text-[#007185] hover:underline cursor-pointer">Deliver to User - Agartala 799001</span>
            </div>
          </div>

          <div className="text-lg font-bold text-[#007600] mt-4 mb-2">
            In stock
          </div>

          {/* Return Privilege Toggle */}
          <div className="mt-3 border border-gray-300 rounded-md p-3 bg-[#f3f7f4]">
            <h4 className="font-bold text-[13px] text-[#0f1111] mb-2 border-b border-gray-200 pb-1">Return Options</h4>
            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="returnOption" 
                  checked={!optInReturn} 
                  onChange={() => setOptInReturn(false)}
                  className="mt-0.5 accent-[#007185] cursor-pointer"
                />
                <div className="text-xs text-[#0f1111]">
                  <span className="font-bold block group-hover:text-[#c45500]">Final Sale (Free)</span>
                  <span className="text-gray-600 block mt-0.5">Item cannot be returned. You save money upfront.</span>
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer group pt-1">
                <input 
                  type="radio" 
                  name="returnOption" 
                  checked={optInReturn} 
                  onChange={() => setOptInReturn(true)}
                  className="mt-0.5 accent-[#007185] cursor-pointer"
                />
                <div className="text-xs text-[#0f1111]">
                  <span className="font-bold block group-hover:text-[#c45500]">Return Privilege (+₹{returnFeeAmount})</span>
                  <span className="text-gray-600 block mt-0.5">Pay a small transit fee now to unlock 10-day returns.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-4">
             <select 
               id="qty" 
               className="border border-gray-300 rounded-md p-1 shadow-sm focus:border-[#e77600] focus:ring-[#e77600] w-full text-sm bg-[#f0f2f2]"
               value={quantity}
               onChange={(e) => setQuantity(Number(e.target.value))}
             >
               {[1,2,3,4,5].map(n => <option key={n} value={n}>Quantity: {n}</option>)}
             </select>
          </div>

          <button 
            onClick={handleAddToCart}
            className={`w-full rounded-full py-2 px-4 mt-4 text-sm font-bold shadow-sm transition ${isAdded ? 'bg-green-600 hover:bg-green-700 text-white border border-green-700' : 'bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200]'}`}
          >
            {isAdded ? 'Added to Cart ✓' : 'Add to cart'}
          </button>
          
          <button className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] border border-[#ff8f00] rounded-full py-2 px-4 mt-2 text-sm font-bold shadow-sm transition">
            Buy Now
          </button>
          
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4 cursor-pointer hover:underline text-[#007185]">
            <ShieldCheck className="w-4 h-4 text-gray-400" /> Secure transaction
          </div>

          <div className="text-xs mt-3 flex items-center justify-between text-[#0f1111]">
             <span className="text-gray-500">Ships from</span>
             <span className="font-medium text-right">Amazon 2nd Chance</span>
          </div>
          <div className="text-xs mt-1 flex items-center justify-between text-[#0f1111]">
             <span className="text-gray-500">Sold by</span>
             <span className="font-medium text-right text-[#007185] hover:underline cursor-pointer">{listing.seller?.firstName || 'Amazon Retail'}</span>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <button className="w-full text-left border border-gray-300 rounded-md py-1.5 px-3 text-sm shadow-sm hover:bg-gray-50 flex items-center justify-between">
               Add to Wish List
               <span className="text-gray-400">▾</span>
            </button>
          </div>
        </div>
        
        {/* Other Sellers */}
        <div className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm mt-4">
          <h4 className="font-bold text-[13px] mb-2 text-[#0f1111]">Other sellers on Amazon</h4>
          <div className="text-xs text-[#0f1111]">
            <span className="font-bold">New (5) from <span className="text-[#b12704]">₹{originalPrice.toLocaleString('en-IN')}</span></span> & FREE Delivery
            <span className="float-right text-gray-400 font-bold">›</span>
          </div>
        </div>
      </div>
    </div>
  );
}
