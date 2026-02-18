"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  Building,
  Users,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SeoauditPricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small projects",
      icon: Star,
      color: "from-blue-500 to-cyan-500",
      monthlyPrice: 0,
      annualPrice: 0,
      badge: null,
      features: [
        "5 website audits",
        "100 keywords tracking",
        "1,000 pages to crawl",
        "Basic SEO analysis",
        "PDF reports (5/month)",
        "Email support",
      ],
      notIncluded: [
        "Competitor analysis",
        "API access",
        "White label reports",
      ],
    },
    {
      name: "Pro",
      description: "For freelancers and growing businesses",
      icon: Zap,
      color: "from-violet-500 to-fuchsia-500",
      monthlyPrice: 49.99,
      annualPrice: 39.99,
      badge: "Most Popular",
      features: [
        "Unlimited audits",
        "5,000 keywords tracking",
        "50,000 pages to crawl",
        "Advanced SEO analysis",
        "Competitor analysis",
        "Unlimited PDF reports",
        "API access",
        "Priority support",
        "Rank tracking",
        "Backlink analysis",
      ],
      notIncluded: [
        "White label reports",
        "Team management",
      ],
    },
    {
      name: "Business",
      description: "For agencies and enterprises",
      icon: Crown,
      color: "from-amber-500 to-orange-500",
      monthlyPrice: 149.99,
      annualPrice: 119.99,
      badge: null,
      features: [
        "Everything in Pro",
        "Unlimited keywords",
        "Unlimited pages to crawl",
        "White label reports",
        "Team management (10 users)",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "Custom API limits",
        "Advanced analytics",
      ],
      notIncluded: [],
    },
  ];

  const faqs = [
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 14-day free trial for all new users. No credit card required to start.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-violet-600/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-600/10 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-6">
            <Building className="w-4 h-4 text-violet-400" />
            Pricing Plans
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, Transparent
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your SEO needs. All plans include a 14-day free trial.
          </p>

          <div className="flex items-center justify-center mb-8">
            <span className={`mr-4 font-medium ${!isAnnual ? "text-white" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? "bg-gradient-to-r from-violet-600 to-fuchsia-600" : "bg-gray-700"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAnnual ? "left-8" : "left-1"
                }`}
              />
            </button>
            <span className={`ml-4 font-medium ${isAnnual ? "text-white" : "text-gray-500"}`}>
              Annual
              <span className="ml-2 text-sm text-green-400 font-semibold">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 bg-white/5 border backdrop-blur-md rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                plan.badge
                  ? "border-violet-500/50 bg-white/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-medium rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-r ${plan.color} bg-opacity-20 rounded-2xl flex items-center justify-center`}>
                  <plan.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="mb-2">
                  {plan.monthlyPrice === 0 ? (
                    <div className="text-4xl font-bold text-white">Free</div>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-white">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-400">/month</span>
                    </>
                  )}
                </div>
                {isAnnual && plan.monthlyPrice > 0 && (
                  <p className="text-sm text-gray-500">
                    Billed ${(isAnnual ? plan.annualPrice : plan.monthlyPrice) * 12}/year
                  </p>
                )}
              </div>

              <a href="#features" className="block mb-8">
                <Button
                  size="lg"
                  className={`w-full ${
                    plan.badge
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  {plan.monthlyPrice === 0 ? "Get Started Free" : "Explore Features"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>

              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}

                {plan.notIncluded.length > 0 && (
                  <>
                    <div className="pt-2">
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Not included</p>
                    </div>
                    {plan.notIncluded.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <X className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-500 text-sm">{feature}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-400 mb-4">Need a custom solution for your organization?</p>
          <Button
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Contact Sales
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
