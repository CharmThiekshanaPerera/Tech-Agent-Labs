import mascot from "@/assets/mascot.png";
import { ArrowRight, Play, ShoppingCart } from "lucide-react";

const HeroSection = () => {
  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector("#services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
      
      {/* Floating Particles */}
      <div className="absolute top-1/3 left-10 w-2 h-2 bg-primary/40 rounded-full animate-pulse-glow" />
      <div className="absolute top-1/2 right-20 w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-primary/50 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      {/* Cross decorations */}
      <div className="absolute top-1/4 left-8 text-primary/30 text-2xl font-light">+</div>
      <div className="absolute bottom-1/3 left-16 text-primary/20 text-xl font-light">+</div>
      <div className="absolute top-1/2 right-12 text-primary/25 text-2xl font-light">+</div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 animate-fade-up">
              <span className="text-lg">🚀</span>
              <span className="text-primary text-sm font-medium">AI Agents That Actually Work</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-fade-up leading-tight" style={{ animationDelay: '0.1s' }}>
              <span className="text-foreground">Meet Your New</span>
              <br />
              <span className="text-primary text-glow-intense">AI Teammates</span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-4 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
              We build, sell, and customize <strong className="text-foreground">production-ready AI agents</strong> that handle your busywork—so you can focus on what matters.
            </p>
            
            <p className="text-muted-foreground text-base max-w-xl mb-8 animate-fade-up" style={{ animationDelay: '0.25s' }}>
              Sales. Support. Operations. Analytics. Internal tools. <br className="hidden sm:block" />
              <span className="text-primary">Deploy in days, not months.</span> ⚡
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <a
                href="#contact"
                onClick={handleScrollToContact}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all card-glow group"
              >
                <Play className="w-5 h-5" />
                Start a Demo
              </a>
              <a
                href="#services"
                onClick={handleScrollToServices}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-border rounded-xl font-semibold text-foreground hover:bg-secondary/50 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                Browse Agents
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 mt-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary">500+</p>
                <p className="text-muted-foreground text-sm">Agents Deployed</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary">98%</p>
                <p className="text-muted-foreground text-sm">Client Satisfaction</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary">24h</p>
                <p className="text-muted-foreground text-sm">Avg. Setup Time</p>
              </div>
            </div>
          </div>

          {/* Mascot */}
          <div className="flex-1 relative animate-float">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] scale-75" />
            <img
              src={mascot}
              alt="Tech Agent Labs AI Assistant - Your friendly automation partner"
              className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-[0_0_40px_rgba(34,255,102,0.4)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;