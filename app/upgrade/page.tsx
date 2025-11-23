"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function UpgradePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been upgraded to Premium! Enjoy unlimited access.",
        });
        
        // Update user context
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to upgrade to premium.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during upgrade.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      title: "Unlimited SEO Reports",
      description: "Generate unlimited SEO audit reports for all your websites",
      icon: <Check className="h-5 w-5 text-green-500" />
    },
    {
      title: "Unlimited Keyword Searches",
      description: "Perform unlimited keyword research and analysis",
      icon: <Check className="h-5 w-5 text-green-500" />
    },
    {
      title: "Advanced Analytics",
      description: "Access detailed analytics and insights",
      icon: <Check className="h-5 w-5 text-green-500" />
    },
    {
      title: "Priority Support",
      description: "Get priority customer support",
      icon: <Check className="h-5 w-5 text-green-500" />
    },
    {
      title: "API Access",
      description: "Access our API for integration with your tools",
      icon: <Check className="h-5 w-5 text-green-500" />
    },
    {
      title: "Custom Reports",
      description: "Generate custom white-labeled reports",
      icon: <Check className="h-5 w-5 text-green-500" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 p-2">
            <Crown className="h-4 w-4 mr-1" />
            Premium Upgrade
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Unlock Premium Features</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to all SEO tools and features with our premium plan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>
                <div className="text-3xl font-bold mt-2">$0<span className="text-lg font-normal">/month</span></div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>• 10 SEO reports per month</p>
                <p>• 10 keyword searches per month</p>
                <p>• Basic features</p>
                <p>• Community support</p>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-indigo-500 shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-indigo-500 text-white px-3 py-1">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription>
                <div className="text-3xl font-bold mt-2">$29<span className="text-lg font-normal">/month</span></div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>• <strong>Unlimited</strong> SEO reports</p>
                <p>• <strong>Unlimited</strong> keyword searches</p>
                <p>• All advanced features</p>
                <p>• Priority support</p>
                <p>• API access</p>
                <p>• Custom reports</p>
              </div>
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700" 
                onClick={handleUpgrade}
                disabled={isLoading || user?.isPremium}
              >
                {isLoading ? 'Processing...' : user?.isPremium ? 'Current Plan' : 'Upgrade Now'}
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>
                <div className="text-3xl font-bold mt-2">$99<span className="text-lg font-normal">/month</span></div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>• Everything in Premium</p>
                <p>• Team collaboration</p>
                <p>• Custom integrations</p>
                <p>• Dedicated support</p>
                <p>• SLA guarantee</p>
              </div>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Premium Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                {feature.icon}
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            30-day money-back guarantee • Cancel anytime • No setup fees
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ Secure payment</span>
            <span>✓ Instant access</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  );
}