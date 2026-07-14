import { useEffect, useState, useCallback } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-paper'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-lg lg:text-xl font-medium text-charcoal tracking-tight"
          >
            Kibagabaga
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'Apartments', id: 'features' },
              { label: 'Gallery', id: 'gallery' },
              { label: 'Neighborhood', id: 'neighborhood' },
              { label: 'Contact', id: 'contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="font-body text-[0.8125rem] font-medium uppercase tracking-[0.08em] text-charcoal/70 hover:text-charcoal transition-colors duration-300"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <a
            href="tel:+250788236675"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-cream font-body text-sm font-semibold rounded-full hover:bg-charcoal transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Book Now
          </a>
        </div>
      </div>
    </header>
  );
}
