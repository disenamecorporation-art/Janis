import React, { useState } from 'react';
import { 
  X, Calendar, Clock, MapPin, Video, CheckCircle2, User, Phone, Mail, FileText, 
  ArrowRight, CreditCard, Shield, Copy, Check, ChevronDown, ChevronUp, DollarSign 
} from 'lucide-react';
import { dbService, Appointment } from '../services/db';
import { getWhatsAppUrl } from '../config';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: 'Terapia Individual' | 'Terapia de Pareja';
}

type PaymentMethod = 'PagoMovil' | 'Zelle' | 'Binance' | 'PayPal';

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
  
  // Interactive payment selection state
  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethod | null>('PagoMovil');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
  ];

  const priceAmount = serviceType === 'Terapia Individual' ? '170' : '210';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#1E3A8A]/35 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl glass-modal rounded-[32px] p-6 sm:p-8 text-[#4B5675] shadow-2xl my-8"
        role="dialog"
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-white/80 transition-colors cursor-pointer"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {showPaymentStep && savedAppointment ? (
          /* PAYMENT CHECKOUT STEP AFTER BOOKING */
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-200/60 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D6567F] uppercase tracking-wider mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Checkout de Cita Reservada</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E3A8A]">
                Selecciona tu método de pago
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Haz clic en la opción de tu preferencia para desplegar los datos bancarios y transferir.
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

            {/* INTERACTIVE PAYMENT OPTIONS TABLE */}
            <div className="space-y-3 pt-1">
              <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                Opciones de pago disponibles:
              </label>

              <div className="border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white/80 shadow-sm">
                
                {/* 1. PagoMovil */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod(activePaymentMethod === 'PagoMovil' ? null : 'PagoMovil')}
                    className={`w-full p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      activePaymentMethod === 'PagoMovil' ? 'bg-blue-50/70 text-[#1E3A8A]' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2F5BD6] font-bold text-xs flex items-center justify-center shrink-0">
                        PM
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#1E3A8A] block">PagoMóvil (Venezuela)</span>
                        <span className="text-[11px] text-slate-500">Banco de Venezuela · Tasa BCV</span>
                      </div>
                    </div>
                    {activePaymentMethod === 'PagoMovil' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {activePaymentMethod === 'PagoMovil' && (
                    <div className="p-4 bg-blue-50/30 border-t border-blue-100/60 space-y-3 text-xs animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium block">Banco:</span>
                            <span className="font-semibold text-slate-800">Banco de Venezuela (0102)</span>
                          </div>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium block">Cédula:</span>
                            <span className="font-mono font-semibold text-slate-800">V-18667839</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('18667839', 'pm-ci')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            title="Copiar Cédula"
                          >
                            {copiedKey === 'pm-ci' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between sm:col-span-2">
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium block">Teléfono:</span>
                            <span className="font-mono font-semibold text-slate-800">0424 9516897</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('04249516897', 'pm-phone')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            title="Copiar Teléfono"
                          >
                            {copiedKey === 'pm-phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <a
                        href={getWhatsAppUrl(`Hola Janis, agendé mi cita (${savedAppointment.serviceType}) para el ${savedAppointment.date} a las ${savedAppointment.time}. Adjunto el comprobante de PagoMóvil.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white btn-primary-gradient shadow transition-all cursor-pointer"
                      >
                        <span>Enviar comprobante por WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* 2. Zelle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod(activePaymentMethod === 'Zelle' ? null : 'Zelle')}
                    className={`w-full p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      activePaymentMethod === 'Zelle' ? 'bg-purple-50/70 text-[#1E3A8A]' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                        Z
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#1E3A8A] block">Zelle</span>
                        <span className="text-[11px] text-slate-500">Transferencia directa USD</span>
                      </div>
                    </div>
                    {activePaymentMethod === 'Zelle' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {activePaymentMethod === 'Zelle' && (
                    <div className="p-4 bg-purple-50/30 border-t border-purple-100/60 space-y-3 text-xs animate-in fade-in duration-150">
                      <div className="space-y-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium block">Teléfono Zelle:</span>
                            <span className="font-mono font-semibold text-slate-800">+1 (469) 739-0942</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('+14697390942', 'zelle-phone')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            title="Copiar Teléfono Zelle"
                          >
                            {copiedKey === 'zelle-phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium block">Correo Zelle:</span>
                            <span className="font-mono font-semibold text-slate-800">diegojzr92@gmail.com</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('diegojzr92@gmail.com', 'zelle-email')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            title="Copiar Correo Zelle"
                          >
                            {copiedKey === 'zelle-email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <a
                        href={getWhatsAppUrl(`Hola Janis, agendé mi cita (${savedAppointment.serviceType}) para el ${savedAppointment.date} a las ${savedAppointment.time}. Adjunto el comprobante de pago por Zelle.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 shadow transition-all cursor-pointer"
                      >
                        <span>Enviar comprobante Zelle por WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* 3. Binance */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod(activePaymentMethod === 'Binance' ? null : 'Binance')}
                    className={`w-full p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      activePaymentMethod === 'Binance' ? 'bg-amber-50/70 text-[#1E3A8A]' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#F0B90B]/20 text-[#D9A000] font-black text-xs flex items-center justify-center shrink-0 border border-[#F0B90B]/40">
                        B
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#1E3A8A] block">Binance</span>
                        <span className="text-[11px] text-slate-500">Pago en Crypto / Binance Pay</span>
                      </div>
                    </div>
                    {activePaymentMethod === 'Binance' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {activePaymentMethod === 'Binance' && (
                    <div className="p-4 bg-amber-50/40 border-t border-amber-100/80 space-y-3 text-xs animate-in fade-in duration-150">
                      <p className="text-slate-600 font-medium">
                        Haz clic en el botón oficial para abrir la solicitud de pago en Binance Pay:
                      </p>

                      <a
                        href="https://app.binance.com/uni-qr/request-to-pay?billOrderId=462202091739996160&billType=request_a_payment"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm text-black bg-[#F0B90B] hover:bg-[#E0AC07] shadow-md transition-all cursor-pointer"
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0L5.3 6.7l2.2 2.2L12 4.4l4.5 4.5 2.2-2.2L12 0zm-6.7 12L0 12l2.2 2.2L6.7 9.7 4.5 7.5 2.2 9.8 0 12l2.2 2.2 2.3-2.2zM12 24l6.7-6.7-2.2-2.2L12 19.6l-4.5-4.5-2.2 2.2L12 24zm6.7-12l2.3 2.2L24 12l-2.2-2.2-2.3 2.2 2.2 2.2L24 12l-2.2-2.2-3.1 3zm-6.7-5.3L6.7 12 12 17.3 17.3 12 12 6.7z" />
                        </svg>
                        <span>Pagar con Binance</span>
                      </a>

                      <a
                        href={getWhatsAppUrl(`Hola Janis, agendé mi cita (${savedAppointment.serviceType}) para el ${savedAppointment.date} a las ${savedAppointment.time}. Adjunto comprobante de pago por Binance.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
                      >
                        <span>Enviar comprobante por WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* 4. PayPal */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod(activePaymentMethod === 'PayPal' ? null : 'PayPal')}
                    className={`w-full p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      activePaymentMethod === 'PayPal' ? 'bg-sky-50/70 text-[#1E3A8A]' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#003087]/15 text-[#003087] font-bold text-xs flex items-center justify-center shrink-0 border border-[#003087]/20">
                        PP
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#1E3A8A] block">PayPal</span>
                        <span className="text-[11px] text-slate-500">Tarjeta Internacional / PayPal</span>
                      </div>
                    </div>
                    {activePaymentMethod === 'PayPal' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {activePaymentMethod === 'PayPal' && (
                    <div className="p-4 bg-sky-50/40 border-t border-sky-100/80 space-y-3 text-xs animate-in fade-in duration-150">
                      <p className="text-slate-600 font-medium">
                        Haz clic en el botón oficial para completar tu pago de forma segura a través de PayPal:
                      </p>

                      <a
                        href="https://www.paypal.com/ncp/payment/RZTQFAEKXBTQA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm text-white bg-[#0070BA] hover:bg-[#005EA6] shadow-md transition-all cursor-pointer"
                      >
                        <span className="font-extrabold italic text-base">PayPal</span>
                        <span>· Pagar con PayPal</span>
                      </a>

                      <a
                        href={getWhatsAppUrl(`Hola Janis, agendé mi cita (${savedAppointment.serviceType}) para el ${savedAppointment.date} a las ${savedAppointment.time}. Adjunto comprobante de pago por PayPal.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
                      >
                        <span>Enviar comprobante por WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/60">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cita guardada en historial de admin</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPaymentStep(false)}
                className="text-[#2F5BD6] font-semibold hover:underline cursor-pointer"
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
          /* BOOKING FORM VIEW */
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
                  <span className="text-[11px] font-normal text-slate-500 mt-0.5">50 min · $170 USD</span>
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
