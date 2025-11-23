# Email Notification System

This document describes the email notification system that replaces the complex in-app notification system to avoid JWT authentication issues.

## Overview

The email notification system provides a simple way to send notifications to users via email instead of storing them in the database and displaying them in the app. This approach:

- Eliminates JWT authentication errors
- Reduces database complexity
- Provides reliable delivery through email
- Works even when users are not logged in
- Follows standard email communication patterns

## Files Created

1. **`lib/email-notifications.ts`** - Core email notification functions
2. **`lib/notification-helper.ts`** - Helper utilities and predefined notifications
3. **`app/api/notifications/send-email/route.ts`** - API endpoint for sending notifications

## How to Use

### 1. Sending Predefined Notifications

```typescript
import { sendPredefinedNotification } from '@/lib/notification-helper';

// Send SEO audit completion notification
await sendPredefinedNotification(
  userId,
  'SEO_AUDIT_COMPLETE',
  '/audit/results/123'
);

// Send security alert
await sendPredefinedNotification(
  userId,
  'SECURITY_ALERT',
  '/security/issues'
);
```

### 2. Sending Custom Notifications

```typescript
import { sendCustomNotification } from '@/lib/notification-helper';

await sendCustomNotification({
  userId,
  type: 'info',
  title: 'Custom Message',
  message: 'This is a custom notification',
  category: 'general',
  actionUrl: '/custom/page',
  actionLabel: 'View Details'
});
```

### 3. Sending Simple Email to Non-Users

```typescript
import { sendNotificationToEmail } from '@/lib/notification-helper';

await sendNotificationToEmail(
  'user@example.com',
  'Welcome to SEOaudit Pro',
  'Thank you for signing up! Your account is now active.'
);
```

### 4. Using the API Endpoint

```typescript
// Send notification to current user
fetch('/api/notifications/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    type: 'success',
    title: 'Task Complete',
    message: 'Your task has been completed successfully.',
    category: 'general'
  })
});

// Admin: Send notification to any user
fetch('/api/notifications/send-email', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    userId: 'target-user-id',
    type: 'warning',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight.',
    category: 'general'
  })
});
```

## Available Predefined Notifications

| Notification Key | Type | Category | Use Case |
|------------------|-------|----------|----------|
| `SEO_AUDIT_COMPLETE` | success | seo | When SEO audit finishes |
| `KEYWORD_RANKING_UPDATE` | info | seo | Keyword ranking changes |
| `SECURITY_ALERT` | warning | security | Security issues detected |
| `PERFORMANCE_WARNING` | warning | performance | Performance drops |
| `PREMIUM_FEATURE_AVAILABLE` | info | general | New features available |
| `AI_ANALYSIS_READY` | success | ai | AI analysis completed |

## Configuration

Ensure you have the following environment variables set:

```env
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=your_jwt_secret
```

## Email Templates

The system uses responsive HTML email templates with:

- SEOaudit Pro branding
- Gradient headers matching the site theme
- Category badges with appropriate colors
- Action buttons for important notifications
- Professional styling

## Migration from In-App Notifications

To replace existing in-app notification code:

### Before (In-App Notifications)

```typescript
// Old approach - creates database records
const notification = await prisma.notification.create({
  data: {
    userId,
    type: 'success',
    title: 'SEO Audit Complete',
    message: 'Your audit is ready',
    category: 'seo',
    actionUrl: '/audit/results/123',
    read: false
  }
});
```

### After (Email Notifications)

```typescript
// New approach - sends email directly
await sendPredefinedNotification(
  userId,
  'SEO_AUDIT_COMPLETE',
  '/audit/results/123'
);
```

## Benefits

1. **No Authentication Issues**: Emails work regardless of login status
2. **Reliable Delivery**: Professional email delivery via Resend
3. **Better User Experience**: Users receive notifications in their inbox
4. **Reduced Complexity**: No database tables or real-time polling needed
5. **Scalable**: Email services handle scaling automatically

## Testing

To test the email notification system:

1. Ensure your Resend API key is configured
2. Use a test user account with a valid email
3. Call the notification functions from your code
4. Check the recipient's inbox for the notification

## Troubleshooting

### Emails Not Sending
- Verify `RESEND_API_KEY` is set correctly
- Check the Resend dashboard for delivery status
- Ensure recipient email is valid

### Authentication Errors
- The new email system doesn't require JWT tokens for most operations
- Only admin operations need authentication

### Styling Issues
- Email templates use inline CSS for maximum compatibility
- Test with different email clients if needed

## Future Enhancements

- Email preference management for users
- Scheduled notifications
- Email analytics and tracking
- Template customization
- Bulk email sending