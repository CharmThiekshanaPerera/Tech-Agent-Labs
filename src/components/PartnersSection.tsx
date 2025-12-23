import { useEffect, useRef } from "react";

import techcorpLogo from "@/assets/partners/techcorp.png";
import innovatelabsLogo from "@/assets/partners/innovatelabs.png";
import futureaiLogo from "@/assets/partners/futureai.png";
import dataflowLogo from "@/assets/partners/dataflow.png";
import cloudnineLogo from "@/assets/partners/cloudnine.png";
import smartsysLogo from "@/assets/partners/smartsys.png";
import nextgenLogo from "@/assets/partners/nextgen.png";
import aiventuresLogo from "@/assets/partners/aiventures.png";

const partners = [
  { name: "TechCorp", logo: techcorpLogo },
  { name: "InnovateLabs", logo: innovatelabsLogo },
  { name: "FutureAI", logo: futureaiLogo },
  { name: "DataFlow", logo: dataflowLogo },
  { name: "CloudNine", logo: cloudnineLogo },
  { name: "SmartSys", logo: smartsysLogo },
  { name: "NextGen", logo: nextgenLogo },
  { name: "AIVentures", logo: aiventuresLogo },
];

const PartnersSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const speed = 0.5;

    const scroll = () => {
      scrollPosition += speed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Trusted By Industry Leaders
          </span>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          Partnering with world-class companies to deliver cutting-edge AI solutions
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-12 overflow-x-hidden whitespace-nowrap py-8"
        style={{ scrollBehavior: "auto" }}
      >
        {/* Double the logos for seamless infinite scroll */}
        {[...partners, ...partners].map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="flex-shrink-0 group cursor-pointer"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6 py-4 transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-16 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnersSection;
