import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    // Extract token from header
    const token = authHeader.substring(7);
    
    // Basic token format validation before JWT verification
    if (!token || token.split('.').length !== 3) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 });
    }
    
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      
      if (!decoded?.userId) {
        return NextResponse.json({ error: 'Unauthorized - Invalid token payload' }, { status: 401 });
      }

      // Count unread notifications for user
      const unreadCount = await prisma.notification.count({
        where: {
          userId: decoded.userId,
          read: false
        }
      });

      return NextResponse.json({ count: unreadCount });
    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError instanceof jwt.JsonWebTokenError) {
        console.error('JWT verification failed:', jwtError.message);
        return NextResponse.json({ error: 'Unauthorized - Invalid or expired token' }, { status: 401 });
      }
      throw jwtError; // Re-throw other errors to be caught by outer catch
    }
  } catch (error) {
    console.error('Unread count API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}