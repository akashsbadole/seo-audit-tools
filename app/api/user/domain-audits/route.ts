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
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const domainAudits = await prisma.domain.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        domainName: true,
        ipAddress: true,
        pdfPath: true,
        createdAt: true,
      }
    });

    return NextResponse.json(domainAudits);
  } catch (error) {
    console.error('Error fetching domain audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domain audit history' },
      { status: 500 }
    );
  }
} 