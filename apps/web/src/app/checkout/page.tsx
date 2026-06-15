'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, CreditCard } from 'lucide-react';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { placeOrder } from '@/app/actions/secondLifeActions';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (items.length === 0 && !isSuccess) {
    router.push('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      await placeOrder(items, cartTotal + 40); // including delivery fee
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Failed to place order:", error);
      setIsProcessing(false);
      alert("Failed to place order. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f1111] mb-2">Order Placed, Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Confirmation will be sent to your email. We will notify you when your items have shipped.
          </p>
          <Link href="/" className="inline-block bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0f1111] rounded-full px-6 py-2 shadow-sm font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Checkout Header */}
      <header className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/ama.png" alt="Amazon.in" className="h-[35px] object-contain" />
          </Link>
          <h1 className="text-2xl font-normal text-[#0f1111] hidden sm:block">Checkout</h1>
          <Lock className="w-5 h-5 text-gray-500" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Column - Forms */}
        <div className="flex-1">
          <div className="flex gap-4 mb-4">
            <span className="font-bold text-lg">1</span>
            <div className="flex-1 border border-gray-300 rounded-md p-4 bg-gray-50">
              <h2 className="font-bold text-lg mb-2 text-[#c45500]">Delivery Address</h2>
              <div className="text-sm">
                <p className="font-bold">Jane Doe</p>
                <p>123 Amazon Way, Building B</p>
                <p>Cyber City, Gurugram</p>
                <p>Haryana, 122002</p>
                <p>India</p>
                <p className="text-gray-500 mt-1">Phone: +91 9876543210</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <span className="font-bold text-lg">2</span>
            <div className="flex-1 border border-gray-300 rounded-md p-4 bg-gray-50">
              <h2 className="font-bold text-lg mb-2 text-[#c45500]">Payment Method</h2>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="font-bold">Amazon Pay ICICI Bank Credit Card</span>
                <span>ending in 4242</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="font-bold text-lg">3</span>
            <div className="flex-1 border border-[#e77600] rounded-md p-4 bg-white shadow-[0_0_0_1px_#e77600]">
              <h2 className="font-bold text-lg mb-2 text-[#c45500]">Review items and delivery</h2>
              
              <div className="flex flex-col gap-4 mt-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 border border-gray-200 rounded-md p-4">
                    <img src={item.imageUrl} alt="" className="w-24 h-24 object-contain" />
                    <div>
                      <h3 className="font-bold text-[#0f1111] line-clamp-2">{item.title}</h3>
                      <div className="text-[#B12704] font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</div>
                      <div className="text-sm mt-1">Qty: {item.quantity}</div>
                      <div className="text-sm text-gray-600 mt-1">Sold by: Amazon Retail</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Place Order Box */}
        <div className="w-full md:w-[300px]">
          <div className="border border-gray-300 rounded-md p-4 bg-[#f3f3f3] sticky top-4">
            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] disabled:bg-[#fbdc5a] disabled:cursor-not-allowed border border-[#FCD200] text-[#0f1111] rounded-full py-2 px-4 shadow-sm font-bold text-sm mb-4"
            >
              {isProcessing ? 'Processing...' : 'Place your order'}
            </button>
            <p className="text-xs text-center text-gray-600 mb-4 px-2">
              By placing your order, you agree to Amazon's privacy notice and conditions of use.
            </p>
            
            <h3 className="font-bold text-base mb-2">Order Summary</h3>
            <div className="text-sm flex flex-col gap-1 mb-2 border-b border-gray-300 pb-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>₹40.00</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span>₹{(cartTotal + 40).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#B12704] italic">
                <span>Promotion Applied:</span>
                <span>-₹40.00</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[#B12704] font-bold text-xl pt-2">
              <span>Order Total:</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
