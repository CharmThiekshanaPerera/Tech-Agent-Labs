import { useState, useRef, useEffect, useCallback } from "react";
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
import { useAnalytics } from "@/hooks/useAnalytics";

// Agent images
import supportAgentImg from "@/assets/agents/support-agent.png";
import marketingAgentImg from "@/assets/agents/marketing-agent.png";
import analyticsAgentImg from "@/assets/agents/analytics-agent.png";
import operationsAgentImg from "@/assets/agents/operations-agent.png";
import salesAgentImg from "@/assets/agents/sales-agent.png";
import contentAgentImg from "@/assets/agents/content-agent.png";
import webAgentImg from "@/assets/agents/web-agent.png";
import customAgentImg from "@/assets/agents/custom-agent.png";
import AgentDetailModal from "./AgentDetailModal";

const agents = [
  { 
    icon: MessageSquare, 
    title: "Support Agent", 
    description: "Handles customer inquiries 24/7. Resolves 80% of tickets automatically, escalates the rest.",
    tag: "Most Popular",
    emoji: "💬",
    fullDescription: "Our Support Agent is your tireless customer service representative that never sleeps. Powered by advanced natural language processing, it understands customer intent, provides accurate answers from your knowledge base, and seamlessly escalates complex issues to human agents when needed. It learns from every interaction, continuously improving its responses and customer satisfaction rates.",
    features: [
      "24/7 instant response to customer inquiries",
      "Multi-language support (50+ languages)",
      "Smart ticket routing and prioritization",
      "Integration with Zendesk, Intercom, Freshdesk",
      "Sentiment analysis and escalation triggers",
      "Custom knowledge base training"
    ],
    howItWorks: [
      { step: 1, title: "Connect Your Channels", description: "Integrate with email, chat, social media, or your existing helpdesk in minutes." },
      { step: 2, title: "Train on Your Data", description: "Upload FAQs, docs, and past tickets. The agent learns your brand voice and products." },
      { step: 3, title: "Go Live", description: "Deploy instantly. The agent handles inquiries while you monitor and refine responses." },
      { step: 4, title: "Continuous Learning", description: "The agent improves over time based on feedback and new information." }
    ],
    stats: [
      { label: "Avg. Resolution Rate", value: "80%" },
      { label: "Response Time", value: "<3s" },
      { label: "Cost Savings", value: "65%" },
      { label: "CSAT Improvement", value: "+25%" }
    ],
    youtubeId: "dQw4w9WgXcQ",
    image: supportAgentImg,
    pricing: "$299/mo",
    setupTime: "24-48 hours"
  },
  { 
    icon: TrendingUp, 
    title: "Marketing Agent", 
    description: "Creates campaigns, writes copy, analyzes performance, and optimizes spend in real-time.",
    tag: "High ROI",
    emoji: "📈",
    fullDescription: "The Marketing Agent is your AI-powered growth partner that handles everything from campaign ideation to performance optimization. It creates compelling ad copy, A/B tests messaging automatically, and reallocates budget to top-performing channels in real-time. Say goodbye to guesswork and hello to data-driven marketing at scale.",
    features: [
      "AI-generated ad copy and creative concepts",
      "Automated A/B testing and optimization",
      "Real-time budget allocation across channels",
      "Competitor monitoring and insights",
      "SEO content suggestions and keyword tracking",
      "Social media scheduling and engagement"
    ],
    howItWorks: [
      { step: 1, title: "Connect Ad Accounts", description: "Link Google Ads, Meta, LinkedIn, and other platforms for unified management." },
      { step: 2, title: "Set Your Goals", description: "Define KPIs like CPA, ROAS, or lead volume. The agent optimizes toward your targets." },
      { step: 3, title: "Launch Campaigns", description: "Let the agent create and launch campaigns, or approve drafts before they go live." },
      { step: 4, title: "Watch It Optimize", description: "The agent continuously tests, learns, and improves performance 24/7." }
    ],
    stats: [
      { label: "Avg. ROAS Lift", value: "40%" },
      { label: "Time Saved", value: "20h/wk" },
      { label: "Campaigns/Month", value: "100+" },
      { label: "Ad Spend Managed", value: "$5M+" }
    ],
    youtubeId: "dQw4w9WgXcQ",
    image: marketingAgentImg,
    pricing: "$499/mo",
    setupTime: "1-2 days"
  },
  { 
    icon: BarChart3, 
    title: "Analytics Agent", 
    description: "Transforms raw data into insights. Builds dashboards, spots trends, writes reports.",
    tag: null,
    emoji: "📊",
    fullDescription: "Stop drowning in data and start making decisions. The Analytics Agent connects to your databases, CRMs, and tools to automatically surface insights that matter. It builds interactive dashboards, detects anomalies before they become problems, and writes executive summaries in plain English. Data-driven decision making, without the data science degree.",
    features: [
      "Automated dashboard creation and updates",
      "Natural language data queries (ask questions in plain English)",
      "Anomaly detection and proactive alerts",
      "Scheduled reports delivered to your inbox",
      "Cross-platform data unification",
      "Predictive analytics and forecasting"
    ],
    howItWorks: [
      { step: 1, title: "Connect Data Sources", description: "Integrate with databases, spreadsheets, CRMs, and analytics tools securely." },
      { step: 2, title: "Define Key Metrics", description: "Tell the agent what matters—revenue, churn, engagement, or custom KPIs." },
      { step: 3, title: "Ask Questions", description: "Query your data in plain English. Get charts, tables, and insights instantly." },
      { step: 4, title: "Automate Reporting", description: "Schedule daily, weekly, or monthly reports sent to stakeholders automatically." }
    ],
    stats: [
      { label: "Data Sources", value: "50+" },
      { label: "Report Time", value: "5min" },
      { label: "Accuracy", value: "99.5%" },
      { label: "Insights/Week", value: "30+" }
    ],
    youtubeId: "dQw4w9WgXcQ",
    image: analyticsAgentImg,
    pricing: "$399/mo",
    setupTime: "2-3 days"
  },
  { 
    icon: Workflow, 
    title: "Operations Agent", 
    description: "Automates approvals, manages workflows, and keeps everything moving without bottlenecks.",
    tag: null,
    emoji: "⚙️",
    fullDescription: "Bottlenecks kill productivity. The Operations Agent eliminates them by automating repetitive workflows, routing approvals intelligently, and keeping projects on track. From purchase orders to employee onboarding, it handles the operational grunt work so your team can focus on high-value activities. Think of it as your always-on operations manager.",
    features: [
      "Automated approval workflows with smart routing",
      "Task assignment and deadline tracking",
      "Process bottleneck identification",
      "Integration with Slack, Teams, and email",
      "Custom workflow builder (no code)",
      "Compliance and audit trail logging"
    ],
    howItWorks: [
      { step: 1, title: "Map Your Workflows", description: "Define your processes using our visual builder or describe them in plain English." },
      { step: 2, title: "Set Rules & Triggers", description: "Configure when workflows start, who approves what, and escalation paths." },
      { step: 3, title: "Deploy & Monitor", description: "Launch workflows and track progress through a unified dashboard." },
      { step: 4, title: "Optimize Over Time", description: "The agent identifies inefficiencies and suggests improvements automatically." }
    ],
    stats: [
      { label: "Process Time", value: "-70%" },
      { label: "Error Reduction", value: "95%" },
      { label: "Workflows Active", value: "500+" },
      { label: "Actions/Day", value: "10K+" }
    ],
    youtubeId: "dQw4w9WgXcQ",
    image: operationsAgentImg,
    pricing: "$349/mo",
    setupTime: "1-2 days"
  },
  { 
    icon: Users, 
    title: "Sales Agent", 
    description: "Qualifies leads, books meetings, follows up automatically. Never drops the ball.",
    tag: "Revenue Driver",
    emoji: "🤝",
    fullDescription: "Your sales team is great at closing—but lead qualification and follow-up eat up their time. The Sales Agent handles the top of your funnel, engaging prospects instantly, qualifying them against your criteria, booking meetings on reps' calendars, and nurturing leads until they're ready to buy. It's like hiring 10 SDRs who work 24/7 without breaks.",
    features: [
      "Instant lead response (under 60 seconds)",
      "Intelligent lead scoring and qualification",
      "Automated calendar booking with reps",
      "Personalized follow-up sequences",
      "CRM integration (Salesforce, HubSpot, Pipedrive)",
      "Conversation intelligence and call summaries"
    ],
    howItWorks: [
      { step: 1, title: "Define Your ICP", description: "Set qualification criteria—company size, industry, budget, timeline, etc." },
      { step: 2, title: "Connect Lead Sources", description: "Integrate with your website, ads, LinkedIn, and CRM for unified lead capture." },
      { step: 3, title: "Engage & Qualify", description: "The agent reaches out, asks discovery questions, and scores leads automatically." },
      { step: 4, title: "Book & Handoff", description: "Qualified leads get booked on sales reps' calendars with full context." }
    ],
    stats: [
      { label: "Lead Response", value: "<60s" },
      { label: "Qualification Rate", value: "3x" },
      { label: "Meetings Booked", value: "+150%" },
      { label: "Pipeline Value", value: "+$2M" }
    ],
    youtubeId: "dQw4w9WgXcQ",
    image: salesAgentImg,
    pricing: "$599/mo",
    setupTime: "24 hours"
  },
  { 
    icon: PenTool, 
    title: "Content Agent", 
    description: "Writes blogs, emails, social posts, and marketing copy that sounds like you—not a robot.",
    tag: null,
    emoji: "✍️",
    fullDescription: "Great content drives traffic, builds trust, and converts leads—but creating it is time-consuming. The Content Agent writes in your brand voice, producing blog posts, email campaigns, social media content, and marketing copy at scale. It researches topics, optimizes for SEO, and maintains consistency across all your channels. Your content engine, supercharged.",
    features: [
      "Blog posts optimized for SEO",
      "Email campaigns with personalization",
      "Social media content calendar",
      "Brand voice training and consistency",
      "Plagiarism and fact-checking",
      "Multi-format content (long-form, snippets, threads)"
    ],
    howItWorks: [
      { step: 1, title: "Train Your Voice", description: "Upload existing content so the agent learns your tone, style, and messaging." },
      { step: 2, title: "Set Content Goals", description: "Define topics, keywords, posting frequency, and target audiences." },
      { step: 3, title: "Generate & Review", description: "The agent creates drafts. You approve, edit, or request revisions." },
      { step: 4, title: "Publish & Analyze", description: "Content goes live automatically. The agent tracks performance and optimizes." }
    ],
    stats: [
      { label: "Content/Week", value: "50+" },
      { label: "Time Saved", value: "30h" },
      { label: "SEO Rankings", value: "+45%" },
      { label: "Engagement", value: "+60%" }
    ],
    youtubeId: "dQw4w9WgXcQ",
    image: contentAgentImg,
    pricing: "$249/mo",
    setupTime: "Same day"
  },
  { 
    icon: Globe, 
    title: "Web Agent", 
    description: "Updates content, manages SEO, monitors uptime. Your website stays fresh without the hassle.",
    tag: null,
    emoji: "🌐",
    fullDescription: "Your website is your digital storefront—it should always be fast, fresh, and optimized. The Web Agent handles routine updates, monitors performance and uptime, fixes SEO issues, and ensures your site ranks well. It's like having a dedicated webmaster who never sleeps, catching problems before your customers do.",
    features: [
      "Automated content updates and publishing",
      "SEO monitoring and optimization",
      "Uptime monitoring with instant alerts",
      "Page speed optimization suggestions",
      "Broken link detection and fixing",
      "Security vulnerability scanning"
    ],
    howItWorks: [
      { step: 1, title: "Connect Your Site", description: "Integrate with WordPress, Webflow, Shopify, or custom CMS platforms." },
      { step: 2, title: "Set Monitoring Rules", description: "Define what to track—uptime, speed, rankings, security, content freshness." },
      { step: 3, title: "Automate Updates", description: "Schedule content changes, or let the agent make updates based on triggers." },
      { step: 4, title: "Get Alerts & Reports", description: "Receive instant alerts for issues and weekly performance summaries." }
    ],
    stats: [
      { label: "Uptime", value: "99.9%" },
      { label: "Page Speed", value: "+40%" },
      { label: "SEO Score", value: "95+" },
      { label: "Issues Fixed", value: "500+" }
    ],
    youtubeId: "dQw4w9WgXcQ",
    image: webAgentImg,
    pricing: "$199/mo",
    setupTime: "Same day"
  },
  { 
    icon: Settings, 
    title: "Custom Agent", 
    description: "Need something unique? We build tailored AI agents for your specific workflows and needs.",
    tag: "Bespoke",
    emoji: "🛠️",
    fullDescription: "Sometimes off-the-shelf isn't enough. Our Custom Agent service builds AI agents tailored to your exact specifications. Whether it's a unique industry workflow, proprietary data integration, or a combination of multiple capabilities, we architect and deploy agents that fit your business like a glove. Enterprise-grade, fully customized, completely yours.",
    features: [
      "Custom workflow design and implementation",
      "Proprietary data and system integration",
      "Industry-specific compliance (HIPAA, SOC2, etc.)",
      "Dedicated support and SLA",
      "White-label deployment options",
      "Ongoing maintenance and updates"
    ],
    howItWorks: [
      { step: 1, title: "Discovery Call", description: "We learn about your unique challenges, workflows, and goals in detail." },
      { step: 2, title: "Solution Design", description: "Our team architects a custom agent tailored to your specifications." },
      { step: 3, title: "Build & Test", description: "We develop, test, and refine the agent with your input at every stage." },
      { step: 4, title: "Deploy & Support", description: "Launch with confidence. We provide ongoing support and enhancements." }
    ],
    stats: [
      { label: "Projects Delivered", value: "200+" },
      { label: "Client Retention", value: "98%" },
      { label: "Avg. ROI", value: "400%" },
      { label: "Support", value: "24/7" }
    ],
    youtubeId: "dQw4w9WgXcQ",
    image: customAgentImg,
    pricing: "Custom",
    setupTime: "2-4 weeks"
  },
];

