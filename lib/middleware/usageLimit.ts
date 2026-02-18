import { NextRequest } from "next/server";

export async function checkUsageLimit(
  type: "report" | "search",
  request?: NextRequest
) {
  return { allowed: true, message: "Unlimited access" };
}

export async function incrementUsage(
  type: "report" | "search",
  userId: string
) {
  // No-op since we removed auth
}

export async function checkDailyUrlLimit(
  url: string,
  request?: NextRequest
): Promise<{ allowed: boolean; message: string }> {
  return { allowed: true, message: "Within daily URL limit" };
}

export async function recordAuditAttempt(
  url: string,
  request?: NextRequest
): Promise<void> {
  // No-op since we removed auth
}
