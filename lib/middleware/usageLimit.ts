import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const FREE_REPORT_LIMIT = 10;
const FREE_SEARCH_LIMIT = 10;

export async function checkUsageLimit(type: 'report' | 'search') {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { allowed: false, message: 'Authentication required' };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { usage: true }
  });

  if (!user) {
    return { allowed: false, message: 'User not found' };
  }

  if (user.isPremium) {
    return { allowed: true, message: 'Premium user' };
  }

  if (!user.usage) {
    // Create usage record if it doesn't exist
    await prisma.userUsage.create({
      data: {
        userId: user.id,
        freeReportsUsed: 0,
        freeSearchesUsed: 0,
      }
    });
    return { allowed: true, message: 'First time usage' };
  }

  // Check if it's a new month and reset counters if needed
  const now = new Date();
  const lastReset = new Date(user.usage.lastResetDate);
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    await prisma.userUsage.update({
      where: { userId: user.id },
      data: {
        freeReportsUsed: 0,
        freeSearchesUsed: 0,
        lastResetDate: now,
      }
    });
    return { allowed: true, message: 'Monthly reset' };
  }

  // Check limits
  if (type === 'report' && user.usage.freeReportsUsed >= FREE_REPORT_LIMIT) {
    return { 
      allowed: false, 
      message: `You've reached your monthly limit of ${FREE_REPORT_LIMIT} free reports. Upgrade to premium for unlimited access.` 
    };
  }

  if (type === 'search' && user.usage.freeSearchesUsed >= FREE_SEARCH_LIMIT) {
    return { 
      allowed: false, 
      message: `You've reached your monthly limit of ${FREE_SEARCH_LIMIT} free keyword searches. Upgrade to premium for unlimited access.` 
    };
  }

  return { allowed: true, message: 'Within limits' };
}

export async function incrementUsage(type: 'report' | 'search', userId: number) {
  const updateData = type === 'report' 
    ? { freeReportsUsed: { increment: 1 } }
    : { freeSearchesUsed: { increment: 1 } };

  await prisma.userUsage.update({
    where: { userId },
    data: updateData
  });
} 