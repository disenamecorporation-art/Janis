import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IntakeFormSection } from '../components/IntakeFormSection';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const FormularioPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Formulario Clínico de Admisión | Psicoterapia con Janis';
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#F8FAFD]">
      {/* Top Breadcrumb & Navigation helper */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <RouterLink
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#2F5BD6] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </RouterLink>

          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Formulario Privado y Seguro</span>
          </div>
        </div>
      </div>

      {/* Embedded Intake Form Section */}
      <IntakeFormSection />
    </main>
  );
};

export default FormularioPage;
