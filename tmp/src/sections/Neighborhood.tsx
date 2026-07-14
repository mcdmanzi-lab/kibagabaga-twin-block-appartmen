import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    title: 'Kibagabaga Hospital',
    distance: '3 min walk',
    desc: 'Quality healthcare right around the corner.',
  },
  {
    title: 'Kimironko Market',
    distance: '5 min drive',
    desc: 'Fresh produce, local goods, and vibrant community life.',
  },
  {
    title: 'Pili Pili Restaurant',
    distance: '8 min drive',
    desc: 'Iconic Kigali spot with pool, grill, and stunning views.',
  },
  {
    title: 'City Center',
    distance: '12 min drive',
    desc: 'Kigali Convention Centre, shops, and business district.',
  },
  {
    title: 'ViaVia Café',
    distance: '6 min walk',
    desc: 'Charming café with garden seating and great food.',
  },
  {
    title: 'Sunset Spa',
    distance: '4 min drive',
    desc: 'Relaxation and wellness services nearby.',
  },
];

export default function Neighborhood() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(imageRef.current, {
        x: 50,
        opacity: 0,
        rotateY: 10,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      if (listRef.current) {
        gsap.from(listRef.current.querySelectorAll('.highlight-item'), {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="neighborhood"
      ref={sectionRef}
      className="relative w-full bg-cream overflow-hidden"
      style={{ padding: '120px 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Text content */}
          <div ref={textRef}>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              The Neighborhood
            </span>
            <h2
              className="mt-4 font-display font-medium text-charcoal leading-[1.1] tracking-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              Kibagabaga —
              <br />
              Kigali's Hidden Gem
            </h2>
            <p className="mt-6 font-body text-charcoal/65 text-base lg:text-lg leading-relaxed max-w-lg">
              Tucked between Kimironko and Gacuriro, Kibagabaga is one of
              Kigali's most attractive and fast-developing residential areas.
              Serene, secure, and surrounded by lush greenery — yet only minutes
              from the city center.
            </p>
            <p className="mt-4 font-body text-charcoal/65 text-base lg:text-lg leading-relaxed max-w-lg">
              Paved roads, reliable utilities, international schools, and a
              growing selection of restaurants and cafés make this the perfect
              place to call home.
            </p>

            {/* Nearby highlights */}
            <div ref={listRef} className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="highlight-item p-4 rounded-xl bg-charcoal/[0.02] hover:bg-charcoal/[0.04] transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-body text-sm font-semibold text-charcoal">
                      {item.title}
                    </p>
                    <span className="font-body text-[0.65rem] font-medium uppercase tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                      {item.distance}
                    </span>
                  </div>
                  <p className="font-body text-xs text-charcoal/50">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Map image with 3D tilt */}
          <div
            ref={imageRef}
            className="relative lg:sticky lg:top-32"
            style={{ perspective: '1000px' }}
          >
            <div
              className="relative"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateY(-3deg) rotateX(1deg)',
              }}
            >
              <img
                src="/assets/map-kibagabaga.jpg"
                alt="Map of Kibagabaga area"
                className="w-full rounded-2xl shadow-paper"
              />
              {/* Decorative element */}
              <div
                className="absolute -bottom-6 -right-6 bg-cream rounded-xl p-4 shadow-paper border border-charcoal/5"
                style={{ transform: 'translateZ(30px)' }}
              >
                <p className="font-display text-2xl font-medium text-charcoal">
                  12 min
                </p>
                <p className="font-body text-xs text-charcoal/50">
                  to City Center
                </p>
              </div>
            </div>

            {/* Secondary image */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <img
                src="/assets/gallery-6.jpg"
                alt="Kibagabaga residential street"
                className="w-full h-40 object-cover rounded-xl"
              />
              <img
                src="/assets/gallery-1.jpg"
                alt="Kibagabaga aerial view"
                className="w-full h-40 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
