'use client';

import { useState } from 'react';
import Link from 'next/link';

type Product = {
  id: string;
  type: 'amazon-pay' | 'prime';
  amount: number;
  title: string;
  image: string;
  rating: number;
  reviews: string;
  bestseller?: boolean;
};

export default function GreenCreditsClient({ products, balance }: { products: Product[], balance: number }) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filteredProducts = products.filter(p => {
    if (p.amount < priceRange[0] || p.amount > priceRange[1]) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(p.type)) return false;
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Sidebar */}
      <div className="hidden md:block w-[240px] flex-shrink-0">
        
        <h3 className="font-bold text-[14px] mb-2 text-[#0f1111]">Category</h3>
        <div className="space-y-1.5 mb-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={selectedTypes.includes('amazon-pay')}
              onChange={() => handleTypeToggle('amazon-pay')}
              className="w-4 h-4 border-gray-400 rounded-sm text-[#007185] focus:ring-0 cursor-pointer" 
            />
            <span className="text-[14px] text-[#0f1111] group-hover:text-[#c7511f]">Amazon Pay eGift Cards</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={selectedTypes.includes('prime')}
              onChange={() => handleTypeToggle('prime')}
              className="w-4 h-4 border-gray-400 rounded-sm text-[#007185] focus:ring-0 cursor-pointer" 
            />
            <span className="text-[14px] text-[#0f1111] group-hover:text-[#c7511f]">Digital Subscriptions</span>
          </label>
        </div>

        <div className="w-full h-[1px] bg-gray-200 mb-4"></div>

        <h3 className="font-bold text-[14px] mb-2 text-[#0f1111]">Price</h3>
        <div className="text-[14px] font-bold text-[#0f1111] mb-2">
          {priceRange[0]} GC – {priceRange[1] === 10000 ? '10,000+ GC' : `${priceRange[1]} GC`}
        </div>
        
        <div className="relative h-6 mb-4 flex items-center px-2">
           <input 
             type="range" 
             min="0" max="10000" step="100" 
             value={priceRange[1]} 
             onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
             className="w-full absolute z-20 opacity-0 cursor-pointer"
           />
           <div className="absolute left-2 right-2 h-1 bg-[#3a5b82]"></div>
           <div className="absolute left-2 w-4 h-4 bg-white border-[3px] border-[#3a5b82] rounded-full shadow-md transform -translate-x-2"></div>
           <div 
             className="absolute w-4 h-4 bg-white border-[3px] border-[#3a5b82] rounded-full shadow-md transform -translate-x-2 transition-all"
             style={{ left: `calc(2px + ${(priceRange[1] / 10000) * 100}% - 4px)` }}
           ></div>
        </div>

        <ul className="text-[14px] space-y-1.5 mb-5 text-[#0f1111]">
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => setPriceRange([0, 250])}>Up to 250 GC</li>
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => setPriceRange([250, 500])}>250 GC - 500 GC</li>
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => setPriceRange([500, 1000])}>500 GC - 1,000 GC</li>
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => setPriceRange([1000, 5000])}>1,000 GC - 5,000 GC</li>
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => setPriceRange([5000, 10000])}>Over 5,000 GC</li>
        </ul>

        <h3 className="font-bold text-[14px] mb-2 text-[#0f1111] mt-5">Deals & Discounts</h3>
        <ul className="text-[14px] space-y-1.5 mb-5 text-[#0f1111]">
          <li className="hover:text-[#c7511f] cursor-pointer">All Discounts</li>
          <li className="hover:text-[#c7511f] cursor-pointer">Buy More, Save More</li>
          <li className="hover:text-[#c7511f] cursor-pointer">Coupons</li>
          <li className="hover:text-[#c7511f] cursor-pointer">Today's Deals</li>
        </ul>

        <h3 className="font-bold text-[14px] mb-2 text-[#0f1111]">Brands</h3>
        <div className="space-y-1.5 mb-2">
          {['Amazon Pay', 'Swiggy', 'Zomato', 'BookMyShow', 'Uber', 'MakeMyTrip'].map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 border-gray-400 rounded-sm text-[#007185] focus:ring-0 cursor-pointer" />
              <span className="text-[14px] text-[#0f1111] group-hover:text-[#c7511f]">{brand}</span>
            </label>
          ))}
        </div>
        <div className="text-[14px] text-[#007185] hover:text-[#c7511f] cursor-pointer flex items-center gap-1 mt-1 mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><path d="m6 9 6 6 6-6"/></svg>
          See more
        </div>

      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-[#0f1111]">Results</h2>
          <span className="text-sm text-[#565959]">{filteredProducts.length} results</span>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No rewards found matching your filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 bg-white rounded-sm overflow-hidden flex flex-col group hover:shadow-md transition cursor-pointer">
                <Link href={`/customer/credits/gift-card?type=${product.type}&amount=${product.amount}`}>
                  <div className="bg-[#f7f7f7] p-4 flex items-center justify-center h-[200px]">
                    <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="p-3">
                    {product.bestseller && (
                      <div className="bg-[#c45500] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm w-fit mb-2">Best seller</div>
                    )}
                    <h3 className="text-[16px] font-medium text-[#0f1111] group-hover:text-[#c7511f] line-clamp-2">{product.title}</h3>
                    <div className="text-[13px] text-[#007185] mt-1 flex items-center gap-1">
                      <span>{product.rating}</span> <span className="text-[#ffa41c]">★★★★☆</span> <span>({product.reviews})</span>
                    </div>
                    <div className="mt-2 text-[#0f1111]">
                      <span className="text-[28px] font-medium">{product.amount.toLocaleString()} <span className="text-[13px] align-top relative top-[-10px] text-emerald-600 font-bold">GC</span></span>
                    </div>
                    <div className="text-[12px] text-[#565959] mt-0.5">
                      {product.type === 'prime' ? 'Instant Activation' : '2% back in Green Credits'}
                    </div>
                    <div className="text-[12px] text-green-700 mt-2">In stock</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
