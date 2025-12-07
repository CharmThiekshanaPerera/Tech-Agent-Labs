import { Shield, Users, Sprout } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "SECURE",
    description:
      "Built on advanced blockchain technology with multiple security layers, audited smart contracts, and robust decentralized infrastructure to ensure maximum protection.",
  },
  {
    icon: Users,
    title: "DAO GOVERNANCE",
    description:
      "Introduction of a DAO allowing mechanism empowers the community to vote on project decisions, ensuring that the future of agentX is in the hands of its users.",
  },
  {
    icon: Sprout,
    title: "ORGANIC EVOLUTION",
    description:
      "agentX evolves like a living organism, adapting to the needs of its community and responding to the changing environment of the crypto space.",
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
            <span className="text-primary text-glow">AgentX</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            AgentX Represents The Next Evolution In Cryptocurrency, Combining Cutting-Edge Blockchain
            Technology With Innovative Tokenomics Designed For Sustainable Growth.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
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
