import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const mockResponses: Record<string, string> = {
  pricing: "We offer three flexible plans:\n\n• **Starter** - $99/month for small businesses\n• **Professional** - $299/month (most popular)\n• **Enterprise** - Custom pricing for large organizations\n\nAll plans include a 14-day free trial. Would you like me to help you choose the right plan?",
  agents: "We have 8 specialized AI agents:\n\n🤖 **Support Agent** - 24/7 customer service\n📈 **Marketing Agent** - Campaign automation\n📊 **Analytics Agent** - Data insights\n⚙️ **Operations Agent** - Workflow automation\n🤝 **Sales Agent** - Lead qualification\n✍️ **Content Agent** - Content creation\n🌐 **Web Agent** - Website management\n🛠️ **Custom Agent** - Tailored solutions\n\nWhich agent interests you most?",
  demo: "I'd love to help you schedule a demo! You can:\n\n1. Click the 'Start a Demo' button on our homepage\n2. Fill out the contact form below\n3. Or email us directly at hello@techagentlabs.com\n\nOur team typically responds within 2 hours during business hours. What works best for you?",
  integration: "Our AI agents integrate seamlessly with 100+ popular tools including:\n\n• **CRMs**: Salesforce, HubSpot, Pipedrive\n• **Communication**: Slack, Teams, Discord\n• **Support**: Zendesk, Intercom, Freshdesk\n• **Marketing**: Mailchimp, ActiveCampaign\n• **Productivity**: Notion, Asana, Monday\n\nNeed help with a specific integration?",
  security: "Security is our top priority! We offer:\n\n🔒 **Enterprise-grade encryption** (AES-256)\n✅ **SOC 2 Type II certified**\n🌍 **GDPR compliant**\n🔐 **99.9% uptime guarantee**\n📝 **Full audit logging**\n\nYour data is never shared with third parties. Want to learn more about our security practices?",
  setup: "Getting started is simple:\n\n1️⃣ **Choose your agent** from our marketplace\n2️⃣ **We handle integration** with your existing tools\n3️⃣ **Go live in 24-48 hours**\n\nMost agents are production-ready within a day. Our team provides full onboarding support. Ready to get started?",
  support: "We provide comprehensive support:\n\n• **Starter**: Email support, 24h response\n• **Professional**: Priority email & chat, 4h response\n• **Enterprise**: 24/7 dedicated support, 1h response\n\nPlus, every customer gets dedicated onboarding and training. How can I help you today?",
  hello: "Hello! 👋 Welcome to Tech Agent Labs! I'm your AI assistant, here to help you learn about our automation solutions.\n\nI can help you with:\n• Information about our AI agents\n• Pricing and plans\n• Integration questions\n• Scheduling a demo\n\nWhat would you like to know?",
  default: "Thanks for your message! I'm here to help you learn about Tech Agent Labs.\n\nHere are some topics I can assist with:\n• 🤖 Our AI agents and their capabilities\n• 💰 Pricing and plans\n• 🔌 Integration options\n• 🔒 Security & compliance\n• 📅 Scheduling a demo\n\nWhat would you like to explore?"
};

const getAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("plan")) {
    return mockResponses.pricing;
  }
  if (lowerMessage.includes("agent") || lowerMessage.includes("bot") || lowerMessage.includes("service")) {
    return mockResponses.agents;
  }
  if (lowerMessage.includes("demo") || lowerMessage.includes("trial") || lowerMessage.includes("try")) {
    return mockResponses.demo;
  }
  if (lowerMessage.includes("integrat") || lowerMessage.includes("connect") || lowerMessage.includes("tool")) {
    return mockResponses.integration;
  }
  if (lowerMessage.includes("secur") || lowerMessage.includes("safe") || lowerMessage.includes("privacy") || lowerMessage.includes("gdpr")) {
    return mockResponses.security;
  }
  if (lowerMessage.includes("setup") || lowerMessage.includes("start") || lowerMessage.includes("begin") || lowerMessage.includes("how")) {
    return mockResponses.setup;
  }
  if (lowerMessage.includes("support") || lowerMessage.includes("help") || lowerMessage.includes("assist")) {
    return mockResponses.support;
  }
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return mockResponses.hello;
  }
  
  return mockResponses.default;
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! 👋 I'm the Tech Agent Labs AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse = getAIResponse(inputValue);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What agents do you offer?",
    "How much does it cost?",
    "How do I get started?",
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5" />
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">AI Assistant</h3>
              <p className="text-xs text-primary-foreground/70 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Online • Powered by AI
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted border border-border"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border rounded-bl-md"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="px-4 py-2 border-t border-border bg-card/50">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => {
                    setInputValue(question);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary border border-border transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-border bg-card">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="rounded-xl px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            AI-powered assistant • Responses may vary
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
