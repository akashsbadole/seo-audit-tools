import { NextResponse } from "next/server";

const mockGoals = [
  { id: "1", title: "Increase organic traffic", description: "Reach 10k visitors", target: 10000, current: 6500, deadline: new Date().toISOString(), status: "ACTIVE" },
  { id: "2", title: "Improve SEO score", description: "Achieve 90+ score", target: 90, current: 78, deadline: new Date().toISOString(), status: "ACTIVE" },
];

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, target, deadline } = body;

    const newGoal = {
      id: `${Date.now()}`,
      title,
      description,
      target,
      current: 0,
      deadline: deadline || new Date().toISOString(),
      status: "ACTIVE",
    };

    return NextResponse.json(newGoal);
  } catch (error) {
    console.error("[GOALS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(mockGoals);
  } catch (error) {
    console.error("[GOALS_GET]", error);
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
    const { id, current, status } = body;

    const updatedGoal = {
      id,
      title: "Updated Goal",
      description: "Updated description",
      target: 100,
      current: current || 50,
      deadline: new Date().toISOString(),
      status: status || "ACTIVE",
    };

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("[GOALS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
