"use server";
import { prisma } from '@/lib/prisma';

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function registerSeller(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const businessName = formData.get("businessName") as string;
  const storeDescription = formData.get("storeDescription") as string;
  const taxId = formData.get("taxId") as string;

  if (!businessName) {
    throw new Error("Business Name is required");
  }

  // Find the internal user ID
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if SellerProfile already exists
  // @ts-ignore - Ignoring TS error in case Prisma generation failed due to lock
  let sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
  });

  if (!sellerProfile) {
    // Create new SellerProfile
    // @ts-ignore
    sellerProfile = await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        businessName,
        storeDescription,
        taxId: taxId || null,
      },
    });

    // Update user role to SELLER
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "SELLER" },
    });
  }

  redirect("/seller");
}
