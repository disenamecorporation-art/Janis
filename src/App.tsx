import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { BlogList } from './pages/BlogList';
import { BlogPostDetail } from './pages/BlogPostDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { FormularioPage } from './pages/FormularioPage';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { UserDashboardModal } from './components/UserDashboardModal';

// Helper component to manage smooth scroll on route transitions
const ScrollHandler: React.FC = () => {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
};

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<'Terapia Individual' | 'Terapia de Pareja'>('Terapia Individual');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);

  const handleOpenBooking = (service: 'Terapia Individual' | 'Terapia de Pareja' = 'Terapia Individual') => {
    setBookingService(service);
    setIsBookingOpen(true);
  };

  return (
    <HashRouter>
      <ScrollHandler />
      <div className="min-h-screen flex flex-col bg-[#F8FAFD] text-[#4B5675] relative selection:bg-[#D6567F]/20 selection:text-[#1E3A8A]">
        {/* Sticky Super-Glass Navbar */}
        <Navbar 
          onOpenAgendar={() => handleOpenBooking('Terapia Individual')} 
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        />

        {/* Dynamic Route Content */}
        <div className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  onOpenBooking={handleOpenBooking} 
                />
              } 
            />
            <Route path="/formulario" element={<FormularioPage />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>

        {/* Global Booking Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          defaultService={bookingService}
        />

        {/* Global Auth Modal (Registro, Login y Recuperación de Contraseña) */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />

        {/* Global User Dashboard Modal (Mis Citas, Cambiar Contraseña, Cambiar Email, Logout) */}
        <UserDashboardModal
          isOpen={isUserDashboardOpen}
          onClose={() => setIsUserDashboardOpen(false)}
          onOpenAgendar={() => handleOpenBooking('Terapia Individual')}
        />

        {/* Global Footer */}
        <Footer />
      </div>
    </HashRouter>
  );
}
