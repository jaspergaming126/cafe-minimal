
import React from 'react';
import { Product } from '../types';

interface FeaturedProductProps {
  product: Product;
  coldSurcharge: number;
}

const FeaturedProduct: React.FC<FeaturedProductProps> = ({ product, coldSurcharge }) => {
  const options = product.availableOptions || [];

  const firstPrice = product.price;
  const secondPrice = product.secondaryPrice !== undefined
    ? product.secondaryPrice
    : (product.price + coldSurcharge);

  const formatPrice = (price: number) => Number(price.toFixed(2)).toString();

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-900 shadow-sm transition-all duration-500 hover:shadow-xl">
      <div className={`relative h-64 sm:h-[400px] w-full overflow-hidden flex items-center justify-center ${!product.image ? 'bg-gradient-to-br from-stone-50 to-stone-200 dark:from-stone-900 dark:to-black' : ''}`}>
        {product.image ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
            <img
              alt={product.name}
              className="h-full w-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              src={product.image}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-12 text-center opacity-5">
            <h4 className="font-serif text-[120px] font-bold uppercase tracking-tighter select-none">{product.category}</h4>
          </div>
        )}

        <div className={`absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 flex flex-col justify-end ${!product.image ? 'relative h-full' : ''}`}>
          <div className="max-w-full mb-4">
            <h3 className={`${product.image ? 'text-white' : 'text-stone-text dark:text-white'} font-serif text-3xl sm:text-4xl font-bold mb-2`}>{product.name}</h3>
            <p className={`${product.image ? 'text-white/70' : 'text-stone-light dark:text-stone-400'} font-display text-sm sm:text-base font-medium leading-relaxed italic max-w-lg`}>
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {options.length <= 1 ? (
              <div className="flex flex-col items-start">
                {options[0] && (
                  <span className={`text-[9px] ${product.image ? 'text-white/40' : 'text-primary/60'} font-bold uppercase tracking-widest mb-1 ml-1`}>{options[0]}</span>
                )}
                <div className="bg-primary px-4 py-2 rounded-full shadow-lg">
                  <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">RM {formatPrice(product.price)}</span>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 sm:gap-4">
                <div className="flex flex-col items-start">
                  <span className={`text-[9px] ${product.image ? 'text-white/40' : 'text-primary/60'} font-bold uppercase tracking-widest mb-1 ml-1`}>{options[0]}</span>
                  <div className={`${product.image ? 'bg-white/10' : 'bg-stone-200 dark:bg-white/10'} backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20`}>
                    <span className={`${product.image ? 'text-white' : 'text-primary'} font-bold text-[11px] sm:text-sm whitespace-nowrap`}>RM {formatPrice(firstPrice)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className={`text-[9px] ${product.image ? 'text-primary/80' : 'text-primary/90'} font-bold uppercase tracking-widest mb-1 ml-1`}>{options[1]}</span>
                  <div className="bg-primary/20 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-primary/30">
                    <span className={`${product.image ? 'text-white' : 'text-primary'} font-bold text-[11px] sm:text-sm whitespace-nowrap`}>RM {formatPrice(secondPrice)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
