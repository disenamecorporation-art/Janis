import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase para la aplicación
// Puedes configurar tus claves en el archivo .env o directamente aquí abajo para pruebas rápidas.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key-aqui';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
    supabaseAnonKey &&
    supabaseAnonKey !== 'tu-anon-key-aqui'
  );
};
