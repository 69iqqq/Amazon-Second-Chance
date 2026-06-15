import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
/**
 * Call this in a layout or page to enforce that the signed-in user
 * has one of the required roles. If not, redirects them.
 */
export async function requireRole(
  allowedRoles: string[],
  redirectTo = '/second-life/partner',
) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect('/sign-in');
  }

  let role = 'CUSTOMER';

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { role: true },
    });
    role = user?.role ?? 'CUSTOMER';
  } catch {
    // DB error — treat as CUSTOMER
  }

  if (!allowedRoles.includes(role)) {
    redirect(redirectTo);
  }

  return role;
}
