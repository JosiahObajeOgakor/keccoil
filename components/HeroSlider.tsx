'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface HeroSlide {
  id: string;
  type: 'image' | 'video';
  src: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  ctaExternal?: boolean;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
  videoInterval?: number;
}

export function HeroSlider({
  slides,
  autoPlayInterval = 5000,
  videoInterval = 20000,
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const currentType = slides[currentSlide]?.type;
    const delay = currentType === 'video' ? videoInterval : autoPlayInterval;

    const timeout = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isAutoPlay, autoPlayInterval, videoInterval, slides, currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides?.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides?.length) % slides?.length);
  };

  const slide = slides[currentSlide];

  return (
    <div
      className="relative w-full bg-black overflow-hidden"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      role="region"
      aria-label="Featured content slideshow"
      aria-roledescription="carousel"
    >
      {/* Fits all screens: uses dvh for mobile browser chrome awareness, capped to not overflow */}
      <div className="relative w-full h-[56dvh] sm:h-[60dvh] md:h-[70dvh] lg:h-[85dvh] xl:h-screen">
        {/* Slides */}
        {slides?.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slides.length}${s.title ? `: ${s.title}` : ''}`}
            aria-hidden={index !== currentSlide}
          >
            {s.type === 'video' ? (
              <video
                src={s.src}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={s.src}
                alt={s.title || `Kece Oil promotional image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                sizes="100vw"
              />
            )}

            {/* Overlay — bottom gradient on mobile (portrait friendly), side gradient on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-end p-5 pb-14 sm:p-8 sm:pb-16 md:p-12 lg:p-16">
              <div className="max-w-xl lg:max-w-2xl">
                {s.title && (
                  <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 md:mb-3 leading-tight line-clamp-2">
                    {s.title}
                  </h2>
                )}
                {s.subtitle && (
                  <p className="text-[13px] leading-snug sm:text-sm md:text-base text-white/90 mb-3 sm:mb-5 md:mb-6 max-w-sm sm:max-w-md lg:max-w-lg line-clamp-2">
                    {s.subtitle}
                  </p>
                )}
                {s.ctaExternal ? (
                  <a
                    href={s.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-3.5 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all text-xs sm:text-sm md:text-base shadow-lg shadow-primary/30 hover:scale-105 active:scale-95"
                  >
                    {s.ctaText}
                  </a>
                ) : (
                  <Link
                    href={s.ctaLink}
                    className="inline-block px-5 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-3.5 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all text-xs sm:text-sm md:text-base shadow-lg shadow-primary/30 hover:scale-105 active:scale-95"
                  >
                    {s.ctaText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons — hidden on mobile, visible on tablet+ */}
        <button
          onClick={prevSlide}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 text-white rounded-full items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 text-white rounded-full items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot Indicators — hidden on mobile, visible on tablet+ */}
        <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'bg-white w-8 h-2'
                  : 'bg-white/50 hover:bg-white/70 w-2 h-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide counter — hidden on mobile */}
        <div className="hidden sm:block absolute top-4 md:top-6 right-4 md:right-6 z-20 bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
}
