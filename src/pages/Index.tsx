import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SEOHead from "@/components/seo/SEOHead";
import { useScrollDepthTracking } from "@/hooks/useAnalytics";

// Lazy-load below-the-fold sections for reduced initial JS bundle
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const StatsSection = lazy(() => import("@/components/StatsSection"));
const PartnersSection = lazy(() => import("@/components/PartnersSection"));
const GrowthSection = lazy(() => import("@/components/GrowthSection"));
const HowToBuySection = lazy(() => import("@/components/HowToBuySection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const BlogSection = lazy(() => import("@/components/BlogSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));
const SocialMediaWidget = lazy(() => import("@/components/SocialMediaWidget"));
const ScrollToTopButton = lazy(() => import("@/components/ScrollToTopButton"));
const ChatBot = lazy(() => import("@/components/ChatBot"));
const WhatsAppButton = lazy(() => import("@/components/WhatsAppButton"));
const CookieConsent = lazy(() => import("@/components/CookieConsent"));

const Index = () => {
  const location = useLocation();
  
  // Track scroll depth (25%, 50%, 75%, 100%)
  useScrollDepthTracking();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <SEOHead
        title="Tech Agent Labs | AI Agents Marketplace & Custom Development Studio"
        description="Buy production-ready AI agents or get custom-built automation for your business. Plug-and-play workflow bots for sales, support, operations & more. Fast deployment, enterprise security."
        canonicalUrl="https://techagentlabs.com"
        keywords={[
          "AI agents",
          "AI automation",
          "workflow bots",
          "business automation",
          "AI marketplace",
          "custom AI agents",
          "sales automation",
          "customer support AI",
          "AI chatbot",
          "enterprise AI",
        ]}
      />
      <div className="min-h-screen bg-background scroll-smooth">
        <Navbar />
        <Suspense fallback={null}>
          <SocialMediaWidget />
          <WhatsAppButton />
          <ScrollToTopButton />
          <ChatBot />
          <CookieConsent />
        </Suspense>
        <main className="relative z-10">
          <HeroSection />
          <Suspense fallback={<div className="min-h-[200px]" />}>
            <FeaturesSection />
            <ServicesSection />
            <StatsSection />
            <PartnersSection />
            <GrowthSection />
            <HowToBuySection />
            <TestimonialsSection />
            <BlogSection />
            <FAQSection />
            <ContactSection />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Index;
