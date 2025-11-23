import { sendEmailNotification, sendSimpleEmailNotification } from './email-notifications';

/**
 * Simple notification helper for common use cases
 * This replaces the complex in-app notification system with email notifications
 */

// Common notification types
export const NOTIFICATION_TYPES = {
  SEO_AUDIT_COMPLETE: {
    type: 'success' as const,
    category: 'seo' as const,
    title: 'SEO Audit Complete',
    message: 'Your SEO audit has been completed successfully. View the detailed results to improve your website\'s performance.',
    actionLabel: 'View Results'
  },
  KEYWORD_RANKING_UPDATE: {
    type: 'info' as const,
    category: 'seo' as const,
    title: 'Keyword Ranking Update',
    message: 'There are updates to your keyword rankings. Check your dashboard to see the latest changes.',
    actionLabel: 'View Dashboard'
  },
  SECURITY_ALERT: {
    type: 'warning' as const,
    category: 'security' as const,
    title: 'Security Alert',
    message: 'We\'ve detected a potential security issue that needs your attention.',
    actionLabel: 'Review Security'
  },
  PERFORMANCE_WARNING: {
    type: 'warning' as const,
    category: 'performance' as const,
    title: 'Performance Warning',
    message: 'Your website performance has dropped below the recommended threshold.',
    actionLabel: 'View Performance'
  },
  PREMIUM_FEATURE_AVAILABLE: {
    type: 'info' as const,
    category: 'general' as const,
    title: 'New Premium Features Available',
    message: 'Exciting new premium features have been added to enhance your SEO analysis experience.',
    actionLabel: 'Explore Features'
  },
  AI_ANALYSIS_READY: {
    type: 'success' as const,
    category: 'ai' as const,
    title: 'AI Analysis Ready',
    message: 'Your AI-powered analysis is complete. Get insights to boost your SEO strategy.',
    actionLabel: 'View Analysis'
  }
} as const;

/**
 * Send a predefined notification to a user
 */
export async function sendPredefinedNotification(
  userId: string,
  notificationKey: keyof typeof NOTIFICATION_TYPES,
  customActionUrl?: string
) {
  const template = NOTIFICATION_TYPES[notificationKey];
  
  if (!template) {
    throw new Error(`Unknown notification type: ${notificationKey}`);
  }

  return await sendEmailNotification({
    userId,
    ...template,
    actionUrl: customActionUrl
  });
}

/**
 * Send a custom notification to a user
 */
export async function sendCustomNotification(data: {
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  category?: 'seo' | 'performance' | 'security' | 'general' | 'ai' | 'monitoring';
  actionUrl?: string;
  actionLabel?: string;
}) {
  return await sendEmailNotification(data);
}

/**
 * Send a simple notification to an email address (for non-users)
 */
export async function sendNotificationToEmail(
  email: string,
  subject: string,
  message: string
) {
  return await sendSimpleEmailNotification(email, subject, message);
}

/**
 * Client-side helper to send notifications (to be used in API routes or server actions)
 * Example usage:
 * 
 * // In an API route:
 * import { sendPredefinedNotification } from '@/lib/notification-helper';
 * 
 * await sendPredefinedNotification(userId, 'SEO_AUDIT_COMPLETE', '/audit/results/123');
 * 
 * // Custom notification:
 * await sendCustomNotification({
 *   userId,
 *   type: 'info',
 *   title: 'Custom Message',
 *   message: 'This is a custom notification',
 *   category: 'general'
 * });
 */