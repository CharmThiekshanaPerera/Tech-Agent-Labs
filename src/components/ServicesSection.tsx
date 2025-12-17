import { 
  MessageSquare, 
  BarChart3, 
  Workflow, 
  PenTool, 
  Globe, 
  Users,
  TrendingUp,
  Settings,
  ArrowRight
} from "lucide-react";

const agents = [
  { 
    icon: MessageSquare, 
    title: "Support Agent", 
    description: "Handles customer inquiries 24/7. Resolves 80% of tickets automatically, escalates the rest.",
    tag: "Most Popular",
    emoji: "💬"
  },
  { 
    icon: TrendingUp, 
    title: "Marketing Agent", 
    description: "Creates campaigns, writes copy, analyzes performance, and optimizes spend in real-time.",
    tag: "High ROI",
    emoji: "📈"
  },
  { 
    icon: BarChart3, 
    title: "Analytics Agent", 
    description: "Transforms raw data into insights. Builds dashboards, spots trends, writes reports.",
    tag: null,
    emoji: "📊"
  },
  { 
    icon: Workflow, 
    title: "Operations Agent", 
    description: "Automates approvals, manages workflows, and keeps everything moving without bottlenecks.",
    tag: null,
    emoji: "⚙️"
  },
  { 
    icon: Users, 
    title: "Sales Agent", 
    description: "Qualifies leads, books meetings, follows up automatically. Never drops the ball.",
    tag: "Revenue Driver",
    emoji: "🤝"
  },
  { 
    icon: PenTool, 
    title: "Content Agent", 
    description: "Writes blogs, emails, social posts, and marketing copy that sounds like you—not a robot.",
    tag: null,
    emoji: "✍️"
  },
  { 
    icon: Globe, 
    title: "Web Agent", 
    description: "Updates content, manages SEO, monitors uptime. Your website stays fresh without the hassle.",
    tag: null,
    emoji: "🌐"
  },
  { 
    icon: Settings, 
    title: "Custom Agent", 
    description: "Need something unique? We build tailored AI agents for your specific workflows and needs.",
    tag: "Bespoke",
    emoji: "🛠️"
  },
];

const ServicesSection = () => {
  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="services" className="relative py-20 md:py-32">
      {/* Background Effect */}
      <div className="absolute inset-0 matrix-grid opacity-30" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-3">Our AI Agents Marketplace</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary text-glow">
            Pick an Agent. Deploy. Done. 🎉
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Production-ready workflow bots that handle real business tasks. 
            Buy plug-and-play, or let us customize one for you.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {agents.map((agent) => (
            <article
              key={agent.title}
              className="gradient-border rounded-2xl p-5 md:p-6 card-glow hover:card-glow-hover transition-all duration-300 hover:-translate-y-1 group relative"
            >
              {/* Tag */}
              {agent.tag && (
                <span className="absolute top-4 right-4 text-xs font-medium px-2 py-1 bg-primary/20 text-primary rounded-full border border-primary/30">
                  {agent.tag}
                </span>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <agent.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl">{agent.emoji}</span>
              </div>
              
              <h3 className="text-base md:text-lg font-bold text-foreground mb-2">
                {agent.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {agent.description}
              </p>
              
              <a 
                href="#contact"
                onClick={handleScrollToContact}
                className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </a>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Don't see what you need? <span className="text-foreground">We'll build it.</span>
          </p>
          <a
            href="#contact"
            onClick={handleScrollToContact}
            className="inline-flex items-center gap-2 px-6 py-3 gradient-border rounded-xl font-semibold text-foreground hover:bg-secondary/50 transition-all"
          >
            Request Custom Agent
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;