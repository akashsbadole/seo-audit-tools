"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function SuggestionBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use POST to create a new bin for each suggestion
      const BIN_URL = "https://api.jsonbin.io/v3/b";
      const API_KEY =
        "$2a$10$ofqeaGjcQC/3aAL3IlMZ/uhOo3UZC7K9IANWDx0NCyk7MfmDElWGK";
      const suggestionData = {
        email,
        suggestion,
        date: new Date().toISOString(),
      };
      const response = await fetch(BIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify(suggestionData),
      });
      const data = await response.json();
      console.log("Suggestion API response:", data); // Log the response for debugging
      if (response.ok) {
        toast.success("Thank you for your suggestion!");
        setEmail("");
        setSuggestion("");
        setIsOpen(false);
      } else {
        toast.error(data.message || "Failed to save suggestion");
      }
    } catch (error) {
      toast.error("Failed to submit suggestion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-3 z-50 hidden md:block ">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 shadow-lg text-[10px]"
        >
          Share Suggestion/contact
        </Button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl p-4 w-80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suggestion/Message
              </label>
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                required
                placeholder="Share your thoughts..."
                className="w-full"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
