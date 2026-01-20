
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, CategoryId } from './types';
import { useAppData } from './hooks/useData';
import Header from './components/Header';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import FeaturedProduct from './components/FeaturedProduct';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const COLD_SURCHARGE = 0.50;
const NAV_HEIGHT_OFFSET = 110;

const App: React.FC = () => {
  // Use dynamic data from Supabase (with fallback to static data)
  const { products: allProducts, categories, themeConfig, loading, error } = useAppData();

  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const isScrollingRef = useRef(false);

  // Apply theme configuration
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', themeConfig.primaryColor);
    document.documentElement.style.setProperty('--color-brand-name', themeConfig.brandNameColor);
    document.documentElement.style.setProperty('--font-main', themeConfig.fontFamily);
  }, [themeConfig]);

  const visibleProducts = useMemo(() => {
    return allProducts.filter(p => p.isVisible !== false);
  }, [allProducts]);

  const groupedProducts = useMemo(() => {
    const groups: Record<CategoryId, { label: string; items: Product[] }> = {};
    categories.forEach(cat => {
      if (cat.id === 'all' || cat.id === 'chefs-choice') return;
      const items = visibleProducts.filter(p => p.category === cat.id);
      if (items.length > 0) {
        groups[cat.id] = { label: cat.label, items };
      }
    });
    return groups;
  }, [visibleProducts, categories]);

  const chefChoiceConfig = categories.find(c => c.id === 'chefs-choice');
  const chefChoiceProducts = useMemo(() => {
    return visibleProducts.filter(p => p.category === 'chefs-choice');
  }, [visibleProducts]);

  const filteredProducts = useMemo(() => {
    return visibleProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, visibleProducts]);

  useEffect(() => {
    if (searchQuery) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const scrollPosition = window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition < 50) {
        setActiveCategoryId('all');
        return;
      }

      if (scrollPosition + viewportHeight >= pageHeight - 100) {
        setActiveCategoryId(categories[categories.length - 1].id);
        return;
      }

      const sections = document.querySelectorAll('.menu-section');
      let currentSectionId: string | null = null;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i] as HTMLElement;
        const rect = section.getBoundingClientRect();

        if (rect.top <= NAV_HEIGHT_OFFSET + 30) {
          currentSectionId = section.id;
          break;
        }
      }

      if (currentSectionId && currentSectionId !== activeCategoryId) {
        setActiveCategoryId(currentSectionId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [searchQuery, activeCategoryId, categories]);

  const handleCategoryClick = (id: CategoryId) => {
    setActiveCategoryId(id);
    isScrollingRef.current = true;

    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -NAV_HEIGHT_OFFSET;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }

    // Release scroll lock after transition
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  const handleSearchToggle = () => {
    if (isSearchVisible) {
      setSearchQuery('');
    }
    setIsSearchVisible(!isSearchVisible);
  };

  // Show loading state only during initial load (optional - we show content immediately with fallback data)
  // Uncomment below if you want a full-screen loader instead
  // if (loading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
  //       <LoadingSpinner size="lg" message="Loading menu..." />
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background-light dark:bg-background-dark transition-colors duration-300">
      <div className="w-full max-w-[960px] flex flex-col min-h-screen bg-white/30 dark:bg-black/20 shadow-sm border-x border-stone-100 dark:border-stone-900">
        <section id="all" className="menu-section">
          <Hero />
        </section>

        <Header
          isSearchVisible={isSearchVisible}
          onSearchToggle={handleSearchToggle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <Navbar
          activeCategoryId={activeCategoryId}
          onCategoryChange={handleCategoryClick}
        />

        <main className="flex-1 px-6 pb-20">
          {!searchQuery && chefChoiceProducts.length > 0 && (
            <section id="chefs-choice" className="menu-section mt-8 mb-12 scroll-mt-[110px]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <h2 className="text-xl font-bold text-stone-text dark:text-white">
                  {chefChoiceConfig?.label || "Chef's Choice"}
                </h2>
              </div>
              <div className="flex flex-col gap-8">
                {chefChoiceProducts.map(product => (
                  <FeaturedProduct key={product.id} product={product} coldSurcharge={COLD_SURCHARGE} />
                ))}
              </div>
            </section>
          )}

          <section className="mt-12">
            {!searchQuery ? (
              <div className="space-y-16">
                {Object.entries(groupedProducts).map(([id, group]) => {
                  const typedGroup = group as { label: string; items: Product[] };
                  return (
                    <div key={id} id={id} className="menu-section scroll-mt-[110px]">
                      <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-stone-text dark:text-white shrink-0">
                          {typedGroup.label}
                        </h2>
                        <div className="h-px w-full bg-stone-100 dark:bg-stone-800"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12">
                        {typedGroup.items.map(product => (
                          <ProductCard key={product.id} product={product} coldSurcharge={COLD_SURCHARGE} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-stone-text dark:text-white mb-8">
                  Search Results
                </h2>
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} coldSurcharge={COLD_SURCHARGE} />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <span className="material-symbols-outlined text-5xl text-stone-300 dark:text-stone-700 mb-4">sentiment_very_dissatisfied</span>
                    <p className="text-stone-light dark:text-stone-500 font-medium italic">No items found matching your selection.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
