
import React, { useState, useEffect } from 'react';

interface HeroProps {
  appConfig: any;
}

const Hero: React.FC<HeroProps> = ({ appConfig }) => {
  const [blurAmount, setBlurAmount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate blur based on scroll position
      // Transitions from 0px to 8px blur over the first 250px of scroll
      const scrollY = window.scrollY;
      const blur = Math.min(scrollY / 30, 8);
      setBlurAmount(blur);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check in case page starts scrolled
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div className="relative w-full h-80 sm:h-[420px] overflow-hidden bg-stone-900">
        <img
          alt="Atmospheric Café Interior"
          className="h-full w-full object-cover transition-transform duration-1000"
          src={appConfig.hero_image}
          style={{
            filter: `blur(${blurAmount}px)`,
            // Slightly scale up blurred image to hide softened edges
            transform: `scale(${1 + (blurAmount / 100)})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {appConfig.show_hero_message && (
          <div
            className="absolute bottom-16 left-8 z-10 transition-all duration-300 ease-out smooth-optimize"
            style={{
              filter: `blur(${blurAmount * 0.7}px)`,
              opacity: 1 - (blurAmount / 16),
              transform: `translateY(${blurAmount * 2}px)`
            }}
          >
            <p className="text-white/80 font-display text-[10px] font-bold tracking-[0.2em] uppercase mb-1 drop-shadow-md">Established 2024</p>
            <p className="text-white font-serif text-3xl sm:text-4xl font-bold italic drop-shadow-md">{appConfig.hero_message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
