import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  { src: '/assets/gallery-1.jpg', label: 'Building Exterior' },
  { src: '/assets/gallery-2.jpg', label: 'Modern Bathroom' },
  { src: '/assets/gallery-3.jpg', label: 'Living Area' },
  { src: '/assets/gallery-4.jpg', label: 'Kitchen' },
  { src: '/assets/gallery-5.jpg', label: 'Master Bedroom' },
  { src: '/assets/gallery-6.jpg', label: 'Balcony View' },
];

const skewsetPositions = [
  { sx: '14vw', sy: '-11vh' },
  { sx: '-24vw', sy: '2vh' },
  { sx: '6vw', sy: '13vh' },
  { sx: '29vw', sy: '-6vh' },
  { sx: '-13vw', sy: '-14vh' },
  { sx: '-30vw', sy: '10vh' },
];

const zRotations = [-18, 15, -8, 22, -12, 10];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // Scroll drift
      const driftEl = section.querySelector('.gallery-drift');
      if (driftEl) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          animation: gsap.fromTo(
            driftEl,
            { y: '20vh' },
            { y: '-20vh', ease: 'none' }
          ),
        });
      }

      // Lazy sine-wave skew
      const STAGGER = 0.22;
      const DURATION = 1.5;
      gsap.fromTo(
        section.querySelectorAll('.lazyskrw'),
        {
          skewX: -5,
          skewY: 10,
          scaleY: 0.85,
          ease: 'sine.inOut',
        },
        {
          skewX: 5,
          skewY: -10,
          scaleY: 1.15,
          duration: DURATION,
          ease: 'sine.inOut',
          stagger: {
            each: STAGGER,
            repeat: -1,
            yoyo: true,
            from: 'center',
          },
        }
      );

      // Hover lift
      section.querySelectorAll('.hover-lift').forEach((el) => {
        gsap.set(el, {
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          force3D: true,
        });
        el.addEventListener('mouseenter', () => {
          gsap.to(el, {
            z: 30,
            rotateY: -5,
            scale: 1.03,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            z: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.55,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const cssVariables: React.CSSProperties = {
    '--imgW': '22vw',
    '--imgH': 'calc(var(--imgW) * 0.75)',
    '--gap': '2.5vw',
    '--zBase': '0px',
    '--zInc': '-35px',
    '--zSkewMax': '12deg',
    '--zScaleMin': '0.85',
  } as React.CSSProperties;

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative w-full bg-cream"
      style={cssVariables}
    >
      {/* Section title */}
      <div ref={titleRef} className="text-center pt-20 lg:pt-32 pb-8 px-6">
        <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-gold">
          Visual Tour
        </span>
        <h2
          className="mt-4 font-display font-medium text-charcoal leading-[1.1] tracking-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          Life at Kibagabaga
        </h2>
        <p className="mt-4 font-body text-charcoal/60 text-base max-w-xl mx-auto">
          A glimpse into your new neighborhood — from lush hillsides to vibrant local spots.
        </p>
      </div>

      {/* 3D Gallery */}
      <div className="gallery-scroll-container" style={{ height: '300vh' }}>
        <div className="gallery-camera" style={{ position: 'sticky', top: 0, height: '100vh' }}>
          <div className="gallery-scene w-full h-full">
            <div className="gallery-drift">
              {/* 3 duplicate sets for depth */}
              {[0, 1, 2].map((setIndex) => (
                <div key={setIndex} className="gallery-skewset">
                  {galleryImages.map((img, i) => {
                    const pos = skewsetPositions[i];
                    const zValue = `calc(var(--zBase) + var(--zInc) * ${i})`;
                    return (
                      <div
                        key={`${setIndex}-${i}`}
                        className="lazyskrw"
                        style={
                          {
                            '--sx': pos.sx,
                            '--sy': pos.sy,
                            '--sz': zValue,
                            '--ry': `${zRotations[i]}deg`,
                          } as React.CSSProperties
                        }
                      >
                        <div className="hover-lift relative group cursor-pointer">
                          <img
                            src={img.src}
                            alt={img.label}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors duration-300 rounded-[6px] flex items-end p-4">
                            <span className="font-body text-xs font-medium text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                              {img.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
