"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Globe,
  Settings,
  Activity,
  Calendar,
  MapPin,
  Target,
  Eye,
  Clock,
  ArrowUp,
  ArrowDown,
  Plus,
  Download,
  Share2,
  Mail,
  RefreshCw,
  Filter,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KeywordData {
  id: string;
  keyword: string;
  url: string;
  currentRank: number;
  previousRank: number;
  change: number;
  searchVolume: number;
  competition: "low" | "medium" | "high";
  url: string;
  lastChecked: string;
}

interface TrackingData {
  keywords: KeywordData[];
  totalKeywords: number;
  averageRank: number;
  improved: number;
  declined: number;
  unchanged: number;
}

export default function PositionTrackingPage() {
  const { toast } = useToast();
  const [domain, setDomain] = useState("");
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("united-states");
  const [device, setDevice] = useState("desktop");
  const [language, setLanguage] = useState("en");
  const [competitors, setCompetitors] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Mock data for demonstration
    const mockData: TrackingData = {
      keywords: [
        {
          id: "1",
          keyword: "seo tools",
          url: "https://example.com/seo-tools",
          currentRank: 5,
          previousRank: 8,
          change: 3,
          searchVolume: 12000,
          competition: "high",
          url: "https://example.com/seo-tools",
          lastChecked: new Date().toISOString(),
        },
        {
          id: "2",
          keyword: "keyword research",
          url: "https://example.com/keyword-research",
          currentRank: 12,
          previousRank: 10,
          change: -2,
          searchVolume: 8500,
          competition: "medium",
          url: "https://example.com/keyword-research",
          lastChecked: new Date().toISOString(),
        },
        {
          id: "3",
          keyword: "website audit",
          url: "https://example.com/website-audit",
          currentRank: 3,
          previousRank: 3,
          change: 0,
          searchVolume: 6500,
          competition: "medium",
          url: "https://example.com/website-audit",
          lastChecked: new Date().toISOString(),
        },
        {
          id: "4",
          keyword: "backlink analysis",
          url: "https://example.com/backlink-analysis",
          currentRank: 7,
          previousRank: 15,
          change: 8,
          searchVolume: 4800,
          competition: "high",
          url: "https://example.com/backlink-analysis",
          lastChecked: new Date().toISOString(),
        },
        {
          id: "5",
          keyword: "content optimization",
          url: "https://example.com/content-optimization",
          currentRank: 9,
          previousRank: 6,
          change: -3,
          searchVolume: 3200,
          competition: "low",
          url: "https://example.com/content-optimization",
          lastChecked: new Date().toISOString(),
        },
      ],
      totalKeywords: 5,
      averageRank: 7.2,
      improved: 2,
      declined: 2,
      unchanged: 1,
    };

    setTrackingData(mockData);
  }, []);

  const handleStartTracking = async () => {
    if (!domain || !keywords) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter both domain and keywords to track",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Tracking Started",
        description: "Position tracking has been set up successfully",
      });
      setShowAddForm(false);
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "There was an error setting up position tracking",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Position Tracking
          </h1>
          <p className="text-gray-600">
            Track your keyword rankings over time and monitor SEO performance
          </p>
        </div>

        {/* Add New Tracking Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Keywords to Track
              </CardTitle>
              <CardDescription>
                Set up position tracking for new keywords
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain *</Label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords *</Label>
                  <Textarea
                    id="keywords"
                    placeholder="Enter keywords, one per line"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="united-states">
                        United States
                      </SelectItem>
                      <SelectItem value="united-kingdom">
                        United Kingdom
                      </SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="device">Device</Label>
                  <Select value={device} onValueChange={setDevice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors">
                  Competitor Domains (Optional)
                </Label>
                <Textarea
                  id="competitors"
                  placeholder="Enter competitor domains, one per line"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Tracking Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleStartTracking}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white mr-2"></div>
                      Setting up tracking...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Start Tracking
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overview Stats */}
        {trackingData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Keywords
                </CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trackingData.totalKeywords}
                </div>
                <p className="text-xs text-muted-foreground">Being tracked</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Rank
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trackingData.averageRank}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all keywords
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Improved</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {trackingData.improved}
                </div>
                <p className="text-xs text-muted-foreground">
                  Keywords moved up
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Declined</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {trackingData.declined}
                </div>
                <p className="text-xs text-muted-foreground">
                  Keywords moved down
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Keywords
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Keywords Table */}
        {trackingData && (
          <Card>
            <CardHeader>
              <CardTitle>Tracked Keywords</CardTitle>
              <CardDescription>
                Monitor your keyword performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-8 gap-4 p-4 font-medium text-sm text-gray-700 border-b">
                  <div>Keyword</div>
                  <div>URL</div>
                  <div className="text-center">Current Rank</div>
                  <div className="text-center">Previous Rank</div>
                  <div className="text-center">Change</div>
                  <div className="text-center">Search Volume</div>
                  <div className="text-center">Competition</div>
                  <div className="text-center">Actions</div>
                </div>

                {trackingData.keywords.map((keyword) => (
                  <div
                    key={keyword.id}
                    className="grid grid-cols-8 gap-4 p-4 border-b hover:bg-gray-50"
                  >
                    <div className="font-medium">{keyword.keyword}</div>
                    <div className="truncate">
                      <a
                        href={keyword.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <span className="truncate">{keyword.url}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                    <div className="text-center">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        #{keyword.currentRank}
                      </Badge>
                    </div>
                    <div className="text-center text-gray-600">
                      #{keyword.previousRank}
                    </div>
                    <div
                      className={`text-center flex items-center justify-center gap-1 ${getChangeColor(keyword.change)}`}
                    >
                      {getChangeIcon(keyword.change)}
                      <span className="font-medium">
                        {keyword.change > 0 ? "+" : ""}
                        {keyword.change}
                      </span>
                    </div>
                    <div className="text-center">
                      {keyword.searchVolume.toLocaleString()}
                    </div>
                    <div className="text-center">
                      <Badge
                        className={getCompetitionColor(keyword.competition)}
                      >
                        {keyword.competition}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
