import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '../config';

interface CouplesTherapySectionProps {
  onAgendarClick?: () => void;
}

export const CouplesTherapySection: React.FC<CouplesTherapySectionProps> = ({ onAgendarClick }) => {
  const transformItems = [
    {
      title: "El ciclo tóxico del apego:",
      description: "Entendiendo por qué uno persigue (ansioso) y el otro huye (evitativo), y cómo esto desregula su sistema nervioso.",
    },
    {
      title: "La comunicación destructiva y falta de reparación:",
      description: "Deteniendo las críticas, la defensiva y la 'ley del hielo' para aprender a frenar las discusiones antes de que escalen.",
    },
    {
      title: "Rupturas de confianza e intimidad:",
      description: "Procesando el dolor de la traición, recuperando la amistad perdida y abordando la sexualidad sin usarla como campo de batalla.",
    },
    {
      title: "Desafíos de vida:",
      description: "Alineando estilos de crianza, manejo del estrés financiero y límites con las familias de origen.",
    },
  ];

  return (
    <section id="pareja" className="py-20 md:py-28 bg-gradient-to-br from-[#F5F8FF] via-[#EEF3FF]/70 to-[#FDF4F8]/40 relative overflow-hidden">
      
      {/* Ambient background blur */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-pink-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Intimate couple photo with gentle soft faded border */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[4/5] max-w-lg mx-auto">
              <img
                src="https://i.postimg.cc/j5vmb0wR/image.png"
                alt="Pareja en terapia de reconexión y afecto"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              {/* Soft vignette/gradient blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Copy, List and CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#1E3A8A] leading-tight">
                Cuando el amor se siente como un campo de batalla
              </h2>
              <p className="text-xl font-medium text-[#D6567F] mt-1">
                (Terapia de Pareja)
              </p>
            </div>

            <p className="text-base text-[#4B5675] leading-relaxed">
              El amor no basta cuando el trauma toma el control. Si sienten que caminan sobre cáscaras de huevo o viven como “simples compañeros de cuarto”, la terapia es el puente para reencontrarse.
            </p>

            <div className="pt-2">
              <p className="text-base font-bold text-[#1E3A8A] mb-4">
                Les acompaño a transformar:
              </p>

              <ul className="space-y-4">
                {transformItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#D6567F] mt-2 shrink-0 ring-4 ring-pink-100" />
                    <p className="text-sm sm:text-base text-[#4B5675] leading-relaxed">
                      <strong className="text-[#1E3A8A] font-semibold">{item.title}</strong>{' '}
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <a
                href={getWhatsAppUrl("Hola Janis, quisiéramos consultar sobre la terapia de pareja y cómo podemos sanar nuestro vínculo.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onAgendarClick}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-white font-medium text-sm sm:text-base btn-primary-gradient shadow-lg group transition-transform"
              >
                <span>Queremos sanar nuestro vínculo</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
