import { sendEmail } from './email';
import prisma from './prisma';

export interface EmailNotificationData {
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  category?: 'seo' | 'performance' | 'security' | 'general' | 'ai' | 'monitoring';
  actionUrl?: string;
  actionLabel?: string;
}

/**
 * Send an email notification instead of storing in-app notifications
 * This is simpler and avoids authentication issues
 */
export async function sendEmailNotification(data: EmailNotificationData) {
  try {
    // Get user's email from database
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { email: true, name: true }
    });

    if (!user?.email) {
      console.error('User email not found for notification:', data.userId);
      return { success: false, error: 'User email not found' };
    }

    // Create email content
    const subject = `SEOaudit Pro - ${data.title}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .category { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; }
          .category-seo { background: #e3f2fd; color: #1976d2; }
          .category-performance { background: #fff3e0; color: #f57c00; }
          .category-security { background: #ffebee; color: #d32f2f; }
          .category-ai { background: #f3e5f5; color: #7b1fa2; }
          .category-monitoring { background: #e8f5e8; color: #388e3c; }
          .category-general { background: #f5f5f5; color: #616161; }
          .action-button { display: inline-block; background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SEOaudit Pro</h1>
            <p>Your SEO Analysis Platform</p>
          </div>
          <div class="content">
            <p>Hello ${user.name || 'there'},</p>
            ${data.category ? `<span class="category category-${data.category}">${data.category}</span>` : ''}
            <h2>${data.title}</h2>
            <p>${data.message}</p>
            ${data.actionUrl ? `<a href="${data.actionUrl}" class="action-button">${data.actionLabel || 'View Details'}</a>` : ''}
            <div class="footer">
              <p>This is an automated notification from SEOaudit Pro.</p>
              <p>If you didn't expect this email, you can safely ignore it.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the email
    const result = await sendEmail({
      to: user.email,
      subject,
      html
    });

    console.log('Email notification sent successfully:', result);
    return { success: true, result };

  } catch (error) {
    console.error('Failed to send email notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send a simple text email notification
 */
export async function sendSimpleEmailNotification(to: string, subject: string, message: string) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SEOaudit Pro</h1>
            <p>Your SEO Analysis Platform</p>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <div class="footer">
              <p>This is an automated notification from SEOaudit Pro.</p>
              <p>If you didn't expect this email, you can safely ignore it.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await sendEmail({
      to,
      subject,
      html
    });

    return { success: true, result };

  } catch (error) {
    console.error('Failed to send simple email notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}