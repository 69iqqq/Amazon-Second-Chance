import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import { ClientPDP } from '@/components/shared/ClientPDP';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId: clerkId } = await auth();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          images: true,
          category: true,
          owner: true
        }
      },
      seller: true,
      reviews: {
        include: { user: true }
      }
    }
  });

  if (!listing) {
    notFound();
  }

  // Log interaction
  try {
    let dbUser = null;
    if (clerkId) {
      dbUser = await prisma.user.findUnique({ where: { clerkId } });
    }
    if ((prisma as any).userInteraction) {
      await (prisma as any).userInteraction.create({
        data: {
          userId: dbUser?.id || null,
          productId: listing.product.id,
          action: 'VIEWED'
        }
      });
    }
  } catch(e) { console.error(e) }

  // Find related products using Postgres Trigram similarity (AI-like semantic text matching)
  const similarIds: any[] = await prisma.$queryRawUnsafe(`
    SELECT id
    FROM "listings"
    WHERE id != $1::uuid AND status = 'ACTIVE' AND listing_type != 'NEW'
    ORDER BY title <-> $2::text
    LIMIT 6
  `, listing.id, listing.title);

  let relatedListings: any[] = [];
  if (similarIds.length > 0) {
    const ids = similarIds.map((r: any) => r.id);
    const unsortedListings = await prisma.listing.findMany({
      where: { id: { in: ids } },
      include: { product: { include: { images: true } } }
    });
    // Preserve Trigram similarity order
    relatedListings = ids.map(id => unsortedListings.find(l => l.id === id)).filter(Boolean);
  }

  return (
    <div className="min-h-screen bg-white">
      <AmazonNavbar />
      <ClientPDP listing={listing} relatedListings={relatedListings} isSecondLife={true} />
    </div>
  );
}
