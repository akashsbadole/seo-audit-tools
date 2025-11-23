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
    const { keyword, position, searchVolume, difficulty } = body;

    const dbUser = await prisma.user.findFirst();

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const keywordData = await prisma.keyword.create({
      data: {
        userId: dbUser.id,
        keyword,
        position,
        previousPosition: position,
        searchVolume,
        difficulty,
      },
    });

    return NextResponse.json(keywordData);
  } catch (error) {
    console.error("[KEYWORDS_POST]", error);
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

    const keywords = await prisma.keyword.findMany({
      where: { userId: dbUser.id },
      orderBy: { lastUpdated: "desc" },
    });

    return NextResponse.json(keywords);
  } catch (error) {
    console.error("[KEYWORDS_GET]", error);
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
    const { id, position } = body;

    const dbUser = await prisma.user.findFirst();

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const keyword = await prisma.keyword.findUnique({
      where: { id },
    });

    if (!keyword || keyword.userId !== dbUser.id) {
      return new NextResponse("Keyword not found", { status: 404 });
    }

    const updatedKeyword = await prisma.keyword.update({
      where: { id },
      data: {
        previousPosition: keyword.position,
        position,
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json(updatedKeyword);
  } catch (error) {
    console.error("[KEYWORDS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}