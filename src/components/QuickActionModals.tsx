import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, ShoppingCart, Wrench, Clock, Users, Zap, Check, ArrowRight, Star, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuickActionModalsProps {
  activeModal: "demo" | "buy" | "custom" | null;
  onClose: () => void;
}

const QuickActionModals = ({ activeModal, onClose }: QuickActionModalsProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");

  const handleBookDemo = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select a date and time",
        description: "Choose your preferred demo slot to continue.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Demo Booked! 🎉",
      description: `Your demo is scheduled for ${selectedDate} at ${selectedTime}. Check your email for confirmation.`,
    });
    onClose();
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleBuyAgent = () => {
    if (!selectedAgent) {
      toast({
        title: "Please select an agent",
        description: "Choose an agent to continue to checkout.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Redirecting to checkout... 🛒",
      description: `Preparing ${selectedAgent} for purchase.`,
    });
    onClose();
    setSelectedAgent("");
  };

  const handleCustomBuild = () => {
    toast({
      title: "Request Submitted! 🔧",
      description: "Our team will reach out within 24 hours to discuss your custom agent.",
    });
    onClose();
  };

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
  
  const agents = [
    { id: "support", name: "Support Agent", price: "$299/mo", popular: true },
    { id: "marketing", name: "Marketing Agent", price: "$349/mo", popular: false },
    { id: "analytics", name: "Analytics Agent", price: "$399/mo", popular: false },
    { id: "sales", name: "Sales Agent", price: "$449/mo", popular: true },
    { id: "operations", name: "Operations Agent", price: "$379/mo", popular: false },
  ];

  return (
    <>
      {/* Book Demo Modal */}
      <Dialog open={activeModal === "demo"} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Calendar className="w-5 h-5 text-primary" />
              Book a Demo
            </DialogTitle>
            <DialogDescription>
              See our AI agents in action with a personalized 30-minute demo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">30 min</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">1-on-1</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Live Demo</p>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Time (PST)</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                      selectedTime === time
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary border-border/50 hover:border-primary/50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleBookDemo} className="w-full" size="lg">
              <Calendar className="w-4 h-4 mr-2" />
              Confirm Demo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Buy Agent Modal */}
      <Dialog open={activeModal === "buy"} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Buy an Agent
            </DialogTitle>
            <DialogDescription>
              Choose an AI agent to supercharge your workflow
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.name)}
                className={`w-full p-4 rounded-xl border transition-all text-left relative ${
                  selectedAgent === agent.name
                    ? "bg-primary/10 border-primary"
                    : "bg-secondary/50 border-border/50 hover:border-primary/30"
                }`}
              >
                {agent.popular && (
                  <span className="absolute -top-2 right-3 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Popular
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">Full automation capabilities</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{agent.price}</p>
                    {selectedAgent === agent.name && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </div>
                </div>
              </button>
            ))}

            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" />
                <span>14-day free trial included</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" />
                <span>Cancel anytime, no questions asked</span>
              </div>
            </div>

            <Button onClick={handleBuyAgent} className="w-full" size="lg">
              Continue to Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Build Modal */}
      <Dialog open={activeModal === "custom"} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Wrench className="w-5 h-5 text-primary" />
              Custom Agent Build
            </DialogTitle>
            <DialogDescription>
              Get a tailored AI agent built specifically for your needs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Process Steps */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Discovery Call</p>
                  <p className="text-sm text-muted-foreground">We learn about your workflow and requirements</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Custom Design</p>
                  <p className="text-sm text-muted-foreground">Our team designs your personalized agent</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Build & Deploy</p>
                  <p className="text-sm text-muted-foreground">We build, test, and deploy your agent</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">4</span>
                </div>
                <div>
                  <p className="font-medium">Ongoing Support</p>
                  <p className="text-sm text-muted-foreground">Continuous optimization and maintenance</p>
                </div>
              </div>
            </div>

            {/* Pricing Info */}
            <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Starting from</span>
                <span className="text-2xl font-bold text-primary">$999</span>
              </div>
              <p className="text-xs text-muted-foreground">One-time build fee + monthly maintenance</p>
            </div>

            <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                Our team typically responds within <span className="text-foreground font-medium">24 hours</span>
              </p>
            </div>

            <Button onClick={handleCustomBuild} className="w-full" size="lg">
              <Wrench className="w-4 h-4 mr-2" />
              Request Custom Build
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActionModals;
