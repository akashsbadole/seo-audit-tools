"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Bot,
  Sparkles,
  Loader2,
  Zap,
  Target,
  TrendingUp,
  Search,
  FileText,
  BarChart3,
  MessageSquare,
  X,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Copy,
  RefreshCw,
} from "lucide-react";

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface AgentMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: AgentAction[];
}

export interface AgentAction {
  id: string;
  label: string;
  description: string;
  onClick: () => void;
}

interface AIAgentProps {
  context?: string;
  capabilities?: AgentCapability[];
  onAnalyze?: (query: string) => Promise<any>;
  initialPrompt?: string;
  className?: string;
}

const defaultCapabilities: AgentCapability[] = [
  {
    id: "analyze",
    name: "Analyze",
    description: "Analyze your SEO data and provide insights",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "optimize",
    name: "Optimize",
    description: "Get optimization recommendations",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "research",
    name: "Research",
    description: "Research keywords and competitors",
    icon: <Search className="w-4 h-4" />,
  },
  {
    id: "content",
    name: "Content",
    description: "Generate content recommendations",
    icon: <FileText className="w-4 h-4" />,
  },
];

export function AIAgent({
  context = "",
  capabilities = defaultCapabilities,
  onAnalyze,
  initialPrompt,
  className = "",
}: AIAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCapability, setActiveCapability] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          context,
          capability: activeCapability,
          history: messages.slice(-5),
        }),
      });

      const data = await response.json();

      const agentMessage: AgentMessage = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions,
        actions: data.actions?.map((action: any, idx: number) => ({
          id: action.id || `action-${idx}`,
          label: action.label,
          description: action.description,
          onClick: () => handleAction(action),
        })),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage: AgentMessage = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action: any) => {
    if (action.type === "analyze") {
      handleSend(action.prompt);
    } else if (action.type === "url") {
      window.location.href = action.url;
    }
  };

  const handleCapabilityClick = (capabilityId: string) => {
    setActiveCapability(capabilityId);
    const capability = capabilities.find((c) => c.id === capabilityId);
    if (capability) {
      setInput(`Help me with ${capability.name.toLowerCase()}: ${context}`);
      inputRef.current?.focus();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-full px-6 py-6 shadow-lg shadow-violet-500/25"
      >
        <Bot className="w-6 h-6 mr-2" />
        AI Assistant
      </Button>
    );
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 z-50 w-[400px] bg-[#0a0a0f]/95 backdrop-blur-md border border-white/10 shadow-2xl ${className}`}
    >
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                AI Marketing Agent
                <Badge className="bg-green-500/20 text-green-400 text-xs">Online</Badge>
              </CardTitle>
              <p className="text-gray-400 text-xs">Powered by AI • Agentic</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent className="p-0">
            <div className="p-3 border-b border-white/10">
              <p className="text-gray-400 text-xs mb-2">Quick Actions:</p>
              <div className="flex flex-wrap gap-2">
                {capabilities.map((cap) => (
                  <Button
                    key={cap.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCapabilityClick(cap.id)}
                    className="text-xs border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    {cap.icon}
                    <span className="ml-1">{cap.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <ScrollArea className="h-[300px] p-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-violet-400" />
                  <p className="text-white font-medium mb-2">
                    How can I help you today?
                  </p>
                  <p className="text-gray-400 text-sm">
                    Ask me about SEO analysis, content optimization, keyword research, and more.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                            : "bg-white/5 border border-white/10 text-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.role === "agent" && (
                            <Bot className="w-4 h-4 mt-1 text-violet-400 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            
                            {message.suggestions && message.suggestions.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <p className="text-xs text-gray-400 mb-2">Suggestions:</p>
                                <div className="space-y-1">
                                  {message.suggestions.map((suggestion, idx) => (
                                    <Button
                                      key={idx}
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSend(suggestion)}
                                      className="w-full justify-start text-xs text-gray-300 hover:text-white hover:bg-white/10"
                                    >
                                      <Lightbulb className="w-3 h-3 mr-2 text-yellow-400" />
                                      {suggestion}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {message.actions && message.actions.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <div className="space-y-2">
                                  {message.actions.map((action) => (
                                    <Button
                                      key={action.id}
                                      variant="outline"
                                      size="sm"
                                      onClick={action.onClick}
                                      className="w-full justify-start text-xs border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                                    >
                                      <Zap className="w-3 h-3 mr-2 text-violet-400" />
                                      {action.label}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {message.role === "agent" && (
                            <button
                              onClick={() => copyToClipboard(message.content)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                          <span className="text-gray-400 text-sm">Analyzing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </CardContent>

          <div className="p-4 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  );
}

export default AIAgent;
