/**
 * BASE DE DATOS Y PERSISTENCIA DE LA APLICACIÓN
 * Maneja citas, usuarios, sesiones y artículos de blog con persistencia local garantizada y soporte Supabase.
 */

import { BLOG_POSTS as INITIAL_POSTS, BlogPost } from '../data/posts';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'paciente';
  password?: string;
  createdAt: string;
}

export type AppointmentStatus = 'en_espera_de_confirmacion' | 'pendiente' | 'confirmada' | 'recibido' | 'completada' | 'cancelada';

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  serviceType: 'Terapia Individual' | 'Terapia de Pareja';
  modality: 'Presencial (Caracas)' | 'Online (Videollamada)';
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  clinicalNotes?: string;
  createdAt: string;
  userId?: string;
}

export interface IntakeFormSubmission {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  edad: string;
  fechaNacimiento: string;
  horaNacimiento: string;
  lugarNacimiento: string;
  ocupacion: string;
  paisResidencia: string;
  tienePareja: string;
  sexo: string;
  identificacionSexual: string;
  nivelEducativo: string;
  hijosCuantos: string;
  conQuienesVive: string;
  profesaReligion: string;
  condicionMedicaMedicamentos: string;
  asistidoTerapiaAnterioridad: string;
  situacionEstresanteReciente: string;
  comoSeSienteHoy: string;
  motivoAtencionPsicologica: string;
  sentimientoAlHablarTema: string;
  areasAfectadasComo: string;
  intensidadDel1Al10: number;
  actividadAfrontarEstrategia: string;
  expectativasAcompanamiento: string;
  createdAt: string;
  reviewed?: boolean;
}

const STORAGE_KEYS = {
  USERS: 'janis_users_db',
  CURRENT_USER: 'janis_current_user',
  APPOINTMENTS: 'janis_appointments_db',
  POSTS: 'janis_blog_posts_db',
  INTAKE_FORMS: 'janis_intake_forms_db',
};

const DEFAULT_INTAKE_SUBMISSIONS: IntakeFormSubmission[] = [
  {
    id: 'form-sample-01',
    email: 'mariana.silva@email.com',
    nombre: 'Mariana',
    apellidos: 'Silva Mendoza',
    edad: '32',
    fechaNacimiento: '1994-05-18',
    horaNacimiento: '08:45 AM',
    lugarNacimiento: 'Caracas, Venezuela',
    ocupacion: 'Arquitecta / Diseñadora',
    paisResidencia: 'Venezuela',
    tienePareja: 'Si',
    sexo: 'Femenino',
    identificacionSexual: 'Heterosexual',
    nivelEducativo: 'Profesional',
    hijosCuantos: 'No tengo hijos',
    conQuienesVive: 'Vivo con mi pareja y mi gato',
    profesaReligion: 'Católica no practicante, más enfocada en espiritualidad y meditación',
    condicionMedicaMedicamentos: 'Bruxismo e insomnio ocasional. No tomo medicamentos psiquiátricos, solo suplemento de magnesio.',
    asistidoTerapiaAnterioridad: 'Sí, hace 3 años fui a terapia cognitivo conductual. Valoré mucho el espacio seguro de desahogo, pero sentí que se quedó en lo racional y no profundizó en la sensación física de ansiedad en mi cuerpo.',
    situacionEstresanteReciente: 'Ascenso laboral con alta carga horaria y reciente mudanza de departamento.',
    comoSeSienteHoy: 'Con el pecho apretado y sensación constante de cansancio mental aunque haya dormido 8 horas.',
    motivoAtencionPsicologica: 'Necesito regular mi sistema nervioso, dejar de exigirme perfección constante y aprender a poner límites firmes sin culpa a mi familia y jefes.',
    sentimientoAlHablarTema: 'Siento alivio pero a la vez ganas de llorar por haber sostenido tanto durante tanto tiempo.',
    areasAfectadasComo: 'En lo laboral me sobrecargo; en lo afectivo estoy más irritable con mi pareja y en lo social me he aislado los fines de semana.',
    intensidadDel1Al10: 8,
    actividadAfrontarEstrategia: 'Hago yoga suave y caminatas cuando el tiempo me lo permite. Me relaja momentáneamente pero el patrón de alerta regresa rápido.',
    expectativasAcompanamiento: 'Comprender qué le pasa a mi cuerpo, herramientas somáticas para momentos de desborde y un acompañamiento empático y sin juicios.',
    createdAt: '2026-10-24T15:20:00.000Z',
    reviewed: false,
  },
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientName: 'Mariana Silva',
    patientEmail: 'mariana.silva@email.com',
    patientPhone: '+58 414 1234567',
    serviceType: 'Terapia Individual',
    modality: 'Presencial (Caracas)',
    date: '2026-10-25',
    time: '10:30 AM',
    reason: 'Agotamiento crónico y dificultad para poner límites laborales y familiares.',
    status: 'confirmada',
    clinicalNotes: 'Primera sesión presencial en Torre Libertador. Traer cuestionario inicial.',
    createdAt: '2026-10-20T14:30:00.000Z',
  },
  {
    id: 'apt-2',
    patientName: 'Carlos Mendoza & Valeria Rojas',
    patientEmail: 'carlos.mendoza@email.com',
    patientPhone: '+58 412 9876543',
    serviceType: 'Terapia de Pareja',
    modality: 'Online (Videollamada)',
    date: '2026-10-26',
    time: '03:30 PM',
    reason: 'Ciclos de discusión repetitivos, desconexión afectiva y problemas de comunicación.',
    status: 'en_espera_de_confirmacion',
    clinicalNotes: '',
    createdAt: '2026-10-21T09:15:00.000Z',
  },
];

