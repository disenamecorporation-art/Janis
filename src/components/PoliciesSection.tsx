import React from 'react';
import { Calendar, ShieldCheck, Clock } from 'lucide-react';

export const PoliciesSection: React.FC = () => {
  const policies = [
    {
      icon: Calendar,
      title: "Tu espacio, tu tiempo:",
      description: "El espacio terapéutico está reservado de forma exclusiva para ti. Las cancelaciones o reprogramaciones deben notificarse con al menos 24 horas de anticipación.",
    },
    {
      icon: ShieldCheck,
      title: "Compromiso clínico:",
      description: "Para proteger la evolución de tu proceso y poder brindar asistencia a pacientes que lo necesitan con urgencia, las inasistencias o cancelaciones tardías generarán el cobro de la sesión o el descuento de tu plan activo. Esta medida asegura el cuidado y respeto mutuo por nuestro espacio de trabajo.",
    },
    {
      icon: Clock,
      title: "Vigencia:",
      description: "Los planes mensuales tienen una vigencia de 30 días continuos.",
    },
  ];

  return (
    <section className="py-20 md:py-24 relative overflow-hidden bg-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-14">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E3A8A]">
            Políticas de Agendamiento y Respeto Mutuo
          </h2>
          <div className="w-12 h-1 bg-[#D6567F] rounded-full mx-auto mt-3" />
        </div>

        {/* 3 Columns in Lightweight Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {policies.map((policy, index) => {
            const Icon = policy.icon;
            return (
              <div
                key={index}
                className="glass-card-subtle rounded-2xl p-6 sm:p-7 flex flex-col items-start gap-4 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2F5BD6] flex items-center justify-center shrink-0 border border-blue-100/70">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E3A8A] mb-2">
                    {policy.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4B5675] leading-relaxed">
                    {policy.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
