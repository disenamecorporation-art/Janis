import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onAgendarClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onAgendarClick }) => {
  return (
    <section 
      id="hero" 
      className="relative isolate overflow-hidden min-h-[92vh] sm:min-h-[96vh] pt-36 sm:pt-48 md:pt-56 lg:pt-60 pb-36 sm:pb-48 md:pb-56 flex items-center bg-[#F8FAFD]"
    >
      {/* 
        HERO BACKGROUND IMAGE:
        User requested: https://i.postimg.cc/LXPn2Ns5/Mujer-sonriente-senalando-espacio-luminoso.png
        Original image without opacity reduction. 
        Adjusted object positioning (object-[65%_center] / object-center) so the woman is perfectly framed.
      */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://i.postimg.cc/LXPn2Ns5/Mujer-sonriente-senalando-espacio-luminoso.png"
          alt="Psicoterapia y Bienestar Emocional con Janis"
          className="w-full h-full object-cover object-right sm:object-[88%_center] lg:object-[92%_center]"
        />
        {/* Soft white top gradient overlay for smooth, gentle header blending */}
        <div className="absolute top-0 inset-x-0 h-48 sm:h-64 bg-gradient-to-b from-[#F8FAFD] via-[#F8FAFD]/80 to-transparent pointer-events-none z-10" />
      </div>

      {/* Hero Content directly over background (NO box/card background behind text) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Headlines & Copy directly without card container */}
          <div className="lg:col-span-8 xl:col-span-7 text-left space-y-7">
            
            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.3rem] xl:text-[3.7rem] font-bold tracking-tight leading-[1.14] text-[#1E3A8A] drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">
              Sostienes el mundo <br className="hidden sm:inline" />
              de todos, pero... <br />
              <span className="text-[#D6567F] italic font-medium inline-block mt-1.5">
                ¿quién sostiene tu sistema nervioso?
              </span>
            </h1>

            {/* Paragraph 1 */}
            <p className="text-base sm:text-lg md:text-xl text-[#1E3A8A] font-semibold leading-relaxed max-w-xl drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              Psicoterapia especializada en trauma somático, regulación emocional y vínculos sanos para individuos y parejas.
            </p>

            {/* Paragraph 2 */}
            <p className="text-sm sm:text-base md:text-[17px] text-[#2D3748] leading-relaxed max-w-xl font-normal drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              Un espacio seguro para soltar la coraza, dejar de sobrevivir y aprender a relacionarte desde la paz, no desde el miedo.
            </p>

            {/* CTA Button and Script Tagline */}
            <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              <button
                type="button"
                onClick={onAgendarClick}
                className="inline-flex items-center gap-3 px-8 sm:px-9 py-4 rounded-full text-white font-semibold text-sm sm:text-base btn-primary-gradient shadow-xl hover:shadow-2xl group transition-all cursor-pointer"
              >
                <span>Quiero agendar mi primera sesión</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Hand-written script text with brush underline */}
              <div className="relative inline-block rotate-[-3deg] pl-2">
                <span className="font-script text-2xl sm:text-3xl lg:text-4xl text-[#1E3A8A] font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                  Tu bienestar también importa
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3.5 text-[#D6567F]"
                  viewBox="0 0 250 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8.5C50 3.5 150 2 247 9.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 
        SEPARACIÓN DEL HERO SPECTACULARMENTE ANIMADA:
        Multi-layered morphing organic waves + Floating shimmering light droplets & sparkles
      */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none z-20 leading-none">
        
        {/* Glowing floating light droplets hovering above wave divider */}
        <div className="absolute inset-x-0 bottom-16 sm:bottom-24 h-20 pointer-events-none z-30 flex justify-around px-8">
          <div className="w-3 h-3 rounded-full bg-[#D6567F]/40 blur-[2px] animate-particle-1" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#5B6FD6]/50 blur-[1px] animate-particle-2" />
          <div className="w-4 h-4 rounded-full bg-[#FCE7F3]/70 blur-[2px] animate-particle-3" />
          <div className="w-3 h-3 rounded-full bg-[#D6567F]/50 blur-[1px] animate-particle-4" />
          <div className="hidden sm:block w-3.5 h-3.5 rounded-full bg-[#5B6FD6]/40 blur-[2px] animate-particle-2" />
        </div>

        <svg
          viewBox="0 0 1440 240"
          className="w-full h-28 sm:h-40 md:h-52 lg:h-64 block"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveRoseGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D6567F" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#D6567F" stopOpacity="0.38" />
            </linearGradient>

            <linearGradient id="waveSoftCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FCE7F3" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="waveSparkle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C2477A" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#5B6FD6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#C2477A" stopOpacity="0.18" />
            </linearGradient>
          </defs>

          {/* Background glowing light shimmer wave layer */}
          <path
            className="animate-wave-3"
            d="M0,15 C240,110 440,0 680,70 C920,140 1140,5 1440,75 L1440,240 L0,240 Z"
            fill="url(#waveSparkle)"
          />

          {/* Deep organic morphing wave accent with smooth float */}
          <path
            className="animate-wave-1"
            d="M0,35 C280,135 480,10 720,85 C960,160 1180,20 1440,100 L1440,240 L0,240 Z"
            fill="url(#waveRoseGlow)"
          />

          {/* Secondary soft frosted wave with smooth counter-morph */}
          <path
            className="animate-wave-2"
            d="M0,75 C320,20 520,150 760,65 C1000,-5 1220,130 1440,50 L1440,240 L0,240 Z"
            fill="url(#waveSoftCyan)"
          />

          {/* Final solid pristine wave seamlessly blending into the next section (#F8FAFD) */}
          <path
            d="M0,120 C360,65 600,170 880,105 C1120,40 1300,140 1440,100 L1440,240 L0,240 Z"
            fill="#F8FAFD"
          />
        </svg>
      </div>
    </section>
  );
};
