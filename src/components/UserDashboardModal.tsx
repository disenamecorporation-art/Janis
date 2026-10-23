import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Lock, Phone, Calendar, Clock, CheckCircle2, 
  AlertCircle, LogOut, ArrowRight, ShieldCheck, MapPin, Video 
} from 'lucide-react';
import { dbService, User as UserModel, Appointment } from '../services/db';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAgendar?: () => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenAgendar
}) => {
  const [currentUser, setCurrentUser] = useState<UserModel | null>(dbService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'citas' | 'seguridad' | 'perfil'>('citas');
  
  // Edit Profile State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Change Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feedback
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // User appointments
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (isOpen) {
      const user = dbService.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone || '');
        
        // Filter appointments for this user
        const allApts = dbService.getAppointments();
        const filtered = allApts.filter(
          (a) => a.userId === user.id || a.patientEmail.toLowerCase() === user.email.toLowerCase()
        );
        setUserAppointments(filtered);
      }
      setSuccessMsg('');
      setErrorMsg('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const res = dbService.updateUserProfile(currentUser.id, {
      name,
      email,
      phone,
    });

    setLoading(false);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setSuccessMsg('Tus datos personales se han actualizado correctamente.');
    } else {
      setErrorMsg(res.error || 'No se pudieron actualizar los datos.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setLoading(true);
    const res = dbService.updateUserProfile(currentUser.id, {
      password: newPassword,
    });

    setLoading(false);
    if (res.success) {
      setSuccessMsg('Tu contraseña ha sido cambiada exitosamente.');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setErrorMsg(res.error || 'No se pudo cambiar la contraseña.');
    }
  };

  const handleLogout = () => {
    dbService.logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#1E3A8A]/35 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-modal rounded-[32px] p-6 sm:p-8 md:p-10 text-[#4B5675] shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile Greeting */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#2F5BD6] to-[#D6567F] p-0.5 shadow-md">
              <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center text-[#1E3A8A] font-bold text-lg">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3A8A]">
                  {currentUser.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#2F5BD6] border border-blue-100">
                  {currentUser.role === 'admin' ? 'Administradora' : 'Paciente'}
                </span>
              </div>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50/80 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/80 mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('citas'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'citas'
                ? 'bg-white text-[#1E3A8A] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mis Citas ({userAppointments.length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('perfil'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'perfil'
                ? 'bg-white text-[#1E3A8A] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Datos Personales
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('seguridad'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'seguridad'
                ? 'bg-white text-[#1E3A8A] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Seguridad & Clave
          </button>
        </div>

        {/* Notification Alerts */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: CITAS DEL USUARIO */}
        {activeTab === 'citas' && (
          <div className="space-y-4">
            {userAppointments.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-white/50 border border-slate-200/60">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-[#1E3A8A]">No tienes citas registradas aún</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Agenda tu primera sesión de evaluación somática o psicoterapia con Janis Niño Vasquez.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAgendar?.();
                  }}
                  className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-xs font-semibold btn-primary-gradient shadow-md cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar una cita ahora</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {userAppointments.map((apt) => {
                  const statusMap: Record<string, { label: string; badge: string }> = {
                    en_espera_de_confirmacion: {
                      label: 'En espera de confirmación',
                      badge: 'bg-amber-100 text-amber-900 border-amber-300',
                    },
                    confirmada: {
                      label: 'Cita Confirmada',
                      badge: 'bg-blue-100 text-[#1E3A8A] border-blue-200',
                    },
                    recibido: {
                      label: 'Paciente Recibido',
                      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                    },
                    completada: {
                      label: 'Completada',
                      badge: 'bg-purple-100 text-purple-900 border-purple-200',
                    },
                    cancelada: {
                      label: 'Cancelada',
                      badge: 'bg-rose-100 text-rose-900 border-rose-200',
                    },
                  };

                  const current = statusMap[apt.status] || {
                    label: apt.status,
                    badge: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm space-y-2 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-serif font-bold text-sm text-[#1E3A8A]">
                          {apt.serviceType}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${current.badge}`}>
                          {current.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-[#D6567F]" />
                          {apt.date}
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-[#2F5BD6]" />
                          {apt.time}
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 text-[#2F5BD6]">
                          {apt.modality.includes('Presencial') ? (
                            <MapPin className="w-3.5 h-3.5 text-[#D6567F]" />
                          ) : (
                            <Video className="w-3.5 h-3.5 text-[#2F5BD6]" />
                          )}
                          {apt.modality}
                        </span>
                      </div>

                      {apt.reason && (
                        <p className="text-xs text-slate-600 pt-1 border-t border-slate-100">
                          <span className="font-semibold text-slate-700">Motivo:</span> {apt.reason}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DATOS PERSONALES Y EMAIL */}
        {activeTab === 'perfil' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
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
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  required
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Puedes cambiar tu correo en cualquier momento. Lo usaremos para enviarte confirmaciones de citas.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teléfono o WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-full text-white font-semibold text-xs sm:text-sm btn-primary-gradient shadow-md cursor-pointer disabled:opacity-70"
              >
                Guardar Cambios del Perfil
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: CAMBIAR CONTRASEÑA */}
        {activeTab === 'seguridad' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  required
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-full text-white font-semibold text-xs sm:text-sm btn-primary-gradient shadow-md cursor-pointer disabled:opacity-70"
              >
                Actualizar Contraseña
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
