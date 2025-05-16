import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await currentUser();
  
  if (!user?.id) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { usage: true }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      freeReportsUsed: dbUser.usage?.freeReportsUsed || 0,
      freeSearchesUsed: dbUser.usage?.freeSearchesUsed || 0,
      isPremium: dbUser.isPremium
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage status' },
      { status: 500 }
    );
  }
} 