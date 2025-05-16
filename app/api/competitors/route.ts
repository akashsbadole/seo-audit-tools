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
    const { domain, domainAuthority, backlinks, organicKeywords, organicTraffic } = body;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const competitor = await prisma.competitor.create({
      data: {
        userId: dbUser.id,
        domain,
        domainAuthority,
        backlinks,
        organicKeywords,
        organicTraffic,
      },
    });

    return NextResponse.json(competitor);
  } catch (error) {
    console.error("[COMPETITORS_POST]", error);
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

    const competitors = await prisma.competitor.findMany({
      where: { userId: dbUser.id },
      orderBy: { lastUpdated: "desc" },
    });

    return NextResponse.json(competitors);
  } catch (error) {
    console.error("[COMPETITORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, domainAuthority, backlinks, organicKeywords, organicTraffic } = body;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const competitor = await prisma.competitor.findUnique({
      where: { id },
    });

    if (!competitor || competitor.userId !== dbUser.id) {
      return new NextResponse("Competitor not found", { status: 404 });
    }

    const updatedCompetitor = await prisma.competitor.update({
      where: { id },
      data: {
        domainAuthority,
        backlinks,
        organicKeywords,
        organicTraffic,
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json(updatedCompetitor);
  } catch (error) {
    console.error("[COMPETITORS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 