import { Check, Zap, Crown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "$99",
    period: "/month",
    description: "Perfect for small businesses getting started with AI automation",
    features: [
      "1 AI Agent",
      "Up to 1,000 interactions/month",
      "Email support",
      "Basic analytics",
      "Standard integrations",
      "24-hour response time"
    ],
    notIncluded: [
      "Custom workflows",
      "Priority support",
      "Advanced analytics"
    ],
    buttonText: "Get Started",
    popular: false
  },
  {
    name: "Professional",
    icon: Crown,
    price: "$299",
    period: "/month",
    description: "Ideal for growing teams needing multiple AI agents",
    features: [
      "5 AI Agents",
      "Up to 10,000 interactions/month",
      "Priority email & chat support",
      "Advanced analytics dashboard",
      "Custom integrations",
      "Custom workflows",
      "4-hour response time",
      "API access"
    ],
    notIncluded: [
      "Dedicated account manager"
    ],
    buttonText: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "",
    description: "For large organizations with complex requirements",
    features: [
      "Unlimited AI Agents",
      "Unlimited interactions",
      "24/7 dedicated support",
      "Real-time analytics & reporting",
      "Enterprise integrations",
      "Custom AI training",
      "1-hour response time",
      "Dedicated account manager",
      "SLA guarantee",
      "On-premise deployment option"
    ],
    notIncluded: [],
    buttonText: "Contact Sales",
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-48 h-48 md:w-80 md:h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 md:w-80 md:h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your <span className="text-primary">Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Flexible pricing options designed to scale with your business needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={index}
                className={`relative bg-card border rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/10 scale-[1.02] lg:scale-105"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${
                    plan.popular ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <IconComponent className={`w-7 h-7 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl md:text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full py-6 text-base font-medium ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Money-back guarantee */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            ✨ 14-day free trial on all plans • No credit card required • Cancel anytime
          </p>
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-16 md:mt-24">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            Feature Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-foreground font-semibold">Features</th>
                  <th className="text-center py-4 px-4 text-foreground font-semibold">Starter</th>
                  <th className="text-center py-4 px-4 text-primary font-semibold">Professional</th>
                  <th className="text-center py-4 px-4 text-foreground font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { feature: "AI Agents", starter: "1", pro: "5", enterprise: "Unlimited" },
                  { feature: "Monthly Interactions", starter: "1,000", pro: "10,000", enterprise: "Unlimited" },
                  { feature: "Custom Workflows", starter: false, pro: true, enterprise: true },
                  { feature: "Advanced Analytics", starter: false, pro: true, enterprise: true },
                  { feature: "API Access", starter: false, pro: true, enterprise: true },
                  { feature: "Priority Support", starter: false, pro: true, enterprise: true },
                  { feature: "Dedicated Manager", starter: false, pro: false, enterprise: true },
                  { feature: "Custom AI Training", starter: false, pro: false, enterprise: true },
                  { feature: "SLA Guarantee", starter: false, pro: false, enterprise: true },
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 text-foreground/80 text-sm md:text-base">{row.feature}</td>
                    <td className="text-center py-4 px-4">
                      {typeof row.starter === "boolean" ? (
                        row.starter ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        <span className="text-foreground/80 text-sm">{row.starter}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        <span className="text-foreground/80 text-sm font-medium">{row.pro}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        <span className="text-foreground/80 text-sm">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
