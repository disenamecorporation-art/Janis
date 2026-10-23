import React from 'react';
import { User, Users, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '../config';
import { CheckoutItem } from './PayPalCheckoutModal';

interface MonthlyPlansSectionProps {
  onSelectPlanForPayPal: (item: CheckoutItem) => void;
}

export const MonthlyPlansSection: React.FC<MonthlyPlansSectionProps> = ({ onSelectPlanForPayPal }) => {
  const individualPlanItem: CheckoutItem = {
    id: 'plan-individual',
    title: 'Plan Mensual Terapia Individual',
    subtitle: '4 sesiones clínicas personalizadas (50 min)',
    price: '150',
    currency: 'USD',
    features: [
      '4 sesiones individuales de 50 minutos',
      'Enfoque integrado (EMDR, IFS, somático)',
      'Vigencia estricta de 30 días continuos',
      'Atención presencial en Caracas u Online',
    ],
  };

  const couplePlanItem: CheckoutItem = {
    id: 'plan-pareja',
    title: 'Plan Mensual Terapia de Pareja',
    subtitle: '4 sesiones clínicas de vínculo e intimidad (60 min)',
    price: '210',
    currency: 'USD',
    features: [
      '4 sesiones de pareja especializadas',
      'Reparación de patrones de apego y comunicación',
      'Vigencia estricta de 30 días continuos',
      'Atención presencial en Caracas u Online',
    ],
  };

  return (
    <section id="planes" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#F8FAFD] via-[#F4F7FE] to-[#F8FAFD]">
      
      {/* Background blobs for glassmorphism pop */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-pink-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-float-delayed" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#1E3A8A] leading-tight">
            El compromiso con tu sanación: <br className="hidden sm:inline" />
            <span className="text-[#D6567F]">Planes Mensuales</span>
          </h2>
          <p className="text-base sm:text-lg text-[#4B5675] leading-relaxed">
            Sanar el trauma requiere ritmo, constancia y un encuadre seguro. Mis planes de 4 sesiones garantizan tu evolución clínica con una tarifa preferencial.
          </p>
        </div>

        {/* Two Glass Cards Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-6xl mx-auto">
          
          {/* Card 1: Terapia Individual */}
          <div className="glass-card rounded-[28px] p-6 sm:p-8 md:p-10 flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 pb-6 border-b border-slate-200/70">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2F5BD6] flex items-center justify-center shrink-0 border border-blue-100">
                  <User className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1E3A8A]">
                    Terapia Individual
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    (Valor de sesión suelta: $60)
                  </p>
                </div>
              </div>

              {/* Pricing Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                
                {/* Column 1: Pago Único */}
                <div className="p-4 rounded-2xl bg-white/70 border border-blue-100/60 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block mb-1">
                      Plan Mensual (Pago Único)
                    </span>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1E3A8A]">
                        $150
                      </span>
                      <span className="text-xs text-slate-500 font-medium">USD</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      4 sesiones completas al mes ($37.5 / sesión).
                    </p>
                  </div>

                  {/* PayPal Secondary Glass Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onSelectPlanForPayPal(individualPlanItem)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-[#003087] bg-white/90 hover:bg-white border border-slate-200 shadow-sm hover:shadow transition-all"
                    >
                      <span className="font-extrabold italic text-sm text-[#003087]">Pay<span className="text-[#0079C1]">Pal</span></span>
                      <span>· Pagar $150</span>
                    </button>
                  </div>
                </div>

                {/* Column 2: Financiado Cashea */}
                <div className="p-4 rounded-2xl bg-[#FFFBF0]/80 border border-amber-200/60 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-amber-900 block">
                        Plan Mensual Financiado
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                        Cashea
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1E3A8A]">
                        $200
                      </span>
                      <span className="text-xs text-slate-500 font-medium">USD</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      (inicial de $100 + 3 cuotas quincenales de $33.35 en Bs).
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-100">
                    <a
                      href={getWhatsAppUrl("Hola Janis, quisiera coordinar el Plan Mensual de Terapia Individual financiado con Cashea.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium text-amber-900 bg-amber-100/70 hover:bg-amber-100 border border-amber-200/80 transition-all text-center"
                    >
                      <span>Coordinar con Cashea</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* What is included bullet points */}
              <div className="space-y-2 mb-8 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6567F]" />
                  <span>4 sesiones mensuales individuales de 50 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BD6]" />
                  <span>Vigencia estricta de 30 días continuos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Modalidad presencial (Caracas) u Online</span>
                </div>
              </div>
            </div>

            {/* Gradient Primary Button */}
            <div className="pt-2">
              <a
                href={getWhatsAppUrl("Hola Janis, quiero reservar mi espacio mensual para Terapia Individual.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-white font-medium text-sm btn-primary-gradient shadow-md hover:shadow-lg transition-all"
              >
                <span>Reservar mi espacio mensual</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 2: Terapia de Pareja */}
          <div className="glass-card rounded-[28px] p-6 sm:p-8 md:p-10 flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 pb-6 border-b border-slate-200/70">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#D6567F] flex items-center justify-center shrink-0 border border-pink-100">
                  <Users className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1E3A8A]">
                    Terapia de Pareja
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    (Valor de sesión suelta: $70)
                  </p>
                </div>
              </div>

              {/* Pricing Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                
                {/* Column 1: Pago Único */}
                <div className="p-4 rounded-2xl bg-white/70 border border-blue-100/60 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block mb-1">
                      Plan Mensual (Pago Único)
                    </span>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1E3A8A]">
                        $210
                      </span>
                      <span className="text-xs text-slate-500 font-medium">USD</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      4 sesiones completas de pareja ($52.5 / sesión).
                    </p>
                  </div>

                  {/* PayPal Secondary Glass Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onSelectPlanForPayPal(couplePlanItem)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-[#003087] bg-white/90 hover:bg-white border border-slate-200 shadow-sm hover:shadow transition-all"
                    >
                      <span className="font-extrabold italic text-sm text-[#003087]">Pay<span className="text-[#0079C1]">Pal</span></span>
                      <span>· Pagar $210</span>
                    </button>
                  </div>
                </div>

                {/* Column 2: Financiado Cashea */}
                <div className="p-4 rounded-2xl bg-[#FFFBF0]/80 border border-amber-200/60 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-amber-900 block">
                        Plan Mensual Financiado
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                        Cashea
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1E3A8A]">
                        $240
                      </span>
                      <span className="text-xs text-slate-500 font-medium">USD</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      (inicial de $120 + 3 cuotas quincenales de $40.00 en Bs).
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-100">
                    <a
                      href={getWhatsAppUrl("Hola Janis, quisiera coordinar el Plan Mensual de Terapia de Pareja financiado con Cashea.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium text-amber-900 bg-amber-100/70 hover:bg-amber-100 border border-amber-200/80 transition-all text-center"
                    >
                      <span>Coordinar con Cashea</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* What is included bullet points */}
              <div className="space-y-2 mb-8 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6567F]" />
                  <span>4 sesiones mensuales de pareja de 60 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BD6]" />
                  <span>Vigencia estricta de 30 días continuos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Reencuentro afectivo y comunicación</span>
                </div>
              </div>
            </div>

            {/* Gradient Primary Button */}
            <div className="pt-2">
              <a
                href={getWhatsAppUrl("Hola Janis, queremos reservar nuestro espacio mensual de Terapia de Pareja.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-white font-medium text-sm btn-primary-gradient shadow-md hover:shadow-lg transition-all"
              >
                <span>Reservar mi espacio mensual</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* PayPal Trust Line */}
        <div className="mt-10 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
          <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pago seguro procesado por PayPal. Puedes pagar con tu cuenta PayPal o con tarjeta de crédito/débito.</span>
        </div>

      </div>
    </section>
  );
};
