import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Update user to premium
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { isPremium: true },
      include: { usage: true }
    });

    // Return updated user data
    const userData = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      isPremium: updatedUser.isPremium
    };

    return NextResponse.json({ 
      message: 'Successfully upgraded to premium!',
      user: userData
    });

  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade to premium' },
      { status: 500 }
    );
  }
}