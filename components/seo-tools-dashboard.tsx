import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  Search,
  Heading,
  Link as LinkIcon,
  Image,
  AlertCircle,
  FileCode,
  Network,
  Calculator,
  BookOpen,
  Eye,
  Code,
  Link2,
  Smartphone,
  LogOut,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

interface ToolCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const tools: ToolCard[] = [
  {
    title: "Meta Tag Generator",
    description: "Generate optimized meta tags for your web pages",
    icon: <FileText className="h-6 w-6" />,
    href: "/tools/meta-tags",
  },
  {
    title: "Keyword Density Analyzer",
    description: "Analyze keyword density in your content",
    icon: <Search className="h-6 w-6" />,
    href: "/tools/keyword-density",
  },
  {
    title: "Header Tag Checker",
    description: "Validate proper use of header tags",
    icon: <Heading className="h-6 w-6" />,
    href: "/tools/header-tags",
  },
  {
    title: "Internal Linking Analyzer",
    description: "Find opportunities for internal linking",
    icon: <LinkIcon className="h-6 w-6" />,
    href: "/tools/internal-links",
  },
  {
    title: "Image Alt Text Checker",
    description: "Verify alt text for images",
    icon: <Image className="h-6 w-6" />,
    href: "/tools/alt-text",
  },
  {
    title: "Broken Link Finder",
    description: "Identify broken links on your website",
    icon: <AlertCircle className="h-6 w-6" />,
    href: "/tools/broken-links",
  },
  {
    title: "Robots.txt Generator",
    description: "Create and customize robots.txt files",
    icon: <FileCode className="h-6 w-6" />,
    href: "/tools/robots-txt",
  },
  {
    title: "Sitemap Generator",
    description: "Generate XML sitemaps for search engines",
    icon: <Network className="h-6 w-6" />,
    href: "/tools/sitemap",
  },
  {
    title: "SEO Score Calculator",
    description: "Calculate SEO score based on various metrics",
    icon: <Calculator className="h-6 w-6" />,
    href: "/tools/seo-score",
  },
  {
    title: "Content Readability Score",
    description: "Analyze content readability",
    icon: <BookOpen className="h-6 w-6" />,
    href: "/tools/readability",
  },
  {
    title: "Title Tag Preview",
    description: "Preview title tags in search results",
    icon: <Eye className="h-6 w-6" />,
    href: "/tools/title-preview",
  },
  {
    title: "Description Tag Preview",
    description: "Preview meta descriptions in search results",
    icon: <Eye className="h-6 w-6" />,
    href: "/tools/description-preview",
  },
  {
    title: "Structured Data Validator",
    description: "Validate schema markup for rich snippets",
    icon: <Code className="h-6 w-6" />,
    href: "/tools/structured-data",
  },
  {
    title: "Canonical URL Checker",
    description: "Verify canonical URLs",
    icon: <Link2 className="h-6 w-6" />,
    href: "/tools/canonical-url",
  },
  {
    title: "Mobile-Friendliness Tester",
    description: "Test website mobile-friendliness",
    icon: <Smartphone className="h-6 w-6" />,
    href: "/tools/mobile-friendly",
  },
];

export function SEOToolsDashboard() {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">SEO Tools</h2>
              <p className="text-muted-foreground">
                Comprehensive suite of tools to optimize your website
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Card
                key={tool.title}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {tool.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={tool.href}>Open Tool</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
