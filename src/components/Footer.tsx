import { useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Youtube, Facebook, Instagram, Mail, Phone, MapPin, FileDown, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { z } from "zod";

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" }).max(255);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Why Us", href: "#about" },
    { name: "Agents", href: "#services" },
    { name: "Results", href: "#growth" },
    { name: "How It Works", href: "#howtobuy" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Blog", href: "#blog" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  const agentLinks = [
    { name: "Support Agent", href: "#services" },
    { name: "Marketing Agent", href: "#services" },
    { name: "Analytics Agent", href: "#services" },
    { name: "Sales Agent", href: "#services" },
    { name: "Custom Build", href: "#contact" },
  ];

  const resourceLinks = [
    { name: "Documentation", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Case Studies", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Project Proposal", href: "/documents/Tech_Agent_Labs_Project_Proposal.pdf", download: true },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Invalid email",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - replace with actual backend integration
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubscribed(true);
    setEmail("");
    
    toast({
      title: "Successfully subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
  };

  return (
    <footer className="relative bg-secondary/30 border-t border-border/50">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <img 
                src={logo} 
                alt="Tech Agent Labs" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_0_10px_rgba(0,255,128,0.3)]"
              />
              <span className="font-bold text-lg sm:text-xl text-foreground">
                Tech Agent <span className="text-primary text-glow">Labs</span>
              </span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 max-w-sm">
              Empowering businesses with cutting-edge AI agents that automate workflows, 
              boost productivity, and drive growth. Join 500+ companies transforming their operations.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3">
              <a href="mailto:info@techagentlabs.com" className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                info@techagentlabs.com
              </a>
              <a href="tel:+94789587000" className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                078 95 87 000
              </a>
              <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>27/14 Ananda Rajakaruna Road,<br />Colombo 10, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Navigation</h4>
            <ul className="space-y-2 sm:space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Agents Column */}
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">AI Agents</h4>
            <ul className="space-y-2 sm:space-y-3">
              {agentLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Resources</h4>
            <ul className="space-y-2 sm:space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    {...(link.download ? { download: true } : {})}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    {link.download && <FileDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-border/30">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center lg:text-left">
              <h4 className="font-semibold text-foreground text-sm sm:text-base mb-1">Subscribe to our newsletter</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Get the latest AI insights and product updates delivered to your inbox.</p>
            </div>
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">You're subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex w-full lg:w-auto gap-2 sm:gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  className="flex-1 lg:w-60 xl:w-72 px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-xs sm:text-sm disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap text-xs sm:text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Subscribing...</span>
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Social Icons - Top on mobile */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 order-1 md:order-none">
              <a
                href="https://facebook.com/techagentlabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
              >
                <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
              </a>
              <a
                href="https://instagram.com/techagentlabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
              </a>
              <a
                href="https://twitter.com/techagentlabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
              </a>
              <a
                href="https://linkedin.com/company/techagentlabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect on LinkedIn"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
              </a>
              <a
                href="https://youtube.com/@techagentlabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch on YouTube"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
              >
                <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
              </a>
            </div>

            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
              <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm text-center md:text-left">
                © 2024 Tech Agent Labs. All rights reserved. Made with 💚 for growing teams.
              </p>

              {/* Legal Links */}
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-[10px] sm:text-xs md:text-sm">
                  Privacy Policy
                </Link>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-[10px] sm:text-xs md:text-sm">
                  Terms of Service
                </a>
                <button 
                  onClick={() => {
                    const event = new CustomEvent('open-cookie-settings');
                    window.dispatchEvent(event);
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors text-[10px] sm:text-xs md:text-sm"
                >
                  Cookie Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
