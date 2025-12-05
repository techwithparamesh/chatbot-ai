import { useState, createContext, useContext } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { FeaturesSection } from "@/components/features-section";
import { WhyChooseUsSection } from "@/components/why-choose-us-section";
import { UseCasesSection } from "@/components/use-cases-section";
import { PricingSection } from "@/components/pricing-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { SignupModal } from "@/components/signup-modal";

type ModalType = "signup" | "demo" | null;

interface ModalContextType {
  openModal: (type: "signup" | "demo") => void;
}

export const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export default function Home() {
  const [modalType, setModalType] = useState<ModalType>(null);

  const openModal = (type: "signup" | "demo") => {
    setModalType(type);
  };

  return (
    <ModalContext.Provider value={{ openModal }}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <HowItWorksSection />
          <FeaturesSection />
          <WhyChooseUsSection />
          <UseCasesSection />
          <PricingSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
        <SignupModal 
          open={modalType !== null} 
          onOpenChange={(open) => !open && setModalType(null)}
          type={modalType || "signup"}
        />
      </div>
    </ModalContext.Provider>
  );
}
