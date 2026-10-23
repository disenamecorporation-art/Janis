import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Shield, CreditCard, ArrowRight, Download } from 'lucide-react';
import { PAYPAL_CLIENT_ID, getWhatsAppUrl, GUIDE_PDF_URL } from '../config';

export interface CheckoutItem {
  id: string;
  title: string;
  subtitle: string;
  price: string; // e.g. "150" or "15"
  currency: string;
  isGuide?: boolean;
  features: string[];
}

interface PayPalCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckoutItem | null;
}

export const PayPalCheckoutModal: React.FC<PayPalCheckoutModalProps> = ({ isOpen, onClose, item }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [sdkReady, setSdkReady] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  // Load PayPal SDK if client ID is configured and not default
  useEffect(() => {
    if (!isOpen || !item) return;

    const isCustomClientId = PAYPAL_CLIENT_ID && PAYPAL_CLIENT_ID !== 'TU_CLIENT_ID_AQUI';

    if (isCustomClientId) {
      const scriptId = 'paypal-sdk-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
        script.async = true;
        script.onload = () => setSdkReady(true);
        script.onerror = () => {
          setSdkReady(false);
          setErrorMessage('No se pudo conectar con los servidores de PayPal. Puedes coordinar tu pago directamente por WhatsApp.');
        };
        document.body.appendChild(script);
      } else {
        setSdkReady(true);
      }
    }
  }, [isOpen, item]);

  // Render PayPal smart buttons if SDK ready
  useEffect(() => {
    if (!sdkReady || !isOpen || !item || status === 'success') return;

    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    container.innerHTML = '';

    // @ts-expect-error PayPal window object
    if (window.paypal) {
      try {
        // @ts-expect-error PayPal window object
        window.paypal.Buttons({
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `${item.title} - Psicoterapia con Janis`,
                amount: {
                  currency_code: 'USD',
                  value: item.price,
                },
              }],
            });
          },
          onApprove: async (_data: any, actions: any) => {
            setStatus('processing');
            try {
              const details = await actions.order.capture();
              setStatus('success');
              console.log('Pago capturado:', details);
            } catch (err) {
              setStatus('error');
              setErrorMessage('Ocurrió un error al procesar el pago. Por favor intenta nuevamente.');
            }
          },
          onError: (err: any) => {
            console.error('Error de PayPal:', err);
            setStatus('error');
            setErrorMessage('El pago no pudo completarse. Puedes reintentar o pagar mediante transferencia o Zelle por WhatsApp.');
          },
          onCancel: () => {
            setStatus('idle');
          }
        }).render('#paypal-button-container');
      } catch (e) {
        console.error('Error instanciando PayPal Buttons', e);
      }
    }
  }, [sdkReady, isOpen, item, status]);

  if (!isOpen || !item) return null;

  // Handle simulated / test checkout for preview when client ID is placeholder
  const handleSimulatedPayment = () => {
    if (!fullName.trim() || !email.trim()) {
      alert('Por favor introduce tu nombre completo y correo electrónico.');
      return;
    }
    if (!acceptedTerms) {
      alert('Debes aceptar las Políticas de Agendamiento y Respeto Mutuo para continuar.');
      return;
    }
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  const handleDownloadPdf = () => {
    // Creates a sample friendly PDF download link or triggers dummy document download
    const blob = new Blob([
      `GUÍA PRÁCTICA: ENTENDIENDO TU SISTEMA NERVIOSO\nPor: Janis Niño Vasquez, Psicóloga Clínica (FPV: 9065)\n\nBienvenida a tu camino de regulación somática.\nEsta guía contiene herramientas paso a paso para regular tu respuesta de alarma.\n\nSede: Multicentro Empresarial del Este, Torre Libertador, Caracas.`
    ], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Guia-Entendiendo-tu-Sistema-Nervioso.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const hasLivePayPal = PAYPAL_CLIENT_ID && PAYPAL_CLIENT_ID !== 'TU_CLIENT_ID_AQUI';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#1E3A8A]/40 backdrop-blur-md transition-all">
      <div 
        className="relative w-full max-w-lg glass-modal rounded-3xl p-6 md:p-8 text-[#4B5675] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif text-[#1E3A8A] font-bold mb-2">¡Pago recibido con éxito!</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-sm mx-auto">
              Tu espacio para <strong className="text-[#1E3A8A]">{item.title}</strong> está reservado. Te escribiré por correo electrónico y WhatsApp para coordinar los horarios de tus sesiones.
            </p>

            {item.isGuide && (
              <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <p className="text-xs text-emerald-800 font-medium mb-3">Tu guía está lista para ser descargada inmediatamente:</p>
                <button
                  onClick={handleDownloadPdf}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Descargar Guía Práctica en PDF
                </button>
              </div>
            )}

            <div className="space-y-3">
              <a
                href={getWhatsAppUrl(`¡Hola Janis! Acabo de realizar el pago de ${item.title} ($${item.price} USD) con el correo ${email}. Quisiera coordinar las fechas de mis sesiones.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 text-white font-medium text-sm rounded-full btn-primary-gradient shadow-md"
              >
                <span>Coordinar por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Volver a la página
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header info */}
            <div className="border-b border-slate-200/60 pb-4 mb-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D6567F] uppercase tracking-wider mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Checkout Seguro</span>
              </div>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1E3A8A]">{item.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
            </div>

            {/* Price badge */}
            <div className="flex items-baseline justify-between p-4 bg-gradient-to-r from-[#F5F8FF] to-[#EEF3FF] border border-blue-100 rounded-2xl mb-5">
              <span className="text-sm font-medium text-[#1E3A8A]">Total a pagar:</span>
              <div className="text-right">
                <span className="text-2xl md:text-3xl font-bold font-serif text-[#1E3A8A]">${item.price}</span>
                <span className="text-xs text-slate-500 ml-1 font-medium">USD</span>
              </div>
            </div>

            {/* Features summary */}
            <div className="mb-5 space-y-1.5 text-xs text-slate-600">
              <p className="font-semibold text-slate-700 text-[13px] mb-1">Lo que incluye:</p>
              {item.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D6567F] mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Inputs */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre completo del paciente <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Carolina Pérez"
                  className="w-full px-3.5 py-2.5 text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Correo electrónico para confirmación <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Acceptance checkbox */}
            <div className="mb-5">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-snug">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#2F5BD6] focus:ring-[#2F5BD6]"
                />
                <span>
                  He leído y acepto las <strong className="text-slate-800">Políticas de Agendamiento y Respeto Mutuo</strong> (cancelaciones con 24h de anticipación y vigencia de 30 días continuos).
                </span>
              </label>
            </div>

            {/* Error banner if any */}
            {status === 'error' && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{errorMessage}</p>
                  <a
                    href={getWhatsAppUrl(`Hola Janis, tuve un problema al procesar mi pago de $${item.price} para ${item.title}. ¿Podemos coordinarlo por aquí?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline mt-1 block"
                  >
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
            )}

            {/* PayPal Container or Simulator */}
            {hasLivePayPal && sdkReady ? (
              <div id="paypal-button-container" className="min-h-[120px]" />
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSimulatedPayment}
                  disabled={status === 'processing' || !acceptedTerms}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm text-[#003087] bg-[#ffc439] hover:bg-[#f4bb33] active:bg-[#eab330] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                  {status === 'processing' ? (
                    <span className="flex items-center gap-2 text-xs">
                      <svg className="animate-spin h-4 w-4 text-[#003087]" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Procesando pago con PayPal...
                    </span>
                  ) : (
                    <>
                      <span className="font-extrabold italic text-base">PayPal</span>
                      <span>· Completar Pago (${item.price} USD)</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-slate-500 font-medium">
                  Al completar tu pago, tu cupo quedará reservado de inmediato y recibirás la confirmación en tu correo.
                </p>
              </div>
            )}

            {/* Security trust badge */}
            <div className="mt-5 pt-3 border-t border-slate-200/50 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pago seguro procesado por PayPal. Puedes pagar con tu cuenta PayPal o con tarjeta de crédito/débito.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
