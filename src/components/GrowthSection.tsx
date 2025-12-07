import { TrendingUp, DollarSign, Clock, Expand } from "lucide-react";

const benefits = [
  { 
    icon: TrendingUp, 
    value: "300%", 
    label: "Efficiency Boost",
    description: "Automate repetitive tasks and free your team for high-value work"
  },
  { 
    icon: DollarSign, 
    value: "60%", 
    label: "Cost Reduction",
    description: "Lower operational costs with intelligent automation"
  },
  { 
    icon: Clock, 
    value: "10x", 
    label: "Faster Decisions",
    description: "Real-time data processing and instant recommendations"
  },
  { 
    icon: Expand, 
    value: "∞", 
    label: "Scalability",
    description: "Grow your operations without proportionally growing headcount"
  },
];

const GrowthSection = () => {
  return (
    <section id="growth" className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How Agent X
            <br />
            <span className="text-primary text-glow">Grows Your Business</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            See the measurable impact Agent X delivers to businesses like yours—
            from startups to enterprises.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.label}
              className="gradient-border rounded-2xl p-6 md:p-8 text-center card-glow hover:card-glow-hover transition-all duration-300 group"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <p className="font-mono text-3xl md:text-4xl font-bold text-primary mb-2">
                {benefit.value}
              </p>
              <p className="font-mono text-lg font-semibold text-foreground mb-3">
                {benefit.label}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GrowthSection;
