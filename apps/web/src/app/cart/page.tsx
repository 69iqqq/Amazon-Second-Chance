'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ShieldCheck } from 'lucide-react';

function CartInner() {
  const { items, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const searchParams = useSearchParams();
  const isSecondLife = searchParams.get('ref') === 'second-life';

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <AmazonNavbar forceSecondLife={isSecondLife} />
      
      <main className="max-w-[1500px] mx-auto p-4 flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN: Cart Items */}
        <div className="flex-1 bg-white p-6 shadow-sm">
          <div className="border-b border-gray-200 pb-2 mb-4 flex justify-between items-end">
            <h1 className="text-[28px] font-medium text-[#0f1111]">Shopping Cart</h1>
            <span className="text-sm text-gray-500">Price</span>
          </div>

          {items.length === 0 ? (
            <div className="py-8">
              <h2 className="text-xl font-bold mb-2">Your Amazon Cart is empty.</h2>
              <p className="text-sm">
                Check your Saved for later items below or{' '}
                <Link href="/" className="text-[#007185] hover:underline">
                  continue shopping
                </Link>.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-gray-200 pb-6">
                  <div className="w-[150px] sm:w-[200px] shrink-0">
                    <Link href={`/dp/${item.id}`}>
                      <ImageWithFallback 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full object-contain max-h-[200px]" 
                      />
                    </Link>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <Link href={`/dp/${item.id}`} className="text-lg font-medium text-[#0f1111] line-clamp-2 hover:text-[#c7511f]">
                        {item.title}
                      </Link>
                      <span className="text-xl font-bold text-[#0f1111] whitespace-nowrap ml-4">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-xs text-green-700 mt-1 mb-1">In stock</div>
                    <div className="text-xs text-gray-500 mb-2">Eligible for FREE Shipping</div>
                    
                    {item.isReturnable ? (
                      <div className="text-xs font-bold text-[#007185] mb-2 bg-[#f3f7f4] inline-block px-2 py-1 rounded-sm border border-[#d5d9d9] w-max">
                        ✓ 10-Day Return Privilege Active (+₹{item.returnFee})
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-[#c45500] mb-2 bg-[#fff8e1] inline-block px-2 py-1 rounded-sm border border-[#d5d9d9] w-max">
                        ⚠️ Final Sale (Non-Returnable)
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 mb-2">
                      <input type="checkbox" className="rounded-sm border-gray-300 text-[#007185] focus:ring-[#007185]" />
                      <span className="text-xs">This will be a gift <a href="#" className="text-[#007185] hover:underline">Learn more</a></span>
                    </div>

                    <div className="mt-auto flex items-center gap-4 text-sm">
                      <div className="bg-[#f0f2f2] rounded-md shadow-sm border border-[#d5d9d9] flex items-center overflow-hidden">
                        <select 
                          className="bg-transparent border-none py-1 pl-2 pr-6 focus:ring-2 focus:ring-[#007185] text-sm font-bold"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <option key={n} value={n}>Qty: {n}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3 text-[#007185]">
                        <span className="text-gray-300">|</span>
                        <button onClick={() => removeFromCart(item.id)} className="hover:underline text-xs">Delete</button>
                        <span className="text-gray-300">|</span>
                        <button className="hover:underline text-xs">Save for later</button>
                        <span className="text-gray-300">|</span>
                        <button className="hover:underline text-xs">See more like this</button>
                        <span className="text-gray-300">|</span>
                        <button className="hover:underline text-xs">Share</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-right text-lg pt-2">
                Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''}): <span className="font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Buy Box */}
        {items.length > 0 && (
          <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-4">
            <div className="bg-white p-5 shadow-sm">
              <div className="flex items-start gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="text-green-700 font-bold">Your order is eligible for FREE Delivery.</span>
                  <br />
                  <span className="text-gray-600">Select this option at checkout. <a href="#" className="text-[#007185] hover:underline">Details</a></span>
                </div>
              </div>

              <div className="text-lg mb-2">
                Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''}): <span className="font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              
              {items.some(i => i.returnFee && i.returnFee > 0) && (
                <div className="text-xs text-gray-600 mb-4 pb-2 border-b border-gray-200">
                  Includes Return Privilege Transit Fees: <span className="font-bold text-[#c45500]">₹{items.reduce((sum, item) => sum + ((item.returnFee || 0) * item.quantity), 0).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center gap-1 mb-4">
                <input type="checkbox" className="rounded-sm border-gray-300 text-[#007185] focus:ring-[#007185]" />
                <span className="text-sm">This order contains a gift</span>
              </div>

              <Link href="/checkout" className="block text-center w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] rounded-full py-2 px-4 text-sm font-medium shadow-sm transition">
                Proceed to Buy
              </Link>
              
              <div className="mt-4 border border-gray-300 rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm">EMI Available</span>
                </div>
                <div className="text-xs text-gray-600">
                  Your order qualifies for EMI with valid credit cards. <a href="#" className="text-[#007185] hover:underline">Learn more</a>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 shadow-sm text-xs border border-gray-300 rounded-md">
              <div className="flex items-center gap-2 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-[#007185]" />
                100% Purchase Protection
              </div>
              <p className="text-gray-600">
                We are committed to ensure 100% Purchase Protection for customers by offering genuine products, secure payments and easy returns for items shopped on Amazon.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CartPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#eaeded]" />}>
      <CartInner />
    </React.Suspense>
  );
}
