import { Zap, Shield, Puzzle, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Deploy in Days, Not Months",
    description:
      "Our plug-and-play AI agents are production-ready from day one. No lengthy setup, no complex integrations—just results. Fast.",
    emoji: "⚡"
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description:
      "Bank-level encryption, SOC 2 compliance, and rock-solid uptime. Your data stays safe, and your workflows never stop.",
    emoji: "🔒"
  },
  {
    icon: Puzzle,
    title: "Fits Your Existing Stack",
    description:
      "Works seamlessly with Slack, Salesforce, HubSpot, Zendesk, Notion, and 100+ other tools you already use. Zero friction.",
    emoji: "🧩"
  },
  {
    icon: HeartHandshake,
    title: "Real Humans, Real Support",
    description:
      "We're not just a vendor—we're your partner. Get dedicated onboarding, training, and ongoing optimization from our team.",
    emoji: "🤝"
  },
];

const FeaturesSection = () => {
  return (
    <section id="about" className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-3 animate-fade-up">Why Teams Choose Us</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            AI Automation That
            <br />
            <span className="text-primary text-glow">Just Works</span> 🎯
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg animate-fade-up" style={{ animationDelay: '0.2s' }}>
            No buzzwords. No empty promises. Just reliable AI agents that save you time, 
            cut costs, and make your team more productive from day one.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group gradient-border rounded-2xl p-6 md:p-8 card-glow card-glow-hover transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Emoji & Icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl">{feature.emoji}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;