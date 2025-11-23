import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface WritingAssistantRequest {
  topic: string;
  contentType: "blog" | "article" | "product-description" | "social" | "email";
  tone: "professional" | "casual" | "friendly" | "formal" | "humorous";
  targetAudience?: string;
  keywords?: string[];
  length?: "short" | "medium" | "long";
  includeSEO?: boolean;
  outlineOnly?: boolean;
}

interface WritingAssistantResult {
  topic: string;
  contentType: string;
  outline: Array<{
    heading: string;
    subpoints: string[];
    wordCount: number;
  }>;
  content?: string;
  seoData?: {
    title: string;
    metaDescription: string;
    keywords: string[];
    readabilityScore: number;
    wordCount: number;
  };
  suggestions: string[];
  estimatedReadTime: number;
}

async function generateWritingAssistant(
  request: WritingAssistantRequest
): Promise<WritingAssistantResult> {
  const {
    topic,
    contentType = "blog",
    tone = "professional",
    targetAudience = "general",
    keywords = [],
    length = "medium",
    includeSEO = true,
    outlineOnly = false,
  } = request;

  // Generate outline based on content type and topic
  const outline = generateOutline(topic, contentType, length);

  let content: string | undefined;
  let seoData: WritingAssistantResult["seoData"] | undefined;

  if (!outlineOnly) {
    content = generateContent(topic, outline, tone, contentType);

    if (includeSEO) {
      seoData = {
        title: generateSEOTitle(topic, contentType),
        metaDescription: generateMetaDescription(topic, contentType),
        keywords: [...keywords, topic, `${topic} guide`, `${topic} tutorial`],
        readabilityScore: Math.floor(Math.random() * 20) + 80,
        wordCount: content.split(/\s+/).length,
      };
    }
  }

  const suggestions = generateSuggestions(topic, contentType, tone);
  const estimatedReadTime = outlineOnly
    ? outline.reduce((sum, section) => sum + section.wordCount, 0) / 200
    : (content?.split(/\s+/).length || 0) / 200;

  return {
    topic,
    contentType,
    outline,
    content,
    seoData,
    suggestions,
    estimatedReadTime: Math.ceil(estimatedReadTime),
  };
}

function generateOutline(
  topic: string,
  contentType: string,
  length: string
): Array<{
  heading: string;
  subpoints: string[];
  wordCount: number;
}> {
  const baseOutline = [
    {
      heading: `Introduction to ${topic}`,
      subpoints: [
        `What is ${topic} and why it matters`,
        `Key benefits of understanding ${topic}`,
        `What readers will learn from this ${contentType}`,
      ],
      wordCount: 150,
    },
    {
      heading: `Understanding the Fundamentals of ${topic}`,
      subpoints: [
        `Core concepts and terminology`,
        `Historical context and evolution`,
        `Current industry standards`,
      ],
      wordCount: 200,
    },
    {
      heading: `Best Practices for ${topic}`,
      subpoints: [
        `Industry-accepted methodologies`,
        `Common mistakes to avoid`,
        `Expert recommendations and tips`,
      ],
      wordCount: 250,
    },
    {
      heading: `Practical Implementation of ${topic}`,
      subpoints: [
        `Step-by-step guide`,
        `Tools and resources needed`,
        `Real-world examples and case studies`,
      ],
      wordCount: 300,
    },
    {
      heading: `Advanced ${topic} Strategies`,
      subpoints: [
        `Optimization techniques`,
        `Measuring success and ROI`,
        `Future trends and developments`,
      ],
      wordCount: 200,
    },
  ];

  const shortOutline = baseOutline.slice(0, 3);
  const longOutline = [
    ...baseOutline,
    {
      heading: `${topic} Tools and Resources`,
      subpoints: [
        `Recommended software and platforms`,
        `Free vs paid options comparison`,
        `Integration with existing workflows`,
      ],
      wordCount: 200,
    },
    {
      heading: `Troubleshooting Common ${topic} Issues`,
      subpoints: [
        `Identification of problems`,
        `Diagnostic techniques`,
        `Solution strategies`,
      ],
      wordCount: 200,
    },
    {
      heading: `Conclusion and Next Steps`,
      subpoints: [
        `Summary of key takeaways`,
        `Action items for readers`,
        `Additional learning resources`,
      ],
      wordCount: 150,
    },
  ];

  return length === "short" ? shortOutline : longOutline;
}

