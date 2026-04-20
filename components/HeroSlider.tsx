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
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
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
      {/* Responsive viewport height */}
      <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[70vh] lg:h-[80vh] min-h-[280px] max-h-[800px]">
        {/* Slides */}
        {slides.map((s, index) => (
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
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={s.src}
                alt={s.title || `KeceoOil promotional image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            )}

            {/* Overlay with content */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-12 lg:p-16">
              <div className="max-w-2xl">
                {s.title && (
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                    {s.title}
                  </h2>
                )}
                {s.subtitle && (
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-5 sm:mb-8 leading-relaxed max-w-lg">
                    {s.subtitle}
                  </p>
                )}
                {s.ctaExternal ? (
                  <a
                    href={s.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2.5 sm:px-8 sm:py-3 bg-accent text-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm sm:text-base"
                  >
                    {s.ctaText}
                  </a>
                ) : (
                  <Link
                    href={s.ctaLink}
                    className="inline-block px-6 py-2.5 sm:px-8 sm:py-3 bg-accent text-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm sm:text-base"
                  >
                    {s.ctaText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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

        {/* Slide counter */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
}
