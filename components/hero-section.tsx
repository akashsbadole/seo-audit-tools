"use client";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsOpen(false); // Close menu after clicking a link
    }
  };
  return (
    <div className="bg-gradient-to-b from-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-8 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block p-2 bg-indigo-800 rounded-full mb-4">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Comprehensive SEO Audit Tool
          </h1>
          <p className="text-xl text-indigo-200 mb-8">
            Analyze your website's SEO performance and get actionable insights
            to improve your search engine rankings
          </p>
          <Link href="#seo-audit" onClick={(e) => handleScroll(e, "seo-audit")}>
            <Button
              size="lg"
              className="rounded-full px-8 gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none"
            >
              Start Your Audit <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/keyword-research" className="group">
              <div className="p-4 bg-indigo-800/50 rounded-lg hover:bg-blue-800/70 transition-colors shadow">
                <h3 className="text-white font-medium group-hover:text-indigo-200 text-[14px]">
                  Keyword Research Tool
                </h3>
              </div>
            </Link>
            <Link href="/meta-tags-generator" className="group">
              <div className="p-4 bg-indigo-800/50 rounded-lg hover:bg-blue-800/70 transition-colors shadow">
                <h3 className="text-white font-medium group-hover:text-indigo-200 text-[14px]">
                  Meta Tags Generator
                </h3>
              </div>
            </Link>
            <Link href="/open-graph-generator" className="group">
              <div className="p-4 bg-indigo-800/50 rounded-lg hover:bg-blue-800/70 transition-colors shadow">
                <h3 className="text-white font-medium group-hover:text-indigo-200 text-[14px]">
                  Open Graph Generator
                </h3>
              </div>
            </Link>
            <Link href="/campaign-url-builder" className="group">
              <div className="p-4 bg-indigo-800/50 rounded-lg hover:bg-blue-800/70 transition-colors shadow">
                <h3 className="text-white font-medium group-hover:text-indigo-200 text-[14px]">
                  Campaign URL Builder
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
