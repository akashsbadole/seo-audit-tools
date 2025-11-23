"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Monitor, 
  Play, 
  Pause, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Globe,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/components/ui/use-toast";

interface StatusHistory {
  id: string;
  statusCode: number;
  responseTime: number;
  checkedAt: string;
}

interface Monitor {
  id: string;
  url: string;
  checkInterval: number;
  status: string;
  lastCheck: string;
  statusHistory: StatusHistory[];
}

export function WebsiteMonitor() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [newMonitorUrl, setNewMonitorUrl] = useState("");
  const [checkInterval, setCheckInterval] = useState(300);

  useEffect(() => {
    fetchMonitors();
  }, []);

  const fetchMonitors = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/tracking/monitor', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMonitors(data.monitors);
      }
    } catch (error) {
      console.error('Failed to fetch monitors:', error);
    }
  };

  const addMonitor = async () => {
    if (!newMonitorUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a website URL",
        variant: "destructive",
      });
      return;
    }

    if (!user.isPremium && monitors.length >= 3) {
      toast({
        title: "Limit Reached",
        description: "Free users can monitor up to 3 websites. Upgrade to premium for unlimited monitoring.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/tracking/monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          url: newMonitorUrl,
          checkInterval
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMonitors([...monitors, data.monitor]);
        setNewMonitorUrl("");
        toast({
          title: "Success",
          description: "Website monitoring started",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to start monitoring",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while setting up monitoring",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMonitorStatus = async (monitorId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/tracking/monitor/${monitorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setMonitors(monitors.map(m => 
          m.id === monitorId ? { ...m, status: newStatus } : m
        ));
        toast({
          title: "Success",
          description: `Monitoring ${newStatus === 'active' ? 'resumed' : 'paused'}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update monitor status",
        variant: "destructive",
      });
    }
  };

  const deleteMonitor = async (monitorId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/tracking/monitor/${monitorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMonitors(monitors.filter(m => m.id !== monitorId));
        toast({
          title: "Success",
          description: "Monitor removed",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove monitor",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-6 w-6" />
            Website Monitoring
          </CardTitle>
          <CardDescription>
            Monitor your websites' uptime and performance in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">
              Please log in to access the website monitoring tool
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Login to Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user.isPremium && monitors.length >= 3) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-6 w-6" />
            Website Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
            <p className="text-muted-foreground mb-4">
              Website monitoring is a premium feature. Upgrade to unlock unlimited monitoring capabilities.
            </p>
            <Button onClick={() => window.location.href = '/upgrade'}>
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-6 w-6" />
            Website Monitoring
          </CardTitle>
          <CardDescription>
            Add websites to monitor their uptime, response time, and status codes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-monitor-url">Website URL</Label>
              <Input
                id="new-monitor-url"
                placeholder="https://yourwebsite.com"
                value={newMonitorUrl}
                onChange={(e) => setNewMonitorUrl(e.target.value)}
                className="w-full"
              />
              <Label htmlFor="check-interval">Check Interval (seconds)</Label>
              <Input
                id="check-interval"
                type="number"
                min="60"
                max="3600"
                value={checkInterval}
                onChange={(e) => setCheckInterval(parseInt(e.target.value))}
                className="w-full"
              />
              <Button
                onClick={addMonitor}
                disabled={isLoading || !newMonitorUrl.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Add Monitor
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchMonitors()}
              className="w-full md:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Monitors
            </Button>
          </div>
        </CardContent>
      </Card>

      {monitors.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {monitors.map((monitor) => (
            <Card key={monitor.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{monitor.url}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={monitor.status === 'active' ? 'default' : 'secondary'}>
                      {monitor.status === 'active' ? 'Active' : 'Paused'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMonitorStatus(monitor.id, monitor.status)}
                    >
                      {monitor.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMonitor(monitor.id)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Last check: {new Date(monitor.lastCheck).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="status" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="status">Status</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="status" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">Check Interval</span>
                        </div>
                        <p className="text-2xl">{monitor.checkInterval}s</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          <span className="font-medium">Status</span>
                        </div>
                        <Badge variant={monitor.status === 'active' ? 'default' : 'secondary'}>
                          {monitor.status === 'active' ? 'Online' : 'Paused'}
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <div className="max-h-64 overflow-y-auto">
                      {monitor.statusHistory.slice(0, 10).map((status, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b">
                          <div className="flex items-center gap-2">
                            <Badge variant={status.statusCode === 200 ? 'default' : 'destructive'}>
                              {status.statusCode}
                            </Badge>
                            <span className="text-sm">{new Date(status.checkedAt).toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {status.responseTime}ms
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Auto-refresh</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast({
                            title: "Coming Soon",
                            description: "Auto-refresh settings will be available soon",
                          })}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Notifications</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast({
                            title: "Coming Soon",
                            description: "Email notifications will be available soon",
                          })}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}