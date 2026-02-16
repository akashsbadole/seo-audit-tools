import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const keywordSearches = await prisma.keywordSearch.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
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
