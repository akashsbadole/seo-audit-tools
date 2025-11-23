"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Search, 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  Star,
  X,
  ChevronRight
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
  feature: string;
  path?: string;
}

const FeatureTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [isTourCompleted, setIsTourCompleted] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: "welcome",
      title: "Welcome to SEO Audit Pro!",
      description: "Let's take a quick tour of our powerful SEO optimization platform. This will help you get the most out of our tools and features.",
      icon: <Star className="h-8 w-8" />,
      feature: "Introduction",
    },
    {
      id: "seo-audit",
      title: "Comprehensive SEO Audit",
      description: "Start with our free SEO audit tool. Enter your website URL and get instant insights about your site's performance, accessibility, and optimization opportunities.",
      icon: <Search className="h-8 w-8" />,
      action: "Try SEO Audit",
      feature: "SEO Audit Tool",
      path: "#seo-audit",
    },
    {
      id: "dashboard",
      title: "Analytics Dashboard",
      description: "Monitor your website's performance with our comprehensive dashboard. Track rankings, traffic, and optimization progress over time.",
      icon: <BarChart3 className="h-8 w-8" />,
      action: "View Dashboard",
      feature: "Analytics Dashboard",
      path: "/dashboard",
    },
    {
      id: "ai-analysis",
      title: "AI-Powered Analysis",
      description: "Get intelligent recommendations using our advanced AI. Analyze content, keywords, and competitor strategies to stay ahead of the competition.",
      icon: <Zap className="h-8 w-8" />,
      action: "Try AI Analysis",
      feature: "AI Analysis",
      path: "/tools/ai-analysis",
    },
    {
      id: "monitoring",
      title: "Website Monitoring",
      description: "Keep track of your website's uptime and performance 24/7. Get instant alerts about issues and monitor your competitors' activities.",
      icon: <Shield className="h-8 w-8" />,
      action: "Set Up Monitoring",
      feature: "Website Monitoring",
      path: "/tools/website-monitoring",
    },
    {
      id: "tools",
      title: "Professional SEO Tools",
      description: "Access our complete suite of SEO tools including keyword research, meta tag generators, competitor analysis, and more.",
      icon: <Users className="h-8 w-8" />,
      action: "Explore Tools",
      feature: "SEO Tools Suite",
      path: "/tools",
    },
    {
      id: "premium",
      title: "Upgrade to Premium",
      description: "Unlock unlimited reports, advanced analytics, AI-powered insights, and priority support. Get 17% off with yearly billing!",
      icon: <CheckCircle className="h-8 w-8" />,
      action: "View Pricing",
      feature: "Premium Features",
      path: "#pricing",
    },
  ];

  useEffect(() => {
    // Check if user has completed the tour
    const tourStatus = localStorage.getItem("feature-tour-completed");
    if (tourStatus === "true") {
      setIsTourCompleted(true);
    }

    // Show tour for new users after 3 seconds
    const timer = setTimeout(() => {
      if (!tourStatus) {
        setIsTourActive(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleNextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const completeTour = () => {
    setIsTourActive(false);
    setIsTourCompleted(true);
    localStorage.setItem("feature-tour-completed", "true");
  };

  const skipTour = () => {
    setIsTourActive(false);
    localStorage.setItem("feature-tour-completed", "true");
  };

  const restartTour = () => {
    setCurrentStep(0);
    setIsTourActive(true);
    localStorage.removeItem("feature-tour-completed");
  };

  const handleAction = () => {
    const step = tourSteps[currentStep];
    if (step.path) {
      if (step.path.startsWith("#")) {
        // Smooth scroll to section
        const element = document.querySelector(step.path);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to page
        window.location.href = step.path;
      }
      completeTour();
    }
  };

  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  if (!isTourActive && !isTourCompleted) {
    return null;
  }

  return (
    <>
      {/* Tour Trigger Button (shown when tour is completed) */}
      {isTourCompleted && !isTourActive && (
        <div className="fixed bottom-6 right-6 z-50">
          <GlassCard className="p-4 shadow-lg">
            <Button
              onClick={restartTour}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Take a Tour
            </Button>
          </GlassCard>
        </div>
      )}

      {/* Tour Overlay */}
      {isTourActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <GlassCard className="max-w-2xl w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={skipTour}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Tour Content */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-6">
                {tourSteps[currentStep].icon}
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {tourSteps[currentStep].title}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {tourSteps[currentStep].description}
              </p>
              <Badge variant="outline" className="mb-6">
                {tourSteps[currentStep].feature}
              </Badge>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {tourSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-blue-500 w-8"
                      : index < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {tourSteps[currentStep].action && (
                <GradientButton
                  onClick={handleAction}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {tourSteps[currentStep].action}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </GradientButton>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNextStep}
                  className="flex items-center gap-2"
                >
                  {currentStep === tourSteps.length - 1 ? "Complete" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Skip Tour Link */}
            <div className="text-center mt-6">
              <button
                onClick={skipTour}
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                Skip tour
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};

export default FeatureTour;