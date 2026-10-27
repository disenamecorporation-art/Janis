import React from 'react';
import { Download } from 'lucide-react';
import { GUIDE_PRICE } from '../config';
import { CheckoutItem } from './PayPalCheckoutModal';

interface GuideBannerSectionProps {
  onBuyGuide: (item: CheckoutItem) => void;
}

export const GuideBannerSection: React.FC<GuideBannerSectionProps> = ({ onBuyGuide }) => {
  const guideItem: CheckoutItem = {
    id: 'guia-sistema-nervioso',
    title: 'Guía Práctica: Entendiendo tu Sistema Nervioso',
    subtitle: 'Material descargable en formato PDF (lectura inmediata)',
    price: GUIDE_PRICE,
    currency: 'USD',
    isGuide: true,
    features: [
      'Ejercicios somáticos guiados paso a paso',
      'Protocolos de respiración vagal para calmar la alarma',
      'Plantillas de registro emocional diario',
      'Acceso de por vida y descarga instantánea',
    ],
  };

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glass Banner Container */}
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#EEF4FF] via-[#E8EFFE] to-[#F5EAF1] border border-white/80 p-8 sm:p-10 md:p-12 shadow-xl">
          
          {/* Subtle light background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Left: Tilted Book Mockup */}
            <div className="md:col-span-4 lg:col-span-3 flex justify-center">
              <div className="relative group perspective-1000">
                <div className="w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transform rotate-[-4deg] group-hover:rotate-0 transition-all duration-500 ring-1 ring-black/5 bg-white">
                  <img
                    src="https://i.postimg.cc/T2HxxXmd/Guia-de-Regulacion-del-Sistema-Nervioso.png"
                    alt="Portada Guía Práctica Entendiendo tu Sistema Nervioso"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Book shadow effect */}
                <div className="absolute -bottom-4 left-4 right-4 h-6 bg-slate-800/15 blur-lg rounded-full -z-10" />
              </div>
            </div>

            {/* Right: Copy & Download button */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-[#1E3A8A] leading-snug">
                ¿Aún no estás lista para un proceso de terapia mensual?
              </h3>

              <p className="text-sm sm:text-base text-[#4B5675] leading-relaxed">
                Si sientes que necesitas empezar por algo más pequeño para comprender lo que te sucede, dale el primer paso con mi <strong className="text-[#1E3A8A]">Guía Práctica: Entendiendo el Sistema Nervioso</strong>.
              </p>

              <p className="text-sm sm:text-base text-[#4B5675] leading-relaxed">
                Un material accionable y accesible para comenzar a regular tu ansiedad desde casa hoy mismo.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onBuyGuide(guideItem)}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-medium text-sm md:text-base bg-gradient-to-r from-[#2F5BD6] to-[#5B6FD6] hover:from-[#244bb5] hover:to-[#4a5ec3] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Descargar Guía Práctica por ${GUIDE_PRICE} USD</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
