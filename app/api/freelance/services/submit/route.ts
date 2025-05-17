import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { z } from 'zod';
import { saveServiceRequest, checkExistingEmail, getSubmissionsByIP } from '@/lib/utils/storage';
import { getCustomerEmailTemplate, getAdminEmailTemplate } from '@/lib/utils/emailTemplates';
import { headers } from 'next/headers';

const resend = new Resend(process.env.RESEND_API_KEY);

const formSchema = z.object({
    question: z.string(),
    websiteType: z.string(),
    reference: z.string().optional(),
    name: z.string(),
    phoneNumber: z.string(),
    email: z.string().email(),
    brandName: z.string(),
    brandAge: z.string(),
    brandDescription: z.string(),
    hasDomain: z.enum(['Yes', 'No']).transform(val => val === 'Yes'),
    domainName: z.string().optional(),
    websitesUnderDomain: z.string().optional(),
    hasHosting: z.enum(['Yes', 'No']).transform(val => val === 'Yes'),
    needsLogo: z.enum(['Yes', 'No']).transform(val => val === 'Yes'),
    categoryPages: z.string(),
    needsContent: z.enum(['Yes', 'No']).transform(val => val === 'Yes'),
    providingProductImages: z.enum(['Yes', 'No']).transform(val => val === 'Yes'),
    additionalRequirements: z.string().optional(),
    budget: z.string()
});

export async function POST(request: Request) {
    try {
        // Get client info from headers
        const headersList = headers();
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        const body = await request.json();
        const data = formSchema.parse(body);

        // Check for existing email
        const existingEmail = checkExistingEmail(data.email);
        if (existingEmail.exists) {
            return NextResponse.json({
                error: 'Email already exists',
                message: 'You have already submitted a request. Please wait for our response.',
                lastSubmission: existingEmail.lastSubmission
            }, { status: 400 });
        }

        // Check submission rate from IP
        const submissionCount = getSubmissionsByIP(ip);
        if (submissionCount >= 3) { // Limit to 3 submissions per 24 hours
            return NextResponse.json({
                error: 'Too many submissions',
                message: 'You have exceeded the maximum number of submissions allowed in 24 hours.'
            }, { status: 429 });
        }

        // Save to JSON file with IP and user agent
        const submission = saveServiceRequest({
            ...data,
            status: 'PENDING'
        }, ip, userAgent);

        // Send email notifications
        if (process.env.RESEND_API_KEY) {
            // Send admin notification with IP and user agent info
            const adminEmailData = {
                ...data,
                ipAddress: ip,
                userAgent: userAgent
            };

            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
                to: [process.env.ADMIN_EMAIL || 'admin@yourdomain.com'],
                subject: 'New Service Request Received',
                html: getAdminEmailTemplate(adminEmailData),
            });

            // Send customer confirmation
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
                to: [data.email],
                subject: 'We received your service request',
                html: getCustomerEmailTemplate(data),
            });
        }

        return NextResponse.json({ success: true, id: submission.id });
    } catch (error) {
        console.error('Error processing service request:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid form data', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to process service request' },
            { status: 500 }
        );
    }
} 