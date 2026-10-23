import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '../config';

export const FinalCtaSection: React.FC = () => {
  return (
    <section id="contacto" className="relative py-24 md:py-32 overflow-hidden text-center">
      
      {/* Background Image: Soft blurred botanical foliage */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/src/assets/images/botanical_foliage_bg_1792597405767.jpg"
          alt="Atmósfera serena y calmada"
          className="w-full h-full object-cover object-center opacity-45"
        />
        {/* Soft pastel lilac/blue overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFD]/90 via-[#EEF3FF]/85 to-[#F8FAFD]/95 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Main Serif Headline */}
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-[#1E3A8A] leading-tight max-w-3xl mx-auto">
          Mereces vínculos que no te desgasten, empezando por el vínculo contigo misma...
        </h2>

        {/* Navy bold subtext */}
        <p className="text-lg sm:text-xl font-bold text-[#1E3A8A] tracking-wide">
          Da el primer paso hacia una vida regulada.
        </p>

        {/* Cursive pink quote */}
        <p className="font-script text-2xl sm:text-3xl md:text-4xl text-[#D6567F] font-semibold">
          Tu cuerpo te está pidiendo un descanso; escúchalo.
        </p>

        {/* WhatsApp CTA Button */}
        <div className="pt-4">
          <a
            href={getWhatsAppUrl("Hola Janis, deseo dar el primer paso y agendar una cita contigo.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full text-white font-medium text-sm sm:text-base btn-primary-gradient shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 group"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Hablar por WhatsApp para agendar mi cita</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Small reassurance */}
        <p className="text-xs text-slate-500 pt-2">
          Respuesta personalizada en menos de 24 horas · Caracas & Consulta Online Internacional
        </p>

      </div>
    </section>
  );
};
