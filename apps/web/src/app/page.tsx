import { prisma } from '@/lib/prisma';
import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

export default async function AmazonHomePage() {
  const { userId: clerkId } = await auth();

  // 1. Fetch random products to populate the general homepage
  const listings = await (prisma.listing as any).findMany({
    where: { status: 'ACTIVE' },
    include: { product: { include: { images: true } } },
    take: 30, // Get 30 items to sprinkle across the homepage
  });

  const refurbishedListings = await (prisma.listing as any).findMany({
    where: { status: 'ACTIVE', listingType: 'REFURBISHED' },
    include: { product: { include: { images: true } } },
    orderBy: { price: 'desc' },
    take: 10,
  });

  // 2. Fetch Recently Viewed based on interactions
  let recentListings: any[] = [];
  if (clerkId) {
    const dbUser = await prisma.user.findUnique({ where: { clerkId } });
    if (dbUser) {
      let recentInteractions: any[] = [];
      try {
        if ((prisma as any).userInteraction) {
          recentInteractions = await (prisma as any).userInteraction.findMany({
            where: { userId: dbUser.id, action: 'VIEWED' },
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: { product: true }
          });
        }
      } catch(e) { console.error(e) }
      // Extract unique product IDs
      const productIds = [...new Set(recentInteractions.map((i: any) => i.productId))].slice(0, 10);
      
      if (productIds.length > 0) {
        recentListings = await prisma.listing.findMany({
          where: { productId: { in: productIds as string[] }, status: 'ACTIVE' },
          include: { product: { include: { images: true } } }
        });
      }
    }
  }

  // Fallback if no recent history
  const viewedItems = recentListings.length >= 4 ? recentListings : listings.slice(10, 20);

  // Helpers
  const getListing = (index: number) => listings[index % listings.length];
  const getImage = (index: number) => getListing(index)?.product?.images?.[0]?.imageUrl;
  const getPrice = (index: number) => Number(getListing(index)?.price || 0).toLocaleString('en-IN');
  const getTitle = (index: number) => getListing(index)?.title || 'Product';

  return (
    <div className="min-h-screen bg-[#e3e6e6] flex flex-col relative">
      <AmazonNavbar />

      <main className="w-full max-w-[1500px] mx-auto relative flex-1 flex flex-col items-center">
        {/* Background Banner Carousel */}
        <div className="w-full h-[150px] sm:h-[250px] lg:h-[350px] absolute top-0 left-0 right-0 z-0 mask-image-gradient bg-[#FA8900]">
          <div className="w-full h-full relative max-w-[1500px] mx-auto">
            <img src="/images/great-indian-festival.png" alt="Great Indian Festival" className="w-full h-full object-contain object-top" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#e3e6e6] to-transparent"></div>
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full px-4 sm:px-6 relative z-10 pt-[100px] sm:pt-[150px] lg:pt-[220px] pb-10">
          
          {/* Row 1: 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            
            {/* Card 1: Pick up where you left off (4-grid) */}
            {viewedItems.length >= 4 ? (
              <div className="bg-white p-5 pb-8 h-[420px] flex flex-col z-20 shadow-sm relative">
                <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Pick up where you left off</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1">
                  {[0, 1, 2, 3].map(i => (
                    <Link href={`/dp/${viewedItems[i].id}?ref=base`} key={i} className="flex flex-col cursor-pointer group">
                      <div className="bg-white h-[100px] w-full mb-1 flex items-center justify-center overflow-hidden">
                        <ImageWithFallback src={viewedItems[i].product?.images?.[0]?.imageUrl} alt="Product" className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
                      </div>
                      <span className="text-[12px] text-[#0F1111] line-clamp-1 group-hover:text-[#C7511F]">{viewedItems[i].title}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/customer" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline mt-2 absolute bottom-5">View your browsing history</Link>
              </div>
            ) : listings.length >= 4 && (
              <div className="bg-white p-5 pb-8 h-[420px] flex flex-col z-20 shadow-sm relative">
                <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Recommended for you</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1">
                  {[4, 5, 6, 7].map(i => (
                    <Link href={`/dp/${getListing(i).id}?ref=base`} key={i} className="flex flex-col cursor-pointer group">
                      <div className="bg-white h-[100px] w-full mb-1 flex items-center justify-center overflow-hidden">
                        <ImageWithFallback src={getImage(i)} alt="Product" className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
                      </div>
                      <span className="text-[12px] text-[#0F1111] line-clamp-1 group-hover:text-[#C7511F]">{getTitle(i)}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/customer" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline mt-2 absolute bottom-5">See more recommendations</Link>
              </div>
            )}

            {/* Card 2: Explore more */}
            {listings.length > 4 && (
              <div className="bg-white p-5 pb-8 h-[420px] flex flex-col z-20 shadow-sm relative">
                <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Explore more</h2>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {[1, 2, 3, 4].map(i => (
                    <Link href={`/dp/${getListing(i).id}?ref=base`} key={i} className="flex flex-col cursor-pointer group">
                      <div className="bg-white h-[110px] w-full mb-1 flex items-center justify-center overflow-hidden">
                        <ImageWithFallback src={getImage(i)} alt="Product" className="max-h-[90%] max-w-[90%] object-contain group-hover:scale-105 transition" />
                      </div>
                    </Link>
                  ))}
                </div>
                <a href="#" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline mt-2 absolute bottom-5">See more</a>
              </div>
            )}

            {/* Card 3: Trending offers */}
            {listings.length > 8 && (
              <div className="bg-white p-5 pb-8 h-[420px] flex flex-col z-20 shadow-sm relative">
                <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Trending offers</h2>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {[5, 6, 7, 8].map(i => (
                    <Link href={`/dp/${getListing(i).id}?ref=base`} key={i} className="flex flex-col cursor-pointer group">
                      <div className="bg-white h-[110px] w-full mb-1 flex items-center justify-center overflow-hidden">
                        <ImageWithFallback src={getImage(i)} alt="Product" className="max-h-[90%] max-w-[90%] object-contain group-hover:scale-105 transition" />
                      </div>
                    </Link>
                  ))}
                </div>
                <a href="#" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline mt-2 absolute bottom-5">See all offers</a>
              </div>
            )}

            {/* Card 4: Top rated */}
            {listings.length > 12 && (
              <div className="bg-white p-5 pb-8 h-[420px] flex flex-col z-20 shadow-sm relative">
                <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Top rated in electronics</h2>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {[9, 10, 11, 12].map(i => (
                    <Link href={`/dp/${getListing(i).id}?ref=base`} key={i} className="flex flex-col cursor-pointer group">
                      <div className="bg-white h-[110px] w-full mb-1 flex items-center justify-center overflow-hidden">
                        <ImageWithFallback src={getImage(i)} alt="Product" className="max-h-[90%] max-w-[90%] object-contain group-hover:scale-105 transition" />
                      </div>
                    </Link>
                  ))}
                </div>
                <a href="#" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline mt-2 absolute bottom-5">Shop now</a>
              </div>
            )}
          </div>

          {/* Row 1.5: Horizontal scroll - High Value Refurbished */}
          {refurbishedListings.length > 0 && (
            <div className="w-full bg-white p-5 pt-4 pb-6 mb-5 shadow-sm relative">
              <div className="flex items-baseline gap-4 mb-2">
                <h2 className="text-[21px] font-bold text-[#0F1111]">Premium Pre-Owned & Refurbished</h2>
                <Link href="/second-life" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline">Explore all</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {refurbishedListings.map((item: any, idx: number) => (
                  <Link href={`/dp/${item.id}?ref=base`} key={idx} className="min-w-[200px] w-[200px] flex flex-col items-center cursor-pointer group snap-start relative">
                    <div className="w-full h-[200px] bg-[#f7f7f7] mb-2 flex items-center justify-center p-2 relative overflow-hidden rounded-sm">
                      <ImageWithFallback src={item.product?.images?.[0]?.imageUrl} alt="Product" className="max-h-[160px] max-w-[160px] object-contain group-hover:scale-105 transition" />
                      <span className="absolute bottom-2 left-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm">Amazon Certified</span>
                    </div>
                    <span className="text-[13px] text-[#0F1111] line-clamp-2 w-full leading-snug group-hover:text-[#C7511F]">{item.title}</span>
                    <span className="text-[#B12704] text-[17px] font-medium mt-1 w-full text-left">₹{Number(item.price).toFixed(2)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Row 2: Horizontal scroll - Related to items */}
          {viewedItems.length > 0 && (
            <div className="w-full bg-white p-5 pt-4 pb-6 mb-5 shadow-sm relative">
              <div className="flex items-baseline gap-4 mb-2">
                <h2 className="text-[21px] font-bold text-[#0F1111]">
                  {recentListings.length > 0 ? "Related to items you've viewed" : "Trending right now"}
                </h2>
                <a href="#" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline">See more</a>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {viewedItems.map((item: any, idx: number) => (
                  <Link href={`/dp/${item.id}?ref=base`} key={idx} className="min-w-[200px] flex flex-col items-center cursor-pointer group snap-start">
                    <div className="w-[200px] h-[200px] bg-white mb-2 flex items-center justify-center p-2">
                      <ImageWithFallback src={item.product?.images?.[0]?.imageUrl} alt="Product" className="max-h-[160px] max-w-[160px] object-contain group-hover:scale-105 transition" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Row 3: Horizontal scroll - Additional items */}
          <div className="w-full bg-white p-5 pt-4 pb-6 mb-5 shadow-sm relative">
            <div className="flex items-baseline gap-4 mb-2">
              <h2 className="text-[21px] font-bold text-[#0F1111]">Additional items to explore</h2>
              <a href="#" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline">See more</a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {[...Array(10)].map((_, i) => {
                const idx = i + 15; // Offset to get different items
                if(idx >= listings.length) return null;
                return (
                  <Link href={`/dp/${getListing(idx).id}?ref=base`} key={idx} className="min-w-[200px] flex flex-col items-center cursor-pointer group snap-start">
                    <div className="w-[200px] h-[200px] bg-white mb-2 flex items-center justify-center p-2">
                      <ImageWithFallback src={getImage(idx)} alt="Product" className="max-h-[160px] max-w-[160px] object-contain group-hover:scale-105 transition" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
