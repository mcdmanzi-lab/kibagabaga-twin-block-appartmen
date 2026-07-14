import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlipCard from './FlipCard';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: 'Spacious Bedrooms',
    description:
      'Two well-appointed bedrooms with built-in wardrobes, large windows, and soft natural light throughout the day.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20" /><path d="M5 20v-8h14v8" /><path d="M3 12v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" /><path d="M7 12V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
      </svg>
    ),
    frontImage: '/assets/feat-bedroom.jpg',
    backImage: '/assets/hero-interior.jpg',
  },
  {
    title: 'Modern Bathrooms',
    description:
      'Two contemporary bathrooms with glass shower enclosures, quality brass fixtures, and elegant porcelain finishes.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21h6" /><path d="M12 21v-5" /><path d="M12 16a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v5" /><path d="M7 16H5a2 2 0 0 1-2-2v-2h20" /><path d="M4 12V7a2 2 0 0 1 2-2h2" /><path d="M8 5v5" />
      </svg>
    ),
    frontImage: '/assets/feat-bathroom.jpg',
    backImage: '/assets/feat-bedroom.jpg',
  },
  {
    title: 'Private Balconies',
    description:
      'Your own outdoor space with views of Kigali\'s green hills — perfect for morning coffee or evening relaxation.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M9 21v-6h6v6" /><path d="M10 9h4" /><path d="M10 13h4" />
      </svg>
    ),
    frontImage: '/assets/feat-balcony.jpg',
    backImage: '/assets/gallery-6.jpg',
  },
  {
    title: 'Modern Kitchen',
    description:
      'Open-plan kitchen with light wood cabinetry, quality countertops, and brass fittings — designed for daily living.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" /><path d="M5 21v-8h3v8" /><path d="M16 21v-8h3v8" /><path d="M8 13V7a2 2 0 0 1 4 0v6" /><path d="M12 13V7a2 2 0 0 1 4 0v6" /><path d="M8 7h8" />
      </svg>
    ),
    frontImage: '/assets/feat-kitchen.jpg',
    backImage: '/assets/hero-interior.jpg',
  },
];

const amenityList = [
  { label: 'Water Storage Tanks', desc: 'Reliable water supply, never run dry' },
  { label: 'Internal Water Heaters', desc: 'Hot water on demand, every day' },
  { label: 'Secure Compound', desc: 'Gated access for your peace of mind' },
  { label: 'Paved Parking', desc: 'Dedicated parking space included' },
  { label: 'Green Surroundings', desc: 'Lush hillside views all around' },
  { label: 'Local Management', desc: 'Personally managed, always responsive' },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Cards stagger
      if (cardsRef.current) {
        gsap.from(cardsRef.current.querySelectorAll('.feature-card'), {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Amenities
      if (amenitiesRef.current) {
        gsap.from(amenitiesRef.current.querySelectorAll('.amenity-item'), {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: amenitiesRef.current,
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
      id="features"
      ref={sectionRef}
      className="relative w-full bg-cream"
      style={{ padding: '120px 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div ref={titleRef} className="text-center mb-16 lg:mb-20">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-gold">
            What We Offer
          </span>
          <h2
            className="mt-4 font-display font-medium text-charcoal leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            Thoughtfully Designed
            <br />
            For Modern Living
          </h2>
          <p className="mt-6 font-body text-charcoal/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Every detail of our twin-block apartments has been considered — from
            the natural light flooding each room to the practical amenities that
            make daily life effortless.
          </p>
        </div>

        {/* Feature cards with Flip-Vault */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <FlipCard
                frontImage={feature.frontImage}
                backImage={feature.backImage}
                alt={feature.title}
              />
              <div className="mt-5 flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-charcoal">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 font-body text-sm text-charcoal/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Amenities list */}
        <div
          ref={amenitiesRef}
          className="mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6"
        >
          {amenityList.map((amenity, index) => (
            <div
              key={index}
              className="amenity-item flex items-start gap-4 p-5 rounded-xl bg-charcoal/[0.02] hover:bg-charcoal/[0.04] transition-colors duration-300"
            >
              <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-gold" />
              <div>
                <p className="font-body text-sm font-semibold text-charcoal">
                  {amenity.label}
                </p>
                <p className="mt-0.5 font-body text-xs text-charcoal/50">
                  {amenity.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
