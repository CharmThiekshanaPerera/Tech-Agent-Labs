import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ServicesSection from "@/components/ServicesSection";
import PartnersSection from "@/components/PartnersSection";
import GrowthSection from "@/components/GrowthSection";
import HowToBuySection from "@/components/HowToBuySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import SocialMediaWidget from "@/components/SocialMediaWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <ParticleBackground />
      <Navbar />
      <SocialMediaWidget />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ServicesSection />
        <PartnersSection />
        <GrowthSection />
        <HowToBuySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
