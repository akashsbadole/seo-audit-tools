import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export interface WhiteLabelSettingsRequest {
  companyName?: string;
  logo?: string;
  brandColor?: string;
  removeBranding?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  contactWebsite?: string;
  footerText?: string;
  defaultReportTitle?: string;
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (!decoded?.userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get user's white label settings
    const settings = await prisma.whiteLabelSettings.findUnique({
      where: { userId: decoded.userId },
    });

    return NextResponse.json({
      success: true,
      settings: settings || null,
    });
  } catch (error) {
    console.error("Error fetching white label settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch white label settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (!decoded?.userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body: WhiteLabelSettingsRequest = await request.json();

    // Validate required fields
    if (body.companyName && body.companyName.length > 100) {
      return NextResponse.json(
        { error: "Company name must be less than 100 characters" },
        { status: 400 }
      );
    }

    if (body.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contactEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (body.contactWebsite && !/^https?:\/\/.+/.test(body.contactWebsite)) {
      return NextResponse.json(
        { error: "Website URL must start with http:// or https://" },
        { status: 400 }
      );
    }

    if (body.brandColor && !/^#[0-9A-Fa-f]{6}$/.test(body.brandColor)) {
      return NextResponse.json(
        { error: "Brand color must be a valid hex color code" },
        { status: 400 }
      );
    }

    // Upsert white label settings
    const settings = await prisma.whiteLabelSettings.upsert({
      where: { userId: decoded.userId },
      update: {
        companyName: body.companyName,
        logo: body.logo,
        brandColor: body.brandColor,
        removeBranding: body.removeBranding,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        contactWebsite: body.contactWebsite,
        footerText: body.footerText,
        defaultReportTitle: body.defaultReportTitle,
        updatedAt: new Date(),
      },
      create: {
        userId: decoded.userId,
        companyName: body.companyName,
        logo: body.logo,
        brandColor: body.brandColor || "#1a365d",
        removeBranding: body.removeBranding || false,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        contactWebsite: body.contactWebsite,
        footerText: body.footerText,
        defaultReportTitle: body.defaultReportTitle,
      },
    });

    return NextResponse.json({
      success: true,
      message: "White label settings saved successfully",
      settings,
    });
  } catch (error) {
    console.error("Error saving white label settings:", error);
    return NextResponse.json(
      { error: "Failed to save white label settings" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (!decoded?.userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Delete user's white label settings
    await prisma.whiteLabelSettings.delete({
      where: { userId: decoded.userId },
    });

    return NextResponse.json({
      success: true,
      message: "White label settings deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting white label settings:", error);
    return NextResponse.json(
      { error: "Failed to delete white label settings" },
      { status: 500 }
    );
  }
}