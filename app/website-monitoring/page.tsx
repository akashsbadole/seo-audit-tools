"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface MonitorSite {
  url: string;
  status: "up" | "down" | "checking";
  responseTime: number;
  lastChecked: string;
  uptime: number;
}

export default function WebsiteMonitoringPage() {
  const [url, setUrl] = useState("");
  const [sites, setSites] = useState<MonitorSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const addSite = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/website-monitoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setSites([...sites, data]);
        setUrl("");
      } else {
        setError(data.error || "Failed to add site");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const removeSite = (index: number) => {
    setSites(sites.filter((_, i) => i !== index));
  };

  const checkAll = async () => {
    setSites(sites.map(s => ({ ...s, status: "checking" })));
    
    const updated = await Promise.all(sites.map(async (site) => {
      try {
        const response = await fetch("/api/website-monitoring", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: site.url }),
        });
        return await response.json();
      } catch {
        return { ...site, status: "down" };
      }
    }));
    
    setSites(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Monitoring</h1>
          <p className="text-gray-600">
            Monitor your websites' uptime, performance, and status codes with real-time alerts.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Add Website to Monitor
            </CardTitle>
            <CardDescription>Enter a URL to start monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSite()}
                className="flex-1"
              />
              <Button onClick={addSite} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Site
                  </>
                )}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {sites.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" onClick={checkAll}>
                <Activity className="mr-2 h-4 w-4" />
                Refresh All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((site, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{new URL(site.url).hostname}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => removeSite(i)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <CardDescription className="truncate">{site.url}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        {site.status === "checking" ? (
                          <Badge variant="outline">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Checking
                          </Badge>
                        ) : site.status === "up" ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Online
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Offline
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Response Time</span>
                        <span className="font-medium">{site.responseTime}ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Uptime</span>
                        <span className="font-medium text-green-600">{site.uptime}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Checked</span>
                        <span className="text-xs text-gray-500">
                          {new Date(site.lastChecked).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {sites.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No websites being monitored</p>
              <p className="text-sm mt-1">Add a website URL above to start monitoring</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
