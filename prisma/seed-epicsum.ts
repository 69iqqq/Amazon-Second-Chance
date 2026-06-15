import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const DATASET_DIR = path.join(__dirname, '../epicsum_dataset/product-images-dataset');
const BATCH_SIZE = 5000; // Insert 5000 products at a time
const MAX_TOTAL_LIMIT = 100000; // Cap at 100k to prevent completely blowing up the DB free tier

interface CsvRow {
  name: string;
  main_category: string;
  sub_category: string;
  image: string;
  link: string;
  ratings: string;
  no_of_ratings: string;
  discount_price: string;
  actual_price: string;
}

function parsePrice(priceStr: string | undefined): number {
  if (!priceStr) return 0;
  const cleanStr = priceStr.replace(/[^\d.]/g, '');
  const val = parseFloat(cleanStr);
  return isNaN(val) ? 0 : val;
}

async function main() {
  console.log('Starting Massive DB Seed Pipeline...');

  // 1. Get or Create Admin User
  let user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!user) user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: 'system-seed-user-12345',
        email: 'system@amazon2ndlife.test',
        firstName: 'System',
        lastName: 'Admin',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });
  }

  console.log(`Using user ${user.id} (${user.email}) as seller.`);

  // 2. Pre-fetch Categories to reduce lookups
  const dbCategories = await prisma.productCategory.findMany();
  const categoryMap = new Map<string, string>();
  for (const cat of dbCategories) {
    categoryMap.set(cat.slug, cat.id);
  }

  // 3. Get all CSV files
  const files = fs.readdirSync(DATASET_DIR).filter(f => f.endsWith('.csv'));
  console.log(`Found ${files.length} CSV files to process.`);

  let totalProcessed = 0;

  for (const file of files) {
    if (totalProcessed >= MAX_TOTAL_LIMIT) break;

    const filePath = path.join(DATASET_DIR, file);
    console.log(`\nProcessing file: ${file}`);

    const results: CsvRow[] = [];
    
    // Read entire file into memory first (CSV files are max 6MB, fine for RAM)
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Loaded ${results.length} rows from ${file}. Batch inserting...`);

    // Process in batches
    for (let i = 0; i < results.length; i += BATCH_SIZE) {
      if (totalProcessed >= MAX_TOTAL_LIMIT) break;

      const batch = results.slice(i, i + BATCH_SIZE);
      const newProducts = [];
      const newImages = [];
      const newListings = [];
      const newCategoriesToInsert = new Map<string, any>(); // slug -> data

      for (const row of batch) {
        if (!row.name || !row.image) continue;

        let categoryName = row.main_category || 'General';
        categoryName = categoryName.split(',')[0].trim().replace(/\b\w/g, l => l.toUpperCase());
        const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Handle Categories missing from DB
        let categoryId = categoryMap.get(slug);
        if (!categoryId) {
          if (!newCategoriesToInsert.has(slug)) {
            const newCatId = randomUUID();
            newCategoriesToInsert.set(slug, {
              id: newCatId,
              name: categoryName,
              slug,
              description: `Auto-generated category for ${categoryName}`
            });
            categoryMap.set(slug, newCatId);
          }
          categoryId = categoryMap.get(slug)!;
        }

        const actPrice = parsePrice(row.actual_price);
        const discPrice = parsePrice(row.discount_price);
        const originalPrice = actPrice > 0 ? actPrice : (discPrice > 0 ? discPrice : 1000);
        const currentValue = discPrice > 0 ? discPrice : (originalPrice * 0.8);
        
        const productId = randomUUID();
        const sku = `EPICSUM-${randomUUID().substring(0, 8).toUpperCase()}`;

        newProducts.push({
          id: productId,
          sku,
          name: row.name.substring(0, 255),
          description: `Imported from dataset. Sub-category: ${row.sub_category}`,
          originalPrice,
          currentValue,
          categoryId,
          ownerId: user.id,
          status: 'USED'
        });

        newImages.push({
          id: randomUUID(),
          productId,
          imageUrl: row.image,
          altText: row.name.substring(0, 255),
          sortOrder: 0
        });

        newListings.push({
          id: randomUUID(),
          sellerId: user.id,
          productId,
          title: row.name.substring(0, 255),
          description: `Excellent condition. Refurbished.`,
          price: currentValue,
          listingType: 'REFURBISHED',
          status: 'ACTIVE'
        });
      }

      // 1. Insert new Categories if any
      if (newCategoriesToInsert.size > 0) {
        await prisma.productCategory.createMany({
          data: Array.from(newCategoriesToInsert.values()),
          skipDuplicates: true
        });
      }

      // 2. Insert Products
      if (newProducts.length > 0) {
        await prisma.product.createMany({ data: newProducts, skipDuplicates: true });
        await prisma.productImage.createMany({ data: newImages, skipDuplicates: true });
        await prisma.listing.createMany({ data: newListings, skipDuplicates: true });
        totalProcessed += newProducts.length;
        console.log(`Inserted batch of ${newProducts.length} products. Total so far: ${totalProcessed}`);
      }
    }
  }

  console.log(`\nMassive Seeding Completed! Total products inserted: ${totalProcessed}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
