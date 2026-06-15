import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const FAKE_USERS = Array.from({ length: 30 }).map((_, i) => ({
  clerkId: `fake-user-${i+1}`, 
  email: `customer${i+1}@example.com`, 
  firstName: `User${i+1}`, 
  lastName: 'Customer'
}));

const POSITIVE_REVIEWS = [
  "Amazing product, totally worth the price! 100% recommended.",
  "Very high quality, exceeded my expectations. Use it every day.",
  "Works perfectly. Fast shipping from Amazon as always.",
  "I was skeptical but it turned out to be a great purchase.",
  "Excellent build quality and design. Looks very premium.",
  "Got this for a great deal. Highly satisfied.",
  "Exactly as described. Best in this price segment.",
  "Packaging was secure and the product feels very durable.",
  "Perfect fit for my needs. Great battery life too.",
  "Awesome experience, the AI certification badge gave me confidence."
];

const AVERAGE_REVIEWS = [
  "It's okay, does the job but could be better.",
  "Decent for the price, but build quality is average.",
  "A bit overpriced, but functional.",
  "Good, but it has some minor flaws."
];

const BATCH_SIZE = 5000;

async function main() {
  console.log('Starting Massive Reviews Seed Pipeline...');

  // 1. Create Users
  const createdUsers = [];
  for (const user of FAKE_USERS) {
    let existing = await prisma.user.findUnique({ where: { clerkId: user.clerkId } });
    if (!existing) {
      existing = await prisma.user.create({
        data: {
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      });
    }
    createdUsers.push(existing);
  }

  console.log(`Ensured ${createdUsers.length} fake users exist.`);

  // 2. Fetch all listing IDs in chunks
  let skip = 0;
  let totalReviewsInserted = 0;
  let hasMoreListings = true;

  while (hasMoreListings) {
    const listings = await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true },
      skip,
      take: BATCH_SIZE
    });

    if (listings.length === 0) {
      hasMoreListings = false;
      break;
    }

    console.log(`Fetched batch of ${listings.length} listings. Generating reviews...`);

    const newReviews = [];

    for (const listing of listings) {
      const numReviews = Math.floor(Math.random() * 6) + 10; // 10 to 15 reviews per product
      
      const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
      const selectedUsers = shuffledUsers.slice(0, numReviews);

      for (const user of selectedUsers) {
        const isExcellent = Math.random() > 0.2;
        const rating = isExcellent ? (Math.random() > 0.5 ? 5 : 4) : 3;
        
        let comment = '';
        if (rating >= 4) {
          comment = POSITIVE_REVIEWS[Math.floor(Math.random() * POSITIVE_REVIEWS.length)];
        } else {
          comment = AVERAGE_REVIEWS[Math.floor(Math.random() * AVERAGE_REVIEWS.length)];
        }

        newReviews.push({
          id: randomUUID(),
          listingId: listing.id,
          userId: user.id,
          rating,
          title: isExcellent ? "Great Product" : "Decent",
          comment,
          status: 'APPROVED'
        });
      }
    }

    if (newReviews.length > 0) {
      await prisma.review.createMany({
        data: newReviews,
        skipDuplicates: true
      });
      totalReviewsInserted += newReviews.length;
      console.log(`Inserted ${newReviews.length} reviews. Total so far: ${totalReviewsInserted}`);
    }

    skip += BATCH_SIZE;
  }

  console.log(`\nMassive Reviews Seeding Completed! Total reviews inserted: ${totalReviewsInserted}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
