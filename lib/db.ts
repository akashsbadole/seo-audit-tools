import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

export interface DomainInput {
  domainName: string;
  ipAddress?: string;
  pdfData?: Uint8Array;
  pdfPath?: string;
}

export interface DomainReport {
  domainName: string;
  ipAddress?: string;
  reportData?: Uint8Array;
  reportPath?: string;
}

export async function addDomain(data: DomainInput) {
  try {
    const domain = await prisma.domain.create({
      data: {
        domainName: data.domainName,
        ipAddress: data.ipAddress,
        pdfData: data.pdfData,
        pdfPath: data.pdfPath,
      },
    });
    return domain;
  } catch (error) {
    console.error('Error adding domain:', error);
    throw error;
  }
}

export async function getDomain(domainName: string) {
  try {
    const domain = await prisma.domain.findUnique({
      where: {
        domainName,
      },
    });
    return domain;
  } catch (error) {
    console.error('Error getting domain:', error);
    throw error;
  }
}

export async function getAllDomains() {
  try {
    const domains = await prisma.domain.findMany();
    return domains;
  } catch (error) {
    console.error('Error getting all domains:', error);
    throw error;
  }
}

export async function searchAndStoreDomain(domainName: string): Promise<DomainReport> {
  try {
    // First check if domain already exists
    const existingDomain = await prisma.domain.findUnique({
      where: { domainName },
    });

    if (existingDomain) {
      return {
        domainName: existingDomain.domainName,
        ipAddress: existingDomain.ipAddress || undefined,
        reportData: existingDomain.pdfData || undefined,
        reportPath: existingDomain.pdfPath || undefined,
      };
    }

    // If domain doesn't exist, create new entry
    const newDomain = await prisma.domain.create({
      data: {
        domainName,
        // IP address will be added later if available
      },
    });

    return {
      domainName: newDomain.domainName,
      ipAddress: newDomain.ipAddress || undefined,
      reportData: newDomain.pdfData || undefined,
      reportPath: newDomain.pdfPath || undefined,
    };
  } catch (error) {
    console.error('Error in searchAndStoreDomain:', error);
    throw error;
  }
}

// Update domain with report data
export async function updateDomainReport(domainName: string, reportData: Partial<DomainReport>) {
  try {
    const updatedDomain = await prisma.domain.update({
      where: { domainName },
      data: {
        ipAddress: reportData.ipAddress,
        pdfData: reportData.reportData,
        pdfPath: reportData.reportPath,
      },
    });
    return updatedDomain;
  } catch (error) {
    console.error('Error updating domain report:', error);
    throw error;
  }
} 