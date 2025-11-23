import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  // Get authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  // TODO: Validate token and get user ID
  // For now, we'll use a placeholder user ID
  const userId = "temp-user-id";

  try {
    const dbUser = await prisma.user.findFirst();

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