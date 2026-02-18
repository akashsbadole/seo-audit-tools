"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Zap,
  Star,
  Clock,
  LineChart,
  Lock,
  Search,
  FileText,
  Code,
} from "lucide-react";
import Link from "next/link";

export function PremiumFeatures() {
  
  const features = [
    {
      title: "Advanced SEO Analysis",
      description: "Comprehensive suite of professional SEO analysis tools",
      icon: <Search className="h-6 w-6 text-yellow-500" />,
      included: [
        "SEO Score Calculator with detailed metrics",
        "Content Readability Analysis",
        "Mobile-Friendliness Testing",
        "Internal Link Structure Analysis",
      ],
    },
    {
      title: "Technical SEO Tools",
      description: "Professional tools for technical SEO optimization",
      icon: <Code className="h-6 w-6 text-yellow-500" />,
      included: [
        "Structured Data Validator",
        "Canonical URL Checker",
        "Robots.txt Generator",
        "XML Sitemap Generator",
      ],
    },
    {
      title: "Content Optimization",
      description: "Advanced tools for optimizing your content",
      icon: <FileText className="h-6 w-6 text-yellow-500" />,
      included: [
        "Meta Tags Generator & Preview",
        "Title Tag Optimization",
        "Description Tag Analysis",
        "Header Tags Structure Check",
      ],
    },
  ];

  const premiumBenefits = [
    "Unlimited analysis and reports",
    "Bulk URL processing",
    "API access for automation",
    "Priority customer support",
    "Custom white-label reports",
    "Advanced data export options",
  ];

  return (
    <div
      id="premium"
      className="container bg-indigo-900 mx-auto px-4 py-12 hidden"
    >
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4 p-4">
          <Star className="h-4 w-4 mr-1" />
          Premium Features
        </Badge>
        <h2 className="text-3xl font-bold text-white mb-4">
          Professional SEO Tools Suite
        </h2>
        <p className="text-lg text-gray max-w-2xl mx-auto">
          Access our complete suite of professional SEO tools and unlock premium
          features for comprehensive website optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="bg-gradient-to-b from-white to-indigo-50 border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300"
          >
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <CardTitle className="text-xl text-indigo-900">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-indigo-700">
                    {feature.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feature.included.map((item) => (
                  <li key={item} className="flex items-center text-indigo-800">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-indigo-900 text-center mb-6">
          Premium Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {premiumBenefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center bg-white bg-opacity-50 rounded-lg p-4"
            >
              <Star className="h-5 w-5 text-yellow-500 mr-3" />
              <span className="text-indigo-800">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-white mt-4">
          All tools are free to use. Enjoy unlimited access to all features!
        </p>
      </div>
    </div>
  );
}
