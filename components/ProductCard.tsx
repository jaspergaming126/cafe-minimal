
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  coldSurcharge: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, coldSurcharge }) => {
  const options = product.availableOptions || [];

  const firstPrice = product.price;
  const secondPrice = product.secondaryPrice !== undefined
    ? product.secondaryPrice
    : (product.price + coldSurcharge);

  const formatPrice = (price: number) => Number(price.toFixed(2)).toString();

  const priceLayout = (
    <div className="mt-auto pt-4">
      {options.length <= 1 ? (
        <div className="flex flex-col items-start">
          {options[0] && (
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-1">{options[0]}</span>
          )}
          <span className="text-primary font-bold text-[11px] sm:text-[13px] uppercase tracking-wide whitespace-nowrap">
            RM {formatPrice(product.price)}
          </span>
        </div>
      ) : (
        <div className="flex gap-4 sm:gap-6">
          <div className="flex flex-col items-start">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-1">{options[0]}</span>
            <span className="text-primary font-bold text-[11px] sm:text-[13px] whitespace-nowrap">RM {formatPrice(firstPrice)}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/80 mb-1">{options[1]}</span>
            <span className="text-primary font-bold text-[11px] sm:text-[13px] whitespace-nowrap">RM {formatPrice(secondPrice)}</span>
          </div>
        </div>
      )}
    </div>
  );

  const cardClass = "flex flex-col rounded-2xl h-full group transition-all duration-300 overflow-hidden";

  if (!product.image) {
    return (
      <div className={`${cardClass} bg-[#f9f7f4] dark:bg-stone-900/40 p-6 sm:p-8 border border-transparent dark:border-stone-800/60`}>
        <div className="flex-1">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-text dark:text-white mb-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-stone-light/70 dark:text-stone-400 text-xs sm:text-sm leading-relaxed italic">
            {product.description}
          </p>
        </div>
        {priceLayout}
      </div>
    );
  }

  return (
    <div className={`${cardClass} bg-stone-50 dark:bg-stone-900/40 border border-stone-100 dark:border-stone-800/60`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
        <img
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={product.image}
        />
      </div>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-text dark:text-white mb-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-stone-light/70 dark:text-stone-400 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-2">
          {product.description}
        </p>
        {priceLayout}
      </div>
    </div>
  );
};

export default ProductCard;
