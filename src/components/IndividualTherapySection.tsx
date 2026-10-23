import React from 'react';
import { Flower2, Brain, HeartHandshake } from 'lucide-react';

export const IndividualTherapySection: React.FC = () => {
  return (
    <section id="individual" className="py-20 md:py-28 relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Heading and emotional text */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#1E3A8A] leading-tight">
                El peso invisible de tener <br className="hidden sm:inline" />
                que ser siempre “la fuerte”
              </h2>
              {/* Short pink line */}
              <div className="w-16 h-1 bg-[#D6567F] rounded-full mt-4" />
            </div>

            <p className="text-base text-[#4B5675] leading-relaxed">
              Quizás has llegado hasta aquí sintiendo que la vida es una lista interminable de exigencias. Cumples en tu trabajo, estás presente para tu familia, pero a puerta cerrada, el cansancio te abruma.
            </p>

            <p className="text-base text-[#4B5675] leading-relaxed">
              Este espacio ha nacido como un refugio especial para mujeres que conocen bien esa profunda sensación de soledad estando acompañadas (aunque también acompaño a hombres dispuestos a sanar sus propios patrones).
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-100">
              <p className="text-base sm:text-lg font-bold text-[#1E3A8A] leading-relaxed">
                No estás fallando. Si experimentas ansiedad, hipervigilancia o desconexión, es porque tu cuerpo está reaccionando para mantenerte a salvo.
              </p>
            </div>
          </div>

          {/* Right Column: Glass Card "En sesión individual, te ayudo a resolver:" */}
          <div className="lg:col-span-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 relative">
              
              {/* Header */}
              <h3 className="font-serif text-2xl font-bold text-[#1E3A8A] mb-8">
                En sesión individual, <br />
                te ayudo a resolver:
              </h3>

              {/* 3 Items */}
              <div className="space-y-6">
                
                {/* Item 1: El agotamiento crónico */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100/80 text-[#2F5BD6] flex items-center justify-center shrink-0 shadow-sm border border-blue-200/60">
                    <Flower2 className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#1E3A8A]">
                      El agotamiento crónico:
                    </h4>
                    <p className="text-sm text-[#4B5675] leading-relaxed">
                      Liberándote del rol de “pilar inquebrantable” que te genera ese cansancio abrumador.
                    </p>
                  </div>
                </div>

                {/* Item 2: La desregulación y el trauma somático */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100/80 text-[#2F5BD6] flex items-center justify-center shrink-0 shadow-sm border border-blue-200/60">
                    <Brain className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#1E3A8A]">
                      La desregulación y el trauma somático:
                    </h4>
                    <p className="text-sm text-[#4B5675] leading-relaxed">
                      Apagando el estado de alerta constante y el miedo que tu cuerpo memorizó por heridas del pasado.
                    </p>
                  </div>
                </div>

                {/* Item 3: La soledad en compañía */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100/80 text-[#D6567F] flex items-center justify-center shrink-0 shadow-sm border border-pink-200/60">
                    <HeartHandshake className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#1E3A8A]">
                      La soledad en compañía:
                    </h4>
                    <p className="text-sm text-[#4B5675] leading-relaxed">
                      Sanando esa frustración de esforzarte de más para recibir, a cambio, un mínimo de conexión emocional.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
