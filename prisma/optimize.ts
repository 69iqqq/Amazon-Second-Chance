import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  console.log('Updating listing types to NEW...');
  const res = await prisma.$executeRawUnsafe(`UPDATE "listings" SET "listing_type" = 'NEW'::"ListingType" WHERE "listing_type" = 'REFURBISHED'::"ListingType"`);
  console.log(`Updated listings:`, res);

  console.log('Creating pg_trgm extension...');
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

  console.log('Creating GIN index on title...');
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS listing_title_trgm_idx ON "listings" USING gin (title gin_trgm_ops);`);
  
  console.log('DB optimization complete.');
  process.exit(0);
}

run();
