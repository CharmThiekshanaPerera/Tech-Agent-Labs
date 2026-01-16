import { useState, useEffect, useMemo } from "react";
import { List, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string | null;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Extract headings from markdown content
  const headings = useMemo(() => {
    if (!content) return [];
    
    const lines = content.split("\n");
    const items: TocItem[] = [];
    
    lines.forEach((line) => {
      // Match markdown headings (## and ###)
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        // Create a slug from the heading text
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
        items.push({ id, text, level });
      }
    });
    
    return items;
  }, [content]);

  // Track active section based on scroll position
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      }
    );

    // Observe all heading elements
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 z-40 lg:hidden p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Toggle table of contents"
      >
        {isOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* TOC Sidebar */}
      <aside
        className={cn(
          "fixed z-40 transition-transform duration-300 ease-in-out",
          // Mobile: slide from right
          "lg:transform-none right-0 top-0 h-full w-72 bg-background border-l border-border p-6 pt-24",
          isOpen ? "translate-x-0" : "translate-x-full",
          // Desktop: sticky sidebar
          "lg:relative lg:right-auto lg:top-auto lg:h-auto lg:w-64 lg:translate-x-0 lg:bg-transparent lg:border-0 lg:p-0 lg:pt-0"
        )}
      >
        <div className="lg:sticky lg:top-28">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-foreground">
            <List className="w-4 h-4 text-primary" />
            <span>Table of Contents</span>
          </div>
          
          <nav className="space-y-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  "block w-full text-left text-sm py-1.5 pr-2 border-l-2 transition-all duration-200",
                  heading.level === 2 ? "pl-3" : "pl-6",
                  activeId === heading.id
                    ? "border-primary text-primary font-medium bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                )}
              >
                <span className="flex items-center gap-1">
                  {activeId === heading.id && (
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  )}
                  <span className="line-clamp-2">{heading.text}</span>
                </span>
              </button>
            ))}
          </nav>

          {/* Progress indicator */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="text-xs text-muted-foreground">
              {headings.findIndex((h) => h.id === activeId) + 1} of {headings.length} sections
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TableOfContents;
