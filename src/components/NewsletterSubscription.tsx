import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

interface NewsletterSubscriptionProps {
  variant?: "default" | "compact" | "blog";
  className?: string;
}

const NewsletterSubscription = ({ variant = "default", className = "" }: NewsletterSubscriptionProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast.info("You're already subscribed to our newsletter!");
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        toast.success("Welcome! You've been subscribed to our newsletter.");
      }
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl ${className}`}>
        <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
        <div>
          <p className="text-foreground font-medium">You're subscribed!</p>
          <p className="text-sm text-muted-foreground">
            Get the latest AI insights from <a href="https://techagentlabs.com" className="text-primary underline underline-offset-4 hover:decoration-primary">Tech Agent Labs</a> delivered to your inbox.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-secondary/50 border-border"
          required
        />
        <Button type="submit" disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
        </Button>
      </form>
    );
  }

  if (variant === "blog") {
    return (
      <div className={`bg-gradient-to-br from-primary/10 via-secondary/30 to-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">Get AI insights delivered weekly</p>
          </div>
        </div>
        <p className="text-muted-foreground mb-6">
          Join thousands of professionals receiving the latest AI automation trends, tips, and exclusive content from{" "}
          <a href="https://techagentlabs.com" className="text-primary underline underline-offset-4 hover:decoration-primary font-medium">Tech Agent Labs</a>.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-background/50 border-border h-12"
            required
          />
          <Button type="submit" disabled={isSubmitting} size="lg" className="h-12 px-8">
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            Subscribe
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-4">
          No spam, ever. Unsubscribe anytime. Read our{" "}
          <a href="/privacy-policy" className="text-primary underline underline-offset-4 hover:decoration-primary">Privacy Policy</a>.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-secondary/30 border border-border/50 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Newsletter</h3>
      </div>
      <p className="text-muted-foreground text-sm mb-4">
        Subscribe to get the latest AI insights from{" "}
        <a href="https://techagentlabs.com" className="text-primary underline underline-offset-4 hover:decoration-primary">Tech Agent Labs</a>.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-secondary/50 border-border"
          required
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSubscription;
