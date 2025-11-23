import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.substring(7);
    // TODO: Validate token and get user ID
    // For now, we'll use a placeholder user ID
    const userId = "temp-user-id";

    const body = await req.json();
    const { domain, domainAuthority, backlinks, organicKeywords, organicTraffic } = body;

    const dbUser = await prisma.user.findFirst();

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
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.substring(7);
    // TODO: Validate token and get user ID
    // For now, we'll use a placeholder user ID
    const userId = "temp-user-id";

    const dbUser = await prisma.user.findFirst();

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
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.substring(7);
    // TODO: Validate token and get user ID
    // For now, we'll use a placeholder user ID
    const userId = "temp-user-id";

    const body = await req.json();
    const { id, domainAuthority, backlinks, organicKeywords, organicTraffic } = body;

    const dbUser = await prisma.user.findFirst();

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