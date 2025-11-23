"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart3,
  Search,
  Globe,
  Target,
  FileText,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Eye,
  Link as LinkIcon,
  Smartphone,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export function SeoauditFeatures() {
  const featureCategories = [
    {
      title: "SEO Tools",
      description: "Comprehensive tools to boost your search rankings",
      icon: <Search className="h-8 w-8" />,
      features: [
        {
          name: "Keyword Research",
          description: "Find profitable keywords with advanced filters",
          icon: <Search className="h-5 w-5" />,
        },
        {
          name: "On-Page SEO Checker",
          description: "Optimize your content for better rankings",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: "Backlink Analytics",
          description: "Analyze your backlink profile and competitors'",
          icon: <LinkIcon className="h-5 w-5" />,
        },
        {
          name: "Position Tracking",
          description: "Monitor your search rankings daily",
          icon: <TrendingUp className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Content Marketing",
      description: "Create content that ranks and converts",
      icon: <FileText className="h-8 w-8" />,
      features: [
        {
          name: "SEO Content Template",
          description: "Get SEO-optimized briefs in seconds",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: "Topic Research",
          description: "Discover trending topics in your niche",
          icon: <Target className="h-5 w-5" />,
        },
        {
          name: "Brand Monitoring",
          description: "Track mentions of your brand online",
          icon: <Eye className="h-5 w-5" />,
        },
        {
          name: "Post Tracking",
          description: "Monitor social media performance",
          icon: <Users className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Market Research",
      description: "Understand your market and competitors",
      icon: <BarChart3 className="h-8 w-8" />,
      features: [
        {
          name: "Market Explorer",
          description: "Analyze market trends and dynamics",
          icon: <Globe className="h-5 w-5" />,
        },
        {
          name: "Competitor Intelligence",
          description: "Uncover competitors' strategies",
          icon: <Target className="h-5 w-5" />,
        },
        {
          name: "Traffic Analytics",
          description: "Estimate any website's traffic",
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          name: "Keyword Gap",
          description: "Find keywords your competitors rank for",
          icon: <Search className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Technical SEO",
      description: "Ensure your site meets technical requirements",
      icon: <Shield className="h-8 w-8" />,
      features: [
        {
          name: "Site Audit",
          description: "Find and fix technical SEO issues",
          icon: <Shield className="h-5 w-5" />,
        },
        {
          name: "Log File Analyzer",
          description: "Understand how search bots crawl your site",
          icon: <Eye className="h-5 w-5" />,
        },
        {
          name: "On-Page SEO Checker",
          description: "Optimize your pages for search engines",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: "Mobile-Friendly Test",
          description: "Ensure your site works on all devices",
          icon: <Smartphone className="h-5 w-5" />,
        },
      ],
    },
  ];

  const benefits = [
    "55+ tools for digital marketing",
    "21 billion keywords in database",
    "43 trillion backlinks indexed",
    "800+ million domain profiles",
    "Data from 190+ countries",
  ];

  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="seoaudit-container">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-sm bg-[hsl(var(--seoaudit-orange))]/10 text-[hsl(var(--seoaudit-orange))] border-[hsl(var(--seoaudit-orange))]/20">
            <Zap className="mr-2 h-4 w-4" />
            All-in-One Marketing Platform
          </Badge>

          <h2 className="seoaudit-heading mb-6">
            Everything You Need to{" "}
            <span className="seoaudit-gradient-text">Win Online</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get access to 55+ tools that help you improve your online
            visibility, analyze competitors, and grow your business.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-gray-600"
              >
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {featureCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="seoaudit-feature-icon mr-4">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {category.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 text-[hsl(var(--seoaudit-orange))]">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {feature.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to grow your online presence?
            </h3>
            <p className="text-gray-600 mb-6">
              Join 50,000+ marketers and agencies who trust SEOaudit Pro to grow
              their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="seoaudit-button">
                  Start Your Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:border-[hsl(var(--seoaudit-orange))] hover:text-[hsl(var(--seoaudit-orange))]"
                >
                  Schedule Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 7-day free
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
