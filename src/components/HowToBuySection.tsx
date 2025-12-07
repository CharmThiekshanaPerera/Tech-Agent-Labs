import { ArrowRight } from "lucide-react";

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

const HowToBuySection = () => {
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
          {steps.map((step, index) => (
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
              XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            </code>
            <button
              className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center hover:bg-primary/20 transition-colors"
              onClick={() => navigator.clipboard.writeText("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")}
            >
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToBuySection;
