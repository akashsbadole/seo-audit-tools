"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
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
  Tag,
  Globe,
  FileCheck,
  BarChart,
  Wrench,
  Monitor,
  Hash,
  Target,
  ArrowRight,
  Star,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

interface Tool {
  title: string;
  href: string;
  icon: ReactNode;
  description?: string;
  popular?: boolean;
  new?: boolean;
}

interface ToolCategory {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
  {
    title: "SEO Tools",
    description: "Optimize your website for search engines",
    icon: <Search className="h-5 w-5" />,
    color: "from-blue-500/20 to-cyan-500/20",
    tools: [
      {
        title: "Keyword Research Tool",
        href: "/tools/keyword-research",
        icon: <Search className="h-4 w-4" />,
        description: "Find profitable keywords with search volume and competition data",
        popular: true
      },
      {
        title: "Meta Tags Generator",
        href: "/tools/meta-tags",
        icon: <Tag className="h-4 w-4" />,
        description: "Generate optimized meta tags for better search visibility"
      },
      {
        title: "Open Graph Generator",
        href: "/tools/open-graph",
        icon: <Globe className="h-4 w-4" />,
        description: "Create social media preview tags for better sharing"
      },
      {
        title: "Campaign URL Builder",
        href: "/tools/campaign-url",
        icon: <Link2 className="h-4 w-4" />,
        description: "Build trackable marketing URLs with UTM parameters"
      },
      {
        title: "SEO Score Calculator",
        href: "/tools/seo-score",
        icon: <Calculator className="h-4 w-4" />,
        description: "Calculate comprehensive SEO score with actionable insights",
        new: true
      }
    ]
  },
  {
    title: "Content Tools",
    description: "Create and optimize engaging content",
    icon: <BookOpen className="h-5 w-5" />,
    color: "from-purple-500/20 to-pink-500/20",
    tools: [
      {
        title: "Content Readability Score",
        href: "/tools/readability",
        icon: <BookOpen className="h-4 w-4" />,
        description: "Analyze content readability with multiple scoring metrics"
      },
      {
        title: "Title Tag Preview",
        href: "/tools/title-preview",
        icon: <Eye className="h-4 w-4" />,
        description: "Preview how titles appear in Google search results"
      },
      {
        title: "Description Tag Preview",
        href: "/tools/description-preview",
        icon: <Eye className="h-4 w-4" />,
        description: "Preview meta descriptions in SERP with character limits"
      },
      {
        title: "Structured Data Validator",
        href: "/tools/structured-data",
        icon: <Code className="h-4 w-4" />,
        description: "Validate structured data markup for rich snippets"
      },
      {
        title: "Canonical URL Checker",
        href: "/tools/canonical-url",
        icon: <Link2 className="h-4 w-4" />,
        description: "Check canonical URL implementation and fix issues"
      }
    ]
  },
  {
    title: "Technical Tools",
    description: "Analyze technical SEO aspects",
    icon: <Wrench className="h-5 w-5" />,
    color: "from-green-500/20 to-emerald-500/20",
    tools: [
      {
        title: "Meta Tags Generator",
        href: "/tools/meta-tags-generator",
        icon: <FileText className="h-4 w-4" />,
        description: "Generate comprehensive meta tags for all pages"
      },
      {
        title: "Keyword Density Analyzer",
        href: "/tools/keyword-density",
        icon: <BarChart className="h-4 w-4" />,
        description: "Analyze keyword density and distribution in content"
      },
      {
        title: "Header Tag Checker",
        href: "/tools/header-tags",
        icon: <Heading className="h-4 w-4" />,
        description: "Check heading structure and hierarchy for SEO"
      },
      {
        title: "Internal Linking Analyzer",
        href: "/tools/internal-links",
        icon: <LinkIcon className="h-4 w-4" />,
        description: "Analyze internal link structure and find opportunities"
      },
      {
        title: "Image Alt Text Checker",
        href: "/tools/alt-text",
        icon: <Image className="h-4 w-4" />,
        description: "Check image alt text optimization for accessibility"
      },
      {
        title: "Broken Link Finder",
        href: "/tools/broken-links",
        icon: <AlertCircle className="h-4 w-4" />,
        description: "Find and fix broken links to improve user experience",
        popular: true
      },
      {
        title: "Robots.txt Generator",
        href: "/tools/robots-txt",
        icon: <FileCode className="h-4 w-4" />,
        description: "Generate robots.txt files for search engine crawlers"
      },
      {
        title: "Sitemap Generator",
        href: "/tools/sitemap-generator",
        icon: <Network className="h-4 w-4" />,
        description: "Create XML sitemaps easily for better indexing"
      },
      {
        title: "Mobile-Friendliness Tester",
        href: "/tools/mobile-friendly",
        icon: <Smartphone className="h-4 w-4" />,
        description: "Test mobile compatibility and responsive design"
      }
    ]
  }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-6">
        <NavigationMenuItem>
          <Link href="/dashboard" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/dashboard"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/audits" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/audits" || pathname.startsWith("/audits/")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Audits
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-primary">
            SEO Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[1000px] gap-0 p-0 md:grid-cols-3 lg:w-[1300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-2xl rounded-lg overflow-hidden">
              {toolCategories.map((category, categoryIndex) => (
                <div key={category.title} className="group relative">
                  {/* Category Header */}
                  <div className={cn(
                    "sticky top-0 z-10 bg-gradient-to-r from-background via-background to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-6",
                    category.color
                  )}>
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-3 text-primary shadow-lg">
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-foreground">{category.title}</div>
                        <div className="text-sm text-muted-foreground font-medium">{category.description}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tools List */}
                  <div className="p-4 pt-4 max-h-[500px] overflow-y-auto">
                    <ul className="space-y-2">
                      {category.tools.map((tool, toolIndex) => (
                        <li key={tool.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={tool.href}
                              className={cn(
                                "group flex items-start gap-3 rounded-xl p-4 transition-all duration-300 hover:bg-accent/50 hover:shadow-md hover:scale-[1.02] focus:bg-accent focus:outline-none relative overflow-hidden",
                                pathname === tool.href &&
                                  "bg-accent text-accent-foreground border-l-4 border-primary shadow-md"
                              )}
                            >
                              {/* Background gradient for active state */}
                              {pathname === tool.href && (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl"></div>
                              )}
                              
                              <div className={cn(
                                "rounded-lg p-2.5 transition-all duration-300 shrink-0 relative z-10",
                                pathname === tool.href
                                  ? "bg-primary text-primary-foreground shadow-lg"
                                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:shadow-md"
                              )}>
                                {tool.icon}
                              </div>
                              
                              <div className="flex-1 min-w-0 relative z-10">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="text-sm font-semibold leading-none truncate">
                                    {tool.title}
                                  </div>
                                  {tool.popular && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full text-xs font-medium">
                                      <Star className="h-3 w-3 fill-current" />
                                      Popular
                                    </div>
                                  )}
                                  {tool.new && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
                                      <Zap className="h-3 w-3" />
                                      New
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {tool.description}
                                </p>
                              </div>
                              
                              {pathname === tool.href && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                  <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"></div>
                                </div>
                              )}
                              
                              {/* Hover arrow */}
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Separator between categories (except last) */}
                  {categoryIndex < toolCategories.length - 1 && (
                    <div className="absolute right-0 top-20 bottom-4 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                  )}
                </div>
              ))}
              
              {/* Footer */}
              <div className="col-span-3 bg-muted/30 border-t p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>All tools are free to use with premium features available</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>15+ Professional SEO Tools</span>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}