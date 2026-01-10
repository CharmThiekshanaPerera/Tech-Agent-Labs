import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Why Us", href: "#about" },
    { name: "Agents", href: "#services" },
    { name: "Results", href: "#growth" },
    { name: "How It Works", href: "#howtobuy" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const sectionIds = navLinks.map(link => link.href.replace("#", ""));
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  const handleButtonClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
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
              alt="Tech Agent Labs" 
              className="h-8 sm:h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(34,255,102,0.3)] hover:drop-shadow-[0_0_25px_rgba(34,255,102,0.5)]"
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
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;