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
    <section id="about" className="relative py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <p className="text-primary font-medium text-sm sm:text-base mb-2 sm:mb-3 animate-fade-up">Why Teams Choose Us</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            AI Automation That
            <br />
            <span className="text-primary text-glow">Just Works</span> 🎯
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg animate-fade-up px-2" style={{ animationDelay: '0.2s' }}>
            No buzzwords. No empty promises. Just reliable AI agents that save you time, 
            cut costs, and make your team more productive from day one.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group gradient-border rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 card-glow card-glow-hover transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Emoji & Icon */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <span className="text-xl sm:text-2xl">{feature.emoji}</span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
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