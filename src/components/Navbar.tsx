import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, User, Shield, LogOut } from 'lucide-react';
import { LOGO_URL } from '../config';
import { dbService, User as UserModel } from '../services/db';

interface NavbarProps {
  onOpenAgendar?: () => void;
  onOpenAuth?: () => void;
  onOpenUserDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAgendar, 
  onOpenAuth, 
  onOpenUserDashboard 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserModel | null>(dbService.getCurrentUser());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Listen to auth changes
  useEffect(() => {
    const checkAuth = () => {
      setCurrentUser(dbService.getCurrentUser());
    };
    window.addEventListener('janis_db_auth_change', checkAuth);
    return () => window.removeEventListener('janis_db_auth_change', checkAuth);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#hero', route: '/' },
    { name: 'Terapia Individual', href: '#individual', route: '/' },
    { name: 'Terapia de Pareja', href: '#pareja', route: '/' },
    { name: 'Planes', href: '#planes', route: '/' },
    { name: 'Formulario', href: '/formulario', isRoute: true },
    { name: 'Blog', href: '/blog', isRoute: true },
    { name: 'Sobre mí', href: '#sobre-mi', route: '/' },
    { name: 'Contacto', href: '#contacto', route: '/' },
  ];

  const handleAgendarAction = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onOpenAgendar) {
      onOpenAgendar();
    } else {
      navigate('/');
    }
    setIsOpen(false);
  };

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
    setIsOpen(false);
  };

  const isCurrentActive = (link: typeof navLinks[0]) => {
    if (link.isRoute && location.pathname === link.href) {
      return true;
    }
    if (link.isRoute && link.href === '/blog' && location.pathname.startsWith('/blog')) {
      return true;
    }
    if (location.pathname === '/' && link.name === 'Inicio' && !location.hash) {
      return true;
    }
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav-scrolled py-2.5 sm:py-3 shadow-xl'
          : 'glass-nav py-3 sm:py-4 shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* Logo - Perfectly Balanced */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="shrink-0 flex items-center group transition-transform hover:scale-[1.02]"
            aria-label="Psicoterapia con Janis - Ir al inicio"
          >
            <img
              src={LOGO_URL}
              alt="Psicoterapia con Janis"
              className="h-12 sm:h-14 md:h-16 lg:h-18 w-auto object-contain transition-all drop-shadow-sm"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.fallback-logo')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'fallback-logo flex items-center gap-2 font-serif text-xl font-bold text-[#1E3A8A]';
                  fallback.innerHTML = `<span class="text-2xl text-[#D6567F]">♥</span><span>Psicoterapia <span class="text-[#D6567F] font-script text-2xl font-normal">con Janis</span></span>`;
                  parent.appendChild(fallback);
                }
              }}
            />
          </Link>

          {/* Desktop Navigation Links (Compact & Refined Typography) */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-[12.5px] font-semibold text-[#1E3A8A]">
            {navLinks.map((link) => {
              const active = isCurrentActive(link);
              return link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`relative py-1 transition-colors whitespace-nowrap hover:text-[#D6567F] ${
                    active ? 'text-[#D6567F] font-bold' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className={`relative py-1 transition-colors whitespace-nowrap hover:text-[#D6567F] ${
                    active ? 'text-[#D6567F] font-bold' : ''
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Action buttons (Auth + Agendar cita) */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Account / Admin Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-purple-900 bg-purple-100/90 hover:bg-purple-200 border border-purple-200 transition-colors shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-700" />
                    <span>Panel Admin</span>
                  </Link>
                ) : (
                  <button
                    onClick={onOpenUserDashboard}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-[#1E3A8A] bg-white/70 hover:bg-white border border-slate-200 transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[#2F5BD6]" />
                    <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  </button>
                )}
                <button
                  onClick={() => dbService.logout()}
                  title="Cerrar sesión"
                  className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#1E3A8A] bg-white/70 hover:bg-white border border-slate-200/90 shadow-sm transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#2F5BD6]" />
                <span>Iniciar Sesión</span>
              </button>
            )}

            {/* Agendar Cita Button */}
            <button
              type="button"
              onClick={handleAgendarAction}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-xs md:text-sm font-semibold btn-primary-gradient shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar cita</span>
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={handleAgendarAction}
              className="inline-flex items-center justify-center p-2.5 rounded-full text-white btn-primary-gradient shadow-md cursor-pointer"
              aria-label="Agendar cita"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 text-slate-800 shadow-sm"
              aria-label="Abrir menú"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Super Glass) */}
      {isOpen && (
        <div className="lg:hidden mx-4 mt-3 rounded-3xl bg-white/80 backdrop-blur-[50px] border border-white/95 p-5 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-sm font-bold text-[#1E3A8A] hover:bg-white/90 transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className="px-4 py-2.5 rounded-2xl text-sm font-bold text-[#1E3A8A] hover:bg-white/90 transition-colors"
                >
                  {link.name}
                </a>
              )
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-200/60 space-y-2">
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-purple-900 bg-purple-100 border border-purple-200"
              >
                <Shield className="w-4 h-4 text-purple-700" />
                <span>Panel Administrativo Clínico</span>
              </Link>
            )}
            {currentUser && currentUser.role !== 'admin' && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenUserDashboard?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-[#1E3A8A] bg-white border border-slate-200 shadow-sm"
              >
                <User className="w-4 h-4 text-[#2F5BD6]" />
                <span>Mi Perfil & Citas ({currentUser.name})</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  dbService.logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            )}

            {!currentUser && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-[#1E3A8A] bg-white border border-slate-200"
              >
                <User className="w-4 h-4 text-[#2F5BD6]" />
                <span>Iniciar Sesión / Registro</span>
              </button>
            )}

            <button
              onClick={handleAgendarAction}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-white text-sm font-semibold btn-primary-gradient shadow-md cursor-pointer"
            >
              <span>Agendar cita en el sistema</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
