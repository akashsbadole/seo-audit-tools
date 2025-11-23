import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract token from header
    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    if (!decoded?.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Delete all notifications for user
    const result = await prisma.notification.deleteMany({
      where: {
        userId: decoded.userId
      }
    });

    return NextResponse.json({ success: true, deleted: result.count });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to clear all notifications' },
      { status: 500 }
    );
  }
}