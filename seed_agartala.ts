import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const agartalaPartners = [
    {
      name: "Gupta General Store (Kirana Hub)",
      type: "KIRANA_HUB",
      email: "gupta.kirana.agartala@example.com",
      phone: "+91 9876543210",
      address: "Akhaura Road, Near Post Office",
      city: "Agartala",
      state: "Tripura",
      country: "India",
      latitude: 23.8335,
      longitude: 91.2828,
      status: "ACTIVE"
    },
    {
      name: "Sharma Kirana & General Store",
      type: "KIRANA_HUB",
      email: "sharma.hub@example.com",
      phone: "+91 9876543211",
      address: "Post Office Chowmuhani",
      city: "Agartala",
      state: "Tripura",
      country: "India",
      latitude: 23.8310,
      longitude: 91.2855,
      status: "ACTIVE"
    },
    {
      name: "Das Grocery Point",
      type: "KIRANA_HUB",
      email: "das.grocery@example.com",
      phone: "+91 9876543212",
      address: "Battala Market Area",
      city: "Agartala",
      state: "Tripura",
      country: "India",
      latitude: 23.8265,
      longitude: 91.2805,
      status: "ACTIVE"
    },
    {
      name: "Tripura Provision Store",
      type: "KIRANA_HUB",
      email: "tripura.provision@example.com",
      phone: "+91 9876543213",
      address: "GB Bazar, Kunjaban",
      city: "Agartala",
      state: "Tripura",
      country: "India",
      latitude: 23.8450,
      longitude: 91.2910,
      status: "ACTIVE"
    },
    {
      name: "Agartala Super Market Hub",
      type: "KIRANA_HUB",
      email: "supermarket.hub@example.com",
      phone: "+91 9876543214",
      address: "Gol Bazar (Maharaj Ganj Bazar)",
      city: "Agartala",
      state: "Tripura",
      country: "India",
      latitude: 23.8320,
      longitude: 91.2880,
      status: "ACTIVE"
    },
    {
      name: "Tripura Foundation for Education (NGO)",
      type: "NGO",
      email: "ngo.tfe@example.com",
      phone: "+91 9876543215",
      address: "Ramnagar Road No. 4",
      city: "Agartala",
      state: "Tripura",
      country: "India",
      latitude: 23.8355,
      longitude: 91.2780,
      status: "ACTIVE"
    },
    {
      name: "Helping Hands Agartala",
      type: "NGO",
      email: "helpinghands.agartala@example.com",
      phone: "+91 9876543216",
      address: "Kerchowmuhani",
      city: "Agartala",
      state: "Tripura",
      country: "India",
      latitude: 23.8370,
      longitude: 91.2840,
      status: "ACTIVE"
    },
    {
      name: "Green Tripura Society",
      type: "NGO",
      email: "greentripura@example.com",
      phone: "+91 9876543217",
      address: "Indranagar",
      city: "Agartala",
      state: "Tripura",
      country: "India",
      latitude: 23.8400,
      longitude: 91.2950,
      status: "ACTIVE"
    },
    {
      name: "Rural Development Trust",
      type: "NGO",
      email: "rdt.tripura@example.com",
      phone: "+91 9876543218",
      address: "Kunjaban Extension",
      city: "Agartala",
      state: "Tripura",
      country: "India",
      latitude: 23.8480,
      longitude: 91.2900,
      status: "ACTIVE"
    },
    {
      name: "Smile Agartala (NGO)",
      type: "NGO",
      email: "smile.agartala@example.com",
      phone: "+91 9876543219",
      address: "Banamalipur",
      city: "Agartala",
      state: "Tripura",
      country: "India",
      latitude: 23.8340,
      longitude: 91.2920,
      status: "ACTIVE"
    }
  ];

  for (const partner of agartalaPartners) {
    await prisma.partner.create({
      data: partner as any
    });
  }
  console.log("Successfully seeded 10 Kirana Hubs and NGOs near Agartala.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
