"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
  Menu,
  X,
  Search,
  ArrowDown,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Globe,
  Brain,
  FileText,
  Settings,
  Cpu,
  Link2,
  Image,
  Zap,
  Shield,
  Smartphone,
  Database,
  Code,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const ToolItem = ({
  href,
  label,
  icon: Icon,
  description,
  closeMenu,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  closeMenu?: () => void;
}) => (
  <Link
    href={href}
    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-[hsl(var(--seoaudit-orange))] focus:ring-offset-2"
    onClick={typeof closeMenu === "function" ? closeMenu : undefined}
  >
    {Icon && (
      <span
        className="text-[hsl(var(--seoaudit-orange))] mt-0.5"
        aria-hidden="true"
      >
        {Icon}
      </span>
    )}
    <div className="flex-1">
      <span className="text-sm font-medium text-gray-900 group-hover:text-[hsl(var(--seoaudit-orange))]">
        {label}
      </span>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  </Link>
);

const ToolGroup = ({
  title,
  children,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2 mb-2">
      {Icon && (
        <span className="text-[hsl(var(--seoaudit-orange))]">{Icon}</span>
      )}
      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
        {title}
      </h4>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

const FeaturesMegaMenu = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 w-[800px] bg-white rounded-lg shadow-lg border border-gray-200">
    <ToolGroup
      title="Premium Analysis"
      icon={<BarChart3 className="h-5 w-5" />}
    >
      <ToolItem
        href="/domain-overview"
        label="Domain Overview"
        icon={<Globe className="h-5 w-5" />}
        description="Comprehensive domain analysis and authority metrics"
      />
      <ToolItem
        href="/competitor-analysis"
        label="Competitor Analysis"
        icon={<TrendingUp className="h-5 w-5" />}
        description="Analyze competitors' strategies and performance"
      />
      <ToolItem
        href="/keyword-research"
        label="Keyword Research"
        icon={<Search className="h-5 w-5" />}
        description="Discover high-value keywords with advanced research"
      />
      <ToolItem
        href="/backlink-analytics"
        label="Backlink Analytics"
        icon={<Link2 className="h-5 w-5" />}
        description="Analyze backlink profile and authority"
      />
    </ToolGroup>
    <ToolGroup title="Advanced Tools" icon={<Zap className="h-5 w-5" />}>
      <ToolItem
        href="/enhanced-site-audit"
        label="Enhanced Site Audit"
        icon={<Shield className="h-5 w-5" />}
        description="Comprehensive SEO audit with advanced metrics"
      />
      <ToolItem
        href="/position-tracking"
        label="Position Tracking"
        icon={<BarChart3 className="h-5 w-5" />}
        description="Track keyword rankings over time"
      />
      <ToolItem
        href="/log-file-analyzer"
        label="Log File Analyzer"
        icon={<Database className="h-5 w-5" />}
        description="Analyze server logs for SEO insights"
      />
      <ToolItem
        href="/bulk-analysis"
        label="Bulk Analysis"
        icon={<Cpu className="h-5 w-5" />}
        description="Analyze multiple URLs at once"
      />
    </ToolGroup>
    <ToolGroup title="Content & AI" icon={<Brain className="h-5 w-5" />}>
      <ToolItem
        href="/content-ideas"
        label="Content Ideas Generator"
        icon={<FileText className="h-5 w-5" />}
        description="Generate data-driven content ideas"
      />
      <ToolItem
        href="/writing-assistant"
        label="SEO Writing Assistant"
        icon={<FileText className="h-5 w-5" />}
        description="AI-powered content optimization"
      />
      <ToolItem
        href="/website-monitoring"
        label="Website Monitoring"
        icon={<Shield className="h-5 w-5" />}
        description="Track website performance 24/7"
      />
      <ToolItem
        href="/ai-content-analysis"
        label="AI Content Analysis"
        icon={<Brain className="h-5 w-5" />}
        description="Optimize content with AI insights"
      />
    </ToolGroup>
  </div>
);

const ToolsMegaMenu = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 w-[900px] bg-white rounded-lg shadow-lg border border-gray-200">
    <ToolGroup title="SEO Tools" icon={<BarChart3 className="h-4 w-4" />}>
      <ToolItem
        href="/keyword-research"
        label="Keyword Research Tool"
        icon={<TrendingUp className="h-4 w-4" />}
        description="Find profitable keywords"
      />
      <ToolItem
        href="/meta-tags-generator"
        label="Meta Tags Generator"
        icon={<FileText className="h-4 w-4" />}
        description="Create optimized meta tags"
      />
      <ToolItem
        href="/open-graph-generator"
        label="Open Graph Generator"
        icon={<Globe className="h-4 w-4" />}
        description="Optimize social sharing"
      />
      <ToolItem
        href="/campaign-url-builder"
        label="Campaign URL Builder"
        icon={<Link2 className="h-4 w-4" />}
        description="Track marketing campaigns"
      />
    </ToolGroup>

    <ToolGroup title="Content Tools" icon={<FileText className="h-4 w-4" />}>
      <ToolItem
        href="/tools/readability"
        label="Content Readability Score"
        icon={<FileText className="h-4 w-4" />}
        description="Improve content readability"
      />
      <ToolItem
        href="/tools/title-preview"
        label="Title Tag Preview"
        icon={<FileText className="h-4 w-4" />}
        description="Preview search appearance"
      />
      <ToolItem
        href="/tools/description-preview"
        label="Description Tag Preview"
        icon={<FileText className="h-4 w-4" />}
        description="Optimize meta descriptions"
      />
      <ToolItem
        href="/tools/structured-data"
        label="Structured Data Validator"
        icon={<Code className="h-4 w-4" />}
        description="Validate schema markup"
      />
      <ToolItem
        href="/tools/canonical-url"
        label="Canonical URL Checker"
        icon={<Link2 className="h-4 w-4" />}
        description="Fix duplicate content"
      />
    </ToolGroup>

    <ToolGroup title="Technical Tools" icon={<Settings className="h-4 w-4" />}>
      <ToolItem
        href="/tools/meta-tags"
        label="Meta Tags Generator"
        icon={<FileText className="h-4 w-4" />}
        description="Generate meta tags"
      />
      <ToolItem
        href="/tools/keyword-density"
        label="Keyword Density Analyzer"
        icon={<BarChart3 className="h-4 w-4" />}
        description="Analyze keyword usage"
      />
      <ToolItem
        href="/tools/header-tags"
        label="Header Tag Checker"
        icon={<FileText className="h-4 w-4" />}
        description="Validate heading structure"
      />
      <ToolItem
        href="/tools/internal-links"
        label="Internal Linking Analyzer"
        icon={<Link2 className="h-4 w-4" />}
        description="Optimize internal links"
      />
      <ToolItem
        href="/tools/alt-text"
        label="Image Alt Text Checker"
        icon={<Image className="h-4 w-4" />}
        description="Optimize image SEO"
      />
      <ToolItem
        href="/tools/broken-links"
        label="Broken Link Finder"
        icon={<X className="h-4 w-4" />}
        description="Find broken links"
      />
      <ToolItem
        href="/tools/robots-txt"
        label="Robots.txt Generator"
        icon={<Settings className="h-4 w-4" />}
        description="Create robots.txt"
      />
      <ToolItem
        href="/tools/sitemap"
        label="Sitemap Generator"
        icon={<Database className="h-4 w-4" />}
        description="Generate XML sitemaps"
      />
      <ToolItem
        href="/tools/mobile-friendly"
        label="Mobile-Friendliness Tester"
        icon={<Smartphone className="h-4 w-4" />}
        description="Test mobile optimization"
      />
    </ToolGroup>

    <div className="lg:col-span-3 pt-4 border-t border-gray-200">
      <div className="bg-gradient-to-r from-[hsl(var(--seoaudit-orange))/10] to-[hsl(var(--seoaudit-orange))/5] rounded-lg p-4 flex items-center justify-between">
        <div>
          <h5 className="font-semibold text-gray-900 mb-1">
            Need help choosing?
          </h5>
          <p className="text-sm text-gray-600">
            Use our SEO audit tool for comprehensive analysis
          </p>
        </div>
        <Link href="/tools/seo-score">
          <Button className="seoaudit-button">Start SEO Audit</Button>
        </Link>
      </div>
    </div>
  </div>
);

const DropdownMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="seoaudit-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold seoaudit-gradient-text">
                SEOaudit
              </span>
              <span className="text-2xl font-bold text-gray-900">Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] font-medium text-sm transition-colors bg-transparent">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <FeaturesMegaMenu />
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] font-medium text-sm transition-colors bg-transparent">
                  Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolsMegaMenu />
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenu>

            <Link
              href="/pricing"
              className="text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] font-medium text-sm transition-colors"
            >
              Pricing
            </Link>

            <Link
              href="/about"
              className="text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] font-medium text-sm transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--seoaudit-orange))] focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] font-medium text-sm transition-colors"
                >
                  Dashboard
                </Link>
                {user.isPremium && (
                  <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--seoaudit-orange))] text-white">
                    Premium
                  </span>
                )}
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] font-medium text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] font-medium"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="seoaudit-button">Start Free Trial</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="px-3 py-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--seoaudit-orange))] focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Premium Features
            </div>
            <Link
              href="/domain-overview"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Domain Overview
            </Link>
            <Link
              href="/competitor-analysis"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Competitor Analysis
            </Link>
            <Link
              href="/keyword-research"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Keyword Research
            </Link>
            <Link
              href="/backlink-analytics"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Backlink Analytics
            </Link>
            <Link
              href="/enhanced-site-audit"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Enhanced Site Audit
            </Link>
            <Link
              href="/position-tracking"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Position Tracking
            </Link>
            <Link
              href="/log-file-analyzer"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Log File Analyzer
            </Link>
            <Link
              href="/bulk-analysis"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Bulk Analysis
            </Link>
            <Link
              href="/content-ideas"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Content Ideas Generator
            </Link>
            <Link
              href="/writing-assistant"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              SEO Writing Assistant
            </Link>

            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SEO Tools
            </div>
            <Link
              href="/tools/seo-score"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              SEO Score Calculator
            </Link>
            <Link
              href="/tools/readability"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Content Readability Score
            </Link>
            <Link
              href="/tools/title-preview"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Title Tag Preview
            </Link>
            <Link
              href="/tools/description-preview"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Description Tag Preview
            </Link>
            <Link
              href="/tools/structured-data"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Structured Data Validator
            </Link>
            <Link
              href="/tools/canonical-url"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Canonical URL Checker
            </Link>

            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Technical Tools
            </div>
            <Link
              href="/tools/meta-tags"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Meta Tags Generator
            </Link>
            <Link
              href="/tools/keyword-density"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Keyword Density Analyzer
            </Link>
            <Link
              href="/tools/header-tags"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Header Tag Checker
            </Link>
            <Link
              href="/tools/internal-links"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Internal Linking Analyzer
            </Link>
            <Link
              href="/tools/alt-text"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Image Alt Text Checker
            </Link>
            <Link
              href="/tools/broken-links"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Broken Link Finder
            </Link>
            <Link
              href="/tools/robots-txt"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Robots.txt Generator
            </Link>
            <Link
              href="/tools/sitemap"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Sitemap Generator
            </Link>
            <Link
              href="/tools/mobile-friendly"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Mobile-Friendliness Tester
            </Link>

            <Link
              href="/pricing"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
            >
              About
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
                >
                  Dashboard
                </Link>
                {user.isPremium && (
                  <div className="px-3 py-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--seoaudit-orange))] text-white">
                      Premium
                    </span>
                  </div>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] hover:bg-gray-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:text-[hsl(var(--seoaudit-orange))] font-medium"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full seoaudit-button">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default DropdownMenu;
