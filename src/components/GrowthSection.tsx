import { TrendingUp, DollarSign, Clock, Expand } from "lucide-react";

const benefits = [
  { 
    icon: TrendingUp, 
    value: "10x", 
    label: "More Productive",
    description: "Your team focuses on high-value work while AI handles the repetitive stuff",
    emoji: "🚀"
  },
  { 
    icon: DollarSign, 
    value: "60%", 
    label: "Cost Savings",
    description: "Reduce operational costs without sacrificing quality or speed",
    emoji: "💰"
  },
  { 
    icon: Clock, 
    value: "24h", 
    label: "Quick Setup",
    description: "Most agents are live within a day. Complex setups take just a week",
    emoji: "⏱️"
  },
  { 
    icon: Expand, 
    value: "∞", 
    label: "Scale Easily",
    description: "Grow your operations without proportionally growing your headcount",
    emoji: "📈"
  },
];

const GrowthSection = () => {
  return (
    <section id="growth" className="relative py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <p className="text-primary font-medium text-sm sm:text-base mb-2 sm:mb-3">The Results Speak for Themselves</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Real Impact,
            <br />
            <span className="text-primary text-glow">Real Numbers</span> 📊
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2">
            Our clients don't just save time—they transform how they work. 
            Here's what you can expect when you bring AI agents to your team.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
          {benefits.map((benefit) => (
            <article
              key={benefit.label}
              className="gradient-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center card-glow hover:card-glow-hover transition-all duration-300 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mx-auto rounded-lg sm:rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">
                {benefit.value}
              </p>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mb-1 flex items-center justify-center gap-1 sm:gap-2">
                {benefit.label} <span className="text-sm sm:text-base">{benefit.emoji}</span>
              </p>
              <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm leading-relaxed">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-10 sm:mt-12 lg:mt-16 text-center">
          <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">Trusted by growing teams at</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 opacity-60">
            <span className="text-foreground font-semibold text-xs sm:text-sm md:text-base">Startup Co.</span>
            <span className="text-foreground font-semibold text-xs sm:text-sm md:text-base">TechCorp</span>
            <span className="text-foreground font-semibold text-xs sm:text-sm md:text-base">ScaleUp Inc.</span>
            <span className="text-foreground font-semibold text-xs sm:text-sm md:text-base">GrowthLabs</span>
            <span className="text-foreground font-semibold text-xs sm:text-sm md:text-base">InnovateCo</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthSection;