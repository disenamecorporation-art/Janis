import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { IndividualTherapySection } from '../components/IndividualTherapySection';
import { CouplesTherapySection } from '../components/CouplesTherapySection';
import { ClinicalResultsSection } from '../components/ClinicalResultsSection';
import { AboutJanisSection } from '../components/AboutJanisSection';
import { MonthlyPlansSection } from '../components/MonthlyPlansSection';
import { GuideBannerSection } from '../components/GuideBannerSection';
import { HomeBlogSection } from '../components/HomeBlogSection';
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

  const handleAgendarIndividual = () => {
    onOpenBooking?.('Terapia Individual');
  };

  const handleAgendarPareja = () => {
    onOpenBooking?.('Terapia de Pareja');
  };

  return (
    <main className="w-full">
      {/* 1. Hero */}
      <HeroSection onAgendarClick={handleAgendarIndividual} />

      {/* 2. El peso invisible de tener que ser siempre la fuerte */}
      <IndividualTherapySection />

      {/* 3. Terapia de Pareja */}
      <CouplesTherapySection onAgendarClick={handleAgendarPareja} />

      {/* 4. Resultados Clínicos */}
      <ClinicalResultsSection />

      {/* 5. Sobre mí (Janis Niño Vasquez) */}
      <AboutJanisSection />

      {/* 6. Planes Mensuales (con PayPal Checkout) */}
      <MonthlyPlansSection onSelectPlanForPayPal={handleOpenCheckout} onOpenBooking={onOpenBooking} />

      {/* 7. Banner Guía Práctica */}
      <GuideBannerSection onBuyGuide={handleOpenCheckout} />

      {/* 8. Desde el blog */}
      <HomeBlogSection />

      {/* 9. Políticas de Agendamiento y Respeto Mutuo */}
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
