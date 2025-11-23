import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const FREE_REPORT_LIMIT = 10;
const FREE_SEARCH_LIMIT = 10;

function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const JWT_SECRET =
    process.env.JWT_SECRET || "your-secret-key-change-in-production";

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function checkUsageLimit(
  type: "report" | "search",
  request?: NextRequest
) {
  // For backward compatibility, try to get user from request first
  let user = null;

  if (request) {
    user = getUserFromRequest(request);
  }

  // If no user from request, this might be called from a server component
  // In that case, we'll need to handle it differently

  if (!user?.userId) {
    return { allowed: false, message: "Authentication required" };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
  });

  if (!dbUser) {
    return { allowed: false, message: "User not found" };
  }

  if (dbUser.isPremium) {
    return { allowed: true, message: "Premium user" };
  }

  // Check usage record separately
  const usage = await prisma.userUsage.findUnique({
    where: { userId: dbUser.id },
  });

  if (!usage) {
    // Create usage record if it doesn't exist
    await prisma.userUsage.create({
      data: {
        userId: dbUser.id,
        freeReportsUsed: 0,
        freeSearchesUsed: 0,
        updatedAt: new Date(),
      },
    });
    return { allowed: true, message: "First time usage" };
  }

  // Check if it's a new month and reset counters if needed
  const now = new Date();
  const lastReset = new Date(usage.lastResetDate);
  if (
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  ) {
    await prisma.userUsage.update({
      where: { userId: dbUser.id },
      data: {
        freeReportsUsed: 0,
        freeSearchesUsed: 0,
        lastResetDate: now,
      },
    });
    return { allowed: true, message: "Monthly reset" };
  }

  // Check limits
  if (type === "report" && usage.freeReportsUsed >= FREE_REPORT_LIMIT) {
    return {
      allowed: false,
      message: `You've reached your monthly limit of ${FREE_REPORT_LIMIT} free reports. Upgrade to premium for unlimited access.`,
    };
  }

  if (type === "search" && usage.freeSearchesUsed >= FREE_SEARCH_LIMIT) {
    return {
      allowed: false,
      message: `You've reached your monthly limit of ${FREE_SEARCH_LIMIT} free searches. Upgrade to premium for unlimited access.`,
    };
  }

  return { allowed: true, message: "Within limits" };
}

export async function incrementUsage(
  type: "report" | "search",
  userId: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return;

  // Check usage record separately
  const usage = await prisma.userUsage.findUnique({
    where: { userId: user.id },
  });

  if (!usage) {
    // Create usage record if it doesn't exist
    await prisma.userUsage.create({
      data: {
        userId: user.id,
        freeReportsUsed: type === "report" ? 1 : 0,
        freeSearchesUsed: type === "search" ? 1 : 0,
        updatedAt: new Date(),
      },
    });
    return;
  }

  // Update the correct counter
  await prisma.userUsage.update({
    where: { userId: user.id },
    data:
      type === "report"
        ? { freeReportsUsed: { increment: 1 } }
        : { freeSearchesUsed: { increment: 1 } },
  });
}

const DAILY_URL_LIMIT = 3; // Limit to 3 audits per URL per day for all users

// Check daily per-URL audit limit
export async function checkDailyUrlLimit(
  url: string,
  request?: NextRequest
): Promise<{ allowed: boolean; message: string }> {
  try {
    // Get user ID if authenticated
    let userId = null;
    if (request) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          userId = decoded.userId;
        } catch {
          // Invalid token, continue without user session
        }
      }
    }

    // Get IP address for non-authenticated users
    const forwarded = request?.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request?.headers.get("x-real-ip") || "127.0.0.1";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    // Get start and end of today
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Check if this URL has been audited today
    const existingAttempts = await prisma.auditAttempt.findMany({
      where: {
        url,
        attemptDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
        OR: [
          { userId }, // If user is authenticated
          { ipHash }, // Or check by IP for anonymous users
        ],
      },
    });

    if (existingAttempts.length >= DAILY_URL_LIMIT) {
      return {
        allowed: false,
        message: `You've reached the daily limit of ${DAILY_URL_LIMIT} audits for this URL. Please try again tomorrow.`,
      };
    }

    return { allowed: true, message: "Within daily URL limit" };
  } catch (error) {
    console.error("Error checking daily URL limit:", error);
    // If we can't check the limit, allow the request but log it
    return { allowed: true, message: "Unable to verify limit - proceeding" };
  }
}

// Record audit attempt for daily tracking
export async function recordAuditAttempt(
  url: string,
  request?: NextRequest
): Promise<void> {
  try {
    // Get user ID if authenticated
    let userId = null;
    if (request) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          userId = decoded.userId;
        } catch {
          // Invalid token, continue without user session
        }
      }
    }

    // Get IP address for non-authenticated users
    const forwarded = request?.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request?.headers.get("x-real-ip") || "127.0.0.1";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    // Get user agent
    const userAgent = request?.headers.get("user-agent") || "Unknown";

    // Record the attempt
    await prisma.auditAttempt.create({
      data: {
        url,
        userId,
        ipHash,
        userAgent,
        attemptDate: new Date(),
      },
    });

    console.log(`Audit attempt recorded for URL: ${url}`);
  } catch (error) {
    console.error("Error recording audit attempt:", error);
  }
}
