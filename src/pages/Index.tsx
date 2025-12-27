import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ServicesSection from "@/components/ServicesSection";
import PartnersSection from "@/components/PartnersSection";
import GrowthSection from "@/components/GrowthSection";
import HowToBuySection from "@/components/HowToBuySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import SocialMediaWidget from "@/components/SocialMediaWidget";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <ParticleBackground />
      <Navbar />
      <SocialMediaWidget />
      <ScrollToTopButton />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ServicesSection />
        <PartnersSection />
        <GrowthSection />
        <HowToBuySection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
