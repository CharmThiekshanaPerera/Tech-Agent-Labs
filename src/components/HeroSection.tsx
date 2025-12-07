import mascot from "@/assets/mascot.png";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      
      {/* Floating Particles */}
      <div className="absolute top-1/3 left-10 w-2 h-2 bg-primary/40 rounded-full animate-pulse-glow" />
      <div className="absolute top-1/2 right-20 w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-primary/50 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      {/* Cross decorations */}
      <div className="absolute top-1/4 left-8 text-primary/30 text-2xl font-light">+</div>
      <div className="absolute bottom-1/3 left-16 text-primary/20 text-xl font-light">+</div>
      <div className="absolute top-1/2 right-12 text-primary/25 text-2xl font-light">+</div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Title */}
          <h1 className="font-mono text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-up">
            <span className="text-primary text-glow-intense">agent</span>
            <span className="text-foreground">X</span>
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            JOIN THE FASTEST GROWING CRYPTOCURRENCY IN THE ECOSYSTEM. AGENTX MULTIPLIES YOUR 
            INVESTMENT THROUGH REVOLUTIONARY BLOCKCHAIN TECHNOLOGY.
          </p>

          {/* Price Cards */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="px-8 py-4 gradient-border rounded-xl">
              <p className="font-mono text-lg text-foreground">SOON....</p>
              <p className="text-muted-foreground text-xs mt-1">Current Price</p>
            </div>
            <div className="px-8 py-4 gradient-border rounded-xl">
              <p className="font-mono text-lg text-foreground">SOON....</p>
              <p className="text-muted-foreground text-xs mt-1">Current Price</p>
            </div>
          </div>

          {/* Mascot */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] scale-75" />
            <img
              src={mascot}
              alt="AgentX Mascot"
              className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-[0_0_30px_rgba(34,255,102,0.4)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
