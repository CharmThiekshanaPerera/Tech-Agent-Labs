import { ArrowRight, Package, Link2, Settings, Rocket } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Package,
    title: "Choose Your Package",
    description:
      "Select the Agent X plan that fits your business needs—from starter packages for small teams to enterprise solutions for large organizations.",
  },
  {
    number: "2",
    icon: Link2,
    title: "Connect Your Systems",
    description:
      "Integrate Agent X with your existing tools and platforms. We support 100+ integrations including CRM, email, analytics, and more.",
  },
  {
    number: "3",
    icon: Settings,
    title: "Customization & Training",
    description:
      "Our team fully sets up, customizes, and trains Agent X specifically for your company's workflows, brand voice, and unique requirements.",
  },
  {
    number: "4",
    icon: Rocket,
    title: "Launch & Scale",
    description:
      "Go live with confidence. Agent X begins working immediately, with ongoing support and optimization as your business grows.",
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
          <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary text-glow">
            Getting Started
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Implementing Agent X is simple. Our team handles the heavy lifting so you can 
            focus on running your business.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="gradient-border rounded-2xl p-6 md:p-8 card-glow hover:card-glow-hover transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Step Number & Icon */}
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-4xl md:text-5xl font-bold text-primary/30">
                  {step.number}
                </span>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-mono text-lg md:text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="#contact"
            onClick={handleScrollToContact}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-mono font-semibold rounded-xl hover:bg-primary/90 transition-all card-glow group"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowToBuySection;
