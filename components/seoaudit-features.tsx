"use client";

import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Globe, 
  Shield, 
  Zap,
  Target,
  Link2,
  FileText,
  Code,
  Smartphone,
  Database,
  ArrowRight,
  CheckCircle,
  Brain,
  Megaphone,
  Layers,
  Rocket,
  Eye,
  Settings,
  Users,
  MessageSquare,
  Clock,
  Award
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    category: "Research & Analysis",
    items: [
      {
        title: "Keyword Research",
        description: "Discover high-volume, low-competition keywords to target. Get search volume, difficulty scores, and trend data.",
        icon: Search,
        color: "from-blue-500 to-cyan-500",
        href: "/keyword-research"
      },
      {
        title: "Competitor Analysis",
        description: "Analyze your competitors' SEO strategies, keywords, backlinks, and traffic to find opportunities.",
        icon: TrendingUp,
        color: "from-purple-500 to-pink-500",
        href: "/competitor-analysis"
      },
      {
        title: "Backlink Analytics",
        description: "Explore your backlink profile and discover new link-building opportunities with comprehensive analysis.",
        icon: Link2,
        color: "from-orange-500 to-red-500",
        href: "/backlink-analytics"
      },
      {
        title: "Domain Overview",
        description: "Get comprehensive domain metrics including authority scores, traffic estimates, and ranking data.",
        icon: Globe,
        color: "from-green-500 to-teal-500",
        href: "/domain-overview"
      }
    ]
  },
  {
    category: "Technical SEO",
    items: [
      {
        title: "Site Audit",
        description: "Identify technical issues that hurt your rankings. Get actionable recommendations to fix problems.",
        icon: Shield,
        color: "from-red-500 to-orange-500",
        href: "/enhanced-site-audit"
      },
      {
        title: "Page Speed Check",
        description: "Analyze page load times and get suggestions to improve Core Web Vitals and user experience.",
        icon: Rocket,
        color: "from-pink-500 to-rose-500",
        href: "/tools/site-speed"
      },
      {
        title: "Mobile-Friendly Test",
        description: "Check how well your site performs on mobile devices and get optimization recommendations.",
        icon: Smartphone,
        color: "from-cyan-500 to-blue-500",
        href: "/tools/mobile-friendly"
      },
      {
        title: "Schema Generator",
        description: "Create and implement structured data markup to enhance your search appearance.",
        icon: Code,
        color: "from-violet-500 to-purple-500",
        href: "/tools/structured-data"
      }
    ]
  },
  {
    category: "Content & Marketing",
    items: [
      {
        title: "Content Analyzer",
        description: "Optimize your content with AI-powered suggestions for readability, keyword density, and SEO.",
        icon: FileText,
        color: "from-yellow-500 to-orange-500",
        href: "/writing-assistant"
      },
      {
        title: "SEO Writing Assistant",
        description: "Get real-time recommendations as you write to create search-engine-friendly content.",
        icon: Brain,
        color: "from-indigo-500 to-blue-500",
        href: "/writing-assistant"
      },
      {
        title: "Position Tracking",
        description: "Monitor your keyword rankings over time and get notified of position changes.",
        icon: Target,
        color: "from-emerald-500 to-green-500",
        href: "/position-tracking"
      },
      {
        title: "Log File Analyzer",
        description: "Analyze server logs to understand how search engines crawl your site and identify issues.",
        icon: Database,
        color: "from-slate-500 to-zinc-500",
        href: "/log-file-analyzer"
      }
    ]
  },
  {
    category: "Tools & Utilities",
    items: [
      {
        title: "Meta Tags Generator",
        description: "Create optimized meta titles and descriptions with preview snippets for search results.",
        icon: Layers,
        color: "from-amber-500 to-yellow-500",
        href: "/tools/meta-tags"
      },
      {
        title: "Bulk Analysis",
        description: "Analyze multiple URLs at once for comprehensive SEO insights and comparisons.",
        icon: Megaphone,
        color: "from-rose-500 to-pink-500",
        href: "/bulk-analysis"
      },
      {
        title: "SEO Score Calculator",
        description: "Get an instant SEO score for any page with detailed recommendations for improvement.",
        icon: Award,
        color: "from-violet-500 to-fuchsia-500",
        href: "/tools/seo-score"
      },
      {
        title: "Broken Link Checker",
        description: "Find broken links on your site to improve user experience and preserve link equity.",
        icon: Eye,
        color: "from-teal-500 to-cyan-500",
        href: "/tools/broken-links"
      }
    ]
  }
];

export function SeoauditFeatures() {
  return (
    <section id="features" className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-gradient-to-r from-violet-600/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-gradient-to-l from-cyan-600/10 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-6">
            <Zap className="w-4 h-4 text-violet-400" />
            Powerful SEO Tools
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> Rank Higher</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive suite of SEO tools to analyze, audit, and optimize your website for search engines.
          </p>
        </div>

        {features.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-20">
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
              {category.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.items.map((feature, featureIndex) => (
                <Link
                  key={featureIndex}
                  href={feature.href}
                  className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-violet-500/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} bg-opacity-20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-violet-400 text-sm font-medium group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* <div className="text-center mt-16">
          <div className="inline-flex p-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl">
            <Button
              size="lg"
              className="bg-transparent hover:bg-white/10 text-white px-8 py-6 h-auto text-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <p className="mt-4 text-gray-500">No credit card required • 7-day free trial</p>
        </div> */}
      </div>
    </section>
  );
}
