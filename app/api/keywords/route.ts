import { NextResponse } from "next/server";

const mockKeywords = [
  { id: "1", keyword: "seo tools", position: 5, previousPosition: 8, searchVolume: 12000, difficulty: 65 },
  { id: "2", keyword: "keyword research", position: 12, previousPosition: 15, searchVolume: 8500, difficulty: 70 },
  { id: "3", keyword: "backlink checker", position: 3, previousPosition: 3, searchVolume: 5200, difficulty: 55 },
];

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { keyword, position, searchVolume, difficulty } = body;

    const newKeyword = {
      id: `${Date.now()}`,
      keyword,
      position: position || 0,
      previousPosition: position || 0,
      searchVolume: searchVolume || 0,
      difficulty: difficulty || 0,
    };

    return NextResponse.json(newKeyword);
  } catch (error) {
    console.error("[KEYWORDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(mockKeywords);
  } catch (error) {
    console.error("[KEYWORDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, position } = body;

    const keyword = mockKeywords.find(k => k.id === id);
    if (!keyword) {
      return new NextResponse("Keyword not found", { status: 404 });
    }

    const updatedKeyword = {
      ...keyword,
      previousPosition: keyword.position,
      position,
    };

    return NextResponse.json(updatedKeyword);
  } catch (error) {
    console.error("[KEYWORDS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
