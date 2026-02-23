import { useState, useEffect } from "react";
import { Menu, X, Sparkles, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import TikTokIcon from "@/components/icons/TikTokIcon";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/techagentlabs", bg: "bg-[#1877F2]" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/techagentlabs", bg: "bg-[#E4405F]" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/techagentlabs", bg: "bg-[#1DA1F2]" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/techagentlabs", bg: "bg-[#0A66C2]" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@techagentlabs", bg: "bg-[#FF0000]" },
  { name: "TikTok", icon: TikTokIcon, href: "https://tiktok.com/@techagentlabs", bg: "bg-[#000000]" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

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

  const scrollToHash = (hash: string) => {
    const id = hash.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const setHashInUrl = (hash: string) => {
    // Keep URL in sync without triggering a route change
    window.history.replaceState(null, "", hash);
  };

  useEffect(() => {
    if (!isHomePage) {
      setActiveSection(location.pathname === "/blog" ? "blog" : "home");
      return;
    }

    // Set initial active section based on scroll position or default to "home"
    const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

    // Find which section is currently in view on initial load
    const findActiveSection = () => {
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is in the visible area (accounting for navbar)
          if (rect.top <= 150 && rect.bottom > 150) {
            return id;
          }
        }
      }
      return "home";
    };

    // Set initial section
    setActiveSection(findActiveSection());

    // IMPORTANT: IntersectionObserver callback only receives CHANGED entries.
    // Keep the latest state of all observed sections so we can pick the best one reliably.
    const observedEntries: Record<string, IntersectionObserverEntry> = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          observedEntries[entry.target.id] = entry;
        });

        const visible = Object.values(observedEntries).filter((e) => e.isIntersecting);
        if (visible.length === 0) return;

        // Prefer the section with the largest visible area.
        // If tied, pick the one closest to the top of the viewport.
        const best = visible.reduce((prev, curr) => {
          if (curr.intersectionRatio !== prev.intersectionRatio) {
            return curr.intersectionRatio > prev.intersectionRatio ? curr : prev;
          }
          return Math.abs(curr.boundingClientRect.top) < Math.abs(prev.boundingClientRect.top)
            ? curr
            : prev;
        });

        setActiveSection(best.target.id);
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: [0, 0.1, 0.2],
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isHomePage, location.pathname]);

  useEffect(() => {
    if (!isHomePage) return;

    if (location.hash) {
      const id = location.hash.replace("#", "");
      setActiveSection(id);
      // When arriving from another route (e.g. /blog -> /#contact)
      setTimeout(() => scrollToHash(location.hash), 50);
    }
  }, [isHomePage, location.hash]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (isHomePage) {
      scrollToHash(href);
      setHashInUrl(href);
    } else {
      // Navigate to home page with hash
      navigate("/" + href);
    }
  };

  const handleButtonClick = (href: string) => {
    setIsOpen(false);

    if (isHomePage) {
      scrollToHash(href);
      setHashInUrl(href);
    } else {
      navigate("/" + href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <nav className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-2 group"
          >
            <img 
              src={logo} 
              alt="Tech Agent Labs logo - Navigate to homepage" 
              className="h-10 sm:h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(34,255,102,0.3)] hover:drop-shadow-[0_0_25px_rgba(34,255,102,0.5)]"
              width={48}
              height={48}
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "transition-colors font-medium text-sm relative py-1",
                  activeSection === link.href.replace("#", "")
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden sm:flex items-center gap-3 sm:gap-4">
            <Button
              variant="glow"
              size="sm"
              onClick={() => handleButtonClick("#contact")}
              className="group"
            >
              Start a Demo
              <Sparkles className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-up">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "transition-colors font-medium py-2 text-sm",
                    activeSection === link.href.replace("#", "")
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
              <Button
                variant="glow"
                size="default"
                onClick={() => handleButtonClick("#contact")}
                className="mt-2 group"
              >
                Start a Demo
                <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
              </Button>
              {/* Social Media Icons */}
              <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-border/50">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.name}`}
                    className={`w-9 h-9 flex items-center justify-center ${social.bg} rounded-full text-white active:scale-95 transition-transform`}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;