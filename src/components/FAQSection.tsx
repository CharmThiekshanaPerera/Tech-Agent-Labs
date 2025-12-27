import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    question: "What are AI Agents and how do they work?",
    answer: "AI Agents are autonomous software programs powered by artificial intelligence that can perform tasks, make decisions, and interact with systems on your behalf. Our agents use advanced machine learning algorithms to understand context, learn from interactions, and continuously improve their performance over time."
  },
  {
    question: "How long does it take to implement an AI Agent?",
    answer: "Implementation time varies based on complexity and customization needs. Standard agents can be deployed within 1-2 weeks, while custom solutions may take 4-6 weeks. We provide comprehensive onboarding and support throughout the process to ensure a smooth transition."
  },
  {
    question: "Can AI Agents integrate with my existing systems?",
    answer: "Yes! Our AI Agents are designed to integrate seamlessly with most popular business tools, CRMs, communication platforms, and custom software. We support APIs, webhooks, and direct integrations with platforms like Salesforce, HubSpot, Slack, and many more."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We offer 24/7 technical support, dedicated account managers, regular performance reviews, and continuous optimization services. Our team ensures your AI Agents are always performing at their best and adapting to your evolving business needs."
  },
  {
    question: "How secure is my data with AI Agents?",
    answer: "Security is our top priority. We implement enterprise-grade encryption, comply with GDPR and SOC 2 standards, and follow strict data handling protocols. Your data is never shared with third parties, and you maintain full ownership and control over all information processed by our agents."
  },
  {
    question: "What is the pricing model for AI Agents?",
    answer: "We offer flexible pricing models including per-agent licensing, usage-based pricing, and enterprise packages. Pricing depends on the type of agent, usage volume, and customization requirements. Contact us for a personalized quote tailored to your specific needs."
  },
  {
    question: "Can I customize the AI Agent's behavior?",
    answer: "Absolutely! Our agents are highly customizable. You can define specific workflows, set response templates, configure decision rules, and train agents on your unique business processes. We also offer custom development for specialized requirements."
  },
  {
    question: "How do I get started with Tech Agent Labs?",
    answer: "Getting started is easy! Simply schedule a consultation through our website, and our team will assess your needs, recommend the right agents for your business, and guide you through the implementation process. We also offer free demos to showcase our agents' capabilities."
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Find answers to common questions about our AI agents and services
          </p>
        </AnimatedSection>

        {/* FAQ Accordion */}
        <AnimatedSection className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-4 md:px-6 overflow-hidden data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-medium text-foreground hover:text-primary py-4 md:py-5 hover:no-underline [&[data-state=open]]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base pb-4 md:pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Contact our team for personalized assistance
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
