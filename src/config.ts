/**
 * CONFIGURACIÓN CENTRAL DE LA APLICACIÓN
 * Aquí puedes cambiar las credenciales, enlaces de contacto y precios fácilmente.
 */

// 1. CLIENT ID DE PAYPAL
// Pega aquí tu Client ID de PayPal (usa credenciales de Sandbox para probar y luego Live para producción):
// https://developer.paypal.com/dashboard/applications/
export const PAYPAL_CLIENT_ID = "TU_CLIENT_ID_AQUI";

// 2. PRECIO DE LA GUÍA PRÁCTICA (en USD)
export const GUIDE_PRICE = "15";

// 3. NÚMERO DE WHATSAPP PARA CONTACTO Y AGENDAMIENTO
// Formato internacional sin símbolos: 58 (código Venezuela) seguido de tu número (ej: 584121234567)
export const WHATSAPP_NUMBER = "584121234567";

// Enlace directo a WhatsApp con mensaje personalizado
export const getWhatsAppUrl = (message?: string) => {
  const defaultMsg = "Hola Janis, estuve revisando tu página web y quisiera información para agendar una sesión.";
  const encoded = encodeURIComponent(message || defaultMsg);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
};

// 4. ENLACE DE DESCARGA DE LA GUÍA PRÁCTICA (PDF)
// Puedes reemplazarlo con la URL de Google Drive, Dropbox o tu archivo en la carpeta public/
export const GUIDE_PDF_URL = "/assets/guia-entendiendo-tu-sistema-nervioso.pdf";

// 5. LOGO OFICIAL
// URL provista por el cliente
export const LOGO_URL = "https://i.postimg.cc/T3kyywZd/LOGOWEBCONJANIS.png";

// 6. ENLACES Y DATOS DE LA CLÍNICA
export const CLINIC_INFO = {
  name: "Psicoterapia con Janis",
  doctor: "Janis Niño Vasquez",
  credential: "Psicóloga Clínica | FPV: 9065",
  address: "Sede Presencial: Multicentro Empresarial del Este, Torre Libertador, núcleo B, Piso 14, oficina 141. Clínica Nexus. Chacao, Caracas.",
  website: "www.psicoterapiaconjanis.com",
  instagram: "https://instagram.com/psicoterapiaconjanis",
};
