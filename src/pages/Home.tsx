import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { IndividualTherapySection } from '../components/IndividualTherapySection';
import { CouplesTherapySection } from '../components/CouplesTherapySection';
import { ClinicalResultsSection } from '../components/ClinicalResultsSection';
import { AboutJanisSection } from '../components/AboutJanisSection';
import { MonthlyPlansSection } from '../components/MonthlyPlansSection';
import { GuideBannerSection } from '../components/GuideBannerSection';
import { HomeBlogSection } from '../components/HomeBlogSection';
import { IntakeFormSection } from '../components/IntakeFormSection';
import { PoliciesSection } from '../components/PoliciesSection';
import { FinalCtaSection } from '../components/FinalCtaSection';
import { PayPalCheckoutModal, CheckoutItem } from '../components/PayPalCheckoutModal';

interface HomeProps {
  onOpenBooking?: (service?: 'Terapia Individual' | 'Terapia de Pareja') => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenBooking }) => {
  const [selectedItem, setSelectedItem] = useState<CheckoutItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCheckout = (item: CheckoutItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsModalOpen(false);
  };

  const scrollToFormulario = () => {
    const el = document.getElementById('formulario');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onOpenBooking?.('Terapia Individual');
    }
  };

  return (
    <main className="w-full">
      {/* 1. Hero */}
      <HeroSection onAgendarClick={scrollToFormulario} />

      {/* 2. El peso invisible de tener que ser siempre la fuerte */}
      <IndividualTherapySection />

      {/* 3. Terapia de Pareja */}
      <CouplesTherapySection onAgendarClick={scrollToFormulario} />

      {/* 4. Resultados Clínicos */}
      <ClinicalResultsSection />

      {/* 5. Sobre mí (Janis Niño Vasquez) */}
      <AboutJanisSection />

      {/* 6. Planes Mensuales (con PayPal Checkout) */}
      <MonthlyPlansSection onSelectPlanForPayPal={handleOpenCheckout} />

      {/* 7. Banner Guía Práctica */}
      <GuideBannerSection onBuyGuide={handleOpenCheckout} />

      {/* 8. Desde el blog */}
      <HomeBlogSection />

      {/* 9. Formulario Propio Clínico y Confidencial */}
      <IntakeFormSection />

      {/* 10. Políticas de Agendamiento y Respeto Mutuo */}
      <PoliciesSection />

      {/* 11. CTA Final */}
      <FinalCtaSection />

      {/* PayPal Checkout Modal */}
      <PayPalCheckoutModal
        isOpen={isModalOpen}
        onClose={handleCloseCheckout}
        item={selectedItem}
      />
    </main>
  );
};
