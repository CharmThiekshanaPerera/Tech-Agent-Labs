import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ArrowRight,
  ExternalLink,
  Star
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface AgentDetail {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string | null;
  emoji: string;
  fullDescription: string;
  features: string[];
  howItWorks: { step: number; title: string; description: string }[];
  stats: { label: string; value: string }[];
  youtubeId: string;
  image: string;
  pricing: string;
  setupTime: string;
}

interface AgentDetailModalProps {
  agent: AgentDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onContactClick: () => void;
}

const AgentDetailModal = ({ agent, isOpen, onClose, onContactClick }: AgentDetailModalProps) => {
  if (!agent) return null;

  const IconComponent = agent.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <IconComponent className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {agent.emoji} {agent.title}
                </DialogTitle>
                {agent.tag && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {agent.tag}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{agent.description}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {/* Agent Image & Video */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Agent Illustration */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/30 border border-border/50 p-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-[60px] scale-50" />
              <img 
                src={agent.image} 
                alt={`${agent.title} illustration`}
                className="relative w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-[0_0_30px_rgba(34,255,102,0.4)] animate-float"
              />
            </div>
            
            {/* Video Preview */}
            <div className="relative rounded-xl overflow-hidden bg-secondary/30 border border-border/50">
              <div className="aspect-video h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${agent.youtubeId}`}
                  title={`${agent.title} Demo Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agent.stats.map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-secondary/30 border border-border/50">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Full Description */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              About This Agent
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {agent.fullDescription}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Key Features
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {agent.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 border border-border/30">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              How It Works
            </h3>
            <div className="space-y-4">
              {agent.howItWorks.map((step) => (
                <div key={step.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">{step.step}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{step.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Setup time: {agent.setupTime}</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                Starting at <span className="text-primary">{agent.pricing}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${agent.youtubeId}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Watch Full Demo
              </Button>
              <Button 
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  onClose();
                  onContactClick();
                }}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentDetailModal;
