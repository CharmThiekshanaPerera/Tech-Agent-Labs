import { useState } from "react";
import { Mail, Phone, MapPin, Send, Check, Calendar, ShoppingCart, Wrench } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QuickActionModals from "./QuickActionModals";
import { AnimatedSection } from "@/hooks/useScrollAnimation";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeModal, setActiveModal] = useState<"demo" | "buy" | "custom" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Message received! 🎉",
      description: "We'll get back to you within a few hours. Talk soon!",
    });
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", company: "", interest: "", message: "" });
    }, 3000);
  };

  return (
    <section id="contact" className="relative py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
          <p className="text-primary font-medium text-sm sm:text-base mb-2 sm:mb-3">Let's Talk</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Ready to Get
            <br />
            <span className="text-primary text-glow">Started?</span> 💬
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2">
            Whether you want a demo, need pricing info, or have questions about custom agents—
            we're here to help. No pressure, just answers.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <AnimatedSection animation="fade-right" className="space-y-4 sm:space-y-6">
            <div className="gradient-border rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 card-glow">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
                Get in Touch 👋
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Email us anytime</p>
                    <a href="mailto:info@techagentlabs.com" className="text-foreground hover:text-primary transition-colors font-medium text-sm sm:text-base">
                      info@techagentlabs.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Call or WhatsApp</p>
                    <a href="tel:+94789587000" className="text-foreground hover:text-primary transition-colors font-medium text-sm sm:text-base">
                      078 95 87 000
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Our Location</p>
                    <p className="text-foreground text-sm sm:text-base">
                      27/14 Ananda Rajakaruna Road,<br />Colombo 10, Sri Lanka 🇱🇰
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="gradient-border rounded-xl sm:rounded-2xl p-4 sm:p-6 card-glow">
              <h4 className="text-xs sm:text-sm font-semibold text-primary mb-3 sm:mb-4">Quick Actions</h4>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button 
                  onClick={() => setActiveModal("demo")}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium bg-secondary border border-border/50 rounded-lg hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span className="hidden sm:inline">Book</span> Demo
                </button>
                <button 
                  onClick={() => setActiveModal("buy")}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium bg-secondary border border-border/50 rounded-lg hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span className="hidden sm:inline">Buy</span> Agent
                </button>
                <button 
                  onClick={() => setActiveModal("custom")}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium bg-secondary border border-border/50 rounded-lg hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  Custom
                </button>
              </div>
            </div>

            <QuickActionModals activeModal={activeModal} onClose={() => setActiveModal(null)} />

            {/* Response Time */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                ⚡ <span className="text-foreground font-medium">Average response time: 2 hours</span> during business hours
              </p>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection animation="fade-left" delay={200}>
            <div className="gradient-border rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 card-glow">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">
              Send Us a Message
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">
              Fill out the form and we'll be in touch shortly. No spam, ever.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors text-sm"
                    placeholder="Jane Smith"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors text-sm"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="company" className="block text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors text-sm"
                    placeholder="Acme Inc."
                  />
                </div>
                
                <div>
                  <label htmlFor="interest" className="block text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    I'm interested in...
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors text-sm"
                  >
                    <option value="">Select one...</option>
                    <option value="demo">Starting a Demo</option>
                    <option value="buy">Buying an Agent</option>
                    <option value="custom">Custom Agent Build</option>
                    <option value="pricing">Pricing Info</option>
                    <option value="other">Something Else</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                  How can we help? *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors resize-none text-sm"
                  placeholder="Tell us about your workflow challenges or what you're looking to automate..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`w-full py-3 sm:py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                  isSubmitted
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 card-glow"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    Send Message
                  </>
                )}
              </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;