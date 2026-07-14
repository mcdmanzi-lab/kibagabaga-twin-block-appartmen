import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

interface FlipCardProps {
  frontImage: string;
  backImage: string;
  backText?: string;
  alt: string;
}

export default function FlipCard({ frontImage, backImage, backText = 'View Gallery', alt }: FlipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const initFlip = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    const front = card.querySelector('.flip-front') as HTMLElement;
    const back = card.querySelector('.flip-back') as HTMLElement;
    const shadowF = front?.querySelector('.flip-shadow') as HTMLElement;
    const shadowB = back?.querySelector('.flip-shadow') as HTMLElement;

    if (!front || !back || !shadowF || !shadowB) return;

    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: 1.1, ease: 'power1.out' },
    });

    tl.to(card, { rotationY: 180, transformOrigin: 'center center' });
    tl.to(
      front.querySelector('img'),
      { rotationY: -180, transformOrigin: 'center center' },
      0
    );
    tl.to(
      back.querySelector('img'),
      { rotationY: 0, transformOrigin: 'center center' },
      0
    );
    tl.fromTo(
      card,
      { rotationX: 0 },
      { rotationX: 8, duration: 0.55, yoyo: true, repeat: 1, ease: 'sine.inOut' },
      0
    );
    tl.fromTo(
      card,
      { scale: 1 },
      { scale: 0.96, duration: 0.55, yoyo: true, repeat: 1, ease: 'sine.inOut' },
      0
    );
    tl.fromTo(
      shadowF,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1.35,
        yoyo: true,
        repeat: 1,
        duration: 0.55,
        ease: 'sine.inOut',
      },
      0
    );
    tl.fromTo(
      shadowB,
      { opacity: 1, scale: 1.35 },
      {
        opacity: 0,
        scale: 0.8,
        yoyo: true,
        repeat: 1,
        duration: 0.55,
        ease: 'sine.inOut',
      },
      0
    );

    tlRef.current = tl;
  }, []);

  useEffect(() => {
    initFlip();
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [initFlip]);

  const handleMouseEnter = useCallback(() => {
    tlRef.current?.play();
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (tlRef.current) {
      if (tlRef.current.progress() === 1) {
        tlRef.current.reverse();
      } else {
        tlRef.current.reverse(0);
      }
    }
  }, []);

  return (
    <div className="flip-card-wrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div ref={cardRef} className="flip-card aspect-[4/3]">
        {/* Front face */}
        <div className="flip-front">
          <div className="flip-shadow" />
          <img
            src={frontImage}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Back face */}
        <div className="flip-back">
          <div className="flip-shadow" />
          <img
            src={backImage}
            alt={`${alt} - alternate view`}
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-dark/35 flex items-center justify-center z-10">
            <span className="font-body text-sm font-medium uppercase tracking-[0.08em] text-cream">
              {backText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
