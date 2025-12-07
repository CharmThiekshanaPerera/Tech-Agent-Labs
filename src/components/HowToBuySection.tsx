import { ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const steps = [
  {
    number: "1",
    title: "Create Phantom Wallet",
    description:
      "Download and install the Phantom wallet extension for your browser. This will be your gateway to the Solana ecosystem.",
    cta: "GET PHANTOM",
    link: "#",
  },
  {
    number: "2",
    title: "Get SOL",
    description:
      "Purchase SOL from your preferred exchange and transfer it to your Phantom wallet address.",
    cta: "VIEW EXCHANGES",
    link: "#",
  },
  {
    number: "3",
    title: "Connect To Raydium",
    description:
      "Visit Raydium and connect your Phantom wallet to start trading.",
    cta: "GO TO RAYDIUM",
    link: "#",
  },
  {
    number: "4",
    title: "Swap For $EVOLVE",
    description:
      "Copy and paste the contract address below and simply swap your SOL for $EVOLVE tokens.",
    cta: null,
    link: null,
  },
];

const CONTRACT_ADDRESS = "AgentX7k9mNp3qRs5tUv8wXy2zAb4cDe6fGh8iJkLmNo";

const HowToBuySection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Contract address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="howtobuy" className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary text-glow">
            How To Buy
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Follow these simple steps to join the agentX community and start your
            journey to financial growth.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="gradient-border rounded-2xl p-6 md:p-8 card-glow hover:card-glow-hover transition-all duration-300 hover:-translate-y-1"
            >
              {/* Step Number */}
              <span className="font-mono text-4xl md:text-5xl font-bold text-primary/30 mb-4 block">
                {step.number}
              </span>

              {/* Title */}
              <h3 className="font-mono text-lg md:text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {step.description}
              </p>

              {/* CTA */}
              {step.cta && (
                <a
                  href={step.link}
                  className="inline-flex items-center gap-2 text-primary font-mono text-sm font-semibold hover:gap-3 transition-all"
                >
                  {step.cta}
                  <ArrowRight size={16} />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Contract Address */}
        <div className="mt-16 max-w-xl mx-auto text-center">
          <h3 className="font-mono text-xl md:text-2xl font-bold text-foreground mb-6">
            Contract Address
          </h3>
          <div className="gradient-border rounded-xl p-4 flex items-center justify-between gap-4">
            <code className="font-mono text-xs md:text-sm text-muted-foreground truncate">
              {CONTRACT_ADDRESS}
            </code>
            <button
              onClick={handleCopy}
              className={`shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                copied 
                  ? "bg-primary/20 border-primary/50 text-primary" 
                  : "bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary"
              }`}
            >
              {copied ? (
                <Check className="w-4 h-4 animate-scale-in" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToBuySection;
