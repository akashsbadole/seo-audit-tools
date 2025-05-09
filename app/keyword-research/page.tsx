"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, Search } from "lucide-react";
import { KeywordTable, KeywordData } from "@/components/keyword-table";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { countries, languages } from "@/data/countries";
import KeywordDomain from "@/components/keyword-domain";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

const platforms = [
  {
    id: "google",
    name: "Google",
    image: "/images/google.webp",
    color: "text-[#4285F4]",
  },
  {
    id: "youtube",
    name: "YouTube",
    image: "/images/youtube.webp",
    color: "text-[#FF0000]",
  },
  {
    id: "bing",
    name: "Bing",
    image: "/images/bing.webp",
    color: "text-[#00B4D8]",
  },
  {
    id: "amazon",
    name: "Amazon",
    image: "/images/amazonl.webp",
    color: "text-[#FF9900]",
  },
  {
    id: "ebay",
    name: "eBay",
    image: "/images/ebay.webp",
    color: "text-[#E53238]",
  },
  {
    id: "appstore",
    name: "App Store",
    image: "/images/app-store.webp",
    color: "text-[#0D96F6]",
  },
  {
    id: "playstore",
    name: "Play Store",
    image: "/images/google-play.webp",
    color: "text-[#00DC82]",
  },
  {
    id: "instagram",
    name: "Instagram",
    image: "/images/instagram.webp",
    color: "text-[#E4405F]",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    image: "/images/twitter.webp",
    color: "text-[#000000]",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    image: "/images/pinterest.webp",
    color: "text-[#BD081C]",
  },
  {
    id: "etsy",
    name: "Etsy",
    image: "/images/etsy.webp",
    color: "text-[#F56400]",
  },
  {
    id: "tiktok",
    name: "TikTok",
    image: "/images/tiktok.webp",
    color: "text-[#000000]",
  },
  {
    id: "trends",
    name: "Google Trends",
    image: "/images/google-trends.webp",
    color: "text-[#4285F4]",
  },
];

function KeywordResearchContent() {
  const [keyword, setKeyword] = useState("");
  const [platform, setPlatform] = useState("google");
  const [searchType, setSearchType] = useState("all");
  const [country, setCountry] = useState("global");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [keywordData, setKeywordData] = useState<KeywordData[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const fetchSuggestions = async () => {
    if (!keyword.trim()) return;

    // Check if enough time has passed since last search
    const now = Date.now();
    const timeSinceLastSearch = now - lastSearchTime;
    const minDelay = 15000; // 15 seconds in milliseconds

    if (timeSinceLastSearch < minDelay) {
      const remaining = Math.ceil((minDelay - timeSinceLastSearch) / 1000);
      setTimeRemaining(remaining);
      return;
    }

    if (!executeRecaptcha) {
      console.error("reCAPTCHA not loaded");
      return;
    }

    setLoading(true);
    try {
      // Get reCAPTCHA token
      const token = await executeRecaptcha("keyword_research");

      const response = await fetch(
        `/api/keyword-suggestions?platform=${platform}&searchType=${searchType}&keyword=${encodeURIComponent(keyword)}&country=${country}&language=${language}`,
        {
          headers: {
            "X-Recaptcha-Token": token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      const allKeywords = Array.from({ length: 100 }, (_, i) => ({
        keyword: `${data.suggestions[i % data.suggestions.length]} ${i + 1}`,
        searchVolume: Math.floor(Math.random() * 100000),
        trend: ["Increasing", "Stable", "Decreasing"][
          Math.floor(Math.random() * 3)
        ],
        cpc: Number((Math.random() * 5).toFixed(2)),
        competition: Number(Math.random().toFixed(2)),
        isPremium: i >= 50,
      }));
      setKeywordData(allKeywords);
      setLastSearchTime(Date.now());

      // Save the search results
      try {
        const saveResponse = await fetch("/api/save-keyword-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Recaptcha-Token": token,
          },
          body: JSON.stringify({
            keyword: keyword.trim(),
            platform,
            searchType,
            country,
            language,
            results: allKeywords,
          }),
        });

        const responseData = await saveResponse.json();

        if (!saveResponse.ok) {
          console.error(
            "Failed to save keyword search:",
            JSON.stringify(responseData, null, 2)
          );
          throw new Error(
            responseData.error || "Failed to save keyword search"
          );
        }

        console.log(
          "Successfully saved keyword search:",
          JSON.stringify(responseData, null, 2)
        );
      } catch (error) {
        console.error("Error saving keyword search:", error);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update time remaining every second
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const getPlatformById = (id: string) => platforms.find((p) => p.id === id);

  const searchTypes = [
    { value: "all", label: "All" },
    { value: "web", label: "Web" },
    { value: "images", label: "Images" },
    { value: "shopping", label: "Shopping" },
    { value: "news", label: "News" },
    { value: "videos", label: "Videos" },
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-[150px] min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Keyword Research</CardTitle>
          <CardDescription>
            Find keyword suggestions with search volume, trends, CPC, and
            competition metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Platform horizontal row */}
            <div className="flex gap-2 overflow-x-auto pb-2 flex-wrap sm:flex-nowrap">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`flex items-center gap-1 text-[12px] pl-2 pr-2 py-1 rounded-full border transition-colors whitespace-nowrap ${platform === p.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"} ${p.color}`}
                  type="button"
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={15}
                    height={15}
                    className="object-contain"
                  />
                  {p.name}
                </button>
              ))}
            </div>
            {/* Minimal search bar row */}
            <div className="flex flex-col md:flex-row gap-2 items-center w-full">
              {/* Search Type Dropdown */}
              <div className="w-full sm:w-[90px] ">
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {searchTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Keyword Input */}
              <Input
                placeholder="Type a keyword and press enter"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchSuggestions()}
                className="flex-1"
              />
              {/* Country Dropdown */}
              <div className="w-full sm:w-[180px] ">
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Language Dropdown */}
              <div className="w-full sm:w-[120px]">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Search Button */}
              <Button
                onClick={fetchSuggestions}
                disabled={loading || timeRemaining > 0}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : timeRemaining > 0 ? (
                  `Wait ${timeRemaining}s`
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                {loading
                  ? "Searching..."
                  : timeRemaining > 0
                    ? "Please wait"
                    : "Search"}
              </Button>
            </div>
            {/* Results Table and Premium logic remain unchanged */}
            {keywordData.length > 0 && (
              <div className="space-y-4">
                {!isPremium && (
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                  >
                    <Lock className="h-3 w-3" />
                    Premium Keywords Available
                  </Badge>
                )}
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
      <KeywordDomain />
    </div>
  );
}

export default function KeywordResearchPage() {
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!reCaptchaKey) {
    console.error("reCAPTCHA site key is not configured");
    return (
      <div className="p-4 text-red-500">
        Error: reCAPTCHA configuration is missing. Please contact support.
      </div>
    );
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={reCaptchaKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      <KeywordResearchContent />
    </GoogleReCaptchaProvider>
  );
}
