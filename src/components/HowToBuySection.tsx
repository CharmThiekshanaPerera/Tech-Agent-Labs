import { ArrowRight, ShoppingCart, Link2, Rocket } from "lucide-react";
import { AnimatedSection } from "@/hooks/useScrollAnimation";

const steps = [
  {
    number: "1",
    icon: ShoppingCart,
    title: "Pick Your Agent",
    description:
      "Browse our marketplace and choose the AI agent that fits your needs—or tell us what you need built custom.",
    emoji: "🛒"
  },
  {
    number: "2",
    icon: Link2,
    title: "We Connect Everything",
    description:
      "Our team integrates the agent with your existing tools. Slack, Salesforce, email, CRM—we've got you covered.",
    emoji: "🔌"
  },
  {
    number: "3",
    icon: Rocket,
    title: "You're Live!",
    description:
      "Your agent starts working immediately. We stay by your side with training, support, and ongoing optimization.",
    emoji: "🚀"
  },
];

const HowToBuySection = () => {
  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="howtobuy" className="relative py-12 sm:py-16 md:py-24 lg:py-32">
      {/* Background Effect */}
      <div className="absolute inset-0 matrix-grid opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
          <p className="text-primary font-medium text-sm sm:text-base mb-2 sm:mb-3">Simple, Human Process</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-primary text-glow">
            How It Works 🤔
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2">
            Getting started is easy. We handle the technical stuff so you don't have to. 
            No coding required—just results.
          </p>
        </AnimatedSection>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <AnimatedSection key={step.number} animation="fade-up" delay={index * 150}>
              <article
                className="gradient-border rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 card-glow hover:card-glow-hover transition-all duration-300 hover:-translate-y-1 group relative h-full"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 lg:-right-4 xl:-right-5 w-6 lg:w-8 xl:w-10 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                
                {/* Step Number & Icon */}
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary/20">
                    {step.number}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <span className="text-xl sm:text-2xl">{step.emoji}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {step.description}
                </p>
              </article>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection className="mt-10 sm:mt-12 lg:mt-16 text-center space-y-3 sm:space-y-4" delay={450}>
          <p className="text-muted-foreground text-sm sm:text-base">
            Ready to meet your new AI teammate? <span className="text-primary">Let's chat.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="#contact"
              onClick={handleScrollToContact}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all card-glow group text-sm sm:text-base"
            >
              Start a Demo
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 gradient-border rounded-xl font-semibold text-foreground hover:bg-secondary/50 transition-all text-sm sm:text-base"
            >
              Browse Agents
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HowToBuySection;