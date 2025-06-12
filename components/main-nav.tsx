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
} from "lucide-react";

interface Tool {
  title: string;
  href: string;
  icon: ReactNode;
}

export const tools: Tool[] = [
  {
    title: "Meta Tag Generator",
    href: "/tools/meta-tags",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Keyword Density Analyzer",
    href: "/tools/keyword-density",
    icon: <Search className="h-4 w-4" />,
  },
  {
    title: "Header Tag Checker",
    href: "/tools/header-tags",
    icon: <Heading className="h-4 w-4" />,
  },
  {
    title: "Internal Linking Analyzer",
    href: "/tools/internal-links",
    icon: <LinkIcon className="h-4 w-4" />,
  },
  {
    title: "Image Alt Text Checker",
    href: "/tools/alt-text",
    icon: <Image className="h-4 w-4" />,
  },
  {
    title: "Broken Link Finder",
    href: "/tools/broken-links",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    title: "Robots.txt Generator",
    href: "/tools/robots-txt",
    icon: <FileCode className="h-4 w-4" />,
  },
  {
    title: "Sitemap Generator",
    href: "/tools/sitemap",
    icon: <Network className="h-4 w-4" />,
  },
  {
    title: "SEO Score Calculator",
    href: "/tools/seo-score",
    icon: <Calculator className="h-4 w-4" />,
  },
  {
    title: "Content Readability Score",
    href: "/tools/readability",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: "Title Tag Preview",
    href: "/tools/title-preview",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    title: "Description Tag Preview",
    href: "/tools/description-preview",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    title: "Structured Data Validator",
    href: "/tools/structured-data",
    icon: <Code className="h-4 w-4" />,
  },
  {
    title: "Canonical URL Checker",
    href: "/tools/canonical-url",
    icon: <Link2 className="h-4 w-4" />,
  },
  {
    title: "Mobile-Friendliness Tester",
    href: "/tools/mobile-friendly",
    icon: <Smartphone className="h-4 w-4" />,
  },
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
            Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-card">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={tool.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        pathname === tool.href &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        {tool.icon}
                        {tool.title}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
