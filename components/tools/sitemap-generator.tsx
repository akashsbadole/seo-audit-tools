"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Settings,
  Loader2,
  Globe,
  Clock,
  ExternalLink,
  Copy
} from "lucide-react";

interface SitemapPage {
  url: string;
  title: string;
  description: string;
  lastModified: string;
  images?: Array<{ url: string; title: string; caption: string }>;
}

interface SitemapGeneration {
  id: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalPages: number;
  sitemapXml?: string;
  sitemapIndexXml?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export function SitemapGenerator() {
  const [url, setUrl] = useState("");
  const [depth, setDepth] = useState(3);
  const [maxPages, setMaxPages] = useState(500);
  const [includeImages, setIncludeImages] = useState(true);
  const [changeFreq, setChangeFreq] = useState('weekly');
  const [priority, setPriority] = useState('0.5');
  const [currentJob, setCurrentJob] = useState<SitemapGeneration | null>(null);
  const [jobHistory, setJobHistory] = useState<SitemapGeneration[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
    fetchJobHistory();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const response = await fetch('/api/user/premium-status');
      const data = await response.json();
      setIsPremium(data.isPremium);
    } catch (error) {
      console.error('Failed to check premium status:', error);
    }
  };

  const fetchJobHistory = async () => {
    try {
      const response = await fetch('/api/tools/sitemap-generator');
      const data = await response.json();
      setJobHistory(data);
    } catch (error) {
      console.error('Failed to fetch job history:', error);
    }
  };

  const startGeneration = async () => {
    if (!url) return;

    setLoading(true);
    try {
      const response = await fetch('/api/tools/sitemap-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          depth,
          maxPages,
          includeImages,
          changeFreq,
          priority,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setCurrentJob({
          id: data.jobId,
          url,
          status: 'pending',
          progress: 0,
          totalPages: 0,
          createdAt: new Date().toISOString(),
        });
        
        // Poll for results
        pollForResults(data.jobId);
      } else {
        alert(data.error || 'Failed to start sitemap generation');
      }
    } catch (error) {
      console.error('Error starting sitemap generation:', error);
      alert('Failed to start sitemap generation');
    } finally {
      setLoading(false);
    }
  };

  const pollForResults = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/tools/sitemap-generator?jobId=${jobId}`);
        const job = await response.json();
        
        setCurrentJob(job);
        
        if (job.status === 'completed' || job.status === 'failed') {
          clearInterval(pollInterval);
          fetchJobHistory(); // Refresh history
        }
      } catch (error) {
        console.error('Error polling for results:', error);
        clearInterval(pollInterval);
      }
    }, 2000); // Poll every 2 seconds
  };

  const downloadSitemap = (job: SitemapGeneration, type: 'xml' | 'index') => {
    const content = type === 'xml' ? job.sitemapXml : job.sitemapIndexXml;
    if (!content) return;

    const blob = new Blob([content], { type: 'application/xml' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = type === 'xml' ? 'sitemap.xml' : 'sitemap-index.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            XML Sitemap Generator
            <Badge variant="outline" className="ml-2">
              Premium
            </Badge>
          </CardTitle>
          <CardDescription>
            Generate comprehensive XML sitemaps for search engines.
            Crawls up to {maxPages} pages with {depth} levels of depth.
            Includes image sitemaps and sitemap index for large sites.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depth">Crawl Depth</Label>
              <Input
                id="depth"
                type="number"
                min="1"
                max="10"
                value={depth}
                onChange={(e) => setDepth(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPages">Max Pages</Label>
              <Input
                id="maxPages"
                type="number"
                min="10"
                max="10000"
                value={maxPages}
                onChange={(e) => setMaxPages(parseInt(e.target.value))}
                className="w-full"
                disabled={!isPremium}
              />
              {!isPremium && (
                <p className="text-xs text-gray-500">
                  Free users limited to 500 pages. Upgrade for more.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="changeFreq">Change Frequency</Label>
              <select
                id="changeFreq"
                value={changeFreq}
                onChange={(e) => setChangeFreq(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="always">Always</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="never">Never</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="1.0">Highest</option>
                <option value="0.8">High</option>
                <option value="0.6">Medium</option>
                <option value="0.5">Normal (Recommended)</option>
                <option value="0.3">Low</option>
                <option value="0.1">Lowest</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeImages"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="includeImages">Include Images</Label>
            </div>
          </div>
          
          <GradientButton
            onClick={startGeneration}
            disabled={loading || !url}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Sitemap...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Generate XML Sitemap
              </>
            )}
          </GradientButton>
        </CardContent>
      </GlassCard>

      {/* Current Job Status */}
      {currentJob && (
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(currentJob.status)}
              Sitemap Generation: {new URL(currentJob.url).hostname}
            </CardTitle>
            <CardDescription>
              Started: {new Date(currentJob.createdAt).toLocaleString()}
              {currentJob.completedAt && (
                <> • Completed: {new Date(currentJob.completedAt).toLocaleString()}</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentJob.status === 'running' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{currentJob.progress}%</span>
                </div>
                <Progress value={currentJob.progress} className="w-full" />
                <div className="text-sm text-gray-600">
                  Found {currentJob.totalPages} pages so far...
                </div>
              </div>
            )}

            {currentJob.status === 'failed' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">Generation Failed</span>
                </div>
                <p className="text-red-700 mt-2">{currentJob.error}</p>
              </div>
            )}

            {currentJob.status === 'completed' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">
                    Generated Successfully: {currentJob.totalPages} pages
                  </h4>
                  <div className="flex gap-2">
                    {currentJob.sitemapXml && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadSitemap(currentJob, 'xml')}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Sitemap XML
                      </Button>
                    )}
                    {currentJob.sitemapIndexXml && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadSitemap(currentJob, 'index')}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Sitemap Index
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Sitemap Generated Successfully!</span>
                    </div>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>URL: {new URL(currentJob.url).origin}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(new URL(currentJob.url).origin)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Generated: {new Date(currentJob.completedAt!).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Total Pages: {currentJob.totalPages}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </GlassCard>
      )}

      {/* Job History */}
      {jobHistory.length > 0 && (
        <GlassCard>
          <CardHeader>
            <CardTitle>Recent Generations</CardTitle>
            <CardDescription>
              Your previous sitemap generations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobHistory.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setCurrentJob(job)}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <div className="font-medium">
                        {new URL(job.url).hostname}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {job.totalPages} pages
                    </div>
                    {job.status === 'completed' && (
                      <div className="flex gap-1">
                        {job.sitemapXml && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadSitemap(job, 'xml');
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {job.sitemapIndexXml && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadSitemap(job, 'index');
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      )}
    </div>
  );
}

export default SitemapGenerator;