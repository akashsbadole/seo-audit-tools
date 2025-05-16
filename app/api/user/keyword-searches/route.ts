import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const keywordSearches = await prisma.keywordSearch.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        keyword: true,
        platform: true,
        searchType: true,
        country: true,
        language: true,
        createdAt: true,
      }
    });

    return NextResponse.json(keywordSearches);
  } catch (error) {
    console.error('Error fetching keyword searches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keyword search history' },
      { status: 500 }
    );
  }
} 