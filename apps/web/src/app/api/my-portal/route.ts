import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
const ROLE_PORTAL_MAP: Record<string, string> = {
  CUSTOMER: '/customer',
  SELLER: '/seller',
  NGO: '/ngo',
  KIRANA_PARTNER: '/kirana',
  ADMIN: '/admin',
};

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ portal: '/customer', role: 'GUEST' });
    }

    let role = 'CUSTOMER';
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId },
        select: { role: true },
      });
      role = user?.role || 'CUSTOMER';
    } catch {
      // DB error — fallback
    }

    const portal = ROLE_PORTAL_MAP[role] || '/customer';
    return NextResponse.json({ portal, role });
  } catch {
    return NextResponse.json({ portal: '/customer', role: 'CUSTOMER' });
  }
}
