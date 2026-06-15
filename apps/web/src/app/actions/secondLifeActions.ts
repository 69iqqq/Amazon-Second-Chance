'use server';
import { prisma } from '@/lib/prisma';

import { auth } from '@clerk/nextjs/server';

export async function getEligiblePastPurchases() {
  let dbUser = null;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) {
      dbUser = await prisma.user.findUnique({ where: { clerkId } });
    }
  } catch (e) {
    console.error(e);
  }

  if (!dbUser) {
    dbUser = await prisma.user.findFirst();
  }
  if (!dbUser) return [];

  const orders = await prisma.order.findMany({
    where: { userId: dbUser.id },
    include: {
      items: {
        include: {
          product: {
            include: { images: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const products: any[] = [];
  
  for (const order of orders) {
    for (const item of order.items) {
      if (item.product) {
        const isGood = Math.random() > 0.4;
        products.push({
          id: item.product.id,
          orderId: order.id,
          title: item.product.name,
          purchasedAt: order.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          image: item.product.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
          originalPrice: Number(item.price), // We paid this price during order
          expectedCondition: isGood ? 'Good' : 'Poor - Damaged',
          disposition: isGood ? 'RESALE' : 'RECYCLE',
          suggestedPrice: Number(item.price) * 0.5
        });
      }
    }
  }

  return products;
}

export async function placeOrder(cartItems: any[], totalAmount: number) {
  let dbUser = null;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) {
      dbUser = await prisma.user.findUnique({ where: { clerkId } });
    }
  } catch (e) {
    console.error(e);
  }

  if (!dbUser) {
    dbUser = await prisma.user.findFirst();
  }
  if (!dbUser) throw new Error("No user found");

  const orderItemsData = [];
  
  for (const item of cartItems) {
    const listing = await prisma.listing.findUnique({ where: { id: item.id } });
    
    if (listing) {
      orderItemsData.push({
        listingId: listing.id,
        productId: listing.productId,
        price: item.price,
        quantity: item.quantity,
        isReturnable: item.isReturnable ?? true,
        returnFee: item.returnFee || 0
      });
    } else {
      let productListing = await prisma.listing.findFirst({ where: { productId: item.id } });
      
      if (!productListing) {
        productListing = await prisma.listing.create({
          data: {
            productId: item.id,
            sellerId: dbUser.id,
            title: item.title || "Amazon Retail",
            price: item.price,
            listingType: "NEW",
            status: "ACTIVE"
          }
        });
      }
      
      orderItemsData.push({
        listingId: productListing.id,
        productId: item.id,
        price: item.price,
        quantity: item.quantity,
        isReturnable: item.isReturnable ?? true,
        returnFee: item.returnFee || 0
      });
    }
  }

  const order = await prisma.order.create({
    data: {
      userId: dbUser.id,
      status: 'PLACED',
      totalAmount: totalAmount,
      items: {
        create: orderItemsData
      }
    }
  });

  return { success: true, orderId: order.id };
}

export async function createSecondLifeListing(productId: string, price: number) {
  let dbUser = null;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) {
      dbUser = await prisma.user.findUnique({ where: { clerkId } });
    }
  } catch (e) {
    console.error(e);
  }

  if (!dbUser) {
    dbUser = await prisma.user.findFirst();
  }

  if (!dbUser) throw new Error("No user found");

  const product = await prisma.product.findUnique({ where: { id: productId }});
  
  if (!product) throw new Error("Product not found");

  // Create active listing
  const listing = await prisma.listing.create({
    data: {
      productId,
      sellerId: dbUser.id,
      title: product.name,
      description: 'Used item listed via Amazon 2nd Chance AI Flow',
      price: price,
      listingType: 'PRE_OWNED',
      status: 'ACTIVE',
    }
  });

  return listing;
}

export async function getGreenCreditWallet() {
  let dbUser = null;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) dbUser = await prisma.user.findUnique({ where: { clerkId } });
  } catch (e) { console.error(e); }

  if (!dbUser) dbUser = await prisma.user.findFirst();
  if (!dbUser) return null;

  let wallet = await prisma.greenCreditWallet.findUnique({
    where: { userId: dbUser.id },
    include: { transactions: { orderBy: { createdAt: 'desc' } } }
  });

  if (!wallet) {
    wallet = await prisma.greenCreditWallet.create({
      data: {
        userId: dbUser.id,
        balance: 500, // Give them 500 initial mock credits for demo
        lifetimeEarned: 500,
        transactions: {
          create: {
            amount: 500,
            type: 'EARNED',
            reason: 'Welcome Bonus'
          }
        }
      },
      include: { transactions: { orderBy: { createdAt: 'desc' } } }
    });
  }

  return wallet;
}

