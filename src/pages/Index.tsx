import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import PartnersSection from "@/components/PartnersSection";
import GrowthSection from "@/components/GrowthSection";
import HowToBuySection from "@/components/HowToBuySection";
import PricingSection from "@/components/PricingSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import SocialMediaWidget from "@/components/SocialMediaWidget";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ChatBot from "@/components/ChatBot";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  const location = useLocation();

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
    <div className="min-h-screen bg-background scroll-smooth">
      <ParticleBackground />
      <Navbar />
      <SocialMediaWidget />
      <WhatsAppButton />
      <ScrollToTopButton />
      <ChatBot />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ServicesSection />
        <StatsSection />
        <PartnersSection />
        <GrowthSection />
        <HowToBuySection />
        {/* <PricingSection /> */}
        {/* <TeamSection /> */}
        <TestimonialsSection />
        <BlogSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
