'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock } from "lucide-react";
import { KeywordTable, KeywordData } from "@/components/keyword-table";
import Image from 'next/image';

const platforms = [
  { id: 'google', name: 'Google', image: '/images/google.webp', color: 'text-[#4285F4]' },
  { id: 'youtube', name: 'YouTube', image: '/images/youtube.webp', color: 'text-[#FF0000]' },
  { id: 'bing', name: 'Bing', image: '/images/bing.webp', color: 'text-[#00B4D8]' },
  { id: 'amazon', name: 'Amazon', image: '/images/amazonl.webp', color: 'text-[#FF9900]' },
  { id: 'ebay', name: 'eBay', image: '/images/ebay.webp', color: 'text-[#E53238]' },
  { id: 'appstore', name: 'App Store', image: '/images/app-store.webp', color: 'text-[#0D96F6]' },
  { id: 'playstore', name: 'Play Store', image: '/images/google-play.webp', color: 'text-[#00DC82]' },
  { id: 'instagram', name: 'Instagram', image: '/images/instagram.webp', color: 'text-[#E4405F]' },
  { id: 'twitter', name: 'X (Twitter)', image: '/images/twitter.webp', color: 'text-[#000000]' },
  { id: 'pinterest', name: 'Pinterest', image: '/images/pinterest.webp', color: 'text-[#BD081C]' },
  { id: 'etsy', name: 'Etsy', image: '/images/etsy.webp', color: 'text-[#F56400]' },
  { id: 'tiktok', name: 'TikTok', image: '/images/tiktok.webp', color: 'text-[#000000]' },
  { id: 'trends', name: 'Google Trends', image: '/images/google-trends.webp', color: 'text-[#4285F4]' },
];

export default function KeywordResearchPage() {
  const [keyword, setKeyword] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [loading, setLoading] = useState(false);
  const [keywordData, setKeywordData] = useState<KeywordData[]>([]);
  const [isPremium, setIsPremium] = useState(false);

  const fetchSuggestions = async () => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/keyword-suggestions?platform=${platform}&keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      
      // Generate 100 keywords with metrics
      const allKeywords = Array.from({ length: 100 }, (_, i) => ({
        keyword: `${data.suggestions[i % data.suggestions.length]} ${i + 1}`,
        searchVolume: Math.floor(Math.random() * 100000),
        trend: ['Increasing', 'Stable', 'Decreasing'][Math.floor(Math.random() * 3)],
        cpc: Number((Math.random() * 5).toFixed(2)),
        competition: Number((Math.random()).toFixed(2)),
        isPremium: i >= 50 // Mark last 50 keywords as premium
      }));

      setKeywordData(allKeywords);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformById = (id: string) => platforms.find(p => p.id === id);

  return (
    <div className="container mx-auto py-8 px-4 md:px-[150px]">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Platform Keyword Research</CardTitle>
          <CardDescription>
            Find keyword suggestions with search volume, trends, CPC, and competition metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs defaultValue="youtube" value={platform} onValueChange={setPlatform}>
              <TabsList className="w-full h-auto flex flex-wrap gap-2 bg-transparent">
                {platforms.map((p) => (
                  <TabsTrigger
                    key={p.id}
                    value={p.id}
                    className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${p.color}`}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      {p.name}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter your keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchSuggestions()}
                />
              </div>
              <Button 
                onClick={fetchSuggestions} 
                disabled={loading || !keyword.trim()}
                className="md:w-[200px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>

            {keywordData.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs flex items-center gap-2">
                    <Image
                      src={getPlatformById(platform)?.image || ''}
                      alt={getPlatformById(platform)?.name || ''}
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                    {getPlatformById(platform)?.name}
                  </Badge>
                  {!isPremium && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Premium Keywords Available
                    </Badge>
                  )}
                </div>
                <KeywordTable 
                  data={isPremium ? keywordData : keywordData.slice(0, 50)} 
                  showPremium={isPremium}
                />
                {!isPremium && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsPremium(true)}
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Unlock Premium Keywords
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 