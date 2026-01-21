
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  isSearchVisible: boolean;
  onSearchToggle: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  brandName?: string;
  showLogo?: boolean;
  logoUrl?: string;
}

const Header: React.FC<HeaderProps> = ({
  isSearchVisible,
  onSearchToggle,
  searchQuery,
  onSearchChange,
  brandName = 'Café Minimal',
  showLogo = true,
  logoUrl
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const startThreshold = 40;
      const transitionDistance = 160;
      const progress = Math.max(0, Math.min((window.scrollY - startThreshold) / transitionDistance, 1));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pt = 24 - (14 * scrollProgress);
  const pb = 18 - (10 * scrollProgress);
  const scale = 1.2 - (0.55 * scrollProgress);
  const btnSize = 48 - (8 * scrollProgress);
  const iconFs = 24 - (4 * scrollProgress);

  return (
    <header
      className="sticky top-0 z-50 flex flex-col px-10 border-b border-stone-100 dark:border-stone-800/50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md rounded-t-[20px] -mt-5 smooth-optimize"
      style={{
        paddingTop: `${pt}px`,
        paddingBottom: `${pb}px`,
        boxShadow: scrollProgress > 0.9 ? '0 8px 30px -15px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'left center',
            transition: 'transform 0.1s ease-out'
          }}
        >
          {showLogo ? (
            logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-10 w-auto object-contain" />
            ) : (
              <h1
                className="font-serif font-bold tracking-tight whitespace-nowrap text-3xl"
                style={{ color: 'var(--color-brand-name)' }}
              >
                {brandName}
              </h1>
            )
          ) : (
            <div className="h-9"></div> // Placeholder when logo is hidden
          )}
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={onSearchToggle}
            className={`flex items-center justify-center rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 transition-all duration-300 ${isSearchVisible ? 'text-primary bg-primary/10' : 'text-stone-text dark:text-stone-300'}`}
            style={{
              width: `${btnSize}px`,
              height: `${btnSize}px`
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: `${iconFs}px` }}
            >
              {isSearchVisible ? 'close' : 'search'}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSearchVisible ? 'max-h-24 opacity-100 mt-4 pb-2' : 'max-h-0 opacity-0 mt-0 pb-0'
          }`}
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400 text-sm">search</span>
          <input
            autoFocus={isSearchVisible}
            type="text"
            placeholder="Search our menu..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 dark:text-white transition-all outline-none"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
