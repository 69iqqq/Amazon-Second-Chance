import { prisma } from '@/lib/prisma';
import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import SearchClient from './SearchClient';

export default async function SearchResultsPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const params = await searchParams;
  const query = params.q || '';
  const isSecondLife = params.type === 'second-life';

  let listings: any[] = [];

  if (query) {
    const queryStr = `%${query}%`;
    const listingTypeCondition = isSecondLife ? "listing_type != 'NEW'" : "listing_type = 'NEW'";
    
    // Fetch IDs first using raw SQL to force GIN index and avoid unindexed description column scans
    const matchingIds: any[] = await prisma.$queryRawUnsafe(`
      SELECT id 
      FROM "listings"
      WHERE status = 'ACTIVE' 
        AND ${listingTypeCondition}
        AND title ILIKE $1
      LIMIT 40
    `, queryStr);

    if (matchingIds.length > 0) {
      const ids = matchingIds.map(m => m.id);
      listings = await prisma.listing.findMany({
        where: { id: { in: ids } },
        include: { 
          product: { include: { images: true } },
          reviews: { select: { rating: true } }
        }
      });
    }
  } else {
    listings = await (prisma.listing as any).findMany({
      where: {
        status: 'ACTIVE',
        listingType: isSecondLife ? { not: 'NEW' } : 'NEW',
      },
      include: { 
        product: { include: { images: true } },
        reviews: { select: { rating: true } }
      },
      take: 40
    });
  }

  // Calculate real average ratings and review counts
  const listingsWithRatings = listings.map(listing => {
    const totalReviews = listing.reviews?.length || 0;
    const avgRating = totalReviews > 0 
      ? (listing.reviews.reduce((sum: number, rev: any) => sum + rev.rating, 0) / totalReviews).toFixed(1)
      : "0.0";
    
    return {
      ...listing,
      avgRating,
      reviewCount: totalReviews
    };
  });

  return (
    <div className="min-h-screen bg-white pb-10">
      <AmazonNavbar forceSecondLife={isSecondLife} />
      <SearchClient initialListings={listingsWithRatings} query={query} isSecondLife={isSecondLife} />
    </div>
  );
}
