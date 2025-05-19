"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function SuggestionBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, comment }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 400 &&
          data.error.includes("already submitted")
        ) {
          toast({
            title: "Email Already Used",
            description:
              "You have already submitted a suggestion with this email address.",
            variant: "destructive",
            duration: 5000,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          return;
        }
        throw new Error(data.error || "Failed to submit suggestion");
      }

      toast({
        title: "Suggestion Submitted Successfully! 🎉",
        description:
          "Thank you for helping us improve. We'll review your suggestion soon.",
        duration: 5000,
        action: <ToastAction altText="Close">Close</ToastAction>,
      });

      setEmail("");
      setComment("");
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description: "We couldn't submit your suggestion. Please try again.",
        variant: "destructive",
        duration: 5000,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-4">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-black rounded-full shadow-lg"
        >
          Have a suggestion?
        </Button>
      ) : (
        <Card className="w-full max-w-md mx-auto p-4 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-lg">Share your suggestion</h3>
            <div className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
              />
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type your suggestion here..."
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
