"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Search, 
  Star, 
  Zap, 
  TrendingUp, 
  Play, 
  Sparkles,
  ArrowDown
} from "lucide-react";
import Link from "next/link";
import { GradientButton } from "@/components/ui/gradient-button";

export function StartupHeroSection() {
  const [email, setEmail] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Search className="h-8 w-8 text-indigo-500" />,
      title: "AI-Powered Analysis",
      description: "Get deep insights with advanced AI algorithms"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      title: "Competitor Intelligence",
      description: "Analyze and outperform your competitors"
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      title: "Real-time Monitoring",
      description: "Track website performance 24/7"
    },
    {
      icon: <Star className="h-8 w-8 text-orange-500" />,
      title: "Smart Recommendations",
      description: "AI-driven optimization suggestions"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 left-1/2 w-96 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/10 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SEOaudit Pro
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features">
                <Button variant="ghost" className="text-white">
                  Features
                </Button>
              </Link>
              <Link href="#pricing">
                <Button variant="ghost" className="text-white">
                  Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Transform Your SEO Strategy
                <span className="block text-3xl lg:text-4xl font-light mt-2">
                  with AI-Powered Insights
                </span>
              </h1>
              
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Get comprehensive SEO analysis, competitor intelligence, and real-time monitoring
                powered by advanced AI algorithms. Make data-driven decisions that boost your rankings.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link href="#features">
                  <GradientButton size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                    Explore Tools
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </GradientButton>
                </Link>
                
                <Link href="#features">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-center">
                <Badge className="mb-4 px-4 py-2 text-lg bg-white/20 text-indigo-600">
                  <Sparkles className="mr-2 h-6 w-6" />
                  Trusted by 10,000+ Marketers
                </Badge>
              </div>

              <h2 className="text-3xl font-bold text-white mb-8">
                Everything You Need to Dominate Search
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white text-center mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Email Signup */}
          <div className="mt-12 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-600 mb-6">
                Get the latest SEO tips and feature updates delivered to your inbox
              </p>
              <div className="space-y-4">
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <GradientButton className="w-full" disabled={!email.trim()}>
                  {isScrolled ? (
                    <>
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Explore Features
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      Get Early Access
                    </>
                  )}
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}