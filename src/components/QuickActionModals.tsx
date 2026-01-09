import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Wrench, Clock, Users, Zap, MessageSquare, Building2, Target, Cog, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuickActionModalsProps {
  activeModal: "demo" | "custom" | null;
  onClose: () => void;
}

const QuickActionModals = ({ activeModal, onClose }: QuickActionModalsProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  
  // Custom requirement form state
  const [customForm, setCustomForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    companySize: "",
    currentChallenges: "",
    desiredOutcome: "",
    existingSystems: "",
    budget: "",
    timeline: "",
    additionalNotes: "",
  });

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

  const handleCustomSubmit = () => {
    if (!customForm.companyName || !customForm.contactName || !customForm.email || !customForm.currentChallenges) {
      toast({
        title: "Please fill in required fields",
        description: "Company name, contact name, email, and current challenges are required.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Requirement Submitted! 🔧",
      description: "Our team will analyze your requirements and reach out within 24 hours.",
    });
    onClose();
    setCustomForm({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      industry: "",
      companySize: "",
      currentChallenges: "",
      desiredOutcome: "",
      existingSystems: "",
      budget: "",
      timeline: "",
      additionalNotes: "",
    });
  };

  const handleCustomFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCustomForm({ ...customForm, [e.target.name]: e.target.value });
  };

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

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

      {/* Custom Requirement Form Modal */}
      <Dialog open={activeModal === "custom"} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Wrench className="w-5 h-5 text-primary" />
              Custom Agent Requirements
            </DialogTitle>
            <DialogDescription>
              Tell us about your business needs and we'll design a tailored AI solution
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Company Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Building2 className="w-4 h-4" />
                Company Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={customForm.companyName}
                    onChange={handleCustomFormChange}
                    placeholder="Your company name"
                    className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Name *</label>
                  <input
                    type="text"
                    name="contactName"
                    value={customForm.contactName}
                    onChange={handleCustomFormChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={customForm.email}
                    onChange={handleCustomFormChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customForm.phone}
                    onChange={handleCustomFormChange}
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <select
                    name="industry"
                    value={customForm.industry}
                    onChange={handleCustomFormChange}
                    className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance & Banking</option>
                    <option value="retail">Retail & E-commerce</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="education">Education</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Size</label>
                  <select
                    name="companySize"
                    value={customForm.companySize}
                    onChange={handleCustomFormChange}
                    className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Target className="w-4 h-4" />
                Project Requirements
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Current Challenges *</label>
                <textarea
                  name="currentChallenges"
                  value={customForm.currentChallenges}
                  onChange={handleCustomFormChange}
                  placeholder="What problems are you trying to solve? What tasks take up too much time?"
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Desired Outcome</label>
                <textarea
                  name="desiredOutcome"
                  value={customForm.desiredOutcome}
                  onChange={handleCustomFormChange}
                  placeholder="What would success look like? What results do you expect from the AI agent?"
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Cog className="w-4 h-4" />
                Technical Details
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Existing Systems & Tools</label>
                <textarea
                  name="existingSystems"
                  value={customForm.existingSystems}
                  onChange={handleCustomFormChange}
                  placeholder="What software, CRM, or tools do you currently use that the agent should integrate with?"
                  rows={2}
                  className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={customForm.budget}
                    onChange={handleCustomFormChange}
                    className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-15k">$5,000 - $15,000</option>
                    <option value="15k-50k">$15,000 - $50,000</option>
                    <option value="50k+">$50,000+</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Timeline</label>
                  <select
                    name="timeline"
                    value={customForm.timeline}
                    onChange={handleCustomFormChange}
                    className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP</option>
                    <option value="1-month">Within 1 month</option>
                    <option value="1-3-months">1-3 months</option>
                    <option value="3-6-months">3-6 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <FileText className="w-4 h-4" />
                Additional Information
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  value={customForm.additionalNotes}
                  onChange={handleCustomFormChange}
                  placeholder="Any other details, questions, or specific requirements you'd like to share"
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                Our team typically responds within <span className="text-foreground font-medium">24 hours</span>
              </p>
            </div>

            <Button onClick={handleCustomSubmit} className="w-full" size="lg">
              <Wrench className="w-4 h-4 mr-2" />
              Submit Requirements
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActionModals;
