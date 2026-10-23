import React from 'react';
import { Check } from 'lucide-react';

export const ClinicalResultsSection: React.FC = () => {
  const clinicalAchievements = [
    {
      title: "Reaccionar en lugar de explotar:",
      desc: "Aprender a pausar y regular su sistema nervioso antes de que una discusión destruya su paz.",
    },
    {
      title: "Establecer límites sin culpa:",
      desc: "Poder decir “no” sin sentir que están traicionando a quienes aman.",
    },
    {
      title: "Recuperar la seguridad corporal:",
      desc: "Volver a habitar su cuerpo sin tensión, hipervigilancia ni dolor psicosomático crónico.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#EEF4FF]/70 relative overflow-hidden">
      
      {/* Decorative Wave at the top */}
      <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-8 text-[#F8FAFD]"
          fill="currentColor"
        >
          <path d="M0,0 C300,60 600,-20 1200,40 L1200,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Title & Check List */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#1E3A8A] leading-tight">
                ¿Qué sucede cuando decides sanar?
              </h2>
              <p className="text-xl font-medium text-[#D6567F] mt-1">
                (Resultados Clínicos)
              </p>
            </div>

            <p className="text-base text-[#4B5675] leading-relaxed">
              Un proceso terapéutico profundo transforma tu realidad. Los pacientes que se comprometen con este espacio logran:
            </p>

            <div className="space-y-5 pt-2">
              {clinicalAchievements.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#2F5BD6] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1E3A8A]">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#4B5675] leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Clasped hands photo with soft curved/faded blend */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-[4/4] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/src/assets/images/clasped_hands_therapy_1792597387293.jpg"
                alt="Manos entrelazadas en sesión de terapia clínica"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              {/* Soft gradient blend into container */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#EEF4FF]/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/50 rounded-3xl pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
