import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { url, type } = body;

    // Check if user has available reports
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { usage: true },
    });

    if (!dbUser?.usage || dbUser.usage.freeReportsUsed >= 10) {
      return new NextResponse("No available reports", { status: 403 });
    }

    // Create new audit
    const audit = await prisma.audit.create({
      data: {
        userId: dbUser.id,
        url,
        type,
        status: "IN_PROGRESS",
        score: 0,
      },
    });

    // Increment free reports used
    await prisma.usage.update({
      where: { userId: dbUser.id },
      data: { freeReportsUsed: { increment: 1 } },
    });

    return NextResponse.json(audit);
  } catch (error) {
    console.error("[AUDITS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const audits = await prisma.audit.findMany({
      where: { userId: dbUser.id },
      include: {
        issues: true,
        recommendations: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(audits);
  } catch (error) {
    console.error("[AUDITS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 