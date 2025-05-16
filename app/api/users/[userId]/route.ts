import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify the authenticated user is requesting their own data
    const { userId: authUserId } = await auth();
    if (!authUserId || authUserId !== params.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: params.userId },
      include: { usage: true },
    });

    if (!user) {
      return NextResponse.json(null);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
} 