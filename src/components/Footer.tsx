import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Instagram, MessageCircle } from 'lucide-react';
import { LOGO_URL, CLINIC_INFO, getWhatsAppUrl } from '../config';

export const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Formulario', href: '/formulario', isRoute: true },
    { name: 'Terapia Individual', href: '#individual' },
    { name: 'Terapia de Pareja', href: '#pareja' },
    { name: 'Planes', href: '#planes' },
    { name: 'Blog', href: '/blog', isRoute: true },
    { name: 'Sobre mí', href: '#sobre-mi' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (link: typeof navLinks[0], e: React.MouseEvent) => {
    if (link.isRoute) return;

    e.preventDefault();
    if (location.pathname === '/') {
      const targetId = link.href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (targetId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/' + link.href);
      setTimeout(() => {
        const targetId = link.href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  return (
    <footer className="bg-white/80 border-t border-slate-200/80 pt-12 pb-8 text-[#4B5675] relative overflow-hidden">
      {/* Background soft ambient blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-blue-100/40 via-pink-100/30 to-purple-100/40 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main top row: Logo, Links, Socials */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-200/70">
          
          {/* Logo (Only the logo, large, prominent) */}
          <div className="shrink-0 flex items-center">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src={LOGO_URL}
                alt="Psicoterapia con Janis"
                className="h-14 sm:h-16 md:h-20 w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          {/* Centered navigation links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="hover:text-[#1E3A8A] transition-colors whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className="hover:text-[#1E3A8A] transition-colors whitespace-nowrap"
                >
                  {link.name}
                </a>
              )
            ))}
          </nav>

          {/* Social Icons on right */}
          <div className="flex items-center gap-3">
            <a
              href={CLINIC_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2.5 rounded-full text-slate-600 hover:text-[#D6567F] hover:bg-pink-50 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="p-2.5 rounded-full text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom row: copyright info and script quote */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center md:text-left space-y-1">
            <div>
              <span>Psicoterapia con Janis</span>
              <span className="mx-2">|</span>
              <span>Caracas, Venezuela</span>
              <span className="mx-2">|</span>
              <a href="https://www.psicoterapiaconjanis.com" className="hover:text-[#1E3A8A] transition-colors">
                {CLINIC_INFO.website}
              </a>
            </div>
            <div className="text-[11px] text-slate-400">
              Hecho por <span className="font-semibold text-slate-600">Legaint Corporation</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-script text-xl md:text-2xl text-[#1E3A8A]">
            <span>Tu bienestar es posible</span>
            <span className="inline-flex text-[#D6567F]">
              <Heart className="w-4 h-4 fill-[#D6567F]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
