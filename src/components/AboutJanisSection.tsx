import React from 'react';
import { MapPin, Globe } from 'lucide-react';
import { CLINIC_INFO } from '../config';

export const AboutJanisSection: React.FC = () => {
  return (
    <section id="sobre-mi" className="py-20 md:py-28 relative overflow-hidden bg-white/60">
      
      {/* Ambient background bloom */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Janis Professional Photo */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[28px] overflow-hidden shadow-2xl ring-1 ring-slate-100">
              <img
                src="/assets/janis-sobre-mi.png"
                alt="Janis Niño Vasquez - Psicóloga Clínica FPV 9065"
                className="w-full h-full object-cover object-top transform hover:scale-102 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = 'https://i.postimg.cc/G3Kwkymw/image.png';
                }}
              />
            </div>
          </div>

          {/* Right Column: Bio & Information */}
          <div className="lg:col-span-7 space-y-6 pt-4 lg:pt-0">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#1E3A8A] leading-tight">
                Hola, soy Janis Niño Vasquez
              </h2>
              <p className="text-xl font-medium text-[#D6567F] mt-1.5">
                {CLINIC_INFO.credential}
              </p>
            </div>

            <p className="text-base sm:text-lg text-[#4B5675] leading-relaxed">
              Mi enfoque no se limita a “escucharte hablar”. Integro técnicas con evidencia científica (como EMDR, Psicoterapia Sensoriomotriz e IFS) para que la sanación ocurra desde tus células hacia afuera.
            </p>

            <blockquote className="border-l-0 pl-0 my-4">
              <p className="font-serif italic text-lg sm:text-xl text-[#D6567F] leading-snug">
                “Mereces relaciones libres de abuso, y mi objetivo es darte el mapa para construirlas.”
              </p>
            </blockquote>

            {/* Location & Website Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
              
              {/* Location Block */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F5F8FF] border border-blue-100/70">
                <div className="w-10 h-10 rounded-xl bg-white text-[#D6567F] flex items-center justify-center shrink-0 shadow-sm border border-pink-100">
                  <MapPin className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-xs text-[#4B5675] leading-relaxed">
                  <span className="font-bold text-[#1E3A8A] block text-[13px] mb-0.5">Sede Presencial:</span>
                  Multicentro Empresarial del Este, Torre Libertador, núcleo B, Piso 14, oficina 141. Clínica Nexus. Chacao, Caracas.
                </div>
              </div>

              {/* Website Block */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F5F8FF] border border-blue-100/70">
                <div className="w-10 h-10 rounded-xl bg-white text-[#2F5BD6] flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
                  <Globe className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-xs text-[#4B5675] leading-relaxed">
                  <span className="font-bold text-[#1E3A8A] block text-[13px] mb-0.5">Consulta Online & Web:</span>
                  <a
                    href="https://www.psicoterapiaconjanis.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2F5BD6] font-medium hover:underline block break-all"
                  >
                    {CLINIC_INFO.website}
                  </a>
                  <span>Atención nacional e internacional</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
