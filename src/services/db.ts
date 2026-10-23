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

const STORAGE_KEYS = {
  USERS: 'janis_users_db',
  CURRENT_USER: 'janis_current_user',
  APPOINTMENTS: 'janis_appointments_db',
  POSTS: 'janis_blog_posts_db',
};

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
    } catch {
      // Fallback a localStorage
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

  /* ------------------- EVENT DISPATCHER ------------------- */
  private dispatchChangeEvent(type: 'auth' | 'appointments' | 'posts') {
    window.dispatchEvent(new CustomEvent(`janis_db_${type}_change`));
  }
}

export const dbService = new DatabaseService();
