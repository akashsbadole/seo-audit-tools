"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WhiteLabelPDFSettings, { WhiteLabelSettings } from '@/components/white-label-pdf-settings';
import { 
  FileText, 
  Download, 
  Settings, 
  Upload, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Sparkles 
} from 'lucide-react';
import { toast } from 'sonner';

export default function WhiteLabelPDFPage() {
  const [settings, setSettings] = useState<WhiteLabelSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch('/api/white-label-settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success && data.settings) {
        setSettings({
          companyName: data.settings.companyName || '',
          logo: data.settings.logo || '',
          brandColor: data.settings.brandColor || '#1a365d',
          removeBranding: data.settings.removeBranding || false,
          contactInfo: {
            email: data.settings.contactEmail || '',
            phone: data.settings.contactPhone || '',
            website: data.settings.contactWebsite || '',
          },
          footerText: data.settings.footerText || '',
          reportTitle: data.settings.defaultReportTitle || '',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load white label settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (newSettings: WhiteLabelSettings) => {
    setSettings(newSettings);
  };

  const handleSave = async (newSettings: WhiteLabelSettings) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch('/api/white-label-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName: newSettings.companyName,
          logo: newSettings.logo,
          brandColor: newSettings.brandColor,
          removeBranding: newSettings.removeBranding,
          contactEmail: newSettings.contactInfo?.email,
          contactPhone: newSettings.contactInfo?.phone,
          contactWebsite: newSettings.contactInfo?.website,
          footerText: newSettings.footerText,
          defaultReportTitle: newSettings.reportTitle,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('White label settings saved successfully');
      } else {
        toast.error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save white label settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = async (previewSettings: WhiteLabelSettings) => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Generate a sample SEO audit for preview
      const response = await fetch('/api/enhanced-site-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          url: 'https://example.com',
          exportFormat: 'pdf',
          whiteLabel: previewSettings,
        }),
      });

      const data = await response.json();
      if (data.exportData?.success) {
        toast.success('PDF preview generated successfully');
        // You could open the PDF in a new tab or trigger download
        window.open(data.exportData.filePath, '_blank');
      } else {
        toast.error('Failed to generate PDF preview');
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate PDF preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete all white label settings?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch('/api/white-label-settings', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('White label settings deleted successfully');
        setSettings({});
      } else {
        toast.error(data.error || 'Failed to delete settings');
      }
    } catch (error) {
      console.error('Error deleting settings:', error);
      toast.error('Failed to delete white label settings');
    }
  };

  const hasValidSettings = settings.companyName && settings.companyName.length > 0;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold">White Label PDF Reports</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Customize your SEO audit reports with your own branding, colors, and contact information.
          Generate professional PDFs that represent your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-2 text-blue-600" />
            <CardTitle>Custom Branding</CardTitle>
            <CardDescription>
              Add your company logo, colors, and name to every report
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Settings className="h-12 w-12 mx-auto mb-2 text-green-600" />
            <CardTitle>Professional Layout</CardTitle>
            <CardDescription>
              Clean, professional PDF layouts optimized for client presentations
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Download className="h-12 w-12 mx-auto mb-2 text-purple-600" />
            <CardTitle>Easy Distribution</CardTitle>
            <CardDescription>
              Generate and download branded PDFs with one click
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Configuration</h2>
              <p className="text-muted-foreground">
                Set up your white label preferences below
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={hasValidSettings ? "default" : "secondary"}>
                {hasValidSettings ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Configured
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Configured
                  </>
                )}
              </Badge>
              {hasValidSettings && (
                <Button variant="outline" size="sm" onClick={handleDelete}>
                  Reset Settings
                </Button>
              )}
            </div>
          </div>

          <WhiteLabelPDFSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onPreview={handlePreview}
            onSave={handleSave}
            disabled={isSaving || isGenerating}
          />

          {hasValidSettings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Test your white label settings with sample reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="audit" className="w-full">
                  <TabsList>
                    <TabsTrigger value="audit">SEO Audit</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Analysis</TabsTrigger>
                  </TabsList>
                  <TabsContent value="audit" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Generate a sample SEO audit report to see how your branding looks.
                    </p>
                    <Button 
                      onClick={() => handlePreview(settings)}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Sample SEO Audit
                    </Button>
                  </TabsContent>
                  <TabsContent value="bulk" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Generate a sample bulk analysis report with multiple URLs.
                    </p>
                    <Button 
                      onClick={() => {
                        // Generate bulk analysis preview
                        toast.info('Bulk analysis preview coming soon');
                      }}
                      disabled={isGenerating}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Generate Sample Bulk Analysis
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}