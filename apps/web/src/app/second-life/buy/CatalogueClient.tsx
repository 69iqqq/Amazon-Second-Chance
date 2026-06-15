'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';

type Listing = {
  id: string;
  title: string;
  price: any;
  listingType: string;
  product: {
    originalPrice: any;
    images: { imageUrl: string }[];
    category?: { name: string };
  };
  avgRating?: string;
  reviewCount?: number;
};

export default function CatalogueClient({ initialListings }: { initialListings: Listing[] }) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const filteredListings = initialListings.filter(listing => {
    const price = Number(listing.price);
    if (price < priceRange[0] || price > priceRange[1]) return false;
    
    if (selectedBrands.length > 0) {
      // Check if title contains the brand (case insensitive)
      const titleLower = listing.title.toLowerCase();
      const matchesBrand = selectedBrands.some(brand => titleLower.includes(brand.toLowerCase()));
      if (!matchesBrand) return false;
    }
    
    return true;
  });

  return (
    <main className="max-w-[1500px] mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Left Sidebar Mock */}
      <div className="hidden md:block w-[240px] flex-shrink-0">
        
        <h3 className="font-bold text-[14px] mb-2 text-[#0f1111]">Popular Shopping Ideas</h3>
        <ul className="text-[14px] space-y-1.5 mb-4 text-[#0f1111]">
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => handleBrandToggle('Samsung')}>Samsung</li>
          <li className="hover:text-[#c7511f] cursor-pointer">Budget</li>
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => handleBrandToggle('Oneplus')}>Oneplus</li>
          <li className="hover:text-[#c7511f] cursor-pointer">Premium</li>
          <li className="text-[#007185] hover:text-[#c7511f] cursor-pointer flex items-center gap-1 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><path d="m6 9 6 6 6-6"/></svg>
            See more
          </li>
        </ul>

        <div className="w-full h-[1px] bg-gray-200 mb-4"></div>

        <h3 className="font-bold text-[14px] mb-2 text-[#0f1111]">Eligible for Free Delivery</h3>
        <label className="flex items-start gap-2 mb-2 cursor-pointer group">
          <input type="checkbox" className="mt-1 w-4 h-4 border-gray-400 rounded-sm text-[#007185] focus:ring-0 cursor-pointer" />
          <span className="text-[14px] text-[#0f1111] group-hover:text-[#c7511f]">Free Shipping</span>
        </label>
        <p className="text-[14px] text-[#0f1111] leading-tight mb-5">Get FREE Shipping on eligible orders shipped by Amazon</p>

        <h3 className="font-bold text-[14px] mb-2 text-[#0f1111]">Price</h3>
        <div className="text-[14px] font-bold text-[#0f1111] mb-2">₹{priceRange[0]} – {priceRange[1] >= 150000 ? '₹150,000+' : `₹${priceRange[1].toLocaleString()}`}</div>
        
        {/* Mock Slider */}
        <div className="relative h-6 mb-4 flex items-center px-2">
           <input 
             type="range" 
             min="0" max="150000" step="1000" 
             value={priceRange[1]} 
             onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
             className="w-full absolute z-20 opacity-0 cursor-pointer"
           />
           <div className="absolute left-2 right-2 h-1 bg-[#3a5b82]"></div>
           <div className="absolute left-2 w-4 h-4 bg-white border-[3px] border-[#3a5b82] rounded-full shadow-md transform -translate-x-2"></div>
           <div 
             className="absolute w-4 h-4 bg-white border-[3px] border-[#3a5b82] rounded-full shadow-md transform -translate-x-2 transition-all"
             style={{ left: `calc(2px + ${(priceRange[1] / 150000) * 100}% - 4px)` }}
           ></div>
        </div>

        <ul className="text-[14px] space-y-1.5 mb-5 text-[#0f1111]">
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => setPriceRange([0, 10000])}>Up to ₹10,000</li>
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => setPriceRange([10000, 30000])}>₹10,000 - ₹30,000</li>
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => setPriceRange([30000, 50000])}>₹30,000 - ₹50,000</li>
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => setPriceRange([50000, 80000])}>₹50,000 - ₹80,000</li>
          <li className="hover:text-[#c7511f] cursor-pointer" onClick={() => setPriceRange([80000, 150000])}>Over ₹80,000</li>
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
          {['OnePlus', 'realme', 'Samsung', 'Redmi', 'Motorola', 'iQOO', 'Lava'].map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="w-4 h-4 border-gray-400 rounded-sm text-[#007185] focus:ring-0 cursor-pointer" 
              />
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
        <div className="bg-white p-4 shadow-sm mb-4 border border-[#D5D9D9]">
          <h1 className="text-xl font-bold">Amazon 2nd Chance Catalogue</h1>
          <p className="text-sm text-gray-600">Showing 1-{filteredListings.length} results for AI Graded and Refurbished products.</p>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No rewards found matching your filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((listing) => {
              const currentPrice = Number(listing.price);
              const originalPrice = Number(listing.product.originalPrice);
              const discount = originalPrice > currentPrice ? Math.round((1 - currentPrice / originalPrice) * 100) : 0;

              return (
                <div key={listing.id} className="bg-white p-4 flex flex-col shadow-sm hover:shadow-md transition border border-[#D5D9D9]">
                  <Link href={`/dp/${listing.id}?ref=second-life`} className="block">
                    <div className="w-full h-[200px] flex items-center justify-center mb-4 overflow-hidden relative bg-[#f7f7f7]">
                      <ImageWithFallback 
                        src={listing.product.images[0]?.imageUrl || '/products/earbuds.png'} 
                        alt={listing.title} 
                        className="max-h-[180px] object-contain group-hover:scale-105 transition"
                      />
                      <span className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm ${listing.listingType === 'PRE_OWNED' ? 'bg-[#007185]' : 'bg-[#CC0C39]'}`}>
                        {listing.listingType === 'PRE_OWNED' ? 'AI Graded' : 'Amazon Certified'}
                      </span>
                    </div>
                    
                    <h2 className="text-[16px] font-medium line-clamp-3 mb-1 text-[#0f1111] hover:text-[#c7511f] cursor-pointer">
                      {listing.title}
                    </h2>
                  </Link>
                  
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-[#007185] hover:underline cursor-pointer">{listing.product.category?.name || 'General'}</span>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-1 mt-1 text-sm text-[#007185]">
                      <span>{listing.avgRating || "0.0"}</span> 
                      <span className="text-[#ffa41c]">
                        {Number(listing.avgRating || 0) >= 4.5 ? '★★★★★' : 
                         Number(listing.avgRating || 0) >= 3.5 ? '★★★★☆' : 
                         Number(listing.avgRating || 0) >= 2.5 ? '★★★☆☆' : 
                         Number(listing.avgRating || 0) >= 1.5 ? '★★☆☆☆' : 
                         Number(listing.avgRating || 0) > 0 ? '★☆☆☆☆' : '☆☆☆☆☆'}
                      </span>
                      <span className="text-gray-400 ml-1">({listing.reviewCount || 0})</span>
                    </div>
                    <div className="text-[28px] font-medium text-[#0f1111] leading-none mt-2">
                      <span className="text-[13px] align-top relative top-[-10px]">₹</span>{currentPrice.toLocaleString('en-IN')}
                    </div>
                    {originalPrice > currentPrice && (
                      <div className="text-xs text-[#565959] mt-1">
                        M.R.P: <span className="line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                        <span className="ml-2 text-[#007185] hover:text-[#c7511f] cursor-pointer">
                          ({discount}% off)
                        </span>
                      </div>
                    )}
                    
                    <div className="text-xs text-green-700 mt-2 flex items-center gap-1">
                      <span className="w-4 h-4 bg-green-100 text-green-700 flex items-center justify-center rounded-full text-[10px]">✓</span>
                      {listing.listingType === 'PRE_OWNED' ? 'AI Graded (User Sold)' : 'Amazon Refurbished'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
