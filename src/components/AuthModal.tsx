import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { dbService } from '../services/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync mode if defaultMode changes on open
  React.useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (mode === 'login') {
      const res = dbService.login(email, password);
      setLoading(false);
      if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(res.error || 'Credenciales no válidas.');
      }
    } else if (mode === 'register') {
      if (!name.trim() || !email.trim() || !phone.trim()) {
        setError('Por favor completa todos los campos.');
        setLoading(false);
        return;
      }
      const res = dbService.register(name, email, phone, password);
      setLoading(false);
      if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(res.error || 'No se pudo crear la cuenta.');
      }
    } else if (mode === 'forgot') {
      if (!email.trim()) {
        setError('Por favor ingresa tu correo electrónico.');
        setLoading(false);
        return;
      }
      const res = dbService.requestPasswordReset(email);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message || 'Instrucciones enviadas a tu correo para restablecer tu contraseña.');
      } else {
        setError(res.error || 'No pudimos encontrar esa cuenta.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#1E3A8A]/35 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-modal rounded-[32px] p-6 sm:p-8 text-[#4B5675] shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switcher (Login / Register only when not in forgot mode) */}
        {mode !== 'forgot' ? (
          <div className="flex items-center p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/80 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1E3A8A] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#1E3A8A] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Crear Cuenta
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F5BD6] hover:text-[#1E3A8A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Iniciar Sesión</span>
            </button>
          </div>
        )}

        {/* Title */}
        <div className="mb-5">
          <h2 className="font-serif text-2xl font-bold text-[#1E3A8A]">
            {mode === 'login' && 'Bienvenida a tu espacio'}
            {mode === 'register' && 'Crear tu cuenta clínica'}
            {mode === 'forgot' && 'Recuperar contraseña'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login' && 'Accede para gestionar tus citas y lecturas somáticas.'}
            {mode === 'register' && 'Regístrate para agendar y dar seguimiento a tu proceso.'}
            {mode === 'forgot' && 'Ingresa el correo electrónico asociado a tu cuenta para restablecer tu acceso.'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Mariana Silva"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teléfono / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+58 412 1234567"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  required
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Contraseña
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="text-[11px] font-semibold text-[#2F5BD6] hover:text-[#D6567F] transition-colors cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  required
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-white font-semibold text-sm btn-primary-gradient shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-70"
            >
              <span>
                {mode === 'login' && 'Iniciar Sesión'}
                {mode === 'register' && 'Registrarme'}
                {mode === 'forgot' && 'Enviar enlace de recuperación'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Bottom helper text */}
        {mode === 'login' && (
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                setError('');
                setSuccessMsg('');
              }}
              className="text-xs text-slate-500 hover:text-[#2F5BD6] font-medium transition-colors cursor-pointer"
            >
              ¿No recuerdas tu contraseña? <span className="font-semibold text-[#2F5BD6] underline">Recupérala aquí</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
