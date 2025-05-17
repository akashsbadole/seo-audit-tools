import fs from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(STORAGE_DIR, 'service-requests.json');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Initialize submissions file if it doesn't exist
if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
}

export interface ServiceRequest {
    id: string;
    createdAt: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    ipAddress: string;
    userAgent: string;
    submissionCount: number;
    lastSubmissionDate?: string;
    [key: string]: any;
}

export function checkExistingEmail(email: string): { exists: boolean; lastSubmission?: string } {
    const submissions: ServiceRequest[] = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
    const existingSubmission = submissions.find(sub => sub.email === email);

    if (existingSubmission) {
        return {
            exists: true,
            lastSubmission: existingSubmission.createdAt
        };
    }

    return { exists: false };
}

export function getSubmissionsByIP(ipAddress: string): number {
    const submissions: ServiceRequest[] = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    return submissions.filter(sub =>
        sub.ipAddress === ipAddress &&
        sub.createdAt > last24Hours
    ).length;
}

export function saveServiceRequest(
    data: Omit<ServiceRequest, 'id' | 'createdAt'>,
    ipAddress: string,
    userAgent: string
): ServiceRequest {
    const submissions: ServiceRequest[] = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));

    // Count submissions from this IP in the last 24 hours
    const submissionCount = getSubmissionsByIP(ipAddress);

    const newSubmission: ServiceRequest = {
        ...data,
        id: `SR${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: data.status || 'PENDING',
        ipAddress,
        userAgent,
        submissionCount: submissionCount + 1
    };

    submissions.push(newSubmission);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));

    return newSubmission;
}

export function getServiceRequests(): ServiceRequest[] {
    return JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
} 