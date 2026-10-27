import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, BookOpen, UserCheck, Clock, CheckCircle, AlertCircle, 
  Trash2, Edit, Plus, Search, MessageCircle, MapPin, Video, 
  ArrowLeft, LogOut, Shield, FileText, Check, X, Database, Copy,
  Download, Eye, ClipboardList, Printer, CheckCircle2
} from 'lucide-react';
import { 
  dbService, Appointment, AppointmentStatus, User, 
  IntakeFormSubmission, generateIntakeDocumentText 
} from '../services/db';
import { BlogPost } from '../data/posts';
import { getWhatsAppUrl } from '../config';
import { isSupabaseConfigured } from '../services/supabaseClient';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(dbService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'appointments' | 'intake' | 'blogs' | 'supabase'>('appointments');
  const [sqlCopied, setSqlCopied] = useState(false);

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');

  // Intake Submissions state (Cuestionarios Clínicos)
  const [intakeSubmissions, setIntakeSubmissions] = useState<IntakeFormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<IntakeFormSubmission | null>(null);
  const [intakeSearch, setIntakeSearch] = useState('');
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // Blog posts state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingPostSlug, setEditingPostSlug] = useState<string | null>(null);

  // Blog Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState<BlogPost['category']>('Sistema nervioso');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 min de lectura');
  const [blogImageUrl, setBlogImageUrl] = useState('/src/assets/images/blog_nervous_system_1792597406633.jpg');
  const [blogImageUrlsText, setBlogImageUrlsText] = useState('');
  const [blogVideoUrl, setBlogVideoUrl] = useState('');
  const [blogContentText, setBlogContentText] = useState('');

  // Load data & subscribe to changes
  const reloadData = () => {
    setCurrentUser(dbService.getCurrentUser());
    setAppointments(dbService.getAppointments());
    setPosts(dbService.getPosts());
    setIntakeSubmissions(dbService.getIntakeSubmissions());
  };

  useEffect(() => {
    reloadData();

    const handleAuth = () => reloadData();
    const handleAppointments = () => setAppointments(dbService.getAppointments());
    const handlePosts = () => setPosts(dbService.getPosts());
    const handleIntake = () => setIntakeSubmissions(dbService.getIntakeSubmissions());

    window.addEventListener('janis_db_auth_change', handleAuth);
    window.addEventListener('janis_db_appointments_change', handleAppointments);
    window.addEventListener('janis_db_posts_change', handlePosts);
    window.addEventListener('janis_db_intake_change', handleIntake);

    return () => {
      window.removeEventListener('janis_db_auth_change', handleAuth);
      window.removeEventListener('janis_db_appointments_change', handleAppointments);
      window.removeEventListener('janis_db_posts_change', handlePosts);
      window.removeEventListener('janis_db_intake_change', handleIntake);
    };
  }, []);

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'todos' || apt.status === statusFilter;
    const q = appointmentSearch.toLowerCase();
    const matchesSearch =
      !q ||
      apt.patientName.toLowerCase().includes(q) ||
      apt.patientEmail.toLowerCase().includes(q) ||
      apt.patientPhone.includes(q) ||
      apt.serviceType.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Status handlers
  const handleUpdateStatus = (id: string, status: AppointmentStatus) => {
    dbService.updateAppointmentStatus(id, status);
  };

  const handleSaveNotes = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      dbService.updateAppointmentStatus(id, apt.status, notesValue);
      setEditingNotesId(null);
    }
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('¿Estás segura de eliminar este registro de cita?')) {
      dbService.deleteAppointment(id);
    }
  };

  // Blog Handlers
  const handleOpenNewBlog = () => {
    setEditingPostSlug(null);
    setBlogTitle('');
    setBlogCategory('Sistema nervioso');
    setBlogExcerpt('');
    setBlogReadTime('5 min de lectura');
    setBlogImageUrl('/src/assets/images/blog_nervous_system_1792597406633.jpg');
    setBlogImageUrlsText('');
    setBlogVideoUrl('');
    setBlogContentText('');
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlog = (post: BlogPost) => {
    setEditingPostSlug(post.slug);
    setBlogTitle(post.title);
    setBlogCategory(post.category);
    setBlogExcerpt(post.excerpt);
    setBlogReadTime(post.readTime);
    setBlogImageUrl(post.imageUrl);
    setBlogImageUrlsText(post.imageUrls ? post.imageUrls.join('\n') : '');
    setBlogVideoUrl(post.videoUrl || '');
    setBlogContentText(post.content.join('\n\n'));
    setIsBlogModalOpen(true);
  };

  const handleDeletePost = (slug: string) => {
    if (window.confirm('¿Deseas eliminar este artículo del blog?')) {
      dbService.deletePost(slug);
    }
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogExcerpt.trim() || !blogContentText.trim()) {
      alert('Por favor completa todos los campos obligatorios del artículo.');
      return;
    }

    const paragraphs = blogContentText
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const imageUrls = blogImageUrlsText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    const postData = {
      title: blogTitle,
      category: blogCategory,
      excerpt: blogExcerpt,
      readTime: blogReadTime,
      imageUrl: blogImageUrl,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      videoUrl: blogVideoUrl.trim() ? blogVideoUrl.trim() : undefined,
      content: paragraphs,
    };

    if (editingPostSlug) {
      dbService.updatePost(editingPostSlug, postData);
    } else {
      const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
      dbService.createPost({
        ...postData,
        date: today,
      });
    }

    setIsBlogModalOpen(false);
  };

  const handleLogout = () => {
    dbService.logout();
    navigate('/');
  };

  // Intake Handlers (Descarga y Gestión de Documentos Clínicos)
  const handleDownloadDocument = (sub: IntakeFormSubmission) => {
    const textContent = generateIntakeDocumentText(sub);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = `${sub.nombre}_${sub.apellidos}`.replace(/\s+/g, '_').toLowerCase();
    link.href = url;
    link.download = `Ficha_Clinica_Janis_${safeName}_${sub.id.substring(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = (sub: IntakeFormSubmission) => {
    const jsonStr = JSON.stringify(sub, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = `${sub.nombre}_${sub.apellidos}`.replace(/\s+/g, '_').toLowerCase();
    link.href = url;
    link.download = `Cuestionario_${safeName}_${sub.id.substring(0, 8)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyDocumentText = (sub: IntakeFormSubmission) => {
    const textContent = generateIntakeDocumentText(sub);
    navigator.clipboard.writeText(textContent);
    setCopiedDocId(sub.id);
    setTimeout(() => setCopiedDocId(null), 2500);
  };

  const handleDeleteIntake = (id: string) => {
    if (window.confirm('¿Estás segura de eliminar este cuestionario clínico? Esta acción no se puede deshacer.')) {
      dbService.deleteIntakeSubmission(id);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    }
  };

  const handleToggleReviewed = (id: string) => {
    dbService.toggleIntakeReviewed(id);
  };

  // Filter intake submissions
  const filteredIntake = intakeSubmissions.filter((sub) => {
    const q = intakeSearch.toLowerCase();
    return (
      !q ||
      sub.nombre.toLowerCase().includes(q) ||
      sub.apellidos.toLowerCase().includes(q) ||
      sub.email.toLowerCase().includes(q) ||
      sub.ocupacion.toLowerCase().includes(q) ||
      sub.paisResidencia.toLowerCase().includes(q) ||
      sub.motivoAtencionPsicologica.toLowerCase().includes(q)
    );
  });

  // Metrics count
  const metrics = {
    total: appointments.length,
    pendientes: appointments.filter((a) => a.status === 'pendiente').length,
    confirmadas: appointments.filter((a) => a.status === 'confirmada').length,
    recibidos: appointments.filter((a) => a.status === 'recibido').length,
    completadas: appointments.filter((a) => a.status === 'completada').length,
    intakeTotal: intakeSubmissions.length,
    intakePendientes: intakeSubmissions.filter((i) => !i.reviewed).length,
  };

  // If not admin, provide direct login button
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="pt-36 pb-24 min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full glass-card rounded-[32px] p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto ring-8 ring-purple-50">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3A8A]">
            Panel de Consulta de Janis
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5675]">
            Para acceder a las historias de agendamiento y la gestión de artículos del blog, por favor inicia sesión como Janis.
          </p>
          <div className="pt-2 space-y-3">
            <button
              onClick={() => {
                dbService.login('janis@psicoterapia.com');
                reloadData();
              }}
              className="w-full py-3.5 px-6 rounded-full text-white font-semibold text-sm btn-primary-gradient shadow-md cursor-pointer"
            >
              Entrar como Janis Niño Vasquez
            </button>
            <Link
              to="/"
              className="block text-xs font-semibold text-slate-500 hover:text-slate-800 pt-2"
            >
              ← Volver al sitio principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/" className="text-xs font-semibold text-[#2F5BD6] hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ver sitio web</span>
              </Link>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-bold text-[#D6567F] uppercase tracking-wider">
                Panel Administrativo Clínico
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E3A8A] mt-1">
              Bienvenida, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Control de citas, estado de pacientes recibidos y gestión editorial de artículos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white/80 hover:bg-white border border-slate-200 shadow-sm transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="glass-card-subtle rounded-2xl p-4">
            <span className="text-xs font-semibold text-slate-500 block">Total Citas</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-serif text-[#1E3A8A] mt-1 block">
              {metrics.total}
            </span>
          </div>

          <div className="glass-card-subtle rounded-2xl p-4 bg-amber-50/50 border-amber-200/60">
            <span className="text-xs font-semibold text-amber-900 block">Citas Pendientes</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-700 mt-1 block">
              {metrics.pendientes}
            </span>
          </div>

          <div className="glass-card-subtle rounded-2xl p-4 bg-emerald-50/50 border-emerald-200/60">
            <span className="text-xs font-semibold text-emerald-900 block">Recibidos / Consulta</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-serif text-emerald-700 mt-1 block">
              {metrics.recibidos}
            </span>
          </div>

          <div className="glass-card-subtle rounded-2xl p-4 bg-purple-50/50 border-purple-200/60">
            <span className="text-xs font-semibold text-purple-900 block">Cuestionarios Clínicos</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-serif text-purple-700 mt-1 block">
              {metrics.intakeTotal}
            </span>
          </div>

          <div className="glass-card-subtle rounded-2xl p-4 bg-blue-50/50 border-blue-200/60">
            <span className="text-xs font-semibold text-[#1E3A8A] block">Artículos en Blog</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-serif text-[#2F5BD6] mt-1 block">
              {posts.length}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/70 mb-8 max-w-4xl">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-white text-[#1E3A8A] shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#D6567F]" />
            <span>Citas ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('intake')}
            className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'intake'
                ? 'bg-white text-[#1E3A8A] shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-[#8B5CF6]" />
            <span>Cuestionarios ({intakeSubmissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'blogs'
                ? 'bg-white text-[#1E3A8A] shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#2F5BD6]" />
            <span>Blog ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'supabase'
                ? 'bg-white text-[#1E3A8A] shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Base de Datos Supabase</span>
          </button>
        </div>

        {/* ----------------- TAB 1: APPOINTMENTS ----------------- */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={appointmentSearch}
                  onChange={(e) => setAppointmentSearch(e.target.value)}
                  placeholder="Buscar paciente, correo o teléfono..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                />
              </div>

              {/* Status filter pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {['todos', 'en_espera_de_confirmacion', 'confirmada', 'recibido', 'completada', 'cancelada'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                      statusFilter === status
                        ? 'bg-[#1E3A8A] text-white shadow-sm'
                        : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200'
                    }`}
                  >
                    {status === 'en_espera_de_confirmacion' ? 'En Espera' : status === 'recibido' ? 'Recibido' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center text-slate-500">
                <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-base font-semibold text-slate-700">No hay citas con este filtro.</p>
                <p className="text-xs text-slate-400 mt-1">Los pacientes que agenden desde la web aparecerán aquí en tiempo real.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => {
                  const statusColors: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
                    en_espera_de_confirmacion: { bg: 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-200', text: 'text-amber-800', label: '⏳ En Espera de Confirmación' },
                    pendiente: { bg: 'bg-slate-100 text-slate-800 border-slate-200', text: 'text-slate-700', label: 'Pendiente' },
                    confirmada: { bg: 'bg-blue-100 text-[#1E3A8A] border-blue-200', text: 'text-blue-800', label: '✓ Cita Confirmada (Pago Verificado)' },
                    recibido: { bg: 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-2 ring-emerald-200', text: 'text-emerald-800', label: '✓ Paciente Recibido' },
                    completada: { bg: 'bg-purple-100 text-purple-900 border-purple-200', text: 'text-purple-800', label: 'Completada' },
                    cancelada: { bg: 'bg-rose-100 text-rose-900 border-rose-200', text: 'text-rose-800', label: 'Cancelada' },
                  };

                  const currentStatusConfig = statusColors[apt.status] || statusColors.pendiente;

                  return (
                    <div
                      key={apt.id}
                      className="glass-card rounded-[24px] p-5 sm:p-6 transition-all hover:shadow-xl"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-200/70">
                        {/* Patient info */}
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E3A8A]">
                              {apt.patientName}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStatusConfig.bg}`}>
                              {currentStatusConfig.label}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-semibold">
                              {apt.serviceType}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                            <span>{apt.patientEmail}</span>
                            <span>·</span>
                            <span>{apt.patientPhone}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1 font-medium text-[#2F5BD6]">
                              {apt.modality.includes('Presencial') ? <MapPin className="w-3.5 h-3.5 text-[#D6567F]" /> : <Video className="w-3.5 h-3.5 text-[#2F5BD6]" />}
                              {apt.modality}
                            </span>
                          </div>
                        </div>

                        {/* Date and actions */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <div className="px-3 py-2 rounded-xl bg-white/90 border border-slate-200 text-center text-xs">
                            <span className="block font-bold text-[#1E3A8A]">{apt.date}</span>
                            <span className="text-slate-500">{apt.time}</span>
                          </div>

                          <a
                            href={getWhatsAppUrl(`Hola ${apt.patientName}, te saluda Janis Niño Vasquez sobre tu cita de ${apt.serviceType} agendada para el ${apt.date} a las ${apt.time}.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                            title="Escribir por WhatsApp al paciente"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                            title="Eliminar cita"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Consultation reason */}
                      {apt.reason && (
                        <div className="py-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          <strong className="text-slate-800">Motivo de consulta:</strong> {apt.reason}
                        </div>
                      )}

                      {/* State Change Quick Buttons */}
                      <div className="pt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 mr-1">Cambiar estado:</span>
                        
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'recibido')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            apt.status === 'recibido'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          ✓ Marcar como Recibido
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'confirmada')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            apt.status === 'confirmada'
                              ? 'bg-[#2F5BD6] text-white shadow-sm'
                              : 'bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] border border-blue-200'
                          }`}
                        >
                          Confirmar
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'completada')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            apt.status === 'completada'
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
                          }`}
                        >
                          Completada
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'cancelada')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            apt.status === 'cancelada'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          Cancelar
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'pendiente')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            apt.status === 'pendiente'
                              ? 'bg-amber-600 text-white shadow-sm'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          Pendiente
                        </button>
                      </div>

                      {/* Clinical Notes Section */}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        {editingNotesId === apt.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={notesValue}
                              onChange={(e) => setNotesValue(e.target.value)}
                              placeholder="Escribe notas clínicas o anotaciones de la sesión..."
                              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveNotes(apt.id)}
                                className="px-3 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold cursor-pointer"
                              >
                                Guardar Notas
                              </button>
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-4 text-xs">
                            <p className="text-slate-600 italic">
                              <strong className="text-slate-700 not-italic">Notas clínicas de Janis:</strong>{' '}
                              {apt.clinicalNotes || 'Sin notas registradas aún.'}
                            </p>
                            <button
                              onClick={() => {
                                setEditingNotesId(apt.id);
                                setNotesValue(apt.clinicalNotes || '');
                              }}
                              className="text-xs text-[#2F5BD6] font-semibold hover:underline shrink-0 cursor-pointer"
                            >
                              {apt.clinicalNotes ? 'Editar notas' : '+ Añadir notas'}
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB: CUESTIONARIOS CLÍNICOS (INTAKE FORMS) ----------------- */}
        {activeTab === 'intake' && (
          <div className="space-y-6">
            
            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3A8A] flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-[#8B5CF6]" />
                  <span>Cuestionarios Clínicos de Pacientes ({intakeSubmissions.length})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Documentos clínicos recibidos a través del formulario de la web. Puedes descargar cada expediente en documento de texto o JSON para tu archivo.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={intakeSearch}
                  onChange={(e) => setIntakeSearch(e.target.value)}
                  placeholder="Buscar por paciente, país, motivo..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>
            </div>

            {/* List of Intake Submissions */}
            {filteredIntake.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center text-slate-500">
                <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-base font-semibold text-slate-700">No se encontraron cuestionarios clínicos.</p>
                <p className="text-xs text-slate-400 mt-1">Los formularios que envíen tus pacientes desde la web aparecerán aquí con su documento descargable.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIntake.map((sub) => {
                  const formattedDate = new Date(sub.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={sub.id}
                      className="glass-card rounded-[24px] p-5 sm:p-6 transition-all hover:shadow-xl border border-white/95"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-200/70">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E3A8A]">
                              {sub.nombre} {sub.apellidos}
                            </h3>
                            
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              sub.reviewed
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-purple-100 text-purple-800 border-purple-300 ring-2 ring-purple-100'
                            }`}>
                              {sub.reviewed ? '✓ Revisado' : '★ Nuevo Expediente'}
                            </span>

                            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                              {sub.edad} años
                            </span>

                            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                              Intensidad: {sub.intensidadDel1Al10}/10
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                            <span><strong>Email:</strong> {sub.email}</span>
                            <span>·</span>
                            <span><strong>Ocupación:</strong> {sub.ocupacion}</span>
                            <span>·</span>
                            <span><strong>Residencia:</strong> {sub.paisResidencia}</span>
                            <span>·</span>
                            <span><strong>Recibido:</strong> {formattedDate}</span>
                          </div>
                        </div>

                        {/* Top Action Download Buttons */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {/* Descargar Documento Clínico Formateado */}
                          <button
                            type="button"
                            onClick={() => handleDownloadDocument(sub)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#1E3A8A] hover:bg-[#2F5BD6] shadow-sm transition-all cursor-pointer"
                            title="Descargar documento clínico (.txt)"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Descargar Documento</span>
                          </button>

                          {/* Ver Ficha Completa */}
                          <button
                            type="button"
                            onClick={() => setSelectedSubmission(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#1E3A8A] bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
                            title="Ver cuestionario completo con las 26 preguntas"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#2F5BD6]" />
                            <span>Ver Ficha</span>
                          </button>

                          {/* Copiar Texto */}
                          <button
                            type="button"
                            onClick={() => handleCopyDocumentText(sub)}
                            className="p-2 rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                            title="Copiar texto del documento"
                          >
                            {copiedDocId === sub.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>

                          {/* Eliminar */}
                          <button
                            type="button"
                            onClick={() => handleDeleteIntake(sub.id)}
                            className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
                            title="Eliminar cuestionario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Snippet Preview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs">
                        <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60 space-y-1">
                          <span className="font-bold text-[#1E3A8A] block">Motivo de atención psicológica:</span>
                          <p className="text-slate-600 line-clamp-2 leading-relaxed">
                            {sub.motivoAtencionPsicologica}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60 space-y-1">
                          <span className="font-bold text-[#1E3A8A] block">¿Cómo se siente hoy?:</span>
                          <p className="text-slate-600 line-clamp-2 leading-relaxed">
                            {sub.comoSeSienteHoy}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">¿Tiene pareja?: <strong>{sub.tienePareja}</strong></span>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-500">Educación: <strong>{sub.nivelEducativo}</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadJson(sub)}
                            className="text-xs text-slate-500 hover:text-slate-800 underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Exportar JSON</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleReviewed(sub.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              sub.reviewed
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {sub.reviewed ? 'Marcar como pendiente' : '✓ Marcar como revisado'}
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ----------------- TAB 2: BLOG MANAGEMENT (CRUD) ----------------- */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3A8A]">
                  Artículos del Blog
                </h2>
                <p className="text-xs text-slate-500">
                  Añade, edita o elimina las publicaciones clínicas que ven tus pacientes.
                </p>
              </div>

              <button
                onClick={handleOpenNewBlog}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs sm:text-sm font-semibold btn-primary-gradient shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Artículo</span>
              </button>
            </div>

            {/* Posts Grid / Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="glass-card rounded-[24px] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#D6567F] shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#1E3A8A] line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100/80 mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{post.date}</span>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-blue-50 text-[#2F5BD6] hover:bg-blue-100 transition-colors"
                        title="Ver artículo publicado"
                      >
                        <FileText className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleOpenEditBlog(post)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Editar artículo"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.slug)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                        title="Eliminar artículo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ----------------- TAB 3: SUPABASE DATABASE & SUPER SCRIPT ----------------- */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            <div className="glass-card rounded-[28px] p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3A8A]">
                      Base de Datos Supabase (Sin RLS & Sin Confirm Email)
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Copia y ejecuta este script en el SQL Editor de tu proyecto en Supabase para habilitar todas las tablas y funciones automáticas.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    isSupabaseConfigured()
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {isSupabaseConfigured() ? '✓ Supabase Conectado' : '⚡ Persistencia Local Activa'}
                  </span>
                </div>
              </div>

              {/* Instructions Pills */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/70 space-y-1">
                  <span className="font-bold text-[#1E3A8A] block">1. Sin RLS</span>
                  <span className="text-slate-500">Row Level Security desactivado en todas las tablas para permitir lecturas y escrituras directas.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/70 space-y-1">
                  <span className="font-bold text-[#1E3A8A] block">2. Sin Confirmación de Email</span>
                  <span className="text-slate-500">Trigger automático que auto-confirma usuarios para que puedan iniciar sesión al instante tras registrarse.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/70 space-y-1">
                  <span className="font-bold text-[#1E3A8A] block">3. 3 Tablas + Datos de Prueba</span>
                  <span className="text-slate-500">Incluye perfiles de usuario, citas de agendamiento y los 6 artículos clínicos completos con sus imágenes.</span>
                </div>
              </div>

              {/* Copy Button & Script Header */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Super Script SQL (archivo /supabase_schema.sql)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const sql = document.getElementById('supabase-sql-code')?.innerText;
                    if (sql) {
                      navigator.clipboard.writeText(sql);
                      setSqlCopied(true);
                      setTimeout(() => setSqlCopied(false), 2500);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
                >
                  {sqlCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{sqlCopied ? '¡Super Script Copiado!' : 'Copiar Super Script SQL'}</span>
                </button>
              </div>

              {/* Code viewer */}
              <div className="relative rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-[11px] sm:text-xs overflow-x-auto max-h-[380px] leading-relaxed">
                <pre id="supabase-sql-code">
{`-- ==============================================================================
-- PSICOTERAPIA CON JANIS - SUPER SCRIPT COMPLETO PARA SUPABASE
-- ==============================================================================
-- 1. TABLA: PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'paciente' CHECK (role IN ('admin', 'paciente')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. TABLA: APPOINTMENTS
CREATE TABLE IF NOT EXISTS public.appointments (
  id text PRIMARY KEY,
  patient_name text NOT NULL,
  patient_email text NOT NULL,
  patient_phone text NOT NULL,
  service_type text NOT NULL,
  modality text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  reason text DEFAULT '',
  status text NOT NULL DEFAULT 'en_espera_de_confirmacion',
  clinical_notes text DEFAULT '',
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. TABLA: BLOG_POSTS
CREATE TABLE IF NOT EXISTS public.blog_posts (
  slug text PRIMARY KEY,
  title text NOT NULL,
  excerpt text NOT NULL,
  category text NOT NULL,
  date text NOT NULL,
  read_time text NOT NULL,
  image_url text NOT NULL,
  image_urls text[] DEFAULT '{}',
  video_url text DEFAULT '',
  content text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. TABLA: INTAKE_FORMS (CUESTIONARIOS CLÍNICOS DE PACIENTES)
CREATE TABLE IF NOT EXISTS public.intake_forms (
  id text PRIMARY KEY,
  email text NOT NULL,
  nombre text NOT NULL,
  apellidos text NOT NULL,
  edad text NOT NULL,
  fecha_nacimiento text NOT NULL,
  hora_nacimiento text NOT NULL,
  lugar_nacimiento text NOT NULL,
  ocupacion text NOT NULL,
  pais_residencia text NOT NULL,
  tiene_pareja text NOT NULL,
  sexo text NOT NULL,
  identificacion_sexual text NOT NULL,
  nivel_educativo text NOT NULL,
  hijos_cuantos text NOT NULL,
  con_quienes_vive text NOT NULL,
  profesa_religion text NOT NULL,
  condicion_medica text NOT NULL,
  asistido_terapia text NOT NULL,
  situacion_estresante text NOT NULL,
  como_se_siente text NOT NULL,
  motivo_atencion text NOT NULL,
  sentimiento_hablar text NOT NULL,
  areas_afectadas text NOT NULL,
  intensidad integer NOT NULL,
  actividad_afrontar text NOT NULL,
  expectativas text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 5. DESACTIVAR RLS (SIN RLS - ACCESO TOTAL PARA ANON Y AUTHENTICATED)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_forms DISABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. AUTO-CONFIRMAR CORREO EN REGISTRO (SIN CONFIRM EMAIL)
CREATE OR REPLACE FUNCTION public.auto_confirm_user_email()
RETURNS trigger AS $$
BEGIN
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.auto_confirm_user_email();

-- 6. SINCRONIZACIÓN AUTOMÁTICA DE REGISTROS A PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN NEW.email = 'janis@psicoterapia.com' OR NEW.email LIKE '%janis%' THEN 'admin'
      ELSE 'paciente'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();`}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: CREATE / EDIT BLOG POST */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#1E3A8A]/35 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl glass-modal rounded-[32px] p-6 sm:p-8 md:p-10 text-[#4B5675] shadow-2xl my-8">
            <button
              onClick={() => setIsBlogModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#1E3A8A] mb-1">
              {editingPostSlug ? 'Editar Artículo' : 'Publicar Nuevo Artículo'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              El contenido se actualizará instantáneamente en la web y la sección de lecturas.
            </p>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                  Título del Artículo
                </label>
                <input
                  type="text"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="Ej: ¿Cómo identificar una crisis del sistema nervioso?"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6] font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                    Categoría
                  </label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  >
                    <option value="Sistema nervioso">Sistema nervioso</option>
                    <option value="Trauma somático">Trauma somático</option>
                    <option value="Apego">Apego</option>
                    <option value="Límites y autocuidado">Límites y autocuidado</option>
                    <option value="Pareja">Pareja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                    Tiempo de Lectura
                  </label>
                  <input
                    type="text"
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(e.target.value)}
                    placeholder="Ej: 5 min de lectura"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                  URL de la Fotografía Principal
                </label>
                <input
                  type="text"
                  value={blogImageUrl}
                  onChange={(e) => setBlogImageUrl(e.target.value)}
                  placeholder="Ruta local o URL de la imagen principal"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                  Imágenes Adicionales (Opcional - Una URL por línea para galería)
                </label>
                <textarea
                  rows={2}
                  value={blogImageUrlsText}
                  onChange={(e) => setBlogImageUrlsText(e.target.value)}
                  placeholder="https://... (URLs adicionales opcionales)"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                  Enlace de Video (Opcional - YouTube / Vimeo / MP4)
                </label>
                <input
                  type="text"
                  value={blogVideoUrl}
                  onChange={(e) => setBlogVideoUrl(e.target.value)}
                  placeholder="Ej: https://www.youtube.com/embed/..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                  Extracto / Resumen (2-3 líneas)
                </label>
                <textarea
                  rows={2}
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  placeholder="Breve introducción que se muestra en las tarjetas..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                  Contenido del Artículo (Separa los párrafos con dos saltos de línea)
                </label>
                <textarea
                  rows={7}
                  value={blogContentText}
                  onChange={(e) => setBlogContentText(e.target.value)}
                  placeholder="Escribe el cuerpo del artículo aquí..."
                  className="w-full p-3.5 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5BD6] font-normal leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full text-white text-xs sm:text-sm font-semibold btn-primary-gradient shadow-md cursor-pointer"
                >
                  {editingPostSlug ? 'Guardar Cambios' : 'Publicar Artículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VER EXPEDIENTE CLÍNICO COMPLETO (26 PREGUNTAS Y DOCUMENTO) */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#1E3A8A]/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl glass-modal rounded-[32px] p-6 sm:p-8 md:p-10 text-[#4B5675] shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-200/80 pb-5 mb-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1E3A8A] text-white">
                  Documento Clínico
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  selectedSubmission.reviewed
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-purple-100 text-purple-800 border-purple-300'
                }`}>
                  {selectedSubmission.reviewed ? '✓ Revisado por Janis' : '★ Pendiente de Evaluación'}
                </span>
                <span className="text-xs text-slate-400">
                  ID: {selectedSubmission.id}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3A8A]">
                {selectedSubmission.nombre} {selectedSubmission.apellidos}
              </h2>

              <p className="text-xs text-slate-500">
                Enviado el {new Date(selectedSubmission.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Document Content Sections (26 Questions) */}
            <div className="space-y-6 text-xs sm:text-sm">
              
              {/* I. Datos Personales y Demográficos */}
              <div className="bg-white/80 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                <h4 className="font-serif text-base font-bold text-[#1E3A8A] border-b border-slate-100 pb-2">
                  I. Datos Personales y Demográficos (Preguntas 1 - 16)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">1. Email</span>
                    <strong className="text-slate-800">{selectedSubmission.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">2. Nombre</span>
                    <strong className="text-slate-800">{selectedSubmission.nombre}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">3. Apellidos</span>
                    <strong className="text-slate-800">{selectedSubmission.apellidos}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">4. Edad</span>
                    <strong className="text-slate-800">{selectedSubmission.edad} años</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">5. Fecha de nacimiento</span>
                    <strong className="text-slate-800">{selectedSubmission.fechaNacimiento}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">6. Hora de nacimiento</span>
                    <strong className="text-slate-800">{selectedSubmission.horaNacimiento}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">7. Lugar de nacimiento</span>
                    <strong className="text-slate-800">{selectedSubmission.lugarNacimiento}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">8. Ocupación</span>
                    <strong className="text-slate-800">{selectedSubmission.ocupacion}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">9. País de residencia</span>
                    <strong className="text-slate-800">{selectedSubmission.paisResidencia}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">10. ¿Tienes pareja?</span>
                    <strong className="text-[#1E3A8A]">{selectedSubmission.tienePareja}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">11. Sexo</span>
                    <strong className="text-slate-800">{selectedSubmission.sexo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">12. Identificación sexual</span>
                    <strong className="text-slate-800">{selectedSubmission.identificacionSexual}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">13. Nivel educativo</span>
                    <strong className="text-slate-800">{selectedSubmission.nivelEducativo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">14. ¿Tienes hijos? cuántos?</span>
                    <strong className="text-slate-800">{selectedSubmission.hijosCuantos}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">15. ¿Con quiénes vive actualmente?</span>
                    <strong className="text-slate-800">{selectedSubmission.conQuienesVive}</strong>
                  </div>
                  <div className="sm:col-span-2 md:col-span-3">
                    <span className="text-slate-400 block text-[11px]">16. ¿Profesa alguna religión?</span>
                    <strong className="text-slate-800">{selectedSubmission.profesaReligion}</strong>
                  </div>
                </div>
              </div>

              {/* II. Historial Médico y Experiencia Terapéutica */}
              <div className="bg-white/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                <h4 className="font-serif text-base font-bold text-[#1E3A8A] border-b border-slate-100 pb-2">
                  II. Historial Médico y Experiencia Terapéutica (Preguntas 17 - 19)
                </h4>
                
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    17. ¿Ha tenido ultimamente alguna condición médica? ¿De ser así está tomando algún medicamento?
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                    {selectedSubmission.condicionMedicaMedicamentos}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    18. ¿Has asistido a terapia con anterioridad? de ser así ¿qué valoraste más sobre las sesiones y qué pudiera mejorar?
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                    {selectedSubmission.asistidoTerapiaAnterioridad}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    19. ¿Has vivido recientemente alguna situación estresante? Desastres naturales, pérdida de algún familiar, diagnóstico de alguna enfermedad, migración...
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                    {selectedSubmission.situacionEstresanteReciente}
                  </p>
                </div>
              </div>

              {/* III. Motivo de Consulta y Evaluación Emocional */}
              <div className="bg-white/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                <h4 className="font-serif text-base font-bold text-[#1E3A8A] border-b border-slate-100 pb-2">
                  III. Motivo de Consulta y Evaluación Emocional (Preguntas 20 - 24)
                </h4>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    20. ¿Cómo se siente hoy?
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                    {selectedSubmission.comoSeSienteHoy}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    21. ¿Qué le motivó a tomar atención psicológica en este momento?
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                    {selectedSubmission.motivoAtencionPsicologica}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    22. ¿Cómo se siente al hablar de este tema?
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                    {selectedSubmission.sentimientoAlHablarTema}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    23. ¿En qué áreas de tu vida social, afectiva, laboral, consideras que te está afectando? y ¿cómo te está afectando?
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                    {selectedSubmission.areasAfectadasComo}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/80 space-y-2">
                  <span className="text-xs font-bold text-purple-900 block">
                    24. ¿Del 1 al 10 que intensidad te parece que tiene el día de hoy el tema que quieres ver en sesiones?
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-extrabold font-serif text-[#1E3A8A]">
                      {selectedSubmission.intensidadDel1Al10} / 10
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-[#D6567F] border border-purple-200">
                      {selectedSubmission.intensidadDel1Al10 <= 3
                        ? 'Baja intensidad'
                        : selectedSubmission.intensidadDel1Al10 <= 6
                        ? 'Intensidad moderada'
                        : 'Muy alta intensidad'}
                    </span>
                  </div>
                </div>
              </div>

              {/* IV. Afrontamiento y Expectativas Terapéuticas */}
              <div className="bg-white/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                <h4 className="font-serif text-base font-bold text-[#1E3A8A] border-b border-slate-100 pb-2">
                  IV. Afrontamiento y Expectativas Terapéuticas (Preguntas 25 - 26)
                </h4>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    25. ¿Haz realizado alguna actividad para afrontar estos temas? alguna estrategia te ha funcionado?
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                    {selectedSubmission.actividadAfrontarEstrategia}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    26. ¿Qué expectativas tienes sobre el acompañamiento terapéutico y las sesiones?
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                    {selectedSubmission.expectativasAcompanamiento}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-8 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleReviewed(selectedSubmission.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSubmission.reviewed
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  }`}
                >
                  {selectedSubmission.reviewed ? 'Marcar como pendiente' : '✓ Marcar como revisado'}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyDocumentText(selectedSubmission)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedDocId === selectedSubmission.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDocId === selectedSubmission.id ? '¡Copiado!' : 'Copiar Texto Ficha'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDownloadJson(selectedSubmission)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Descargar JSON</span>
                </button>

                {/* Primary Download Document Button */}
                <button
                  type="button"
                  onClick={() => handleDownloadDocument(selectedSubmission)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-xs sm:text-sm font-bold btn-primary-gradient shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Documento (.txt)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
