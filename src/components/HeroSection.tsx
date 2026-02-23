import logo from "@/assets/logo.png";
import { ArrowRight, Play, ShoppingCart, FileDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

const HeroSection = () => {
  const { trackCTAClick, trackDownload } = useAnalytics();

  const handleScrollToContact = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    trackCTAClick("Start a Demo", "Hero");
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScrollToServices = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    trackCTAClick("Browse Agents", "Hero");
    const element = document.querySelector("#services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDownload = () => {
    trackDownload("Tech_Agent_Labs_Project_Proposal.pdf");
  };

  return (
    <section id="home" aria-label="Hero Section - Meet Your AI Teammates" className="relative sm:min-h-screen flex items-start sm:items-center justify-center pt-14 sm:pt-20 pb-36 sm:pb-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-primary/10 rounded-full blur-[80px] sm:blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-accent/10 rounded-full blur-[60px] sm:blur-[100px]" />
      
      {/* Floating Particles - Hidden on mobile */}
      <div className="hidden sm:block absolute top-1/3 left-10 w-2 h-2 bg-primary/40 rounded-full animate-pulse-glow" />
      <div className="hidden sm:block absolute top-1/2 right-20 w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
      <div className="hidden sm:block absolute bottom-1/3 left-1/4 w-1 h-1 bg-primary/50 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      {/* Cross decorations - Hidden on mobile */}
      <div className="hidden md:block absolute top-1/4 left-8 text-primary/30 text-2xl font-light">+</div>
      <div className="hidden md:block absolute bottom-1/3 left-16 text-primary/20 text-xl font-light">+</div>
      <div className="hidden md:block absolute top-1/2 right-12 text-primary/25 text-2xl font-light">+</div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-up leading-tight" style={{ animationDelay: '0.1s' }}>
              <span className="text-foreground">Meet Your New</span>
              <br />
              <span className="text-primary text-glow-intense">AI Teammates</span>
            </h1>

            {/* Subtitle - Optimized for AEO/Voice Search */}
            <p className="hero-description text-muted-foreground text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-3 sm:mb-4 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
              We build, sell, and customize <strong className="text-foreground">production-ready AI agents</strong> that handle your busywork—so you can focus on what matters.
            </p>
            
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 animate-fade-up" style={{ animationDelay: '0.25s' }}>
              Sales. Support. Operations. Analytics. Internal tools. <br className="hidden sm:block" />
              <span className="text-primary">Deploy in days, not months.</span> ⚡
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-up [&>*]:w-full sm:[&>*]:w-auto" style={{ animationDelay: '0.3s' }}>
              <Button
                variant="glow"
                size="responsive"
                onClick={handleScrollToContact}
                className="group"
              >
                <Play className="group-hover:scale-110 transition-transform" />
                Start a Demo
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
              </Button>
              
              <Button
                variant="gradientBorder"
                size="responsive"
                onClick={handleScrollToServices}
                className="group"
              >
                <ShoppingCart className="group-hover:scale-110 transition-transform" />
                Browse Agents
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="download"
                size="responsive"
                asChild
              >
                <a
                  href="/documents/Tech_Agent_Labs_Project_Proposal.pdf"
                  download="Tech_Agent_Labs_Project_Proposal.pdf"
                  className="group"
                  onClick={handleDownload}
                >
                  <FileDown className="text-primary group-hover:scale-110 transition-transform" />
                  Download Proposal
                </a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 mb-8 sm:mb-0 px-8 sm:px-0 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">500+</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Agents Deployed</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">98%</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Client Satisfaction</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">24h</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Avg. Setup Time</p>
              </div>
            </div>
          </div>

          {/* Logo / Mascot */}
          <div className="flex-1 relative flex items-center justify-center order-1 lg:order-2">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] sm:blur-[100px] scale-75" />
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-[40px] sm:blur-[60px] animate-pulse-glow scale-90" />
              <img
                src={logo}
                alt="Tech Agent Labs AI Assistant - Your friendly automation partner"
                width={448}
                height={448}
                className="relative w-44 h-44 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] object-contain drop-shadow-[0_0_30px_rgba(34,255,102,0.5)] sm:drop-shadow-[0_0_50px_rgba(34,255,102,0.5)] hover:drop-shadow-[0_0_70px_rgba(34,255,102,0.7)] transition-all duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;