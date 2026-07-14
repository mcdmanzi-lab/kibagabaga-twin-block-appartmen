import { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import Header from './sections/Header';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Gallery from './sections/Gallery';
import Neighborhood from './sections/Neighborhood';
import Booking from './sections/Booking';
import Contact from './sections/Contact';
import AdminDashboard from './pages/AdminDashboard';

const WelcomeRibbonIntro = lazy(() => import('./sections/WelcomeRibbonIntro'));

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    // Check if admin view is requested via URL hash
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  // Show admin dashboard if requested
  if (isAdminView) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      {/* 3D Welcome Intro */}
      {!introComplete && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[100] bg-cream flex items-center justify-center">
              <div className="text-center">
                <p className="font-display text-2xl text-charcoal mb-2">
                  Kibagabaga
                </p>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-charcoal/50 animate-pulse">
                  Loading Experience
                </p>
              </div>
            </div>
          }
        >
          <WelcomeRibbonIntro onComplete={handleIntroComplete} />
        </Suspense>
      )}

      {/* Main Content */}
      <div
        className={`transition-opacity duration-700 ${
          introComplete ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Header />
        <main>
          <Hero />
          <Features />
          <Gallery />
          <Neighborhood />
          <Booking />
          <Contact />
        </main>
      </div>
    </div>
  );
}
