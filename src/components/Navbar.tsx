import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Tokenomics", href: "#tokenomics" },
    { name: "How to Buy", href: "#howtobuy" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <span className="text-primary text-lg md:text-xl font-mono font-bold">X</span>
            </div>
            <span className="font-mono font-bold text-lg md:text-xl text-foreground">
              agent<span className="text-primary text-glow">X</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm uppercase tracking-wider"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-muted-foreground text-sm font-mono">CA : SOON</span>
            <a
              href="#"
              className="px-4 py-2 bg-primary text-primary-foreground font-mono font-semibold text-sm rounded-lg hover:bg-primary/90 transition-all card-glow"
            >
              CA NOW
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#"
                className="px-4 py-3 bg-primary text-primary-foreground font-mono font-semibold text-sm rounded-lg text-center mt-2"
              >
                CA NOW
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
