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
    const { title, description, target, deadline } = body;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: dbUser.id,
        title,
        description,
        target,
        current: 0,
        deadline: new Date(deadline),
        status: "ACTIVE",
      },
    });

    // Create notification for goal creation
    await prisma.notification.create({
      data: {
        userId: dbUser.id,
        type: "GOAL_MILESTONE",
        message: `New goal created: ${title}`,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("[GOALS_POST]", error);
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

    const goals = await prisma.goal.findMany({
      where: { userId: dbUser.id },
      orderBy: { deadline: "asc" },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("[GOALS_GET]", error);
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
    const { id, current, status } = body;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== dbUser.id) {
      return new NextResponse("Goal not found", { status: 404 });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        current,
        status,
      },
    });

    // Create notification for goal progress
    if (current >= goal.target && status === "COMPLETED") {
      await prisma.notification.create({
        data: {
          userId: dbUser.id,
          type: "GOAL_MILESTONE",
          message: `Goal completed: ${goal.title}`,
        },
      });
    }

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("[GOALS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 