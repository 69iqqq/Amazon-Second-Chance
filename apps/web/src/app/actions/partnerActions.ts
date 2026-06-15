'use server';
import { prisma } from '@/lib/prisma';

import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

const VALID_PARTNER_ROLES = ['SELLER', 'KIRANA_PARTNER', 'NGO'] as const;
type PartnerRole = typeof VALID_PARTNER_ROLES[number];

export async function applyForPartnerRole(role: PartnerRole) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Not authenticated');

  if (!VALID_PARTNER_ROLES.includes(role)) {
    throw new Error('Invalid role');
  }

  // Get Clerk user details in case we need to create the DB record
  const clerkUser = await currentUser();

  // Use upsert — the user might not have a DB record yet if the webhook hasn't fired
  await prisma.user.upsert({
    where: { clerkId },
    update: { role },
    create: {
      clerkId,
      email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${clerkId}@placeholder.com`,
      firstName: clerkUser?.firstName ?? null,
      lastName: clerkUser?.lastName ?? null,
      imageUrl: clerkUser?.imageUrl ?? null,
      role,
      status: 'ACTIVE',
    },
  });

  revalidatePath('/');
  revalidatePath('/seller');
  revalidatePath('/ngo');
  revalidatePath('/kirana');

  return { success: true, role };
}

export async function getUserRole(): Promise<{ role: string; portal: string }> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { role: 'GUEST', portal: '/customer' };

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { role: true },
  });

  const role = user?.role ?? 'CUSTOMER';
  const portalMap: Record<string, string> = {
    CUSTOMER: '/customer',
    SELLER: '/seller',
    NGO: '/ngo',
    KIRANA_PARTNER: '/kirana',
    ADMIN: '/admin',
  };

  return { role, portal: portalMap[role] ?? '/customer' };
}
