"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SeoauditTestimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Inc.",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content: "SEOaudit Pro has transformed how we approach SEO. The keyword research tools alone have helped us increase organic traffic by 150% in just 6 months. The competitor analysis features give us insights we never had before.",
      results: "150% increase in organic traffic",
    },
    {
      name: "Michael Chen",
      role: "SEO Specialist",
      company: "Digital Agency Pro",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content: "As an agency managing multiple clients, SEOaudit Pro has been a game-changer. The project management features and comprehensive reporting make it easy to demonstrate ROI to our clients. Worth every penny!",
      results: "40+ clients managed successfully",
    },
    {
      name: "Emily Rodriguez",
      role: "Content Manager",
      company: "E-commerce Plus",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content: "The content marketing tools in SEOaudit Pro are exceptional. We've been able to create content that ranks on the first page consistently. The SEO Content Template saves us hours of research time.",
      results: "300% increase in first-page rankings",
    },
  ];

  const stats = [
    { value: "50K+", label: "Happy Customers", color: "from-violet-500 to-fuchsia-500" },
    { value: "4.9/5", label: "Average Rating", color: "from-yellow-500 to-orange-500" },
    { value: "150+", label: "Countries", color: "from-cyan-500 to-blue-500" },
    { value: "99.9%", label: "Uptime", color: "from-green-500 to-teal-500" },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-gradient-to-r from-fuchsia-600/10 to-transparent rounded-full blur-[80px]" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-gradient-to-l from-violet-600/10 to-transparent rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-6">
            <Star className="w-4 h-4 text-yellow-400" />
            Customer Success
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> Thousands</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of marketers, agencies, and businesses who trust SEOaudit Pro.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="relative mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl" />
          <div className="relative bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12">
            <Quote className="h-12 w-12 text-violet-400 mb-6" />
            
            <p className="text-xl md:text-2xl text-white leading-relaxed mb-8">
              "{testimonials[activeTestimonial].content}"
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {testimonials[activeTestimonial].name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-gray-400">
                    {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                  </p>
                  <div className="flex items-center mt-1">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevTestimonial}
                  className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <span className="text-violet-400 font-semibold">
                Result: {testimonials[activeTestimonial].results}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="mt-4 text-gray-500">No credit card required • 14-day free trial</p>
        </div>
      </div>
    </section>
  );
}
