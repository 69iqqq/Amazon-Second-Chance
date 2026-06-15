'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function getUserLocation() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { profile: true }
    });

    if (user?.profile) {
      return { city: user.profile.city, postalCode: user.profile.postalCode };
    }
  } catch (error) {
    console.error('Error fetching user location:', error);
  }
  return null;
}

export async function saveUserLocation(city: string, postalCode: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return false;

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (user) {
      await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: { city, postalCode },
        create: { userId: user.id, city, postalCode }
      });
      return true;
    }
  } catch (error) {
    console.error('Error saving user location:', error);
  }
  return false;
}
