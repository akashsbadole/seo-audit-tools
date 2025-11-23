import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Eye, Palette, Settings } from 'lucide-react';

export interface WhiteLabelSettings {
  companyName?: string;
  logo?: string;
  brandColor?: string;
  removeBranding?: boolean;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  footerText?: string;
  reportTitle?: string;
}

interface WhiteLabelPDFSettingsProps {
  settings?: WhiteLabelSettings;
  onSettingsChange?: (settings: WhiteLabelSettings) => void;
  onPreview?: (settings: WhiteLabelSettings) => void;
  onSave?: (settings: WhiteLabelSettings) => void;
  disabled?: boolean;
}

export function WhiteLabelPDFSettings({
  settings = {},
  onSettingsChange,
  onPreview,
  onSave,
  disabled = false
}: WhiteLabelPDFSettingsProps) {
  const [localSettings, setLocalSettings] = useState<WhiteLabelSettings>(settings);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (settings.logo) {
      setLogoPreview(settings.logo);
    }
  }, [settings.logo]);

  const handleSettingChange = (key: keyof WhiteLabelSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleContactInfoChange = (key: string, value: string) => {
    const contactInfo = { ...localSettings.contactInfo, [key]: value };
    const newSettings = { ...localSettings, contactInfo };
    setLocalSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        handleSettingChange('logo', result);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    handleSettingChange('logo', undefined);
  };

  const handlePreview = () => {
    onPreview?.(localSettings);
  };

  const handleSave = () => {
    onSave?.(localSettings);
  };

  const presetThemes = [
    { name: 'Professional', color: '#1a365d' },
    { name: 'Modern Blue', color: '#2563eb' },
    { name: 'Green Growth', color: '#059669' },
    { name: 'Royal Purple', color: '#7c3aed' },
    { name: 'Elegant Gray', color: '#374151' },
    { name: 'Vibrant Orange', color: '#ea580c' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            White Label PDF Settings
          </CardTitle>
          <CardDescription>
            Customize your SEO audit reports with your own branding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="branding" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
            </TabsList>

            <TabsContent value="branding" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Your Company Name"
                  value={localSettings.companyName || ''}
                  onChange={(e) => handleSettingChange('companyName', e.target.value)}
                  disabled={disabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={disabled}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {logoPreview && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveLogo}
                      disabled={disabled}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={logoPreview}
                      alt="Company logo preview"
                      className="h-16 w-auto max-w-xs rounded border border-gray-200"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Brand Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={localSettings.brandColor || '#1a365d'}
                    onChange={(e) => handleSettingChange('brandColor', e.target.value)}
                    disabled={disabled}
                    className="w-16 h-10"
                  />
                  <Input
                    placeholder="#1a365d"
                    value={localSettings.brandColor || ''}
                    onChange={(e) => handleSettingChange('brandColor', e.target.value)}
                    disabled={disabled}
                    className="flex-1"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {presetThemes.map((theme) => (
                    <Button
                      key={theme.name}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSettingChange('brandColor', theme.color)}
                      disabled={disabled}
                      className="flex items-center gap-1"
                    >
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: theme.color }}
                      />
                      {theme.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="removeBranding"
                  checked={localSettings.removeBranding || false}
                  onCheckedChange={(checked) => handleSettingChange('removeBranding', checked)}
                  disabled={disabled}
                />
                <Label htmlFor="removeBranding">Remove all default branding</Label>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportTitle">Default Report Title</Label>
                <Input
                  id="reportTitle"
                  placeholder="SEO Audit Report"
                  value={localSettings.reportTitle || ''}
                  onChange={(e) => handleSettingChange('reportTitle', e.target.value)}
                  disabled={disabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  placeholder="Generated by Your Company"
                  value={localSettings.footerText || ''}
                  onChange={(e) => handleSettingChange('footerText', e.target.value)}
                  disabled={disabled}
                  rows={2}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@yourcompany.com"
                  value={localSettings.contactInfo?.email || ''}
                  onChange={(e) => handleContactInfoChange('email', e.target.value)}
                  disabled={disabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  placeholder="+1 (555) 123-4567"
                  value={localSettings.contactInfo?.phone || ''}
                  onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                  disabled={disabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactWebsite">Website URL</Label>
                <Input
                  id="contactWebsite"
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={localSettings.contactInfo?.website || ''}
                  onChange={(e) => handleContactInfoChange('website', e.target.value)}
                  disabled={disabled}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {localSettings.removeBranding ? 'No Branding' : 'Custom Branding'}
              </Badge>
              {localSettings.companyName && (
                <Badge variant="outline">
                  Company: {localSettings.companyName}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={disabled || !localSettings.companyName}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview PDF
              </Button>
              <Button
                onClick={handleSave}
                disabled={disabled}
              >
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WhiteLabelPDFSettings;