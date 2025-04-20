import { NextResponse } from 'next/server';
import { searchAndStoreDomain, updateDomainReport } from '@/lib/db';
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

export async function POST(request: Request) {
  try {
    const { domainName } = await request.json();

    if (!domainName) {
      return NextResponse.json(
        { error: 'Domain name is required' },
        { status: 400 }
      );
    }

    // First store the domain in database
    const domain = await searchAndStoreDomain(domainName);

    // Try to resolve IP address
    try {
      const { address: ipAddress } = await lookup(domainName);
      
      // Update domain with IP address
      if (ipAddress) {
        await updateDomainReport(domainName, {
          domainName,
          ipAddress,
        });
        domain.ipAddress = ipAddress;
      }
    } catch (error) {
      console.error('Error resolving IP address:', error);
      // Continue execution even if IP resolution fails
    }

    return NextResponse.json(domain);
  } catch (error) {
    console.error('Error processing domain:', error);
    return NextResponse.json(
      { error: 'Failed to process domain' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domainName = searchParams.get('domain');

    if (!domainName) {
      return NextResponse.json(
        { error: 'Domain name is required' },
        { status: 400 }
      );
    }

    const domain = await searchAndStoreDomain(domainName);
    return NextResponse.json(domain);
  } catch (error) {
    console.error('Error getting domain:', error);
    return NextResponse.json(
      { error: 'Failed to get domain' },
      { status: 500 }
    );
  }
} 