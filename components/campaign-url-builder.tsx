"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";

export function CampaignUrlBuilder() {
  const [campaignData, setCampaignData] = useState({
    websiteUrl: "",
    campaignSource: "",
    campaignMedium: "",
    campaignName: "",
    campaignTerm: "",
    campaignContent: "",
  });

  const [copied, setCopied] = useState(false);

  const generateCampaignUrl = () => {
    const params = new URLSearchParams();

    // Required fields
    if (campaignData.campaignSource)
      params.append("utm_source", campaignData.campaignSource);
    if (campaignData.campaignMedium)
      params.append("utm_medium", campaignData.campaignMedium);
    if (campaignData.campaignName)
      params.append("utm_campaign", campaignData.campaignName);

    // Optional fields
    if (campaignData.campaignTerm)
      params.append("utm_term", campaignData.campaignTerm);
    if (campaignData.campaignContent)
      params.append("utm_content", campaignData.campaignContent);

    const baseUrl = campaignData.websiteUrl || "https://example.com";
    const separator = baseUrl.includes("?") ? "&" : "?";

    return `${baseUrl}${separator}${params.toString()}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCampaignUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Campaign URL Builder</CardTitle>
        <CardDescription>
          Create trackable URLs for your marketing campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL *</Label>
              <Input
                id="websiteUrl"
                value={campaignData.websiteUrl}
                onChange={(e) =>
                  setCampaignData({
                    ...campaignData,
                    websiteUrl: e.target.value,
                  })
                }
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignSource">Campaign Source *</Label>
              <Input
                id="campaignSource"
                value={campaignData.campaignSource}
                onChange={(e) =>
                  setCampaignData({
                    ...campaignData,
                    campaignSource: e.target.value,
                  })
                }
                placeholder="Google, Facebook, Email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignMedium">Campaign Medium *</Label>
              <Input
                id="campaignMedium"
                value={campaignData.campaignMedium}
                onChange={(e) =>
                  setCampaignData({
                    ...campaignData,
                    campaignMedium: e.target.value,
                  })
                }
                placeholder="CPC, Organic, Social"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name *</Label>
              <Input
                id="campaignName"
                value={campaignData.campaignName}
                onChange={(e) =>
                  setCampaignData({
                    ...campaignData,
                    campaignName: e.target.value,
                  })
                }
                placeholder="Summer Sale, Holiday Promotion"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignTerm">Campaign Term (Optional)</Label>
              <Input
                id="campaignTerm"
                value={campaignData.campaignTerm}
                onChange={(e) =>
                  setCampaignData({
                    ...campaignData,
                    campaignTerm: e.target.value,
                  })
                }
                placeholder="summer sale, discount code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignContent">
                Campaign Content (Optional)
              </Label>
              <Input
                id="campaignContent"
                value={campaignData.campaignContent}
                onChange={(e) =>
                  setCampaignData({
                    ...campaignData,
                    campaignContent: e.target.value,
                  })
                }
                placeholder="banner ad, text link"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <Label>Generated Campaign URL</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              <pre className="bg-indigo-200 p-4 rounded-md overflow-auto text-sm">
                <code>{generateCampaignUrl()}</code>
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
