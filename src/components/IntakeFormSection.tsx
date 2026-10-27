import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, RotateCcw, CheckCircle2, AlertCircle, ShieldCheck
} from 'lucide-react';
import { dbService, IntakeFormSubmission } from '../services/db';

export const IntakeFormSection: React.FC = () => {
  // Form values state
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellidos: '',
    edad: '',
    fechaNacimiento: '',
    horaNacimientoHora: '08',
    horaNacimientoMin: '00',
    horaNacimientoPeriodo: 'AM',
    lugarNacimiento: '',
    ocupacion: '',
    paisResidencia: '',
    tienePareja: '',
    tieneParejaOtro: '',
    sexo: '',
    sexoOtro: '',
    identificacionSexual: '',
    identificacionSexualOtro: '',
    nivelEducativo: '',
    hijosCuantos: '',
    conQuienesVive: '',
    profesaReligion: '',
    condicionMedicaMedicamentos: '',
    asistidoTerapiaAnterioridad: '',
    situacionEstresanteReciente: '',
    comoSeSienteHoy: '',
    motivoAtencionPsicologica: '',
    sentimientoAlHablarTema: '',
    areasAfectadasComo: '',
    intensidadDel1Al10: 0,
    actividadAfrontarEstrategia: '',
    expectativasAcompanamiento: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Auto-resize textarea handler
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = 'auto';
    target.style.height = `${Math.max(88, target.scrollHeight)}px`;
  };

  // Generic change handler
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Progress computation (total 26 questions)
  const calculateProgress = () => {
    let completed = 0;
    if (formData.email.trim() && /\S+@\S+\.\S+/.test(formData.email)) completed++;
    if (formData.nombre.trim()) completed++;
    if (formData.apellidos.trim()) completed++;
    if (formData.edad.trim()) completed++;
    if (formData.fechaNacimiento) completed++;
    if (formData.horaNacimientoHora && formData.horaNacimientoMin && formData.horaNacimientoPeriodo) completed++;
    if (formData.lugarNacimiento.trim()) completed++;
    if (formData.ocupacion.trim()) completed++;
    if (formData.paisResidencia.trim()) completed++;
    if (formData.tienePareja === 'Otro:' ? formData.tieneParejaOtro.trim() : formData.tienePareja) completed++;
    if (formData.sexo === 'Otro:' ? formData.sexoOtro.trim() : formData.sexo) completed++;
    if (formData.identificacionSexual === 'Otro:' ? formData.identificacionSexualOtro.trim() : formData.identificacionSexual) completed++;
    if (formData.nivelEducativo) completed++;
    if (formData.hijosCuantos.trim()) completed++;
    if (formData.conQuienesVive.trim()) completed++;
    if (formData.profesaReligion.trim()) completed++;
    if (formData.condicionMedicaMedicamentos.trim()) completed++;
    if (formData.asistidoTerapiaAnterioridad.trim()) completed++;
    if (formData.situacionEstresanteReciente.trim()) completed++;
    if (formData.comoSeSienteHoy.trim()) completed++;
    if (formData.motivoAtencionPsicologica.trim()) completed++;
    if (formData.sentimientoAlHablarTema.trim()) completed++;
    if (formData.areasAfectadasComo.trim()) completed++;
    if (formData.intensidadDel1Al10 >= 1 && formData.intensidadDel1Al10 <= 10) completed++;
    if (formData.actividadAfrontarEstrategia.trim()) completed++;
    if (formData.expectativasAcompanamiento.trim()) completed++;
    return completed;
  };

  const progressCount = calculateProgress();
  const progressPercent = Math.round((progressCount / 26) * 100);

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 1. Email
    if (!formData.email.trim()) {
      newErrors.email = 'Esta pregunta es obligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Por favor ingresa un formato de correo válido';
    }

    // 2. Nombre
    if (!formData.nombre.trim()) newErrors.nombre = 'Esta pregunta es obligatoria';

    // 3. Apellidos
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Esta pregunta es obligatoria';

    // 4. Edad
    if (!formData.edad.trim()) {
      newErrors.edad = 'Esta pregunta es obligatoria';
    } else if (isNaN(Number(formData.edad.trim())) || Number(formData.edad.trim()) <= 0) {
      newErrors.edad = 'Ingresa una edad numérica válida';
    }

    // 5. Fecha de nacimiento
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Esta pregunta es obligatoria';

    // 6. Hora de nacimiento
    if (!formData.horaNacimientoHora || !formData.horaNacimientoMin || !formData.horaNacimientoPeriodo) {
      newErrors.horaNacimiento = 'Esta pregunta es obligatoria';
    }

    // 7. Lugar de nacimiento
    if (!formData.lugarNacimiento.trim()) newErrors.lugarNacimiento = 'Esta pregunta es obligatoria';

    // 8. Ocupación
    if (!formData.ocupacion.trim()) newErrors.ocupacion = 'Esta pregunta es obligatoria';

    // 9. País de residencia
    if (!formData.paisResidencia.trim()) newErrors.paisResidencia = 'Esta pregunta es obligatoria';

    // 10. ¿Tienes pareja?
    if (!formData.tienePareja) {
      newErrors.tienePareja = 'Esta pregunta es obligatoria';
    } else if (formData.tienePareja === 'Otro:' && !formData.tieneParejaOtro.trim()) {
      newErrors.tienePareja = 'Por favor especifica tu respuesta en el campo de texto';
    }

    // 11. Sexo
    if (!formData.sexo) {
      newErrors.sexo = 'Esta pregunta es obligatoria';
    } else if (formData.sexo === 'Otro:' && !formData.sexoOtro.trim()) {
      newErrors.sexo = 'Por favor especifica tu respuesta en el campo de texto';
    }

    // 12. Identificación sexual
    if (!formData.identificacionSexual) {
      newErrors.identificacionSexual = 'Esta pregunta es obligatoria';
    } else if (formData.identificacionSexual === 'Otro:' && !formData.identificacionSexualOtro.trim()) {
      newErrors.identificacionSexual = 'Por favor especifica tu respuesta en el campo de texto';
    }

    // 13. Nivel educativo
    if (!formData.nivelEducativo) newErrors.nivelEducativo = 'Esta pregunta es obligatoria';

    // 14. ¿Tienes hijos? cuántos?
    if (!formData.hijosCuantos.trim()) newErrors.hijosCuantos = 'Esta pregunta es obligatoria';

    // 15. ¿Con quiénes vive actualmente?
    if (!formData.conQuienesVive.trim()) newErrors.conQuienesVive = 'Esta pregunta es obligatoria';

    // 16. ¿Profesa alguna religión?
    if (!formData.profesaReligion.trim()) newErrors.profesaReligion = 'Esta pregunta es obligatoria';

    // 17. ¿Ha tenido ultimamente alguna condición médica? ¿De ser así está tomando algún medicamento?
    if (!formData.condicionMedicaMedicamentos.trim()) newErrors.condicionMedicaMedicamentos = 'Esta pregunta es obligatoria';

    // 18. ¿Has asistido a terapia con anterioridad? de ser así ¿qué valoraste más sobre las sesiones y qué pudiera mejorar?
    if (!formData.asistidoTerapiaAnterioridad.trim()) newErrors.asistidoTerapiaAnterioridad = 'Esta pregunta es obligatoria';

    // 19. ¿Has vivido recientemente alguna situación estresante? Desastres naturales, pérdida de algún familiar, diagnóstico de alguna enfermedad, migración...
    if (!formData.situacionEstresanteReciente.trim()) newErrors.situacionEstresanteReciente = 'Esta pregunta es obligatoria';

    // 20. ¿Cómo se siente hoy?
    if (!formData.comoSeSienteHoy.trim()) newErrors.comoSeSienteHoy = 'Esta pregunta es obligatoria';

    // 21. ¿Qué le motivó a tomar atención psicológica en este momento?
    if (!formData.motivoAtencionPsicologica.trim()) newErrors.motivoAtencionPsicologica = 'Esta pregunta es obligatoria';

    // 22. ¿Cómo se siente al hablar de este tema?
    if (!formData.sentimientoAlHablarTema.trim()) newErrors.sentimientoAlHablarTema = 'Esta pregunta es obligatoria';

    // 23. ¿En qué áreas de tu vida social, afectiva, laboral, consideras que te está afectando? y ¿cómo te está afectando?
    if (!formData.areasAfectadasComo.trim()) newErrors.areasAfectadasComo = 'Esta pregunta es obligatoria';

    // 24. ¿Del 1 al 10 que intensidad te parece que tiene el día de hoy el tema que quieres ver en sesiones?
    if (!formData.intensidadDel1Al10 || formData.intensidadDel1Al10 < 1 || formData.intensidadDel1Al10 > 10) {
      newErrors.intensidadDel1Al10 = 'Esta pregunta es obligatoria';
    }

    // 25. ¿Haz realizado alguna actividad para afrontar estos temas? alguna estrategia te ha funcionado?
    if (!formData.actividadAfrontarEstrategia.trim()) newErrors.actividadAfrontarEstrategia = 'Esta pregunta es obligatoria';

    // 26. ¿Qué expectativas tienes sobre el acompañamiento terapéutico y las sesiones?
    if (!formData.expectativasAcompanamiento.trim()) newErrors.expectativasAcompanamiento = 'Esta pregunta es obligatoria';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Auto-scroll to first error element
      const firstErrorField = Object.keys(newErrors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  /**
   * FUNCIÓN PRINCIPAL DE ENVÍO
   * Recopila todas las respuestas en un objeto JSON limpio,
   * guarda el documento en la base de datos para descarga del admin,
   * y permite la fácil conexión con servicios externos (Google Apps Script, Formspree, etc.).
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const formattedTime = `${formData.horaNacimientoHora}:${formData.horaNacimientoMin} ${formData.horaNacimientoPeriodo}`;
    const resolvedPareja = formData.tienePareja === 'Otro:' ? `Otro: ${formData.tieneParejaOtro.trim()}` : formData.tienePareja;
    const resolvedSexo = formData.sexo === 'Otro:' ? `Otro: ${formData.sexoOtro.trim()}` : formData.sexo;
    const resolvedIdentificacion = formData.identificacionSexual === 'Otro:' ? `Otro: ${formData.identificacionSexualOtro.trim()}` : formData.identificacionSexual;

    const finalSubmissionPayload = {
      email: formData.email.trim(),
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      edad: formData.edad.trim(),
      fechaNacimiento: formData.fechaNacimiento,
      horaNacimiento: formattedTime,
      lugarNacimiento: formData.lugarNacimiento.trim(),
      ocupacion: formData.ocupacion.trim(),
      paisResidencia: formData.paisResidencia.trim(),
      tienePareja: resolvedPareja,
      sexo: resolvedSexo,
      identificacionSexual: resolvedIdentificacion,
      nivelEducativo: formData.nivelEducativo,
      hijosCuantos: formData.hijosCuantos.trim(),
      conQuienesVive: formData.conQuienesVive.trim(),
      profesaReligion: formData.profesaReligion.trim(),
      condicionMedicaMedicamentos: formData.condicionMedicaMedicamentos.trim(),
      asistidoTerapiaAnterioridad: formData.asistidoTerapiaAnterioridad.trim(),
      situacionEstresanteReciente: formData.situacionEstresanteReciente.trim(),
      comoSeSienteHoy: formData.comoSeSienteHoy.trim(),
      motivoAtencionPsicologica: formData.motivoAtencionPsicologica.trim(),
      sentimientoAlHablarTema: formData.sentimientoAlHablarTema.trim(),
      areasAfectadasComo: formData.areasAfectadasComo.trim(),
      intensidadDel1Al10: formData.intensidadDel1Al10,
      actividadAfrontarEstrategia: formData.actividadAfrontarEstrategia.trim(),
      expectativasAcompanamiento: formData.expectativasAcompanamiento.trim(),
    };

    // 1. Mostrar objeto en consola tal como lo requiere el prompt
    console.log('✅ Formulario Clínico de Janis enviado con éxito:', finalSubmissionPayload);

    // 2. Guardar en base de datos local y Supabase para que Janis (Admin) lo descargue en su panel
    try {
      dbService.saveIntakeSubmission(finalSubmissionPayload);
    } catch (err) {
      console.error('Error guardando en dbService:', err);
    }

    // 3. Simular breve espera para feedback UX
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Scroll al encabezado del mensaje de éxito
      const headerEl = document.getElementById('formulario');
      if (headerEl) {
        headerEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 450);
  };

  // Clear form handler with confirmation
  const handleConfirmClear = () => {
    setFormData({
      email: '',
      nombre: '',
      apellidos: '',
      edad: '',
      fechaNacimiento: '',
      horaNacimientoHora: '08',
      horaNacimientoMin: '00',
      horaNacimientoPeriodo: 'AM',
      lugarNacimiento: '',
      ocupacion: '',
      paisResidencia: '',
      tienePareja: '',
      tieneParejaOtro: '',
      sexo: '',
      sexoOtro: '',
      identificacionSexual: '',
      identificacionSexualOtro: '',
      nivelEducativo: '',
      hijosCuantos: '',
      conQuienesVive: '',
      profesaReligion: '',
      condicionMedicaMedicamentos: '',
      asistidoTerapiaAnterioridad: '',
      situacionEstresanteReciente: '',
      comoSeSienteHoy: '',
      motivoAtencionPsicologica: '',
      sentimientoAlHablarTema: '',
      areasAfectadasComo: '',
      intensidadDel1Al10: 0,
      actividadAfrontarEstrategia: '',
      expectativasAcompanamiento: '',
    });
    setErrors({});
    setShowClearConfirm(false);
  };

  return (
    <section 
      id="formulario" 
      className="relative py-20 sm:py-32 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F8FAFD] via-[#EEF4FB] to-[#F8FAFD] overflow-x-hidden"
    >
      {/* Decorative ambient blurred orbs matching site palette */}
      <div className="absolute top-1/4 -left-36 w-96 h-96 rounded-full bg-[#D6567F]/10 blur-[100px] pointer-events-none -z-10 overflow-hidden" />
      <div className="absolute bottom-1/4 -right-36 w-96 h-96 rounded-full bg-[#2F5BD6]/10 blur-[100px] pointer-events-none -z-10 overflow-hidden" />

      <div className="max-w-4xl mx-auto w-full">
        
        {/* ENCABEZADO DE LA SECCIÓN */}
        <div className="text-center mb-8 sm:mb-14 space-y-3 sm:space-y-4">
          <h2 className="font-montserrat font-light text-xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1E3A8A] tracking-wide leading-tight px-2">
            Bienvenido/a a Psicoterapia con Janis
          </h2>

          <p className="max-w-2xl mx-auto text-xs sm:text-base text-[#4B5675] leading-relaxed px-2">
            Este formulario me ayuda a conocerte un poco antes de nuestra sesión, todos los datos proporcionados estarán a mi resguardo. Solo se utilizarán para ver tus necesidades y suministrarte información relevante del servicio de psicoterapia acorde con ellas.
          </p>

          <p className="text-xs sm:text-sm font-semibold text-rose-600 inline-block pt-1">
            * Indica que la pregunta es obligatoria
          </p>
        </div>

        {/* SI YA SE ENVIÓ CON ÉXITO: Mensaje de agradecimiento solicitado */}
        {submitted ? (
          <div className="glass-card rounded-[28px] p-6 sm:p-14 text-center space-y-6 shadow-2xl border border-white/95 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50/60">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3 max-w-lg mx-auto">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3A8A]">
                ¡Gracias por completar el formulario!
              </h3>
              <p className="text-base sm:text-lg text-[#2D3748] font-medium leading-relaxed">
                Me pondré en contacto contigo pronto.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-2">
                Tus respuestas ya quedaron resguardadas de manera segura y confidencial en el expediente clínico de Janis. Si necesitas agendar tu sesión de inmediato o hacer una consulta puntual, también puedes escribirme por WhatsApp.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  handleConfirmClear();
                }}
                className="px-6 py-3 rounded-full text-xs font-semibold text-[#1E3A8A] bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
              >
                Completar otro formulario
              </button>

              <a
                href="#contacto"
                className="px-7 py-3 rounded-full text-xs font-semibold text-white btn-primary-gradient shadow-md hover:shadow-lg transition-all"
              >
                Ir a información de contacto
              </a>
            </div>
          </div>
        ) : (
          /* FORMULARIO COMPLETO */
          <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-8">
            
            {/* BARRA DE PROGRESO SIEMPRE VISIBLE AL SCROLL (STICKY) */}
            <div className="sticky top-16 sm:top-20 z-30 glass-card rounded-2xl p-3.5 sm:p-5 shadow-xl border border-white/95 backdrop-blur-xl transition-all">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#1E3A8A] mb-1.5 sm:mb-2">
                <span>Progreso del Cuestionario</span>
                <span className="text-[#D6567F] font-bold text-xs sm:text-sm">
                  {progressCount} de 26 preguntas ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100/90 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div 
                  className="h-full rounded-full transition-all duration-300 btn-primary-gradient"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* SECCIÓN 1: DATOS BÁSICOS Y DEMOGRÁFICOS */}
            <div className="glass-card rounded-[24px] sm:rounded-[28px] p-4 sm:p-8 space-y-6 shadow-xl border border-white/95 max-w-full">
              <div className="border-b border-slate-200/80 pb-3">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E3A8A]">
                  Datos de Contacto y Personales
                </h3>
                <p className="text-xs text-slate-500">
                  Información para poder comunicarme contigo y estructurar tu ficha.
                </p>
              </div>

              {/* 1. Email */}
              <div id="field-email" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  1. Email <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 ${
                    errors.email 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Grid 2 y 3: Nombre y Apellidos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 2. Nombre */}
                <div id="field-nombre" className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                    2. Nombre <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    placeholder="Tu primer y segundo nombre"
                    className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 ${
                      errors.nombre 
                        ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                        : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                    }`}
                    required
                  />
                  {errors.nombre && (
                    <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.nombre}
                    </p>
                  )}
                </div>

                {/* 3. Apellidos */}
                <div id="field-apellidos" className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                    3. Apellidos <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => handleChange('apellidos', e.target.value)}
                    placeholder="Tus apellidos completos"
                    className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 ${
                      errors.apellidos 
                        ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                        : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                    }`}
                    required
                  />
                  {errors.apellidos && (
                    <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.apellidos}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. Edad */}
              <div id="field-edad" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  4. Edad <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.edad}
                  onChange={(e) => handleChange('edad', e.target.value)}
                  placeholder="Ej: 32"
                  className={`w-full max-w-xs px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 ${
                    errors.edad 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.edad && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.edad}
                  </p>
                )}
              </div>

              {/* Grid 5 y 6: Fecha y Hora de Nacimiento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 5. Fecha de nacimiento */}
                <div id="field-fechaNacimiento" className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                    5. Fecha de nacimiento <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 ${
                        errors.fechaNacimiento 
                          ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                          : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                      }`}
                      required
                    />
                  </div>
                  {errors.fechaNacimiento && (
                    <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.fechaNacimiento}
                    </p>
                  )}
                </div>

                {/* 6. Hora de nacimiento */}
                <div id="field-horaNacimiento" className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                    6. Hora de nacimiento <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Hora */}
                    <select
                      value={formData.horaNacimientoHora}
                      onChange={(e) => handleChange('horaNacimientoHora', e.target.value)}
                      className="px-3 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                    >
                      {['01','02','03','04','05','06','07','08','09','10','11','12'].map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <span className="text-slate-400 font-bold">:</span>
                    {/* Minutos */}
                    <select
                      value={formData.horaNacimientoMin}
                      onChange={(e) => handleChange('horaNacimientoMin', e.target.value)}
                      className="px-3 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                    >
                      {['00','05','10','15','20','25','30','35','40','45','50','55'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {/* AM / PM */}
                    <select
                      value={formData.horaNacimientoPeriodo}
                      onChange={(e) => handleChange('horaNacimientoPeriodo', e.target.value)}
                      className="px-3 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border border-slate-200/90 font-semibold text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  {errors.horaNacimiento && (
                    <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.horaNacimiento}
                    </p>
                  )}
                </div>
              </div>

              {/* Grid 7, 8 y 9: Lugar de nacimiento, Ocupación y País de residencia */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* 7. Lugar de nacimiento */}
                <div id="field-lugarNacimiento" className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                    7. Lugar de nacimiento <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lugarNacimiento}
                    onChange={(e) => handleChange('lugarNacimiento', e.target.value)}
                    placeholder="Ciudad y País natal"
                    className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 ${
                      errors.lugarNacimiento 
                        ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                        : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                    }`}
                    required
                  />
                  {errors.lugarNacimiento && (
                    <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.lugarNacimiento}
                    </p>
                  )}
                </div>

                {/* 8. Ocupación */}
                <div id="field-ocupacion" className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                    8. Ocupación <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ocupacion}
                    onChange={(e) => handleChange('ocupacion', e.target.value)}
                    placeholder="A qué te dedicas"
                    className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 ${
                      errors.ocupacion 
                        ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                        : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                    }`}
                    required
                  />
                  {errors.ocupacion && (
                    <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.ocupacion}
                    </p>
                  )}
                </div>

                {/* 9. País de residencia */}
                <div id="field-paisResidencia" className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                    9. País de residencia <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.paisResidencia}
                    onChange={(e) => handleChange('paisResidencia', e.target.value)}
                    placeholder="Dónde vives actualmente"
                    className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 ${
                      errors.paisResidencia 
                        ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                        : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                    }`}
                    required
                  />
                  {errors.paisResidencia && (
                    <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.paisResidencia}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: SITUACIÓN VINCULAR, IDENTIDAD Y CONTEXTO */}
            <div className="glass-card rounded-[28px] p-6 sm:p-8 space-y-6 shadow-xl border border-white/95">
              <div className="border-b border-slate-200/80 pb-3">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E3A8A]">
                  Contexto Personal, Relacional y Social
                </h3>
                <p className="text-xs text-slate-500">
                  Nos ayuda a comprender tu entorno vincular cotidiano.
                </p>
              </div>

              {/* 10. ¿Tienes pareja? */}
              <div id="field-tienePareja" className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  10. ¿Tienes pareja? <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="space-y-2">
                  {['Si', 'No', 'Otro:'].map((opt) => (
                    <label 
                      key={opt} 
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                        formData.tienePareja === opt 
                          ? 'bg-[#EEF4FB] border-[#2F5BD6] shadow-sm' 
                          : 'bg-white/70 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tienePareja"
                        value={opt}
                        checked={formData.tienePareja === opt}
                        onChange={() => handleChange('tienePareja', opt)}
                        className="w-4 h-4 text-[#2F5BD6] focus:ring-[#2F5BD6]"
                      />
                      <span className="text-xs sm:text-sm font-medium text-[#1E3A8A]">{opt}</span>
                    </label>
                  ))}
                  {formData.tienePareja === 'Otro:' && (
                    <input
                      type="text"
                      value={formData.tieneParejaOtro}
                      onChange={(e) => handleChange('tieneParejaOtro', e.target.value)}
                      placeholder="Describe tu situación de pareja..."
                      className="w-full mt-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                      autoFocus
                    />
                  )}
                </div>
                {errors.tienePareja && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.tienePareja}
                  </p>
                )}
              </div>

              {/* 11. Sexo */}
              <div id="field-sexo" className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  11. Sexo <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="space-y-2">
                  {['Femenino', 'Masculino', 'Prefiero no decirlo', 'Otro:'].map((opt) => (
                    <label 
                      key={opt} 
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                        formData.sexo === opt 
                          ? 'bg-[#EEF4FB] border-[#2F5BD6] shadow-sm' 
                          : 'bg-white/70 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sexo"
                        value={opt}
                        checked={formData.sexo === opt}
                        onChange={() => handleChange('sexo', opt)}
                        className="w-4 h-4 text-[#2F5BD6] focus:ring-[#2F5BD6]"
                      />
                      <span className="text-xs sm:text-sm font-medium text-[#1E3A8A]">{opt}</span>
                    </label>
                  ))}
                  {formData.sexo === 'Otro:' && (
                    <input
                      type="text"
                      value={formData.sexoOtro}
                      onChange={(e) => handleChange('sexoOtro', e.target.value)}
                      placeholder="Especifica tu sexo..."
                      className="w-full mt-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                      autoFocus
                    />
                  )}
                </div>
                {errors.sexo && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.sexo}
                  </p>
                )}
              </div>

              {/* 12. Identificación sexual */}
              <div id="field-identificacionSexual" className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  12. Identificación sexual <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="space-y-2">
                  {['Heterosexual', 'Homosexual', 'Otro:'].map((opt) => (
                    <label 
                      key={opt} 
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                        formData.identificacionSexual === opt 
                          ? 'bg-[#EEF4FB] border-[#2F5BD6] shadow-sm' 
                          : 'bg-white/70 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="identificacionSexual"
                        value={opt}
                        checked={formData.identificacionSexual === opt}
                        onChange={() => handleChange('identificacionSexual', opt)}
                        className="w-4 h-4 text-[#2F5BD6] focus:ring-[#2F5BD6]"
                      />
                      <span className="text-xs sm:text-sm font-medium text-[#1E3A8A]">{opt}</span>
                    </label>
                  ))}
                  {formData.identificacionSexual === 'Otro:' && (
                    <input
                      type="text"
                      value={formData.identificacionSexualOtro}
                      onChange={(e) => handleChange('identificacionSexualOtro', e.target.value)}
                      placeholder="Especifica tu orientación o identidad..."
                      className="w-full mt-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                      autoFocus
                    />
                  )}
                </div>
                {errors.identificacionSexual && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.identificacionSexual}
                  </p>
                )}
              </div>

              {/* 13. Nivel educativo */}
              <div id="field-nivelEducativo" className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  13. Nivel educativo <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Bachiller', 'Profesional', 'Postgrado'].map((lvl) => (
                    <label 
                      key={lvl} 
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                        formData.nivelEducativo === lvl 
                          ? 'bg-[#EEF4FB] border-[#2F5BD6] shadow-sm' 
                          : 'bg-white/70 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="nivelEducativo"
                        value={lvl}
                        checked={formData.nivelEducativo === lvl}
                        onChange={() => handleChange('nivelEducativo', lvl)}
                        className="w-4 h-4 text-[#2F5BD6] focus:ring-[#2F5BD6]"
                      />
                      <span className="text-xs sm:text-sm font-medium text-[#1E3A8A]">{lvl}</span>
                    </label>
                  ))}
                </div>
                {errors.nivelEducativo && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.nivelEducativo}
                  </p>
                )}
              </div>

              {/* 14. ¿Tienes hijos? cuántos? */}
              <div id="field-hijosCuantos" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  14. ¿Tienes hijos? cuántos? <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.hijosCuantos}
                  onChange={(e) => handleChange('hijosCuantos', e.target.value)}
                  placeholder="Ej: No tengo / Sí, 2 hijos (edades: 4 y 7)"
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 ${
                    errors.hijosCuantos 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.hijosCuantos && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.hijosCuantos}
                  </p>
                )}
              </div>

              {/* 15. ¿Con quiénes vive actualmente? */}
              <div id="field-conQuienesVive" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  15. ¿Con quiénes vive actualmente? <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.conQuienesVive}
                  onChange={(e) => handleChange('conQuienesVive', e.target.value)}
                  placeholder="Ej: Vivo sola / Con mi pareja e hijos / Con mis padres"
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 ${
                    errors.conQuienesVive 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.conQuienesVive && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.conQuienesVive}
                  </p>
                )}
              </div>

              {/* 16. ¿Profesa alguna religión? */}
              <div id="field-profesaReligion" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  16. ¿Profesa alguna religión? <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.profesaReligion}
                  onChange={(e) => handleChange('profesaReligion', e.target.value)}
                  placeholder="Ej: Ninguna / Católica / Cristiana / Budismo / Espiritual no religioso"
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 ${
                    errors.profesaReligion 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.profesaReligion && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.profesaReligion}
                  </p>
                )}
              </div>
            </div>

            {/* SECCIÓN 3: HISTORIAL MÉDICO Y ANTECEDENTES TERAPÉUTICOS */}
            <div className="glass-card rounded-[28px] p-6 sm:p-8 space-y-6 shadow-xl border border-white/95">
              <div className="border-b border-slate-200/80 pb-3">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E3A8A]">
                  Historial Médico y Antecedentes
                </h3>
                <p className="text-xs text-slate-500">
                  Nos permite evaluar aspectos biológicos y experiencias previas.
                </p>
              </div>

              {/* 17. ¿Ha tenido ultimamente alguna condición médica? ¿De ser así está tomando algún medicamento? */}
              <div id="field-condicionMedicaMedicamentos" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A] leading-snug">
                  17. ¿Ha tenido ultimamente alguna condición médica? ¿De ser así está tomando algún medicamento? <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.condicionMedicaMedicamentos}
                  onInput={handleTextareaInput}
                  onChange={(e) => handleChange('condicionMedicaMedicamentos', e.target.value)}
                  placeholder="Detalla cualquier condición de salud reciente, cirugías, diagnósticos médicos o fármacos que tomes actualmente..."
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 resize-none ${
                    errors.condicionMedicaMedicamentos 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.condicionMedicaMedicamentos && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.condicionMedicaMedicamentos}
                  </p>
                )}
              </div>

              {/* 18. ¿Has asistido a terapia con anterioridad? de ser así ¿qué valoraste más sobre las sesiones y qué pudiera mejorar? */}
              <div id="field-asistidoTerapiaAnterioridad" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A] leading-snug">
                  18. ¿Has asistido a terapia con anterioridad? de ser así ¿qué valoraste más sobre las sesiones y qué pudiera mejorar? <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.asistidoTerapiaAnterioridad}
                  onInput={handleTextareaInput}
                  onChange={(e) => handleChange('asistidoTerapiaAnterioridad', e.target.value)}
                  placeholder="Coméntame si es tu primera vez en terapia o si has tenido experiencias anteriores, qué te funcionó y qué no..."
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 resize-none ${
                    errors.asistidoTerapiaAnterioridad 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.asistidoTerapiaAnterioridad && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.asistidoTerapiaAnterioridad}
                  </p>
                )}
              </div>

              {/* 19. ¿Has vivido recientemente alguna situación estresante? Desastres naturales, pérdida de algún familiar, diagnóstico de alguna enfermedad, migración... */}
              <div id="field-situacionEstresanteReciente" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A] leading-snug">
                  19. ¿Has vivido recientemente alguna situación estresante? Desastres naturales, pérdida de algún familiar, diagnóstico de alguna enfermedad, migración... <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.situacionEstresanteReciente}
                  onInput={handleTextareaInput}
                  onChange={(e) => handleChange('situacionEstresanteReciente', e.target.value)}
                  placeholder="Describe eventos de alto impacto emocional o cambios vitales significativos en los últimos meses..."
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 resize-none ${
                    errors.situacionEstresanteReciente 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.situacionEstresanteReciente && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.situacionEstresanteReciente}
                  </p>
                )}
              </div>
            </div>

            {/* SECCIÓN 4: MOTIVO DE CONSULTA Y ESTADO EMOCIONAL ACTUAL */}
            <div className="glass-card rounded-[28px] p-6 sm:p-8 space-y-6 shadow-xl border border-white/95">
              <div className="border-b border-slate-200/80 pb-3">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E3A8A]">
                  Motivo de Consulta y Evaluación Emocional
                </h3>
                <p className="text-xs text-slate-500">
                  Cuéntame con total libertad cómo te sientes y qué te trae hoy a consulta.
                </p>
              </div>

              {/* 20. ¿Cómo se siente hoy? */}
              <div id="field-comoSeSienteHoy" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  20. ¿Cómo se siente hoy? <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.comoSeSienteHoy}
                  onInput={handleTextareaInput}
                  onChange={(e) => handleChange('comoSeSienteHoy', e.target.value)}
                  placeholder="Describe tu estado de ánimo actual, sensaciones en tu cuerpo o nivel de energía..."
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 resize-none ${
                    errors.comoSeSienteHoy 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.comoSeSienteHoy && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.comoSeSienteHoy}
                  </p>
                )}
              </div>

              {/* 21. ¿Qué le motivó a tomar atención psicológica en este momento? */}
              <div id="field-motivoAtencionPsicologica" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  21. ¿Qué le motivó a tomar atención psicológica en este momento? <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.motivoAtencionPsicologica}
                  onInput={handleTextareaInput}
                  onChange={(e) => handleChange('motivoAtencionPsicologica', e.target.value)}
                  placeholder="¿Cuál fue el detonante o punto de inflexión para buscar ayuda ahora?..."
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 resize-none ${
                    errors.motivoAtencionPsicologica 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.motivoAtencionPsicologica && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.motivoAtencionPsicologica}
                  </p>
                )}
              </div>

              {/* 22. ¿Cómo se siente al hablar de este tema? */}
              <div id="field-sentimientoAlHablarTema" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A]">
                  22. ¿Cómo se siente al hablar de este tema? <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.sentimientoAlHablarTema}
                  onInput={handleTextareaInput}
                  onChange={(e) => handleChange('sentimientoAlHablarTema', e.target.value)}
                  placeholder="¿Te genera alivio, miedo, tristeza, tensión en el pecho o en la garganta?..."
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 resize-none ${
                    errors.sentimientoAlHablarTema 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.sentimientoAlHablarTema && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.sentimientoAlHablarTema}
                  </p>
                )}
              </div>

              {/* 23. ¿En qué áreas de tu vida social, afectiva, laboral, consideras que te está afectando? y ¿cómo te está afectando? */}
              <div id="field-areasAfectadasComo" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A] leading-snug">
                  23. ¿En qué áreas de tu vida social, afectiva, laboral, consideras que te está afectando? y ¿cómo te está afectando? <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.areasAfectadasComo}
                  onInput={handleTextareaInput}
                  onChange={(e) => handleChange('areasAfectadasComo', e.target.value)}
                  placeholder="Detalla cómo impacta en tu trabajo, tu descanso, tu pareja, amigos o familia..."
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 resize-none ${
                    errors.areasAfectadasComo 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.areasAfectadasComo && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.areasAfectadasComo}
                  </p>
                )}
              </div>

              {/* 24. Escala lineal 1 al 10 */}
              <div id="field-intensidadDel1Al10" className="space-y-3 pt-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A] leading-snug">
                  24. ¿Del 1 al 10 que intensidad te parece que tiene el día de hoy el tema que quieres ver en sesiones? <span className="text-rose-500 font-bold">*</span>
                </label>
                
                {/* Botones circulares seleccionables del 1 al 10 */}
                <div className="pt-2 pb-1 max-w-full overflow-x-auto scrollbar-none">
                  <div className="flex items-center justify-between gap-1 sm:gap-2 min-w-[300px] sm:min-w-0">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const isSelected = formData.intensidadDel1Al10 === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleChange('intensidadDel1Al10', num)}
                          className={`w-7 h-7 sm:w-11 sm:h-11 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 transition-all cursor-pointer transform hover:scale-105 ${
                            isSelected
                              ? 'bg-[#1E3A8A] text-white shadow-lg ring-4 ring-[#2F5BD6]/30 scale-110'
                              : 'bg-white/90 text-slate-700 hover:bg-[#EEF4FB] border border-slate-200 shadow-sm'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  {/* Etiquetas de los extremos */}
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold text-slate-500 mt-3 px-1">
                    <span className="flex items-center gap-1 text-slate-500">
                      ← 1 (Baja)
                    </span>
                    {formData.intensidadDel1Al10 > 0 && (
                      <span className="text-[#D6567F] font-bold">
                        {formData.intensidadDel1Al10} / 10
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-500">
                      10 (Muy alta) →
                    </span>
                  </div>
                </div>

                {errors.intensidadDel1Al10 && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.intensidadDel1Al10}
                  </p>
                )}
              </div>
            </div>

            {/* SECCIÓN 5: ESTRATEGIAS Y EXPECTATIVAS */}
            <div className="glass-card rounded-[28px] p-6 sm:p-8 space-y-6 shadow-xl border border-white/95">
              <div className="border-b border-slate-200/80 pb-3">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E3A8A]">
                  Estrategias y Expectativas Terapéuticas
                </h3>
                <p className="text-xs text-slate-500">
                  Alineación de objetivos para acompañarte de forma personalizada.
                </p>
              </div>

              {/* 25. ¿Haz realizado alguna actividad para afrontar estos temas? alguna estrategia te ha funcionado? */}
              <div id="field-actividadAfrontarEstrategia" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A] leading-snug">
                  25. ¿Haz realizado alguna actividad para afrontar estos temas? alguna estrategia te ha funcionado? <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.actividadAfrontarEstrategia}
                  onInput={handleTextareaInput}
                  onChange={(e) => handleChange('actividadAfrontarEstrategia', e.target.value)}
                  placeholder="Ej: Meditación, ejercicio físico, lectura, escritura o algún recurso que sientas que te brinda calma..."
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 resize-none ${
                    errors.actividadAfrontarEstrategia 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.actividadAfrontarEstrategia && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.actividadAfrontarEstrategia}
                  </p>
                )}
              </div>

              {/* 26. ¿Qué expectativas tienes sobre el acompañamiento terapéutico y las sesiones? */}
              <div id="field-expectativasAcompanamiento" className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A8A] leading-snug">
                  26. ¿Qué expectativas tienes sobre el acompañamiento terapéutico y las sesiones? <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.expectativasAcompanamiento}
                  onInput={handleTextareaInput}
                  onChange={(e) => handleChange('expectativasAcompanamiento', e.target.value)}
                  placeholder="¿Qué esperas lograr en este proceso y qué esperas de mí como tu psicóloga?..."
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border transition-all focus:outline-none focus:ring-2 resize-none ${
                    errors.expectativasAcompanamiento 
                      ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                      : 'border-slate-200/90 focus:ring-[#2F5BD6] focus:border-transparent'
                  }`}
                  required
                />
                {errors.expectativasAcompanamiento && (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.expectativasAcompanamiento}
                  </p>
                )}
              </div>
            </div>

            {/* BOTONES DE ACCIÓN: ENVIAR Y BORRAR FORMULARIO */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              
              {/* Botón secundario: Borrar formulario */}
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Borrar formulario</span>
              </button>

              {/* Botón principal: Enviar */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full text-white font-semibold text-sm sm:text-base btn-primary-gradient shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Enviando información...</span>
                ) : (
                  <>
                    <span>Enviar</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* AVISO DE PRIVACIDAD REQUERIDO */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tus datos serán tratados con total confidencialidad.</span>
              </p>
            </div>

          </form>
        )}

      </div>

      {/* MODAL DE CONFIRMACIÓN PARA BORRAR FORMULARIO */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3A8A]/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl text-center border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1E3A8A]">
              ¿Borrar todas las respuestas?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Esta acción limpiará todos los campos del cuestionario y tendrás que completarlos nuevamente.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
              >
                Sí, borrar todo
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
