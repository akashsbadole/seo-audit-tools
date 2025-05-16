import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

const FREE_REPORT_LIMIT = 10;
const FREE_SEARCH_LIMIT = 10;

export async function checkUsageLimit(type: 'report' | 'search') {
  const user = await currentUser();
  
  if (!user?.id) {
    return { allowed: false, message: 'Authentication required' };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { usage: true }
  });

  if (!dbUser) {
    return { allowed: false, message: 'User not found' };
  }

  if (dbUser.isPremium) {
    return { allowed: true, message: 'Premium user' };
  }

  if (!dbUser.usage) {
    // Create usage record if it doesn't exist
    await prisma.userUsage.create({
      data: {
        userId: dbUser.id,
        freeReportsUsed: 0,
        freeSearchesUsed: 0,
      }
    });
    return { allowed: true, message: 'First time usage' };
  }

  // Check if it's a new month and reset counters if needed
  const now = new Date();
  const lastReset = new Date(dbUser.usage.lastResetDate);
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    await prisma.userUsage.update({
      where: { userId: dbUser.id },
      data: {
        freeReportsUsed: 0,
        freeSearchesUsed: 0,
        lastResetDate: now,
      }
    });
    return { allowed: true, message: 'Monthly reset' };
  }

  // Check limits
  if (type === 'report' && dbUser.usage.freeReportsUsed >= FREE_REPORT_LIMIT) {
    return { 
      allowed: false, 
      message: `You've reached your monthly limit of ${FREE_REPORT_LIMIT} free reports. Upgrade to premium for unlimited access.` 
    };
  }

  if (type === 'search' && dbUser.usage.freeSearchesUsed >= FREE_SEARCH_LIMIT) {
    return { 
      allowed: false, 
      message: `You've reached your monthly limit of ${FREE_SEARCH_LIMIT} free searches. Upgrade to premium for unlimited access.` 
    };
  }

  return { allowed: true, message: 'Within limits' };
}

export async function incrementUsage(type: 'report' | 'search', userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { usage: true }
  });

  if (!user) return;
  
  if (!user.usage) {
    // Create usage record if it doesn't exist
    await prisma.userUsage.create({
      data: {
        userId: user.id,
        freeReportsUsed: type === 'report' ? 1 : 0,
        freeSearchesUsed: type === 'search' ? 1 : 0,
      }
    });
    return;
  }

  // Update the correct counter
  await prisma.userUsage.update({
    where: { userId: user.id },
    data: type === 'report' 
      ? { freeReportsUsed: { increment: 1 } }
      : { freeSearchesUsed: { increment: 1 } }
  });
} 