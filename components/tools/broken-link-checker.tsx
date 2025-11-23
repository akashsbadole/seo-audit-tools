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
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Download,
  FileText,
  Link,
  X,
  Loader2
} from "lucide-react";

interface BrokenLink {
  id: string;
  url: string;
  statusCode: number;
  error?: string;
  sourceUrl: string;
}

interface BrokenLinkCheck {
  id: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  brokenLinks: BrokenLink[];
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export function BrokenLinkChecker() {
  const [url, setUrl] = useState("");
  const [depth, setDepth] = useState(3);
  const [maxPages, setMaxPages] = useState(100);
  const [currentJob, setCurrentJob] = useState<BrokenLinkCheck | null>(null);
  const [jobHistory, setJobHistory] = useState<BrokenLinkCheck[]>([]);
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
      const response = await fetch('/api/tools/broken-links');
      const data = await response.json();
      setJobHistory(data);
    } catch (error) {
      console.error('Failed to fetch job history:', error);
    }
  };

  const startCheck = async () => {
    if (!url) return;

    setLoading(true);
    try {
      const response = await fetch('/api/tools/broken-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          depth,
          maxPages,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setCurrentJob({
          id: data.jobId,
          url,
          status: 'pending',
          progress: 0,
          brokenLinks: [],
          createdAt: new Date().toISOString(),
        });
        
        // Poll for results
        pollForResults(data.jobId);
      } else {
        alert(data.error || 'Failed to start broken link check');
      }
    } catch (error) {
      console.error('Error starting broken link check:', error);
      alert('Failed to start broken link check');
    } finally {
      setLoading(false);
    }
  };

  const pollForResults = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/tools/broken-links?jobId=${jobId}`);
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

  const exportResults = (job: BrokenLinkCheck) => {
    const csvContent = [
      ['URL', 'Status Code', 'Error', 'Source URL'],
      ...job.brokenLinks.map(link => [
        link.url,
        link.statusCode,
        link.error || '',
        link.sourceUrl
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `broken-links-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600';
    if (statusCode >= 300 && statusCode < 400) return 'text-yellow-600';
    if (statusCode >= 400 && statusCode < 500) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-6 w-6" />
            Broken Link Checker
            <Badge variant="outline" className="ml-2">
              Premium
            </Badge>
          </CardTitle>
          <CardDescription>
            Find broken links (404s), redirects, and server errors across your website.
            Crawls up to {maxPages} pages with {depth} levels of depth.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                max="1000"
                value={maxPages}
                onChange={(e) => setMaxPages(parseInt(e.target.value))}
                className="w-full"
                disabled={!isPremium}
              />
              {!isPremium && (
                <p className="text-xs text-gray-500">
                  Free users limited to 100 pages. Upgrade for more.
                </p>
              )}
            </div>
          </div>
          
          <GradientButton
            onClick={startCheck}
            disabled={loading || !url}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Start Broken Link Check
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
              Check Results: {new URL(currentJob.url).hostname}
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
              </div>
            )}

            {currentJob.status === 'failed' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">Check Failed</span>
                </div>
                <p className="text-red-700 mt-2">{currentJob.error}</p>
              </div>
            )}

            {currentJob.brokenLinks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">
                    Found {currentJob.brokenLinks.length} Broken Links
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportResults(currentJob)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {currentJob.brokenLinks.map((link, index) => (
                    <div
                      key={index}
                      className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate"
                            >
                              {link.url}
                            </a>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`font-medium ${getStatusColor(link.statusCode)}`}>
                              {link.statusCode}
                            </span>
                            {link.error && (
                              <span className="text-gray-600">{link.error}</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Found on: {link.sourceUrl}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentJob.status === 'completed' && currentJob.brokenLinks.length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">No Broken Links Found!</span>
                </div>
                <p className="text-green-700 mt-2">
                  Great! All checked links are working properly.
                </p>
              </div>
            )}
          </CardContent>
        </GlassCard>
      )}

      {/* Job History */}
      {jobHistory.length > 0 && (
        <GlassCard>
          <CardHeader>
            <CardTitle>Recent Checks</CardTitle>
            <CardDescription>
              Your previous broken link checks
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
                      {job.brokenLinks.length} issues
                    </div>
                    {job.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          exportResults(job);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
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

export default BrokenLinkChecker;