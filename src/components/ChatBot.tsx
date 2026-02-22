import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { streamChat } from "@/lib/streamChat";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const generateSessionId = () => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! 👋 I'm the Tech Agent Labs AI assistant. I can help you book a demo, learn about our AI agents, or answer any questions. How can I help?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef(generateSessionId());
  const logIdRef = useRef<string | null>(null);

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

  const saveChat = useCallback(async (msgs: Message[]) => {
    const chatMessages = msgs
      .filter((m) => m.id !== "1") // exclude initial greeting
      .map((m) => ({ role: m.role, content: m.content }));
    if (chatMessages.length === 0) return;

    const firstUserMsg = chatMessages.find((m) => m.role === "user")?.content || null;

    try {
      if (!logIdRef.current) {
        const { data } = await supabase
          .from("chat_logs")
          .insert({
            session_id: sessionIdRef.current,
            messages: chatMessages as any,
            message_count: chatMessages.length,
            first_message: firstUserMsg?.slice(0, 200),
            page_path: window.location.pathname,
          })
          .select("id")
          .single();
        if (data) logIdRef.current = data.id;
      } else {
        await supabase
          .from("chat_logs")
          .update({
            messages: chatMessages as any,
            message_count: chatMessages.length,
            first_message: firstUserMsg?.slice(0, 200),
          })
          .eq("id", logIdRef.current);
      }
    } catch (e) {
      console.error("Failed to save chat log:", e);
    }
  }, []);

  const handleSend = useCallback(async (overrideInput?: string) => {
    const text = (overrideInput ?? inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInputValue("");
    setIsLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      const content = assistantSoFar;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id === "streaming") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
        }
        return [...prev, { id: "streaming", role: "assistant", content }];
      });
    };

    await streamChat({
      messages: currentMessages.map((m) => ({ role: m.role, content: m.content })),
      onDelta: upsertAssistant,
      onDone: () => {
        setMessages((prev) => {
          const updated = prev.map((m) => (m.id === "streaming" ? { ...m, id: Date.now().toString() } : m));
          saveChat(updated);
          return updated;
        });
        setIsLoading(false);
      },
      onError: (error) => {
        const errorMsg: Message = { id: Date.now().toString(), role: "assistant", content: `Sorry, I'm having trouble connecting right now. Please try again or email us at hello@techagentlabs.com.` };
        setMessages((prev) => {
          const updated = [...prev.filter((m) => m.id !== "streaming"), errorMsg];
          saveChat(updated);
          return updated;
        });
        setIsLoading(false);
      },
    });
  }, [inputValue, isLoading, messages, saveChat]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "I'd like to book a demo",
    "What agents do you offer?",
    "How much does it cost?",
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-2 right-2 sm:bottom-6 sm:right-6 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-bounce ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ animationDuration: "2s", animationIterationCount: "3" }}
        aria-label="Open chat"
      >
        <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center animate-ping">
          <span className="absolute w-4 h-4 bg-accent rounded-full" />
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-16 right-2 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-16px)] sm:w-[380px] sm:max-w-[calc(100vw-48px)] max-h-[calc(100vh-5rem)] bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">AI Support</h3>
              <p className="text-xs text-primary-foreground/70 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Powered by AI • Booking Assistant
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
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
                <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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
                  onClick={() => handleSend(question)}
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
              placeholder="Ask about bookings, agents, pricing..."
              aria-label="Type your message"
              className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="rounded-xl px-4"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            AI-powered booking assistant • Tech Agent Labs
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
