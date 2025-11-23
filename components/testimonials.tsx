"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { GlassCard } from "./ui/glass-card";

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Inc.",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content:
        "This SEO audit platform has transformed how we approach our digital marketing. The AI-powered insights are incredibly valuable, and we've seen a 40% increase in organic traffic in just 3 months.",
      results: "40% increase in organic traffic",
      plan: "Professional",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "SEO Specialist",
      company: "Digital Agency Pro",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content:
        "As an agency, we need reliable tools for multiple clients. The competitor analysis and website monitoring features are game-changers. Our clients love the detailed reports we can generate.",
      results: "50+ clients managed",
      plan: "Enterprise",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      company: "Boutique Store",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content:
        "I was struggling with SEO until I found this platform. The free plan gave me everything I needed to get started, and the upgrade to Professional was worth every penny. My website now ranks on page 1!",
      results: "Page 1 rankings achieved",
      plan: "Professional",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Content Manager",
      company: "Media Corp",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content:
        "The AI content analysis tool is phenomenal. It helps us optimize our articles before publishing, and the keyword suggestions are spot-on. Our content performance has improved dramatically.",
      results: "60% better content engagement",
      plan: "Professional",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "E-commerce Manager",
      company: "Online Store",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content:
        "The website monitoring feature alone is worth the subscription. We get instant alerts about any issues, and the SEO audit helps us stay ahead of competitors. Essential for any online business.",
      results: "99.9% uptime maintained",
      plan: "Premium",
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Freelance Consultant",
      company: "SEO Consultant",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content:
        "I've tried many SEO tools, but this one stands out. The interface is intuitive, the features are comprehensive, and the pricing is fair. My clients are impressed with the results we achieve together.",
      results: "25+ successful projects",
      plan: "Professional",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "50,000+", label: "Websites Analyzed" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "99.9%", label: "Uptime" },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" />
      <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2">
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
            Loved by Thousands of Users
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            See what our customers have to say about their experience with our
            SEO audit platform.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <GlassCard key={index} className="text-center p-6">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="mb-16">
          <GlassCard className="p-8 md:p-12 relative">
            <Quote className="absolute top-4 right-4 h-12 w-12 text-blue-200 opacity-50" />
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src={testimonials[activeTestimonial].avatar}
                alt={testimonials[activeTestimonial].name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="flex-1 text-center md:text-left">
                <div className="flex justify-center md:justify-start gap-1 mb-4">
                  {renderStars(testimonials[activeTestimonial].rating)}
                </div>
                <p className="text-xl text-gray-700 mb-6 italic">
                  "{testimonials[activeTestimonial].content}"
                </p>
                <div>
                  <div className="font-semibold text-lg">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[activeTestimonial].role}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonials[activeTestimonial].company}
                  </div>
                  <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {testimonials[activeTestimonial].plan} Plan
                  </Badge>
                </div>
                <div className="mt-4">
                  <span className="text-green-600 font-semibold">
                    ✓ {testimonials[activeTestimonial].results}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                activeTestimonial === index ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setActiveTestimonial(index)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {testimonial.plan}
                  </Badge>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {testimonial.role}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-green-600 text-xs font-semibold">
                    ✓ {testimonial.results}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <GlassCard className="p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Join Thousands of Happy Users?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Start your free today and see why our platform is the preferred
              choice for SEO professionals and businesses worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/sign-up")}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Start Free
              </button>
              <button
                onClick={() => (window.location.href = "#pricing")}
                className="px-8 py-3 border-2 border-blue-500 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                View Pricing
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
