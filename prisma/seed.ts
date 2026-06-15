// ============================================================================
// Amazon 2nd Chance — Database Seed Script
// ============================================================================
// Populates the database with realistic demo data matching the UI mockups.
// Run with: npx prisma db seed
// ============================================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // --------------------------------------------------------------------------
  // 1. Product Categories
  // --------------------------------------------------------------------------
  console.log("📂 Seeding product categories...");

  const categories = await Promise.all([
    prisma.productCategory.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and gadgets",
      },
    }),
    prisma.productCategory.upsert({
      where: { slug: "mobile-phones" },
      update: {},
      create: {
        name: "Mobile Phones",
        slug: "mobile-phones",
        description: "Smartphones and mobile devices",
      },
    }),
    prisma.productCategory.upsert({
      where: { slug: "laptops" },
      update: {},
      create: {
        name: "Laptops",
        slug: "laptops",
        description: "Laptops and notebooks",
      },
    }),
    prisma.productCategory.upsert({
      where: { slug: "home-appliances" },
      update: {},
      create: {
        name: "Home Appliances",
        slug: "home-appliances",
        description: "Home and kitchen appliances",
      },
    }),
    prisma.productCategory.upsert({
      where: { slug: "clothing" },
      update: {},
      create: {
        name: "Clothing",
        slug: "clothing",
        description: "Apparel and clothing",
      },
    }),
    prisma.productCategory.upsert({
      where: { slug: "furniture" },
      update: {},
      create: {
        name: "Furniture",
        slug: "furniture",
        description: "Home and office furniture",
      },
    }),
    prisma.productCategory.upsert({
      where: { slug: "phones-accessories" },
      update: {},
      create: {
        name: "Phones & Accessories",
        slug: "phones-accessories",
        description: "Phone cases, chargers, and accessories",
      },
    }),
    prisma.productCategory.upsert({
      where: { slug: "computers" },
      update: {},
      create: {
        name: "Computers",
        slug: "computers",
        description: "Desktop computers and peripherals",
      },
    }),
  ]);

  console.log(`  ✅ ${categories.length} categories seeded\n`);

  // --------------------------------------------------------------------------
  // 2. Partners
  // --------------------------------------------------------------------------
  console.log("🤝 Seeding partners...");

  const partners = await Promise.all([
    prisma.partner.create({
      data: {
        name: "GreenTech Refurbishment Center",
        type: "REFURBISHMENT_CENTER",
        email: "ops@greentech-refurb.com",
        phone: "+91-9876543210",
        address: "42 Industrial Area, Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        country: "India",
        latitude: 28.6273,
        longitude: 77.3714,
        status: "ACTIVE",
      },
    }),
    prisma.partner.create({
      data: {
        name: "Hope Foundation NGO",
        type: "NGO",
        email: "info@hopefoundation.org",
        phone: "+91-9876543211",
        address: "15 Community Center, Lodhi Road",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        latitude: 28.5918,
        longitude: 77.2273,
        status: "ACTIVE",
      },
    }),
    prisma.partner.create({
      data: {
        name: "EcoRecycle India",
        type: "RECYCLER",
        email: "ops@ecorecycle.in",
        phone: "+91-9876543212",
        address: "78 Recycling Zone, MIDC",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        latitude: 18.5204,
        longitude: 73.8567,
        status: "ACTIVE",
      },
    }),
    prisma.partner.create({
      data: {
        name: "Sharma General Store",
        type: "KIRANA_HUB",
        email: "sharma.store@email.com",
        phone: "+91-9876543213",
        address: "23 Main Market, Lajpat Nagar",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        latitude: 28.5700,
        longitude: 77.2400,
        status: "ACTIVE",
      },
    }),
    prisma.partner.create({
      data: {
        name: "Care & Share NGO",
        type: "NGO",
        email: "contact@careandshare.org",
        phone: "+91-9876543214",
        address: "9 Gandhi Nagar",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        latitude: 19.0760,
        longitude: 72.8777,
        status: "ACTIVE",
      },
    }),
  ]);

  console.log(`  ✅ ${partners.length} partners seeded\n`);

  // --------------------------------------------------------------------------
  // 3. Demo note
  // --------------------------------------------------------------------------
  console.log("ℹ️  Note: User data is NOT seeded here.");
  console.log("   Users are created via Clerk webhooks when they sign up.");
  console.log("   After signing up in the app, run the user-specific seed");
  console.log("   to populate products, returns, listings, etc.\n");

  // --------------------------------------------------------------------------
  // 4. KPI Records (for admin dashboard)
  // --------------------------------------------------------------------------
  console.log("📊 Seeding KPI records...");

  const kpiRecords = await Promise.all([
    prisma.kpiRecord.create({
      data: {
        metricName: "total_users",
        metricValue: 12000,
        metadata: { period: "all_time" },
      },
    }),
    prisma.kpiRecord.create({
      data: {
        metricName: "total_returns",
        metricValue: 3500,
        metadata: { period: "all_time" },
      },
    }),
    prisma.kpiRecord.create({
      data: {
        metricName: "total_listings",
        metricValue: 1800,
        metadata: { period: "all_time" },
      },
    }),
    prisma.kpiRecord.create({
      data: {
        metricName: "co2_saved_kg",
        metricValue: 1520,
        metadata: { period: "all_time" },
      },
    }),
    prisma.kpiRecord.create({
      data: {
        metricName: "revenue_recovered",
        metricValue: 245000,
        metadata: { period: "last_30_days", currency: "INR" },
      },
    }),
    prisma.kpiRecord.create({
      data: {
        metricName: "marketplace_gmv",
        metricValue: 890000,
        metadata: { period: "last_30_days", currency: "INR" },
      },
    }),
  ]);

  console.log(`  ✅ ${kpiRecords.length} KPI records seeded\n`);

  console.log("✅ Database seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
