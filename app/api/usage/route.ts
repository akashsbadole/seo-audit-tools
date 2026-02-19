import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const usage = await prisma.userUsage.findUnique({
      where: { userId: dbUser.id }
    });

    return NextResponse.json({
      freeReportsUsed: usage?.freeReportsUsed || 0,
      freeSearchesUsed: usage?.freeSearchesUsed || 0,
      isPremium: dbUser.isPremium
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
