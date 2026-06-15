import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ngos = [
    {
      name: 'Goonj',
      type: 'NGO' as any,
      email: 'contact@goonj.example.com',
      status: 'ACTIVE' as any,
      distanceText: '1.2 km away',
      keywords: ['kettle', 'bottle', 'appliance', 'electronic', 'phone', 'laptop', 'charger', 'heater', 'earbuds', 'chair', 'table', 'sofa', 'furniture'],
      needs: 'Electronics, basic home appliances, and furniture',
    },
    {
      name: 'CRY',
      type: 'NGO' as any,
      email: 'contact@cry.example.com',
      status: 'ACTIVE' as any,
      distanceText: '2.1 km away',
      keywords: ['book', 'toy', 'stationery', 'pencil', 'pen', 'notebook', 'table', 'chair'],
      needs: 'Educational materials, toys, and study furniture',
    },
    {
      name: 'HelpAge India',
      type: 'NGO' as any,
      email: 'contact@helpage.example.com',
      status: 'ACTIVE' as any,
      distanceText: '3.4 km away',
      keywords: ['medical', 'aid', 'blanket', 'walker', 'wheelchair', 'monitor', 'chair', 'sofa'],
      needs: 'Medical devices, mobility aids, and comfortable seating',
    }
  ];

  for (const ngo of ngos) {
    const existing = await prisma.partner.findFirst({
      where: { name: ngo.name, type: 'NGO' }
    });

    if (existing) {
      await prisma.partner.update({
        where: { id: existing.id },
        data: {
          keywords: ngo.keywords,
          needs: ngo.needs,
          distanceText: ngo.distanceText,
        }
      });
      console.log(`Updated NGO: ${ngo.name}`);
    } else {
      await prisma.partner.create({
        data: ngo
      });
      console.log(`Created NGO: ${ngo.name}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
