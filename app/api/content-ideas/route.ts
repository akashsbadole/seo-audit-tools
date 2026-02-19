import { NextResponse } from "next/server";

function generateContentIdeas(topic: string, contentType: string) {
  const seed = topic.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const random = (min: number, max: number) => Math.floor(Math.abs(Math.sin(seed + min + max) * 10000) % (max - min + 1)) + min;

  const contentTypes = contentType === "all" 
    ? ["blog", "video", "guide", "listicle"]
    : [contentType];

  const templates = [
    { title: `The Ultimate Guide to ${topic} in 2024`, type: "guide" },
    { title: `10 ${topic} Tips That Actually Work`, type: "listicle" },
    { title: `How to Master ${topic}: A Beginner's Guide`, type: "blog" },
    { title: `${topic} Mistakes to Avoid at All Costs`, type: "blog" },
    { title: `${topic} vs Alternatives: Complete Comparison`, type: "blog" },
    { title: `Complete ${topic} Tutorial for Beginners`, type: "video" },
    { title: `Top 5 ${topic} Tools You Need to Know`, type: "listicle" },
    { title: `Why ${topic} Matters for Your Business`, type: "blog" },
  ];

  const ideas = templates
    .filter(t => contentTypes.includes(t.type))
    .map((template) => ({
      title: template.title,
      description: `A comprehensive piece about ${topic} that provides actionable insights and expert tips for your audience.`,
      contentType: template.type,
      difficulty: ["easy", "medium", "hard"][random(0, 2)],
      searchVolume: random(500, 50000),
      targetKeywords: [
        `${topic.toLowerCase()}`,
        `${topic.toLowerCase()} guide`,
        `${topic.toLowerCase()} tips`,
        `best ${topic.toLowerCase()}`,
      ],
      potentialTraffic: random(1000, 30000),
    }));

  return ideas;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, contentType = "all" } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 1200));

    const ideas = generateContentIdeas(topic, contentType);

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Content ideas error:", error);
    return NextResponse.json({ error: "Failed to generate ideas" }, { status: 500 });
  }
}
