import { 
  MessageSquare, 
  BarChart3, 
  Workflow, 
  PenTool, 
  Globe, 
  Users,
  TrendingUp,
  Settings
} from "lucide-react";

const services = [
  { 
    icon: MessageSquare, 
    title: "Customer Support", 
    description: "Automate responses, handle inquiries 24/7, and escalate complex issues intelligently." 
  },
  { 
    icon: TrendingUp, 
    title: "Marketing Automation", 
    description: "Create campaigns, analyze performance, and optimize strategies in real-time." 
  },
  { 
    icon: BarChart3, 
    title: "Data Analytics", 
    description: "Process vast amounts of data, generate insights, and create actionable reports." 
  },
  { 
    icon: Workflow, 
    title: "Workflow Automation", 
    description: "Streamline repetitive tasks, manage approvals, and orchestrate complex processes." 
  },
  { 
    icon: Users, 
    title: "Sales Assistance", 
    description: "Qualify leads, schedule meetings, and provide personalized follow-ups automatically." 
  },
  { 
    icon: PenTool, 
    title: "Content Creation", 
    description: "Generate blogs, social posts, emails, and marketing copy that matches your brand voice." 
  },
  { 
    icon: Globe, 
    title: "Website Management", 
    description: "Update content, manage SEO, and keep your digital presence fresh without manual work." 
  },
  { 
    icon: Settings, 
    title: "Internal Processes", 
    description: "Handle HR tasks, document management, and internal communications effortlessly." 
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="relative py-20 md:py-32">
      {/* Background Effect */}
      <div className="absolute inset-0 matrix-grid opacity-30" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary text-glow">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Agent X automates critical business functions without human supervision, 
            letting you focus on growth while we handle the rest.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="gradient-border rounded-2xl p-5 md:p-6 card-glow hover:card-glow-hover transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-mono text-sm md:text-base font-bold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
