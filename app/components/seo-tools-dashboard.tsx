"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Globe,
  Clock,
  Shield,
  Target,
  Activity,
  Zap,
  Star,
  Eye,
  Download,
  Upload,
  Settings,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowDownLeft,
  Plus,
  Minus,
  Info,
  Loader,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  AreaChart as AreaChartIcon,
  BookOpen,
} from "lucide-react";

// Types
interface ToolData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: "active" | "completed" | "error";
  lastUsed?: string;
  usageCount?: number;
  results?: any;
}

interface DashboardProps {
  className?: string;
}

const SEODashboard: React.FC<DashboardProps> = ({ className = "" }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "tools" | "analytics" | "reports"
  >("overview");
  const [tools, setTools] = useState<ToolData[]>([]);

  // Mock data for tools
  const mockTools: ToolData[] = [
    // SEO Tools
    {
      id: "keyword-research",
      name: "Keyword Research Tool",
      description:
        "Advanced keyword analysis with search volume and difficulty estimation",
      icon: "Search",
      category: "seo",
      status: "active",
      usageCount: 8,
      results: {
        totalKeywords: 156,
        avgDifficulty: 42.3,
      },
    },
    {
      id: "meta-tags-generator",
      name: "Meta Tags Generator",
      description:
        "Generate optimized meta tags for better search engine visibility",
      icon: "Settings",
      category: "seo",
      status: "active",
      usageCount: 12,
      results: {
        tagsGenerated: 89,
        avgCTR: 3.2,
      },
    },
    {
      id: "open-graph-generator",
      name: "Open Graph Generator",
      description:
        "Create Open Graph tags for social media sharing optimization",
      icon: "Globe",
      category: "seo",
      status: "active",
      usageCount: 6,
      results: {
        ogTagsCreated: 45,
        socialEngagement: 28.5,
      },
    },
    {
      id: "campaign-url-builder",
      name: "Campaign URL Builder",
      description:
        "Build tracking URLs for marketing campaigns with UTM parameters",
      icon: "Target",
      category: "seo",
      status: "active",
      usageCount: 4,
      results: {
        campaignsBuilt: 23,
        trackingAccuracy: 97.8,
      },
    },
    {
      id: "seo-score-calculator",
      name: "SEO Score Calculator",
      description:
        "Calculate comprehensive SEO scores with actionable recommendations",
      icon: "BarChart3",
      category: "seo",
      status: "active",
      usageCount: 15,
      results: {
        avgScore: 78.4,
        improvements: 12,
      },
    },
    
    // Content Tools
    {
      id: "content-readability",
      name: "Content Readability Score",
      description:
        "Analyze content readability and get suggestions for improvement",
      icon: "BookOpen",
      category: "content",
      status: "active",
      usageCount: 9,
      results: {
        avgReadability: 72.3,
        contentOptimized: 34,
      },
    },
    {
      id: "title-preview",
      name: "Title Tag Preview",
      description:
        "Preview how your title tags will appear in search results",
      icon: "Eye",
      category: "content",
      status: "active",
      usageCount: 7,
      results: {
        titlesPreviewed: 56,
        ctrOptimized: 4.2,
      },
    },
    {
      id: "description-preview",
      name: "Description Tag Preview",
      description:
        "Preview and optimize meta descriptions for search results",
      icon: "Eye",
      category: "content",
      status: "active",
      usageCount: 7,
      results: {
        descriptionsPreviewed: 56,
        avgLength: 158,
      },
    },
    {
      id: "structured-data-validator",
      name: "Structured Data Validator",
      description:
        "Validate and generate structured data for rich snippets",
      icon: "Code",
      category: "content",
      status: "active",
      usageCount: 5,
      results: {
        schemasValidated: 28,
        richSnippets: 15,
      },
    },
    {
      id: "canonical-url-checker",
      name: "Canonical URL Checker",
      description:
        "Check and validate canonical URL implementation",
      icon: "Target",
      category: "content",
      status: "active",
      usageCount: 3,
      results: {
        urlsChecked: 19,
        issuesFound: 2,
      },
    },
    
    // Technical Tools
    {
      id: "meta-tags-generator-technical",
      name: "Meta Tags Generator (Technical)",
      description:
        "Generate comprehensive technical meta tags for SEO",
      icon: "Settings",
      category: "technical",
      status: "active",
      usageCount: 11,
      results: {
        technicalTags: 67,
        validationScore: 94.2,
      },
    },
    {
      id: "keyword-density",
      name: "Keyword Density Analyzer",
      description:
        "Analyze keyword density and distribution in content",
      icon: "BarChart3",
      category: "technical",
      status: "active",
      usageCount: 8,
      results: {
        pagesAnalyzed: 45,
        avgDensity: 2.3,
      },
    },
    {
      id: "header-tags",
      name: "Header Tag Checker",
      description:
        "Analyze H1-H6 tag structure and hierarchy",
      icon: "Activity",
      category: "technical",
      status: "active",
      usageCount: 6,
      results: {
        headersChecked: 38,
        structureScore: 85.7,
      },
    },
    {
      id: "internal-links",
      name: "Internal Linking Analyzer",
      description:
        "Analyze internal link structure and distribution",
      icon: "ExternalLink",
      category: "technical",
      status: "active",
      usageCount: 7,
      results: {
        linksAnalyzed: 234,
        linkEquity: 76.4,
      },
    },
    {
      id: "image-alt-text",
      name: "Image Alt Text Checker",
      description:
        "Check and optimize image alt text for accessibility and SEO",
      icon: "Eye",
      category: "technical",
      status: "active",
      usageCount: 9,
      results: {
        imagesChecked: 156,
        altTextScore: 82.1,
      },
    },
    {
      id: "broken-links",
      name: "Broken Link Finder",
      description:
        "Find and fix broken links across your website",
      icon: "AlertCircle",
      category: "technical",
      status: "active",
      usageCount: 4,
      results: {
        linksScanned: 1234,
        brokenFound: 23,
      },
    },
    {
      id: "robots-txt",
      name: "Robots.txt Generator",
      description:
        "Generate and validate robots.txt files",
      icon: "Settings",
      category: "technical",
      status: "active",
      usageCount: 3,
      results: {
        filesGenerated: 12,
        validationScore: 98.5,
      },
    },
    {
      id: "sitemap-generator",
      name: "Sitemap Generator",
      description:
        "Generate XML sitemaps for better search engine indexing",
      icon: "Globe",
      category: "technical",
      status: "active",
      usageCount: 5,
      results: {
        sitemapsCreated: 18,
        pagesIndexed: 892,
      },
    },
    {
      id: "mobile-friendly",
      name: "Mobile-Friendliness Tester",
      description:
        "Test mobile compatibility and responsiveness",
      icon: "Smartphone",
      category: "technical",
      status: "active",
      usageCount: 10,
      results: {
        pagesTested: 67,
        mobileScore: 84.3,
      },
    },
  ];

  // State for tabs
  const [overviewData, setOverviewData] = useState<any>(null);
  const [toolsData, setToolsData] = useState<any[]>(mockTools);

  React.useEffect(() => {
    // Initialize tools if not already loaded
    if (tools.length === 0) {
      setTools(mockTools);
    }
  }, []);

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setActiveTab("tools");

    // Update tool last used
    setTools((prevTools) =>
      prevTools.map((tool) =>
        tool.id === toolId
          ? { ...tool, lastUsed: new Date().toISOString() }
          : tool
      )
    );
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      research: <Search className="w-5 h-5" />,
      analytics: <BarChart3 className="w-5 h-5" />,
      tools: <Settings className="w-5 h-5" />,
      reports: <Activity className="w-5 h-5" />,
      seo: <Target className="w-5 h-5" />,
      content: <BookOpen className="w-5 h-5" />,
      technical: <Settings className="w-5 h-5" />,
    };
    return icons[category] || <Info className="w-5 h-5" />;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      error: "bg-red-100 text-red-800",
    };

    return (
      <Badge variant="secondary" className={`${colors[status]} mr-2`}>
        {status === "active" && <Activity className="w-3 h-3 mr-1" />}
        {status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === "error" && <XCircle className="w-3 h-3 mr-1" />}
        {status}
      </Badge>
    );
  };

  const renderToolCard = (tool: ToolData) => (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${tool.icon === "Globe" ? "bg-blue-100" : tool.icon === "Search" ? "bg-green-100" : tool.icon === "ExternalLink" ? "bg-purple-100" : "bg-gray-100"}`}
            >
              {tool.icon === "Globe" && (
                <Globe className="w-5 h-5 text-blue-600" />
              )}
              {tool.icon === "Search" && (
                <Search className="w-5 h-5 text-green-600" />
              )}
              {tool.icon === "ExternalLink" && (
                <ExternalLink className="w-5 h-5 text-purple-600" />
              )}
              {tool.icon !== "Globe" &&
                tool.icon !== "Search" &&
                tool.icon !== "ExternalLink" &&
                getCategoryIcon(tool.category)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(tool.status)}
            <div className="text-sm text-gray-500">
              {tool.lastUsed &&
                `Used ${new Date(tool.lastUsed).toLocaleDateString()}`}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tool.results && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Recent Results
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(tool.results)
                .slice(0, 4)
                .map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded">
                    <div className="text-xs font-medium text-gray-500">
                      {key}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {String(value)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToolSelect(tool.id)}
          >
            Use Tool
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderToolsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <div
          key={tool.id}
          onClick={() => handleToolSelect(tool.id)}
          className="cursor-pointer"
        >
          {renderToolCard(tool)}
        </div>
      ))}
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          SEO Tools Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-blue-900 mb-2">
              Total Tools
            </h4>
            <p className="text-3xl font-bold text-blue-900">{tools.length}</p>
            <p className="text-blue-700">Active Tools</p>
          </div>

          <div className="space-y-4 md:col-span-2 lg:col-span-2">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Tool Categories
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">
                  SEO Tools
                </div>
                <div className="text-3xl font-bold text-blue-900">
                  {tools.filter((t) => t.category === "seo").length}
                </div>
              </div>

              <div className="text-center">
                <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">
                  Content Tools
                </div>
                <div className="text-3xl font-bold text-green-900">
                  {tools.filter((t) => t.category === "content").length}
                </div>
              </div>

              <div className="text-center">
                <Settings className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">
                  Technical Tools
                </div>
                <div className="text-3xl font-bold text-purple-900">
                  {tools.filter((t) => t.category === "technical").length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Recent Activity
          </h4>
          <div className="space-y-3">
            {tools.slice(0, 5).map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center">
                  {getCategoryIcon(tool.category)}
                  <div className="ml-3">
                    <h5 className="font-medium text-gray-900">{tool.name}</h5>
                    <p className="text-xs text-gray-600">
                      {tool.lastUsed &&
                        `Last used: ${new Date(tool.lastUsed).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(tool.status)}
                  <div className="text-xs text-gray-500 mt-1">
                    Uses: {tool.usageCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedTool && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Selected Tool: {tools.find((t) => t.id === selectedTool)?.name}
          </h4>
          {renderToolCard(tools.find((t) => t.id === selectedTool)!)}
        </div>
      )}
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Usage Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-xl font-bold text-blue-900 mb-2">
              Total Usage
            </h4>
            <p className="text-3xl font-bold text-blue-900">
              {tools.reduce((sum, tool) => sum + (tool.usageCount || 0), 0)}
            </p>
            <p className="text-blue-700">API Calls This Month</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Tool Usage Breakdown
            </h4>
            <div className="space-y-2">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded"
                >
                  <div className="flex items-center">
                    {getCategoryIcon(tool.category)}
                    <div className="ml-3">
                      <h5 className="font-medium text-gray-900">{tool.name}</h5>
                      <p className="text-xs text-gray-600">
                        {tool.usageCount} uses
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-900">
                      {tool.usageCount}
                    </div>
                    <div className="text-xs text-gray-500">This Month</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Performance Metrics
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">
                  Avg Response Time
                </div>
                <div className="text-2xl font-bold text-yellow-900">2.3s</div>
              </div>

              <div className="text-center">
                <Zap className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">
                  Success Rate
                </div>
                <div className="text-2xl font-bold text-green-900">98.5%</div>
              </div>

              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">
                  Usage Growth
                </div>
                <div className="text-2xl font-bold text-blue-900">+23.4%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Info className="w-12 h-12 mx-auto mb-4" />
          <p className="text-sm font-medium text-gray-700">No reports yet</p>
          <p className="text-xs text-gray-500">
            Generate your first report to see insights
          </p>
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: renderOverviewTab(),
    },
    {
      id: "tools",
      label: "Tools",
      content: renderToolsTab(),
    },
    {
      id: "analytics",
      label: "Analytics",
      content: renderAnalyticsTab(),
    },
    {
      id: "reports",
      label: "Reports",
      content: renderReportsTab(),
    },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-blue-600">SEO</span> Tools Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Advanced competitive research, keyword analysis, and backlink
              analytics for enterprise SEO optimization
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg rounded-r-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {selectedTool && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Tool Details: {tools.find((t) => t.id === selectedTool)?.name}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTool(null)}
              className="mt-2"
            >
              Back to Overview
            </Button>
          </div>
          {renderToolCard(tools.find((t) => t.id === selectedTool)!)}
        </div>
      )}
    </div>
  );
};

export default SEODashboard;
