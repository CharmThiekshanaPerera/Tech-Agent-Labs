import { Twitter, Linkedin, Youtube, Github, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Why Us", href: "#about" },
    { name: "Agents", href: "#services" },
    { name: "Results", href: "#growth" },
    { name: "How It Works", href: "#howtobuy" },
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

  return (
    <footer className="relative bg-secondary/30 border-t border-border/50">
      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logo} 
                alt="Tech Agent Labs" 
                className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(0,255,128,0.3)]"
              />
              <span className="font-bold text-xl text-foreground">
                Tech Agent <span className="text-primary text-glow">Labs</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              Empowering businesses with cutting-edge AI agents that automate workflows, 
              boost productivity, and drive growth. Join 500+ companies transforming their operations.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:hello@techagentlabs.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                hello@techagentlabs.com
              </a>
              <a href="tel:+1-888-555-0123" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                +1 (888) 555-0123
              </a>
              <p className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                San Francisco, CA & Worldwide
              </p>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Agents Column */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">AI Agents</h4>
            <ul className="space-y-3">
              {agentLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
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
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Subscribe to our newsletter</h4>
              <p className="text-sm text-muted-foreground">Get the latest AI insights and product updates delivered to your inbox.</p>
            </div>
            <div className="flex w-full lg:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-72 px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-sm"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
              © 2024 Tech Agent Labs. All rights reserved. Made with 💚 for growing teams.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Cookie Policy
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Follow us on Twitter"
                className="w-9 h-9 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
              >
                <Twitter className="w-4 h-4 text-foreground" />
              </a>
              <a
                href="#"
                aria-label="Connect on LinkedIn"
                className="w-9 h-9 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-foreground" />
              </a>
              <a
                href="#"
                aria-label="Watch on YouTube"
                className="w-9 h-9 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
              >
                <Youtube className="w-4 h-4 text-foreground" />
              </a>
              <a
                href="#"
                aria-label="View on GitHub"
                className="w-9 h-9 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
              >
                <Github className="w-4 h-4 text-foreground" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
