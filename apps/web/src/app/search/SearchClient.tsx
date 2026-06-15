'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { AddToCartButton } from '@/components/shared/AddToCartButton';

type Listing = {
  id: string;
  title: string;
  price: any;
  listingType: string;
  sellerId: string;
  product: {
    originalPrice: any;
    images: { imageUrl: string }[];
    category?: { name: string };
  };
  avgRating?: string;
  reviewCount?: number;
};

export default function SearchClient({ initialListings, query, isSecondLife }: { initialListings: Listing[], query: string, isSecondLife: boolean }) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showOnlyFreeShipping, setShowOnlyFreeShipping] = useState(false);

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
    <>
      <div className="border-b border-gray-200 shadow-sm p-3 text-sm text-[#0f1111] bg-white">
        <div className="max-w-[1500px] mx-auto">
          {filteredListings.length > 0 ? `1-${filteredListings.length} of ${filteredListings.length} results for ` : `0 results for `}
          <span className="text-[#c7511f] font-bold">"{query}"</span>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto p-4 flex flex-col lg:flex-row gap-6 mt-4">
        
        {/* Left Sidebar Filters */}
        <div className="hidden lg:block w-[240px] flex-shrink-0 border-r border-gray-200 pr-4">
          
          <h3 className="font-bold text-[14px] mb-2 text-[#0f1111]">Eligible for Free Delivery</h3>
          <label className="flex items-start gap-2 mb-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={showOnlyFreeShipping}
              onChange={(e) => setShowOnlyFreeShipping(e.target.checked)}
              className="mt-1 w-4 h-4 border-gray-400 rounded-sm text-[#007185] focus:ring-0 cursor-pointer" 
            />
            <span className="text-[14px] text-[#0f1111] group-hover:text-[#c7511f]">Free Shipping</span>
          </label>
          <p className="text-[14px] text-[#0f1111] leading-tight mb-5">Get FREE Shipping on eligible orders shipped by Amazon</p>

          <h3 className="font-bold text-[14px] mb-2 text-[#0f1111]">Price</h3>
          <div className="text-[14px] font-bold text-[#0f1111] mb-2">₹{priceRange[0]} – {priceRange[1] >= 150000 ? '₹150,000+' : `₹${priceRange[1].toLocaleString()}`}</div>
          
          {/* Functional Slider */}
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
            {['OnePlus', 'realme', 'Samsung', 'Redmi', 'Motorola', 'iQOO', 'Apple'].map(brand => (
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

        {/* Search Results List */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="font-bold text-xl mb-2 text-[#0f1111]">Results</h2>
          
          {filteredListings.length === 0 ? (
            <p className="text-lg text-[#0f1111]">No results found matching your filters.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredListings.map(listing => {
                const currentPrice = Number(listing.price);
                const originalPrice = Number(listing.product.originalPrice);
                const discount = originalPrice > currentPrice ? Math.round((1 - currentPrice / originalPrice) * 100) : 0;

                const linkRef = isSecondLife ? '?ref=second-life' : '?ref=base';

                return (
                  <div key={listing.id} className="flex flex-col sm:flex-row gap-8 border-b border-gray-200 bg-white py-6 px-4">
                    
                    {/* Image */}
                    <Link href={`/dp/${listing.id}${linkRef}`} className="w-[280px] h-[280px] flex-shrink-0 bg-transparent flex items-center justify-center p-2">
                      <ImageWithFallback src={listing.product.images[0]?.imageUrl || '/products/earbuds.png'} alt={listing.title} className="max-w-full max-h-full object-contain mix-blend-multiply hover:scale-105 transition" />
                    </Link>
                    
                    {/* Info */}
                    <div className="flex flex-col flex-1 py-1">
                      <Link href={`/dp/${listing.id}${linkRef}`} className="text-[18px] font-medium text-[#0f1111] hover:text-[#c7511f] leading-snug line-clamp-3">
                        {listing.title}
                      </Link>
                      
                      <div className="flex items-center gap-1 text-[13px] text-[#007185] mt-1">
                        <span>{listing.avgRating || "0.0"}</span>
                        <span className="text-[#ffa41c]">
                          {Number(listing.avgRating || 0) >= 4.5 ? '★★★★★' : 
                           Number(listing.avgRating || 0) >= 3.5 ? '★★★★☆' : 
                           Number(listing.avgRating || 0) >= 2.5 ? '★★★☆☆' : 
                           Number(listing.avgRating || 0) >= 1.5 ? '★★☆☆☆' : 
                           Number(listing.avgRating || 0) > 0 ? '★☆☆☆☆' : '☆☆☆☆☆'}
                        </span>
                        <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
                          ({(listing.reviewCount || 0).toLocaleString()})
                        </span>
                      </div>

                      <div className="text-[12px] text-[#565959] mt-0.5 mb-2">
                        {Math.floor((parseInt(listing.id.replace(/-/g, '').substring(8, 16), 16) % 300) / 50) * 50 + 50}+ bought in past month
                      </div>
                      
                      {listing.listingType !== 'NEW' && (
                        <div className="mb-2 bg-[#CC0C39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm w-fit">
                          {listing.listingType === 'PRE_OWNED' ? 'Pre-Owned' : 'Refurbished'}
                        </div>
                      )}

                      <div className="flex items-baseline mt-1">
                        <span className="text-[28px] font-medium text-[#0f1111] leading-none">
                          <span className="text-[13px] align-top relative top-[-10px]">₹</span>{currentPrice.toLocaleString('en-IN')}
                        </span>
                        {originalPrice > currentPrice && (
                          <span className="text-[13px] text-[#565959] ml-1.5">
                            M.R.P: <span className="line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                            <span className="ml-1">({discount}% off)</span>
                          </span>
                        )}
                      </div>

                      <div className="text-[12px] text-[#565959] mt-0.5">
                        Up to 5% back with Amazon Pay ICICI card
                      </div>

                      <div className="text-[13px] mt-1 text-[#0f1111]">
                        <span className="font-bold">FREE delivery</span> <strong>Thu, 18 Jun</strong>
                      </div>

                      <div className="mt-4">
                        <AddToCartButton 
                          className="w-[200px]"
                          item={{
                            id: listing.id,
                            title: listing.title,
                            price: currentPrice,
                            imageUrl: listing.product.images[0]?.imageUrl || '/products/earbuds.png',
                            sellerId: listing.sellerId
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