function generateContent(
  topic: string,
  outline: any[],
  tone: string,
  contentType: string
): string {
  const toneAdjectives = {
    professional: [
      "comprehensive",
      "strategic",
      "methodical",
      "evidence-based",
    ],
    casual: ["fun", "relatable", "easy-going", "straightforward"],
    friendly: ["helpful", "supportive", "encouraging", "clear"],
    formal: ["systematic", "structured", "authoritative", "precise"],
    humorous: ["entertaining", "witty", "light-hearted", "engaging"],
  };

  const adjectives =
    toneAdjectives[tone as keyof typeof toneAdjectives] ||
    toneAdjectives.professional;
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];

  let content = `# ${outline[0].heading}\n\n`;
  content += `In this ${adj} ${contentType} about ${topic}, we'll explore the essential aspects that everyone should know. `;
  content += `This guide is designed to provide ${adj} insights that you can immediately apply to your situation.\n\n`;

  outline.forEach((section, index) => {
    if (index === 0) return;

    content += `## ${section.heading}\n\n`;

    section.subpoints.forEach((point: string, pointIndex: number) => {
      content += `${pointIndex + 1}. ${point}\n`;
    });

    content += `\nThis section provides ${adj} coverage of ${section.heading.toLowerCase()}, `;
    content += `ensuring readers gain practical knowledge they can implement immediately.\n\n`;
  });

  return content;
}

function generateSEOTitle(topic: string, contentType: string): string {
  const templates = [
    `Ultimate Guide to ${topic} in ${new Date().getFullYear()}`,
    `${topic}: Complete Guide for Beginners and Experts`,
    `How to ${topic} - Best Practices and Examples`,
    `${topic} Explained: Everything You Need to Know`,
    `Master ${topic}: Step-by-Step Tutorial`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function generateMetaDescription(topic: string, contentType: string): string {
  return `Learn everything about ${topic} in this comprehensive ${contentType}. Discover best practices, expert tips, and practical examples to master ${topic} quickly and effectively.`;
}

function generateSuggestions(
  topic: string,
  contentType: string,
  tone: string
): string[] {
  return [
    `Add relevant images or videos to enhance reader engagement`,
    `Include internal links to related ${topic} resources`,
    `Add a FAQ section to address common questions about ${topic}`,
    `Use bullet points and numbered lists for better readability`,
    `Include real-world examples and case studies`,
    `Add a call-to-action at the end of your ${contentType}`,
    `Consider adding downloadable resources or templates`,
    `Update content regularly to keep it fresh and relevant`,
    `Include social sharing buttons to increase reach`,
  ];
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
    const JWT_SECRET =
      process.env.JWT_SECRET || "your-secret-key-change-in-production";

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (!decoded?.userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body: WritingAssistantRequest = await request.json();
    const {
      topic,
      contentType,
      tone,
      targetAudience,
      keywords,
      length,
      includeSEO,
      outlineOnly,
    } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Check user limits
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isPremium) {
      const usage = await prisma.userUsage.findUnique({
        where: { userId: user.id },
      });
      if (usage && usage.freeReportsUsed >= 10) {
        return NextResponse.json(
          {
            error:
              "You have reached your monthly limit. Upgrade to premium for unlimited access.",
          },
          { status: 429 }
        );
      }
    }

    // Generate writing assistant result
    const result = await generateWritingAssistant({
      topic,
      contentType,
      tone,
      targetAudience,
      keywords,
      length,
      includeSEO,
      outlineOnly,
    });

    // Save to database
    const analysis = await prisma.sEOToolResult.create({
      data: {
        id: `writing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        toolType: "SEO_WRITING_ASSISTANT",
        url: `topic: ${topic}`,
        result: result as any,
        updatedAt: new Date(),
      },
    });

    // Update usage
    if (!user.isPremium) {
      await prisma.userUsage.upsert({
        where: { userId: user.id },
        update: { freeReportsUsed: { increment: 1 } },
        create: {
          userId: user.id,
          freeReportsUsed: 1,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      ...result,
      analysisId: analysis.id,
    });
  } catch (error) {
    console.error("Writing assistant error:", error);
    return NextResponse.json(
      { error: "Failed to generate writing assistance" },
      { status: 500 }
    );
  }
}
