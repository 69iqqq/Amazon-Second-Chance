import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  console.log('Fetching 2000 random NEW listings...');
  const newItems = await prisma.$queryRawUnsafe<any[]>(`
    SELECT id, product_id, seller_id, price
    FROM "listings"
    WHERE listing_type = 'NEW'
    ORDER BY RANDOM()
    LIMIT 2000
  `);

  console.log(`Creating ${newItems.length} REFURBISHED/PRE_OWNED listings...`);
  
  let created = 0;
  for (const item of newItems) {
    const type = Math.random() > 0.5 ? 'REFURBISHED' : 'PRE_OWNED';
    const discount = 0.6 + Math.random() * 0.2; // 60% to 80% of original price (20-40% discount)
    const newPrice = Number(item.price) * discount;
    
    await prisma.$executeRawUnsafe(`
      INSERT INTO "listings" ("id", "title", "description", "price", "listing_type", "status", "product_id", "seller_id", "view_count", "created_at", "updated_at")
      SELECT 
        gen_random_uuid(), 
        title, 
        description, 
        $1, 
        $2::"ListingType", 
        'ACTIVE'::"ListingStatus", 
        product_id, 
        seller_id, 
        0, 
        NOW(), 
        NOW()
      FROM "listings" WHERE id = $3::uuid
    `, newPrice, type, item.id);
    created++;
    if (created % 500 === 0) console.log(`Created ${created}...`);
  }
  
  console.log('Done!');
  process.exit(0);
}
run();
