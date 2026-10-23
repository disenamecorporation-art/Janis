-- ==============================================================================
-- PSICOTERAPIA CON JANIS - SUPER SCRIPT COMPLETO PARA SUPABASE
-- ==============================================================================
-- Características configuradas:
-- 1. SIN RLS (Row Level Security Desactivado) en todas las tablas para acceso directo.
-- 2. REGISTRO SIN CONFIRM EMAIL: Auto-confirmación inmediata de usuarios al registrarse.
-- 3. Trigger automático para sincronizar perfiles de usuario (pacientes y admin).
-- 4. Tablas completas: profiles, appointments (agendado) y blog_posts (con múltiples imágenes y video).
-- 5. Carga inicial de datos (artículos clínicos y citas de ejemplo).
-- ==============================================================================

-- 1. TABLA: PROFILES (Usuarios y Administradora)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'paciente' CHECK (role IN ('admin', 'paciente')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. TABLA: APPOINTMENTS (Historial de Agendado Clínico)
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

-- 3. TABLA: BLOG_POSTS (Artículos, Títulos, Contenido, Galería y Video)
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

-- ==============================================================================
-- 4. DESACTIVAR RLS (SIN RLS - ACCESO TOTAL PARA ANON Y AUTHENTICATED)
-- ==============================================================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;

-- Otorgar todos los permisos a los roles de Supabase (anon, authenticated, service_role)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- ==============================================================================
-- 5. AUTO-CONFIRMAR CORREO EN REGISTRO (SIN CONFIRM EMAIL)
-- ==============================================================================
-- Este trigger confirma automáticamente el email del usuario en auth.users
-- para que pueda iniciar sesión al instante sin esperar confirmaciones por correo.
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

-- ==============================================================================
-- 6. SINCRONIZACIÓN AUTOMÁTICA DE USUARIOS A PROFILES
-- ==============================================================================
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
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();

-- ==============================================================================
-- 7. SEED DATA: CARGA INICIAL DE ARTÍCULOS CLÍNICOS DEL BLOG
-- ==============================================================================
INSERT INTO public.blog_posts (slug, title, excerpt, category, date, read_time, image_url, content)
VALUES
(
  'por-que-tu-cuerpo-se-queda-en-modo-alerta',
  '¿Por qué tu cuerpo se queda en modo alerta aunque ya estés a salvo?',
  'Comprende los mecanismos neurobiológicos que mantienen encendida la respuesta de supervivencia y aprende a enviarle señales reales de seguridad a tu sistema nervioso.',
  'Sistema nervioso',
  '14 Oct 2026',
  '5 min de lectura',
  '/src/assets/images/blog_nervous_system_1792597406633.jpg',
  ARRAY[
    '¿Te ha pasado alguna vez que, aun estando en la comodidad de tu casa, con todas las tareas del día cumplidas y sin ningún peligro evidente, tu pecho sigue apretado, tu respiración es superficial y sientes una urgencia inexplicable de estar alerta?',
    'Muchas personas interpretan este estado como un fallo personal o una señal de debilidad emocional. Sin embargo, desde la perspectiva de la neurobiología y la psicoterapia clínica, la realidad es muy distinta: tu sistema nervioso no está roto, está cumpliendo diligentemente con un programa de supervivencia que quedó fijado en el pasado.',
    'El sistema nervioso autónomo opera a través de una rama simpática (lucha o huida) y una rama parasimpática (descanso, digestión y conexión social). Cuando atravesamos periodos prolongados de estrés crónico, el organismo clasifica la neutralidad como una amenaza potencial.',
    'Para desactivar este bucle no basta con decirte intelectualmente "cálmate". Las órdenes racionales rara vez penetran las capas subcorticales del cerebro. La vía de salida es somática: a través del contacto con el suelo, la exhalación prolongada y la orientación visual consciente.',
    'Aprender a habitar el presente requiere paciencia y acompañamiento terapéutico. Cuando le demostramos al cuerpo que el peligro ya pasó, la coraza finalmente comienza a ceder.'
  ]
),
(
  'trauma-somatico-lo-que-tu-cuerpo-recuerda',
  'Trauma somático: lo que tu cuerpo recuerda aunque tu mente lo olvide',
  'El dolor no procesado no desaparece con el tiempo; se almacena en tensiones musculares, patrones posturales y respuestas viscerales que la psicoterapia corporal puede liberar.',
  'Trauma somático',
  '8 Oct 2026',
  '6 min de lectura',
  '/src/assets/images/blog_somatic_trauma_1792597408054.jpg',
  ARRAY[
    'Solemos creer que el trauma es un evento extraordinario y catastrófico guardado en forma de recuerdos nítidos. No obstante, el trauma es, ante todo, una respuesta inconclusa en el cuerpo físico.',
    'Cuando experimentamos una sobrecarga emocional sin el sostén necesario, el impulso instintivo queda truncado. La contracción muscular o el congelamiento visceral permanecen activos en los tejidos.',
    'En el trabajo somático con EMDR e IFS, no forzamos al paciente a revivir relatos dolorosos. Rastreamos sensaciones sutiles para permitir que el organismo complete suavemente las respuestas congeladas.',
    'Sanar el trauma somático no es olvidar lo vivido, sino quitarle al pasado el poder de dictar la tensión cotidiana de tu cuerpo.'
  ]
),
(
  'apego-ansioso-y-evitativo-perseguir-y-huir',
  'Apego ansioso y evitativo: por qué uno persigue y el otro huye',
  'Descubre la danza invisible de la desregulación vincular: por qué mientras más insiste uno por cercanía, más necesita el otro distanciarse para sentirse seguro.',
  'Apego',
  '29 Sep 2026',
  '6 min de lectura',
  '/src/assets/images/blog_attachment_styles_1792597407234.jpg',
  ARRAY[
    'En terapia de pareja, una dinámica frecuente es el ciclo entre un estilo de apego ansioso y uno evitativo.',
    'Para la persona con apego ansioso, cualquier distancia activa una alarma de abandono inmediata.',
    'Para la persona evitativa, la exigencia de contacto se siente como invasión, provocando repliegue defensivo.',
    'El camino de reparación consiste en reconocer las heridas de apego y aprender a pedir una pausa sin abandonar y cercanía sin asfixiar.'
  ]
),
(
  'como-poner-limites-sin-sentir-culpa',
  'Cómo poner límites sin sentir culpa',
  'Poner límites no es levantar muros agresivos, sino definir las condiciones necesarias para amar y relacionarte sin traicionar tu propia integridad.',
  'Límites y autocuidado',
  '19 Sep 2026',
  '5 min de lectura',
  '/src/assets/images/blog_setting_boundaries_1792597408038.jpg',
  ARRAY[
    'Decir no despierta en muchas personas un oleaje instantáneo de culpa y miedo al rechazo.',
    'Esta culpa no es señal de daño; es el residuo de haber aprendido que tu valor dependía de complacer.',
    'Una relación donde no puedes decir no se basa en sumisión. Los límites protegen el amor.',
    'Aprender a tolerar la culpa inicial de un límite saludable es madurez emocional.'
  ]
)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- 8. SEED DATA: CITAS INICIALES DE EJEMPLO
-- ==============================================================================
INSERT INTO public.appointments (id, patient_name, patient_email, patient_phone, service_type, modality, date, time, reason, status, clinical_notes)
VALUES
(
  'apt-1',
  'Mariana Silva',
  'mariana.silva@email.com',
  '+58 414 1234567',
  'Terapia Individual',
  'Presencial (Caracas)',
  '2026-10-25',
  '10:30 AM',
  'Agotamiento crónico y dificultad para poner límites laborales y familiares.',
  'confirmada',
  'Primera sesión presencial en Torre Libertador. Traer cuestionario inicial.'
),
(
  'apt-2',
  'Carlos Mendoza & Valeria Rojas',
  'carlos.mendoza@email.com',
  '+58 412 9876543',
  'Terapia de Pareja',
  'Online (Videollamada)',
  '2026-10-26',
  '03:30 PM',
  'Ciclos de discusión repetitivos, desconexión afectiva y problemas de comunicación.',
  'en_espera_de_confirmacion',
  'Esperando comprobante de pago para validar la cita.'
)
ON CONFLICT (id) DO NOTHING;
