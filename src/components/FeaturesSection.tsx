import { Brain, Database, Layers, Rocket } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "ADVANCED REASONING",
    description:
      "Agent X uses cutting-edge AI to understand complex problems, analyze data patterns, and make intelligent decisions that drive real business outcomes.",
  },
  {
    icon: Database,
    title: "LONG-TERM MEMORY",
    description:
      "Unlike basic chatbots, Agent X remembers context across conversations, learns from interactions, and builds knowledge specific to your business needs.",
  },
  {
    icon: Layers,
    title: "MULTI-SYSTEM INTEGRATION",
    description:
      "Seamlessly connect with your existing tools—CRM, email, analytics, databases, and more. Agent X works across your entire tech stack.",
  },
  {
    icon: Rocket,
    title: "ENTERPRISE PERFORMANCE",
    description:
      "Built for scale with enterprise-grade security, reliability, and speed. Reduce workload and boost productivity instantly across your organization.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="about" className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose
            <br />
            <span className="text-primary text-glow">Agent X</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Discover what makes Agent X truly unique—advanced AI capabilities designed 
            to transform how your business operates and scales.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group gradient-border rounded-2xl p-6 md:p-8 card-glow card-glow-hover transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Title */}
              <h3 className="font-mono text-lg md:text-xl font-bold text-foreground mb-4 tracking-wider">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
