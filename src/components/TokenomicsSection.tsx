import { Droplets, Flame, Coins, Lock } from "lucide-react";

const stats = [
  { icon: Droplets, value: "20%", label: "Liquidity Providers" },
  { icon: Flame, value: "100%", label: "LP Burned" },
  { icon: Coins, value: "1B", label: "Total Supply" },
  { icon: Lock, value: "80%", label: "Liquidity Pool" },
];

const TokenomicsSection = () => {
  return (
    <section id="tokenomics" className="relative py-20 md:py-32">
      {/* Background Effect */}
      <div className="absolute inset-0 matrix-grid opacity-30" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary text-glow">
            Tokenomics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Our Tokenomics Are Designed To Create A Sustainable Ecosystem With Strong
            Liquidity Backing And Fair Distribution.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="gradient-border rounded-2xl p-6 text-center card-glow hover:card-glow-hover transition-all duration-300"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-mono text-2xl md:text-3xl font-bold text-foreground mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-xs md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Fair Launch Card */}
        <div className="max-w-xl mx-auto">
          <div className="gradient-border rounded-2xl p-6 md:p-8 text-center card-glow">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-mono text-xl md:text-2xl font-bold text-foreground mb-4">
              Fair Launch &<br />Distribution
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              With 80% of tokens locked in the liquidity pool and 100% of LP
              tokens burned, we ensure maximum security and fair trading
              conditions for all participants.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;