export async function redeemGreenCredits(amount: number, reason: string) {
  let dbUser = null;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) dbUser = await prisma.user.findUnique({ where: { clerkId } });
  } catch (e) { console.error(e); }

  if (!dbUser) dbUser = await prisma.user.findFirst();
  if (!dbUser) throw new Error("User not found");

  const wallet = await prisma.greenCreditWallet.findUnique({ where: { userId: dbUser.id } });
  if (!wallet) throw new Error("Wallet not found");

  if (wallet.balance < amount) {
    throw new Error("Insufficient Green Credits");
  }

  // Update wallet and add transaction
  const updatedWallet = await prisma.$transaction([
    prisma.greenCreditWallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
        lifetimeRedeemed: { increment: amount }
      }
    }),
    prisma.greenCreditTransaction.create({
      data: {
        walletId: wallet.id,
        amount: amount,
        type: 'REDEEMED',
        reason: reason
      }
    })
  ]);

  return updatedWallet[0];
}

export async function createKiranaDropoff(productId: string, customerName: string, notes: string) {
  let dbUser = null;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) dbUser = await prisma.user.findUnique({ where: { clerkId } });
  } catch (e) { console.error(e); }

  if (!dbUser) dbUser = await prisma.user.findFirst();
  if (!dbUser) throw new Error("No user found");

  // Get a random active Kirana Hub partner, or create one if none exist
  let kiranaPartner = await prisma.partner.findFirst({ where: { type: 'KIRANA_HUB' } });
  if (!kiranaPartner) {
    kiranaPartner = await prisma.partner.create({
      data: {
        name: 'Sharma General Store (Kirana Hub)',
        type: 'KIRANA_HUB',
        email: 'sharma.kirana@example.com',
        status: 'ACTIVE'
      }
    });
  }

  // Create ReturnRequest and KiranaPickup
  const returnRequest = await prisma.returnRequest.create({
    data: {
      userId: dbUser.id,
      productId: productId,
      reason: 'AI Appraised Kirana Drop-off',
      status: 'REQUESTED'
    }
  });

  const pickup = await prisma.kiranaPickup.create({
    data: {
      partnerId: kiranaPartner.id,
      productId: productId,
      customerName: customerName,
      status: 'SCHEDULED',
      scheduledDate: new Date(),
      notes: notes
    }
  });

  return { returnRequest, pickup };
}

export async function getKiranaPickups() {
  let kiranaPartner = await prisma.partner.findFirst({ where: { type: 'KIRANA_HUB' } });
  if (!kiranaPartner) return [];

  const pickups = await prisma.kiranaPickup.findMany({
    where: { partnerId: kiranaPartner.id },
    orderBy: { createdAt: 'desc' }
  });

  return pickups;
}

