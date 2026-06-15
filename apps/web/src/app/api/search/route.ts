import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const type = searchParams.get('type');
  const isSecondLife = type === 'second-life';

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    const queryStr = `%${q}%`;
    const listingTypeCondition = isSecondLife ? "listing_type != 'NEW'" : "listing_type = 'NEW'";
    
    const listings: any[] = await prisma.$queryRawUnsafe(`
      SELECT title 
      FROM "listings"
      WHERE status = 'ACTIVE' 
        AND ${listingTypeCondition}
        AND title ILIKE $1
      LIMIT 8
    `, queryStr);

    const suggestions = new Set<string>();
    
    // Add the exact query as the first suggestion
    suggestions.add(q.toLowerCase());

    listings.forEach(l => {
      const titleLower = l.title.toLowerCase();
      const queryLower = q.toLowerCase();
      const idx = titleLower.indexOf(queryLower);
      
      if (idx !== -1) {
        // Extract up to 3-4 words starting from the query
        const matchStr = titleLower.substring(idx);
        const words = matchStr.split(' ').slice(0, 4).join(' ');
        
        // Clean up punctuation at the end
        const clean = words.replace(/[^a-z0-9 ]/g, '').trim();
        if (clean.length > 0 && clean.length < 50) {
          suggestions.add(clean);
        }
      }
    });

    const results = Array.from(suggestions).slice(0, 10);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
