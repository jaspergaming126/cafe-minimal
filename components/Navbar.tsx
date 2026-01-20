
import React, { useEffect, useRef } from 'react';
import { CategoryId, CategoryConfig } from '../types';
import { useCategories } from '../hooks/useData';

interface NavbarProps {
  activeCategoryId: CategoryId;
  onCategoryChange: (id: CategoryId) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeCategoryId, onCategoryChange }) => {
  const { categories } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeBtnRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const element = activeBtnRef.current;
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft = element.offsetLeft - (containerRect.width / 2) + (elementRect.width / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeCategoryId]);

  return (
    <nav className="sticky top-[58px] z-40 bg-white/95 dark:bg-background-dark/95 border-b border-stone-100 dark:border-stone-800/50 py-0.5 overflow-hidden transition-all duration-300 backdrop-blur-md">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar px-6 gap-8 snap-x"
      >
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              ref={isActive ? activeBtnRef : null}
              onClick={() => onCategoryChange(cat.id)}
              className={`snap-start shrink-0 flex flex-col items-center justify-center border-b-[3px] transition-all pb-3 pt-4 focus:outline-none ${isActive
                  ? 'border-primary'
                  : 'border-transparent hover:border-stone-200 dark:hover:border-stone-700'
                }`}
            >
              <span className={`text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap transition-colors ${isActive
                  ? 'text-primary'
                  : 'text-stone-light/40 dark:text-stone-500'
                }`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