// Agent Card component with view tracking
const AgentCard = ({ 
  agent, 
  onOpenModal,
  onView,
  onCardClick 
}: { 
  agent: typeof agents[0]; 
  onOpenModal: (agent: typeof agents[0]) => void;
  onView: (name: string) => void;
  onCardClick: (name: string) => void;
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedView.current) {
            hasTrackedView.current = true;
            onView(agent.title);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [agent.title, onView]);

  const handleClick = () => {
    onCardClick(agent.title);
    onOpenModal(agent);
  };

  return (
    <article
      ref={cardRef}
      className="gradient-border rounded-2xl p-5 md:p-6 card-glow hover:card-glow-hover transition-all duration-300 hover:-translate-y-1 group relative cursor-pointer"
      onClick={handleClick}
      aria-label={`${agent.title} - ${agent.description}. Click to learn more.`}
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
      
      <button 
        className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        aria-label={`Learn more about ${agent.title}`}
      >
        Learn More <ArrowRight className="w-4 h-4" />
      </button>
    </article>
  );
};

const ServicesSection = () => {
  const { trackAgentView, trackAgentClick, trackCTAClick } = useAnalytics();
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAgentView = useCallback((agentName: string) => {
    trackAgentView(agentName);
  }, [trackAgentView]);

  const handleAgentClick = useCallback((agentName: string) => {
    trackAgentClick(agentName);
  }, [trackAgentClick]);

  const handleScrollToContact = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) e.preventDefault();
    trackCTAClick("Get Started", "Services Section");
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenModal = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
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
            <AgentCard
              key={agent.title}
              agent={agent}
              onOpenModal={handleOpenModal}
              onView={handleAgentView}
              onCardClick={handleAgentClick}
            />
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

      {/* Agent Detail Modal */}
      <AgentDetailModal 
        agent={selectedAgent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onContactClick={() => handleScrollToContact()}
      />
    </section>
  );
};

export default ServicesSection;
