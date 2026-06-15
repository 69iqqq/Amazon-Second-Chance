import { prisma } from '@/lib/prisma';
import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import Link from 'next/link';
export default async function ShopRefurbishedPage() {
  const refurbishedListings = await (prisma.listing as any).findMany({
    where: { status: 'ACTIVE', listingType: 'REFURBISHED' },
    include: { product: { include: { images: true } } },
    take: 30,
  });

  // Helpers
  const getListing = (index: number) => refurbishedListings[index % (refurbishedListings.length || 1)];
  const getImage = (index: number) => getListing(index)?.product?.images?.[0]?.imageUrl || '/products/earbuds.png';
  const getPrice = (index: number) => Number(getListing(index)?.price || 0).toLocaleString('en-IN');
  const getTitle = (index: number) => getListing(index)?.title || 'Product';

  return (
    <div className="min-h-screen bg-[#e3e6e6] flex flex-col relative">
      <AmazonNavbar />

      <main className="w-full max-w-[1500px] mx-auto relative flex-1 flex flex-col items-center">
        {/* Background Banner Carousel (Refurbished Theme) */}
        <div className="w-full h-[250px] sm:h-[400px] lg:h-[600px] bg-gradient-to-r from-[#2c3e50] to-[#3498db] absolute top-0 left-0 right-0 z-0 mask-image-gradient">
          <div className="w-full h-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Amazon Renewed</h1>
                <p className="text-xl md:text-2xl">Like-new products you can trust</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#e3e6e6] to-transparent"></div>
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full px-4 sm:px-6 relative z-10 pt-[150px] sm:pt-[250px] lg:pt-[350px] pb-10">
          
          {/* Row 1: 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            
            {/* Card 1: 4-grid deals */}
            <div className="bg-white p-5 pb-8 h-[420px] flex flex-col z-20 shadow-sm relative">
              <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Refurbished Deals</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1">
                {[0, 1, 2, 3].map(i => (
                  <Link href={`/dp/${getListing(i)?.id}`} key={i} className="flex flex-col cursor-pointer group">
                    <div className="bg-white h-[100px] w-full mb-1 flex items-center justify-center overflow-hidden">
                      <ImageWithFallback src={getImage(i)} alt="Product" className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
                    </div>
                    <span className="text-[12px] text-[#0F1111] line-clamp-1 group-hover:text-[#C7511F]">{getTitle(i)}</span>
                  </Link>
                ))}
              </div>
              <Link href="#" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline mt-2 absolute bottom-5">See all refurbished deals</Link>
            </div>

            {/* Card 2: 4-grid categories */}
            <div className="bg-white p-5 pb-8 h-[420px] flex flex-col z-20 shadow-sm relative">
              <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Up to 70% off | Laptops</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1">
                {[4, 5, 6, 7].map(i => (
                  <Link href={`/dp/${getListing(i)?.id}`} key={i} className="flex flex-col cursor-pointer group">
                    <div className="bg-white h-[100px] w-full mb-1 flex items-center justify-center overflow-hidden">
                      <ImageWithFallback src={getImage(i)} alt="Product" className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
                    </div>
                    <span className="text-[12px] text-[#0F1111] line-clamp-1 group-hover:text-[#C7511F]">{getTitle(i)}</span>
                  </Link>
                ))}
              </div>
              <Link href="#" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline mt-2 absolute bottom-5">Explore all laptops</Link>
            </div>
            
            {/* Card 3: 4-grid more */}
            <div className="bg-white p-5 pb-8 h-[420px] flex flex-col z-20 shadow-sm relative">
              <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Up to 60% off | Mobiles</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1">
                {[8, 9, 10, 11].map(i => (
                  <Link href={`/dp/${getListing(i)?.id}`} key={i} className="flex flex-col cursor-pointer group">
                    <div className="bg-white h-[100px] w-full mb-1 flex items-center justify-center overflow-hidden">
                      <ImageWithFallback src={getImage(i)} alt="Product" className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
                    </div>
                    <span className="text-[12px] text-[#0F1111] line-clamp-1 group-hover:text-[#C7511F]">{getTitle(i)}</span>
                  </Link>
                ))}
              </div>
              <Link href="#" className="text-[#007185] text-[13px] hover:text-[#C7511F] hover:underline mt-2 absolute bottom-5">Explore all mobiles</Link>
            </div>

            {/* Card 4 (1 big item) */}
            <div className="bg-white p-5 pb-8 h-[420px] flex flex-col z-20 shadow-sm relative cursor-pointer group">
              <h2 className="text-[21px] font-bold text-[#0F1111] mb-3 leading-tight">Deal of the Day</h2>
              <Link href={`/dp/${getListing(12)?.id}`} className="flex-1 flex flex-col h-full">
                <div className="flex-1 w-full relative mb-2 flex items-center justify-center">
                  <ImageWithFallback src={getImage(12)} alt="Product" className="max-w-[90%] max-h-[220px] object-contain group-hover:opacity-90 transition" />
                </div>
                <div className="flex flex-col mt-auto">
                  <span className="text-[14px] text-[#0F1111] line-clamp-2 leading-snug hover:text-[#C7511F]">{getTitle(12)}</span>
                  <span className="text-[#B12704] text-[18px] font-medium mt-1">₹{getPrice(12)}</span>
                </div>
              </Link>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
