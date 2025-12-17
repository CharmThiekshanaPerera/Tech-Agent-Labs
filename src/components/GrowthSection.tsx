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
    <section id="growth" className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-3">The Results Speak for Themselves</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Real Impact,
            <br />
            <span className="text-primary text-glow">Real Numbers</span> 📊
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Our clients don't just save time—they transform how they work. 
            Here's what you can expect when you bring AI agents to your team.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit) => (
            <article
              key={benefit.label}
              className="gradient-border rounded-2xl p-6 md:p-8 text-center card-glow hover:card-glow-hover transition-all duration-300 group"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {benefit.value}
              </p>
              <p className="text-lg font-semibold text-foreground mb-1 flex items-center justify-center gap-2">
                {benefit.label} <span>{benefit.emoji}</span>
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">Trusted by growing teams at</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            <span className="text-foreground font-semibold">Startup Co.</span>
            <span className="text-foreground font-semibold">TechCorp</span>
            <span className="text-foreground font-semibold">ScaleUp Inc.</span>
            <span className="text-foreground font-semibold">GrowthLabs</span>
            <span className="text-foreground font-semibold">InnovateCo</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthSection;