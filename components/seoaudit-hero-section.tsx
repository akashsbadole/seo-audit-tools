"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Search,
  Zap,
  TrendingUp,
  Play,
  Sparkles,
  CheckCircle,
  Globe,
  BarChart3,
  Users,
  ArrowDown,
  Loader2,
  Shield,
  Target,
  Layers,
  Rocket,
  Eye,
  Code,
  Megaphone,
  Link2,
  FileText,
  Smartphone,
  Database,
} from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  url: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
      message: "URL must start with http:// or https://",
    }),
});

const tools = [
  { name: "SEO Audit", icon: Search, color: "from-blue-500 to-cyan-500" },
  { name: "Keyword Research", icon: Target, color: "from-purple-500 to-pink-500" },
  { name: "Backlink Analysis", icon: Link2, color: "from-orange-500 to-red-500" },
  { name: "Competitor Analysis", icon: TrendingUp, color: "from-green-500 to-teal-500" },
  { name: "Content Analysis", icon: FileText, color: "from-yellow-500 to-orange-500" },
  { name: "Site Speed", icon: Rocket, color: "from-pink-500 to-rose-500" },
];

export function SeoauditHeroSection() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function onAnalyze(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const encodedUrl = encodeURIComponent(values.url);
      router.push(`/audit-results?url=${encodedUrl}`);
    } catch (error) {
      console.error("Error analyzing URL:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const stats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "1M+", label: "Audits Completed", icon: BarChart3 },
    { value: "99.9%", label: "Uptime", icon: Shield },
    { value: "24/7", label: "Support", icon: Zap },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-[150px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10">
        {/* Top Bar */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>New: AI-powered content analysis now available</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  Log in
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center mb-12">
            <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 50,000+ SEO Professionals
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Supercharge Your</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                SEO Strategy
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              All-in-one SEO platform with 50+ tools for keyword research, 
              competitor analysis, site audits, and more. Start growing your organic traffic today.
            </p>

            {/* Search Form */}
            <form
              onSubmit={form.handleSubmit(onAnalyze)}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-3 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                <div className="relative flex-1">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="url"
                    placeholder="Enter your website URL"
                    {...form.register("url")}
                    className="pl-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 rounded-xl text-lg"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="h-14 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Site
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
              {form.formState.errors.url && (
                <p className="mt-2 text-red-400 text-sm">{form.formState.errors.url.message}</p>
              )}
            </form>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free 7-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-all duration-300"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-violet-400" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tools Preview */}
          <div className="text-center mb-8">
            <p className="text-gray-500 mb-6">Powerful tools to boost your SEO</p>
            <div className="flex flex-wrap justify-center gap-3">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${tool.color} bg-opacity-10 border border-white/10 rounded-full text-white text-sm hover:scale-105 transition-transform cursor-pointer`}
                >
                  <tool.icon className="w-4 h-4" />
                  {tool.name}
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center text-gray-500 animate-bounce">
              <span className="text-sm mb-2">Explore all features</span>
              <ArrowDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
