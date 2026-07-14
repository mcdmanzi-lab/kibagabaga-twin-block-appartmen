import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      })
        .from(
          subtitleRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.7'
        )
        .from(
          ctaRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          imageRef.current,
          {
            x: 80,
            opacity: 0,
            rotateY: 15,
            duration: 1.4,
            ease: 'power3.out',
          },
          '-=1'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-cream"
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid z-0" />

      {/* Warm grain overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full pt-20 lg:pt-0">
          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold font-body text-xs font-semibold uppercase tracking-[0.12em] rounded-full">
                Now Available
              </span>
            </div>

            <h1
              ref={headingRef}
              className="font-display font-medium text-charcoal leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            >
              Twin-Block
              <br />
              <span className="text-gold">Apartments</span>
            </h1>

            <p
              ref={subtitleRef}
              className="mt-6 lg:mt-8 font-body text-charcoal/70 text-lg lg:text-xl leading-relaxed max-w-lg"
            >
              Modern 2-bedroom living in Kibagabaga, Kigali. Secure, sun-filled
              apartments with private balconies, water storage, and internal
              heaters — managed locally with care.
            </p>

            <div ref={ctaRef} className="mt-8 lg:mt-10 flex flex-wrap gap-4">
              <a
                href="#features"
                className="inline-flex items-center px-8 py-4 bg-charcoal text-cream font-body text-sm font-semibold rounded-full hover:bg-gold transition-colors duration-300"
              >
                Explore Apartments
                <svg
                  className="ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a
                href="tel:+250788236675"
                className="inline-flex items-center px-8 py-4 border-2 border-charcoal/20 text-charcoal font-body text-sm font-semibold rounded-full hover:border-gold hover:text-gold transition-colors duration-300"
              >
                <svg
                  className="mr-2"
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
                +250 788 236 675
              </a>
            </div>

            <div className="mt-10 flex items-center gap-8">
              <div>
                <p className="font-display text-3xl font-medium text-charcoal">2</p>
                <p className="font-body text-xs uppercase tracking-[0.08em] text-charcoal/50 mt-1">
                  Bedrooms
                </p>
              </div>
              <div className="w-px h-10 bg-charcoal/10" />
              <div>
                <p className="font-display text-3xl font-medium text-charcoal">2</p>
                <p className="font-body text-xs uppercase tracking-[0.08em] text-charcoal/50 mt-1">
                  Bathrooms
                </p>
              </div>
              <div className="w-px h-10 bg-charcoal/10" />
              <div>
                <p className="font-display text-3xl font-medium text-gold">500K</p>
                <p className="font-body text-xs uppercase tracking-[0.08em] text-charcoal/50 mt-1">
                  RWF / Month
                </p>
              </div>
            </div>
          </div>

          {/* Right: 3D Tilted Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end" style={{ perspective: '1000px' }}>
            <div
              ref={imageRef}
              className="relative w-full max-w-[540px] aspect-[4/3]"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateY(-5deg) rotateX(2deg)',
              }}
            >
              <img
                src="/assets/hero-property.jpg"
                alt="Kibagabaga Twin-Block Apartments exterior"
                className="w-full h-full object-cover rounded-xl shadow-paper"
              />
              {/* Secondary floating image */}
              <div
                className="absolute -bottom-8 -left-8 w-36 h-28 rounded-lg overflow-hidden shadow-paper border-4 border-cream"
                style={{ transform: 'translateZ(40px)' }}
              >
                <img
                  src="/assets/hero-interior.jpg"
                  alt="Apartment interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-body text-[0.625rem] uppercase tracking-[0.15em] text-charcoal/40">
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border-2 border-charcoal/20 flex justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-gold rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
