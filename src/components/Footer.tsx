import { Twitter, Linkedin, Youtube, Sparkles } from "lucide-react";

const Footer = () => {
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Why Us", href: "#about" },
    { name: "Agents", href: "#services" },
    { name: "Results", href: "#growth" },
    { name: "How It Works", href: "#howtobuy" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="relative py-12 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg text-foreground">
              Tech Agent <span className="text-primary text-glow">Labs</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Legal Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors text-sm underline"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors text-sm underline"
            >
              Terms
            </a>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-8 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Follow us on Twitter"
              className="w-10 h-10 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
            >
              <Twitter className="w-4 h-4 text-foreground" />
            </a>
            <a
              href="#"
              aria-label="Connect on LinkedIn"
              className="w-10 h-10 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-foreground" />
            </a>
            <a
              href="#"
              aria-label="Watch on YouTube"
              className="w-10 h-10 rounded-lg bg-secondary border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors"
            >
              <Youtube className="w-4 h-4 text-foreground" />
            </a>
          </div>

          {/* Copyright & Tagline */}
          <p className="text-muted-foreground text-xs md:text-sm text-center">
            © 2024 Tech Agent Labs. Made with 💚 for growing teams.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;