const DEFAULT_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Janis Niño Vasquez',
    email: 'janis@psicoterapia.com',
    phone: '+58 412 1234567',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

const safeExec = (promiseLike: any) => {
  Promise.resolve(promiseLike).catch(() => {});
};

class DatabaseService {
  constructor() {
    this.initDatabase();
    if (isSupabaseConfigured()) {
      this.syncFromSupabase();
    }
  }

  private initDatabase() {
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INTAKE_FORMS)) {
      localStorage.setItem(STORAGE_KEYS.INTAKE_FORMS, JSON.stringify(DEFAULT_INTAKE_SUBMISSIONS));
    }
  }

  /**
   * Sincroniza datos remotos desde Supabase hacia la caché local si está configurado
   */
  private async syncFromSupabase() {
    try {
      // 1. Sync appointments
      const { data: aptsData } = await supabase.from('appointments').select('*');
      if (aptsData && aptsData.length > 0) {
        const mapped: Appointment[] = aptsData.map((row: any) => ({
          id: row.id,
          patientName: row.patient_name,
          patientEmail: row.patient_email,
          patientPhone: row.patient_phone,
          serviceType: row.service_type,
          modality: row.modality,
          date: row.date,
          time: row.time,
          reason: row.reason || '',
          status: row.status,
          clinicalNotes: row.clinical_notes || '',
          userId: row.user_id,
          createdAt: row.created_at || new Date().toISOString(),
        }));
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(mapped));
        this.dispatchChangeEvent('appointments');
      }

      // 2. Sync posts
      const { data: postsData } = await supabase.from('blog_posts').select('*');
      if (postsData && postsData.length > 0) {
        const mappedPosts: BlogPost[] = postsData.map((row: any) => ({
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          category: row.category,
          date: row.date,
          readTime: row.read_time,
          imageUrl: row.image_url,
          imageUrls: row.image_urls || [],
          videoUrl: row.video_url || undefined,
          content: row.content || [],
        }));
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(mappedPosts));
        this.dispatchChangeEvent('posts');
      }

      // 3. Sync intake forms
      const { data: intakeData } = await supabase.from('intake_forms').select('*');
      if (intakeData && intakeData.length > 0) {
        const mappedIntake: IntakeFormSubmission[] = intakeData.map((row: any) => ({
          id: row.id,
          email: row.email,
          nombre: row.nombre,
          apellidos: row.apellidos,
          edad: row.edad,
          fechaNacimiento: row.fecha_nacimiento,
          horaNacimiento: row.hora_nacimiento,
          lugarNacimiento: row.lugar_nacimiento,
          ocupacion: row.ocupacion,
          paisResidencia: row.pais_residencia,
          tienePareja: row.tiene_pareja,
          sexo: row.sexo,
          identificacionSexual: row.identificacion_sexual,
          nivelEducativo: row.nivel_educativo,
          hijosCuantos: row.hijos_cuantos,
          conQuienesVive: row.con_quienes_vive,
          profesaReligion: row.profesa_religion,
          condicionMedicaMedicamentos: row.condicion_medica,
          asistidoTerapiaAnterioridad: row.asistido_terapia,
          situacionEstresanteReciente: row.situacion_estresante,
          comoSeSienteHoy: row.como_se_siente,
          motivoAtencionPsicologica: row.motivo_atencion,
          sentimientoAlHablarTema: row.sentimiento_hablar,
          areasAfectadasComo: row.areas_afectadas,
          intensidadDel1Al10: Number(row.intensidad),
          actividadAfrontarEstrategia: row.actividad_afrontar,
          expectativasAcompanamiento: row.expectativas,
          createdAt: row.created_at || new Date().toISOString(),
          reviewed: row.reviewed || false,
        }));
        localStorage.setItem(STORAGE_KEYS.INTAKE_FORMS, JSON.stringify(mappedIntake));
        this.dispatchChangeEvent('intake');
      }
    } catch {
      // Fallback si no hay conexión
    }
  }

  /* ------------------- AUTHENTICATION & PROFILE MANAGEMENT ------------------- */
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  login(email: string, password?: string): { success: boolean; user?: User; error?: string } {
    const cleanEmail = email.toLowerCase().trim();
    const users = this.getUsers();
    
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (cleanEmail === 'janis@psicoterapia.com' || cleanEmail === 'admin@psicoterapia.com' || cleanEmail.includes('janis')) {
      if (!user) {
        user = {
          id: 'admin-janis',
          name: 'Janis Niño Vasquez',
          email: 'janis@psicoterapia.com',
          phone: '+58 412 1234567',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        users.push(user);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
    }

    if (!user) {
      return { success: false, error: 'No encontramos una cuenta con este correo. Puedes registrarte en segundos.' };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, error: 'La contraseña ingresada no es correcta.' };
    }

    // Supabase login in background if configured
    if (isSupabaseConfigured() && password) {
      supabase.auth.signInWithPassword({ email: cleanEmail, password }).catch(() => {});
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.dispatchChangeEvent('auth');
    return { success: true, user };
  }

  register(name: string, email: string, phone: string, password?: string, role: 'paciente' | 'admin' = 'paciente'): { success: boolean; user?: User; error?: string } {
    const cleanEmail = email.toLowerCase().trim();
    const users = this.getUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Ya existe una cuenta con este correo electrónico.' };
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password: password || undefined,
      role: cleanEmail.includes('janis') ? 'admin' : role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    // Supabase registration in background if configured (sin confirm email)
    if (isSupabaseConfigured() && password) {
      supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
          },
        },
      }).catch(() => {});
    }

    this.dispatchChangeEvent('auth');
    return { success: true, user: newUser };
  }

  updateUserProfile(userId: string, updatedData: { name?: string; email?: string; phone?: string; password?: string }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return { success: false, error: 'Usuario no encontrado.' };

    const user = users[index];
    if (updatedData.name) user.name = updatedData.name.trim();
    if (updatedData.phone) user.phone = updatedData.phone.trim();
    if (updatedData.password) user.password = updatedData.password;
    if (updatedData.email) {
      const newEmail = updatedData.email.toLowerCase().trim();
      if (users.some((u) => u.email.toLowerCase() === newEmail && u.id !== userId)) {
        return { success: false, error: 'Este correo ya está en uso por otra cuenta.' };
      }
      user.email = newEmail;
    }

    users[index] = user;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    // Update in Supabase if configured
    if (isSupabaseConfigured()) {
      safeExec(
        supabase.from('profiles').update({
          name: user.name,
          email: user.email,
          phone: user.phone,
        }).eq('id', user.id)
      );

      if (updatedData.password) {
        safeExec(supabase.auth.updateUser({ password: updatedData.password }));
      }
    }

    this.dispatchChangeEvent('auth');
    return { success: true, user };
  }

  requestPasswordReset(email: string): { success: boolean; message?: string; error?: string } {
    const cleanEmail = email.toLowerCase().trim();
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user && cleanEmail !== 'janis@psicoterapia.com') {
      return { success: false, error: 'No encontramos ninguna cuenta registrada con este correo.' };
    }

    if (isSupabaseConfigured()) {
      supabase.auth.resetPasswordForEmail(cleanEmail).catch(() => {});
    }

    return { 
      success: true, 
      message: 'Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada.' 
    };
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
    this.dispatchChangeEvent('auth');
  }

  private getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) return DEFAULT_USERS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USERS;
    }
  }

  /* ------------------- APPOINTMENTS (AGENDADO) ------------------- */
  getAppointments(): Appointment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (!raw) return DEFAULT_APPOINTMENTS;
    try {
      const list = JSON.parse(raw);
      return list.sort((a: Appointment, b: Appointment) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return DEFAULT_APPOINTMENTS;
    }
  }

  createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment {
    const currentUser = this.getCurrentUser();
    const appointments = this.getAppointments();
    const newAppointment: Appointment = {
      ...appointmentData,
      id: 'cita-' + Date.now().toString(36),
      status: 'en_espera_de_confirmacion',
      userId: currentUser?.id,
      createdAt: new Date().toISOString(),
    };

    appointments.unshift(newAppointment);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

    // Save to Supabase in background if configured
    if (isSupabaseConfigured()) {
      safeExec(
        supabase.from('appointments').insert({
          id: newAppointment.id,
          patient_name: newAppointment.patientName,
          patient_email: newAppointment.patientEmail,
          patient_phone: newAppointment.patientPhone,
          service_type: newAppointment.serviceType,
          modality: newAppointment.modality,
          date: newAppointment.date,
          time: newAppointment.time,
          reason: newAppointment.reason,
          status: newAppointment.status,
          clinical_notes: newAppointment.clinicalNotes || '',
          user_id: newAppointment.userId || null,
          created_at: newAppointment.createdAt,
        })
      );
    }

    this.dispatchChangeEvent('appointments');
    return newAppointment;
  }

  updateAppointmentStatus(id: string, status: AppointmentStatus, clinicalNotes?: string): boolean {
    const appointments = this.getAppointments();
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) return false;

    appointments[index].status = status;
    if (clinicalNotes !== undefined) {
      appointments[index].clinicalNotes = clinicalNotes;
    }

    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

    // Update in Supabase in background
    if (isSupabaseConfigured()) {
      safeExec(
        supabase.from('appointments').update({
          status,
          ...(clinicalNotes !== undefined ? { clinical_notes: clinicalNotes } : {}),
        }).eq('id', id)
      );
    }

    this.dispatchChangeEvent('appointments');
    return true;
  }

  deleteAppointment(id: string): boolean {
    let appointments = this.getAppointments();
    appointments = appointments.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

    if (isSupabaseConfigured()) {
      safeExec(supabase.from('appointments').delete().eq('id', id));
    }

    this.dispatchChangeEvent('appointments');
    return true;
  }

  /* ------------------- BLOG POSTS (CRUD) ------------------- */
  getPosts(): BlogPost[] {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) return INITIAL_POSTS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_POSTS;
    }
  }

  getPostBySlug(slug: string): BlogPost | undefined {
    const posts = this.getPosts();
    return posts.find((p) => p.slug === slug);
  }

  createPost(newPost: Omit<BlogPost, 'slug'> & { slug?: string }): BlogPost {
    const posts = this.getPosts();
    const slug = newPost.slug || newPost.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const post: BlogPost = {
      ...newPost,
      slug,
    };

    posts.unshift(post);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

    if (isSupabaseConfigured()) {
      safeExec(
        supabase.from('blog_posts').insert({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          date: post.date,
          read_time: post.readTime,
          image_url: post.imageUrl,
          image_urls: post.imageUrls || [],
          video_url: post.videoUrl || '',
          content: post.content,
        })
      );
    }

    this.dispatchChangeEvent('posts');
    return post;
  }

  updatePost(slug: string, updatedFields: Partial<BlogPost>): boolean {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.slug === slug);
    if (index === -1) return false;

    posts[index] = {
      ...posts[index],
      ...updatedFields,
    };

    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

    if (isSupabaseConfigured()) {
      const updatePayload: any = {};
      if (updatedFields.title) updatePayload.title = updatedFields.title;
      if (updatedFields.excerpt) updatePayload.excerpt = updatedFields.excerpt;
      if (updatedFields.category) updatePayload.category = updatedFields.category;
      if (updatedFields.readTime) updatePayload.read_time = updatedFields.readTime;
      if (updatedFields.imageUrl) updatePayload.image_url = updatedFields.imageUrl;
      if (updatedFields.imageUrls !== undefined) updatePayload.image_urls = updatedFields.imageUrls;
      if (updatedFields.videoUrl !== undefined) updatePayload.video_url = updatedFields.videoUrl;
      if (updatedFields.content) updatePayload.content = updatedFields.content;

      safeExec(supabase.from('blog_posts').update(updatePayload).eq('slug', slug));
    }

    this.dispatchChangeEvent('posts');
    return true;
  }

  deletePost(slug: string): boolean {
    let posts = this.getPosts();
    posts = posts.filter((p) => p.slug !== slug);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

    if (isSupabaseConfigured()) {
      safeExec(supabase.from('blog_posts').delete().eq('slug', slug));
    }

    this.dispatchChangeEvent('posts');
    return true;
  }

  /* ------------------- INTAKE FORMS (CUESTIONARIOS CLÍNICOS) ------------------- */
  getIntakeSubmissions(): IntakeFormSubmission[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INTAKE_FORMS);
    if (!raw) return DEFAULT_INTAKE_SUBMISSIONS;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : DEFAULT_INTAKE_SUBMISSIONS;
    } catch {
      return DEFAULT_INTAKE_SUBMISSIONS;
    }
  }

  saveIntakeSubmission(submissionData: Omit<IntakeFormSubmission, 'id' | 'createdAt'>): IntakeFormSubmission {
    const list = this.getIntakeSubmissions();
    const newSubmission: IntakeFormSubmission = {
      ...submissionData,
      id: `intake-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      reviewed: false,
    };

    list.unshift(newSubmission);
    localStorage.setItem(STORAGE_KEYS.INTAKE_FORMS, JSON.stringify(list));

    if (isSupabaseConfigured()) {
      safeExec(
        supabase.from('intake_forms').insert({
          id: newSubmission.id,
          email: newSubmission.email,
          nombre: newSubmission.nombre,
          apellidos: newSubmission.apellidos,
          edad: newSubmission.edad,
          fecha_nacimiento: newSubmission.fechaNacimiento,
          hora_nacimiento: newSubmission.horaNacimiento,
          lugar_nacimiento: newSubmission.lugarNacimiento,
          ocupacion: newSubmission.ocupacion,
          pais_residencia: newSubmission.paisResidencia,
          tiene_pareja: newSubmission.tienePareja,
          sexo: newSubmission.sexo,
          identificacion_sexual: newSubmission.identificacionSexual,
          nivel_educativo: newSubmission.nivelEducativo,
          hijos_cuantos: newSubmission.hijosCuantos,
          con_quienes_vive: newSubmission.conQuienesVive,
          profesa_religion: newSubmission.profesaReligion,
          condicion_medica: newSubmission.condicionMedicaMedicamentos,
          asistido_terapia: newSubmission.asistidoTerapiaAnterioridad,
          situacion_estresante: newSubmission.situacionEstresanteReciente,
          como_se_siente: newSubmission.comoSeSienteHoy,
          motivo_atencion: newSubmission.motivoAtencionPsicologica,
          sentimiento_hablar: newSubmission.sentimientoAlHablarTema,
          areas_afectadas: newSubmission.areasAfectadasComo,
          intensidad: newSubmission.intensidadDel1Al10,
          actividad_afrontar: newSubmission.actividadAfrontarEstrategia,
          expectativas: newSubmission.expectativasAcompanamiento,
          created_at: newSubmission.createdAt,
        })
      );
    }

    this.dispatchChangeEvent('intake');
    return newSubmission;
  }

  deleteIntakeSubmission(id: string): boolean {
    let list = this.getIntakeSubmissions();
    list = list.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.INTAKE_FORMS, JSON.stringify(list));

    if (isSupabaseConfigured()) {
      safeExec(supabase.from('intake_forms').delete().eq('id', id));
    }

    this.dispatchChangeEvent('intake');
    return true;
  }

  toggleIntakeReviewed(id: string): boolean {
    const list = this.getIntakeSubmissions();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return false;

    list[index].reviewed = !list[index].reviewed;
    localStorage.setItem(STORAGE_KEYS.INTAKE_FORMS, JSON.stringify(list));
    this.dispatchChangeEvent('intake');
    return true;
  }

  /* ------------------- EVENT DISPATCHER ------------------- */
  private dispatchChangeEvent(type: 'auth' | 'appointments' | 'posts' | 'intake') {
    window.dispatchEvent(new CustomEvent(`janis_db_${type}_change`));
  }
}

export const dbService = new DatabaseService();

/**
 * Genera el documento clínico formateado y listo para ser descargado o impreso por Janis
 */
export function generateIntakeDocumentText(sub: IntakeFormSubmission): string {
  const formattedDate = new Date(sub.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `================================================================================
PSICOTERAPIA CON JANIS - FICHA DE CUESTIONARIO CLÍNICO INICIAL
================================================================================
Psicóloga: Janis Niño Vásquez
Especialidad: Trauma Somático, Regulación Emocional y Vínculos Sanos
ID de Registro: ${sub.id}
Fecha y hora de envío: ${formattedDate}
Estado: ${sub.reviewed ? 'REVISADO' : 'PENDIENTE DE EVALUACIÓN'}
================================================================================

DATOS PERSONALES Y DEMOGRÁFICOS
--------------------------------------------------------------------------------
1.  Email:
    ${sub.email}

2.  Nombre:
    ${sub.nombre}

3.  Apellidos:
    ${sub.apellidos}

4.  Edad:
    ${sub.edad} años

5.  Fecha de nacimiento:
    ${sub.fechaNacimiento}

6.  Hora de nacimiento:
    ${sub.horaNacimiento}

7.  Lugar de nacimiento:
    ${sub.lugarNacimiento}

8.  Ocupación:
    ${sub.ocupacion}

9.  País de residencia:
    ${sub.paisResidencia}

10. ¿Tienes pareja?:
    ${sub.tienePareja}

11. Sexo:
    ${sub.sexo}

12. Identificación sexual:
    ${sub.identificacionSexual}

13. Nivel educativo:
    ${sub.nivelEducativo}

14. ¿Tienes hijos? cuántos?:
    ${sub.hijosCuantos}

15. ¿Con quiénes vive actualmente?:
    ${sub.conQuienesVive}

16. ¿Profesa alguna religión?:
    ${sub.profesaReligion}


HISTORIAL MÉDICO Y ANTECEDENTES TERAPÉUTICOS
--------------------------------------------------------------------------------
17. ¿Ha tenido ultimamente alguna condición médica? ¿De ser así está tomando algún medicamento?:
    ${sub.condicionMedicaMedicamentos}

18. ¿Has asistido a terapia con anterioridad? de ser así ¿qué valoraste más sobre las sesiones y qué pudiera mejorar?:
    ${sub.asistidoTerapiaAnterioridad}

19. ¿Has vivido recientemente alguna situación estresante? Desastres naturales, pérdida de algún familiar, diagnóstico de alguna enfermedad, migración...:
    ${sub.situacionEstresanteReciente}


EVALUACIÓN CLÍNICA ACTUAL Y ESTADO EMOCIONAL
--------------------------------------------------------------------------------
20. ¿Cómo se siente hoy?:
    ${sub.comoSeSienteHoy}

21. ¿Qué le motivó a tomar atención psicológica en este momento?:
    ${sub.motivoAtencionPsicologica}

22. ¿Cómo se siente al hablar de este tema?:
    ${sub.sentimientoAlHablarTema}

23. ¿En qué áreas de tu vida social, afectiva, laboral, consideras que te está afectando? y ¿cómo te está afectando?:
    ${sub.areasAfectadasComo}

24. ¿Del 1 al 10 que intensidad te parece que tiene el día de hoy el tema que quieres ver en sesiones?:
    [ ${sub.intensidadDel1Al10} / 10 ] - ${
      sub.intensidadDel1Al10 <= 3
        ? 'Baja intensidad'
        : sub.intensidadDel1Al10 <= 6
        ? 'Intensidad moderada'
        : 'Muy alta intensidad'
    }


AFRONTAMIENTO Y EXPECTATIVAS TERAPÉUTICAS
--------------------------------------------------------------------------------
25. ¿Haz realizado alguna actividad para afrontar estos temas? alguna estrategia te ha funcionado?:
    ${sub.actividadAfrontarEstrategia}

26. ¿Qué expectativas tienes sobre el acompañamiento terapéutico y las sesiones?:
    ${sub.expectativasAcompanamiento}

================================================================================
CONFIDENCIALIDAD PROFESIONAL:
Este documento contiene datos clínicos sensibles y confidenciales bajo el
resguardo exclusivo de Psicoterapia con Janis.
================================================================================
`;
}
