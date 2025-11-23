import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
      
      // Get user information from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          isPremium: true,
          role: true,
        }
      });

      if (!user) {
        return NextResponse.json({
          valid: false,
          error: 'User not found'
        }, { status: 404 })
      }
      
      return NextResponse.json({
        valid: true,
        userId: decoded.userId,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isPremium: user.isPremium,
          role: user.role,
        }
      })
    } catch (jwtError) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid token'
      })
    }
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}