import { prisma } from '@/lib/prisma';
import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import CatalogueClient from './CatalogueClient';

export default async function SecondLifeBuyPage() {
  // Fetch active listings that are either PRE_OWNED (AI Graded) or REFURBISHED (Amazon)
  const listings = await prisma.listing.findMany({
    where: { 
      status: 'ACTIVE',
      listingType: { in: ['PRE_OWNED', 'REFURBISHED'] }
    },
    include: {
      product: {
        include: {
          images: true,
          category: true
        }
      },
      reviews: {
        select: { rating: true }
      }
    },
    take: 100,
    orderBy: { createdAt: 'desc' }
  });

  // Calculate avgRating and reviewCount for each listing
  const listingsWithRatings = listings.map(listing => {
    const totalReviews = listing.reviews.length;
    const avgRating = totalReviews > 0 
      ? (listing.reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews).toFixed(1)
      : "0.0";
    
    return {
      ...listing,
      avgRating,
      reviewCount: totalReviews
    };
  });

  // Sort: PRE_OWNED (User AI Graded) first, then REFURBISHED
  const sortedListings = listingsWithRatings.sort((a, b) => {
    if (a.listingType === 'PRE_OWNED' && b.listingType !== 'PRE_OWNED') return -1;
    if (a.listingType !== 'PRE_OWNED' && b.listingType === 'PRE_OWNED') return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <AmazonNavbar />
      <CatalogueClient initialListings={sortedListings as any} />
    </div>
  );
}