export async function processKiranaRefund(pickupId: string) {
  const pickup = await prisma.kiranaPickup.findUnique({ where: { id: pickupId }});
  if (!pickup) throw new Error("Pickup not found");

  await prisma.kiranaPickup.update({
    where: { id: pickupId },
    data: { status: 'COMPLETED', completedAt: new Date() }
  });

  // Give the user Green Credits for completing the return!
  let dbUser = null;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) dbUser = await prisma.user.findUnique({ where: { clerkId } });
  } catch (e) {}

  if (!dbUser) dbUser = await prisma.user.findFirst();

  if (dbUser) {
    let wallet = await prisma.greenCreditWallet.findUnique({ where: { userId: dbUser.id }});
    if (wallet) {
      await prisma.greenCreditWallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: 100 },
          lifetimeEarned: { increment: 100 }
        }
      });
      await prisma.greenCreditTransaction.create({
        data: {
          walletId: wallet.id,
          amount: 100,
          type: 'EARNED',
          reason: 'Kirana Drop-off Bonus'
        }
      });
    }
  }

  return { success: true };
}

export async function getMatchingNgo(title: string) {
  try {
    const ngos = await prisma.partner.findMany({
      where: { type: 'NGO' }
    });

    const lowerTitle = title.toLowerCase();
    for (const ngo of ngos) {
      if (ngo.keywords && Array.isArray(ngo.keywords)) {
        if (ngo.keywords.some((kw: string) => lowerTitle.includes(kw))) {
          return {
            name: ngo.name,
            distance: ngo.distanceText || '2.0 km away',
            needs: ngo.needs || 'General items'
          };
        }
      }
    }
  } catch (e) {
    console.error("Failed to fetch NGOs", e);
  }
  return null;
}

export async function processKiranaFinalDisposition(pickupId: string, actionType: 'RESALE' | 'DONATE' | 'RECYCLE', ngoId?: string) {
  const pickup = await prisma.kiranaPickup.findUnique({ where: { id: pickupId }});
  if (!pickup) throw new Error("Pickup not found");

  const ngoNote = ngoId ? ` (Routed to NGO: ${ngoId})` : '';

  await prisma.kiranaPickup.update({
    where: { id: pickupId },
    data: { status: 'COMPLETED', completedAt: new Date(), notes: `${pickup.notes} -> Final: ${actionType}${ngoNote}` }
  });

  // Green Credits or listing logic
  let dbUser = null;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) dbUser = await prisma.user.findUnique({ where: { clerkId } });
  } catch (e) {}

  if (!dbUser) dbUser = await prisma.user.findFirst();

  if (actionType === 'RESALE' && pickup.productId) {
    // Create listing for resale
    await createSecondLifeListing(pickup.productId, 49.99); // Hardcoded price for simplicity
    
    // Give standard drop-off bonus
    if (dbUser) {
      let wallet = await prisma.greenCreditWallet.findUnique({ where: { userId: dbUser.id }});
      if (wallet) {
        await prisma.greenCreditWallet.update({ where: { id: wallet.id }, data: { balance: { increment: 100 }, lifetimeEarned: { increment: 100 } } });
        await prisma.greenCreditTransaction.create({ data: { walletId: wallet.id, amount: 100, type: 'EARNED', reason: 'Kirana Drop-off Bonus (Resale)' } });
      }
    }
  } else if (actionType === 'DONATE' || actionType === 'RECYCLE') {
    const credits = actionType === 'DONATE' ? 500 : 250;
    if (dbUser) {
      let wallet = await prisma.greenCreditWallet.findUnique({ where: { userId: dbUser.id }});
      if (wallet) {
        await prisma.greenCreditWallet.update({ where: { id: wallet.id }, data: { balance: { increment: credits }, lifetimeEarned: { increment: credits } } });
        await prisma.greenCreditTransaction.create({ data: { walletId: wallet.id, amount: credits, type: 'EARNED', reason: `Kirana Final Disposition (${actionType})` } });
      }
    }
  }

  return { success: true };
}

export async function getAllNgos() {
  // Database schema for NGO partner logic is still being finalized, 
  // returning empty to trigger the frontend MOCK_NGOS fallback for demo.
  return [];
}
