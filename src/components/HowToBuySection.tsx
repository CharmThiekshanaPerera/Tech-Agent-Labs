import { ArrowRight, ShoppingCart, Link2, Rocket } from "lucide-react";

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
    <section id="howtobuy" className="relative py-20 md:py-32">
      {/* Background Effect */}
      <div className="absolute inset-0 matrix-grid opacity-20" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-3">Simple, Human Process</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary text-glow">
            How It Works 🤔
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Getting started is easy. We handle the technical stuff so you don't have to. 
            No coding required—just results.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className="gradient-border rounded-2xl p-6 md:p-8 card-glow hover:card-glow-hover transition-all duration-300 hover:-translate-y-1 group relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 w-8 lg:w-10 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              {/* Step Number & Icon */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl md:text-6xl font-bold text-primary/20">
                  {step.number}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-2xl">{step.emoji}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-muted-foreground">
            Ready to meet your new AI teammate? <span className="text-primary">Let's chat.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              onClick={handleScrollToContact}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all card-glow group"
            >
              Start a Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-border rounded-xl font-semibold text-foreground hover:bg-secondary/50 transition-all"
            >
              Browse Agents
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToBuySection;