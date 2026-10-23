import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Video, CheckCircle2, User, Phone, Mail, FileText, ArrowRight, CreditCard, Shield } from 'lucide-react';
import { dbService, Appointment } from '../services/db';
import { getWhatsAppUrl, PAYPAL_CLIENT_ID } from '../config';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: 'Terapia Individual' | 'Terapia de Pareja';
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, defaultService = 'Terapia Individual' }) => {
  const currentUser = dbService.getCurrentUser();

  const [serviceType, setServiceType] = useState<'Terapia Individual' | 'Terapia de Pareja'>(defaultService);
  const [modality, setModality] = useState<'Presencial (Caracas)' | 'Online (Videollamada)'>('Presencial (Caracas)');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('10:30 AM');
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [reason, setReason] = useState('');
  
  const [savedAppointment, setSavedAppointment] = useState<Appointment | null>(null);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim()) {
      alert('Por favor completa tus datos de contacto para formalizar tu cita.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // 1. Guardar en la base de datos con estado "en_espera_de_confirmacion"
      const created = dbService.createAppointment({
        patientName,
        patientEmail,
        patientPhone,
        serviceType,
        modality,
        date,
        time,
        reason: reason.trim() || 'Consulta inicial de valoración y acompañamiento.',
        userId: currentUser?.id,
      });
      // Sobrescribir status a en_espera_de_confirmacion explícitamente para el admin
      dbService.updateAppointmentStatus(created.id, 'en_espera_de_confirmacion');
      created.status = 'en_espera_de_confirmacion';

      setSavedAppointment(created);
      setLoading(false);
      // 2. Saltar inmediatamente al checkout de pago
      setShowPaymentStep(true);
    }, 400);
  };

  const handleSimulatedPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowPaymentStep(false);
    }, 1000);
  };

  const handleResetAndClose = () => {
    setSavedAppointment(null);
    setShowPaymentStep(false);
    onClose();
  };

  const priceAmount = serviceType === 'Terapia Individual' ? '150' : '210';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#1E3A8A]/35 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl glass-modal rounded-[32px] p-6 sm:p-8 md:p-10 text-[#4B5675] shadow-2xl my-8"
        role="dialog"
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-white/80 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {showPaymentStep && savedAppointment ? (
          /* PAYMENT CHECKOUT STEP AFTER BOOKING */
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-200/60 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D6567F] uppercase tracking-wider mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Checkout de Cita Reservada</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E3A8A]">
                Selecciona tu método de pago
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tu cita ha quedado guardada en el sistema en <strong>Espera de Confirmación</strong>. Janis validará tu pago para marcarla como Confirmada.
              </p>
            </div>

            {/* Price summary */}
            <div className="flex items-baseline justify-between p-4 bg-gradient-to-r from-[#F5F8FF] to-[#EEF3FF] border border-blue-100 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-[#1E3A8A] block">{savedAppointment.serviceType}</span>
                <span className="text-[11px] text-slate-500">Plan mensual (4 sesiones)</span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-bold font-serif text-[#1E3A8A]">${priceAmount}</span>
                <span className="text-xs text-slate-500 ml-1">USD</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleSimulatedPayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm text-[#003087] bg-[#ffc439] hover:bg-[#f4bb33] shadow-sm transition-all cursor-pointer"
              >
                <span className="font-extrabold italic text-base">PayPal</span>
                <span>· Pagar ${priceAmount} USD</span>
              </button>

              <a
                href={getWhatsAppUrl(`Hola Janis, acabo de agendar mi cita para ${savedAppointment.serviceType} (${savedAppointment.date}). Quisiera coordinar el pago por transferencia o Zelle.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition-colors text-center"
              >
                <span>Pagar por Zelle / Transferencia (Coordinar por WhatsApp)</span>
              </a>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/60">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cita guardada en historial de admin</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPaymentStep(false)}
                className="text-[#2F5BD6] font-semibold hover:underline"
              >
                Ver resumen de cita
              </button>
            </div>
          </div>
        ) : savedAppointment ? (
          /* SUCCESS CONFIRMATION VIEW */
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E3A8A]">
                ¡Cita registrada en el sistema!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                La cita se encuentra en estado <strong className="text-amber-700">En espera de confirmación</strong> en el panel de Janis.
              </p>
            </div>

            {/* Appointment Summary Box */}
            <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 text-left space-y-3 text-xs sm:text-sm shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Servicio:</span>
                <span className="font-bold text-[#1E3A8A]">{savedAppointment.serviceType}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Modalidad:</span>
                <span className="font-bold text-[#2F5BD6] flex items-center gap-1.5">
                  {savedAppointment.modality.includes('Presencial') ? <MapPin className="w-3.5 h-3.5 text-[#D6567F]" /> : <Video className="w-3.5 h-3.5 text-[#2F5BD6]" />}
                  {savedAppointment.modality}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Fecha y Hora:</span>
                <span className="font-bold text-slate-800">{savedAppointment.date} a las {savedAppointment.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Estado:</span>
                <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full text-xs">En espera de confirmación</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPaymentStep(true)}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-white font-medium text-sm btn-primary-gradient shadow-lg cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Proceder al pago (${priceAmount} USD)</span>
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-white/60 rounded-xl transition-colors cursor-pointer"
              >
                Cerrar ventana
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM VIEW (WITHOUT THE HATED TOP TEXT) */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3A8A]">
                Agendar Sesión de Psicoterapia
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Selecciona la modalidad, el día y la hora que mejor se adapte a tu ritmo.
              </p>
            </div>

            {/* Service Type Selection */}
            <div>
              <label className="block text-xs font-bold text-[#1E3A8A] mb-2">
                1. Tipo de Terapia
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setServiceType('Terapia Individual')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                    serviceType === 'Terapia Individual'
                      ? 'bg-blue-50/90 border-[#2F5BD6] text-[#1E3A8A] shadow-sm'
                      : 'bg-white/70 border-slate-200/80 text-slate-600 hover:bg-white'
                  }`}
                >
                  <span className="block text-sm font-serif">Terapia Individual</span>
                  <span className="text-[11px] font-normal text-slate-500 mt-0.5">50 min · $150 USD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('Terapia de Pareja')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                    serviceType === 'Terapia de Pareja'
                      ? 'bg-pink-50/90 border-[#D6567F] text-[#1E3A8A] shadow-sm'
                      : 'bg-white/70 border-slate-200/80 text-slate-600 hover:bg-white'
                  }`}
                >
                  <span className="block text-sm font-serif">Terapia de Pareja</span>
                  <span className="text-[11px] font-normal text-slate-500 mt-0.5">60 min · $210 USD</span>
                </button>
              </div>
            </div>

            {/* Modality Selection */}
            <div>
              <label className="block text-xs font-bold text-[#1E3A8A] mb-2">
                2. Modalidad de Atención
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModality('Presencial (Caracas)')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                    modality === 'Presencial (Caracas)'
                      ? 'bg-white border-[#1E3A8A] text-[#1E3A8A] shadow-sm ring-1 ring-[#1E3A8A]'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#D6567F] shrink-0" />
                  <div className="text-left">
                    <span className="block">Presencial</span>
                    <span className="text-[10px] font-normal text-slate-500">Chacao, Caracas</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setModality('Online (Videollamada)')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                    modality === 'Online (Videollamada)'
                      ? 'bg-white border-[#1E3A8A] text-[#1E3A8A] shadow-sm ring-1 ring-[#1E3A8A]'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <Video className="w-4 h-4 text-[#2F5BD6] shrink-0" />
                  <div className="text-left">
                    <span className="block">Online</span>
                    <span className="text-[10px] font-normal text-slate-500">Videollamada privada</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1.5">
                  3. Fecha Deseada
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6] font-medium text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1.5">
                  4. Horario Disponible
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6] font-medium text-slate-800"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Patient Info Fields */}
            <div className="space-y-3 pt-1 border-t border-slate-200/60">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre completo <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Ej: Carolina Morales"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Correo electrónico <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Teléfono / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+58 412 1234567"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Motivo de consulta (opcional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Cuéntame brevemente qué te gustaría abordar en sesión..."
                    className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-white/90 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-white font-semibold text-sm btn-primary-gradient shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Registrando cita...' : 'Guardar cita y proceder al pago'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
