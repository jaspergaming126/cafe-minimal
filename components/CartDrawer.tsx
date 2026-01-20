
import React from 'react';
import { CartItem, ProductOption } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string, option?: ProductOption) => void;
  onUpdateQuantity: (id: string, option: ProductOption | undefined, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQuantity,
  onCheckout
}) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const formatPrice = (price: number) => Number(price.toFixed(2)).toString();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white dark:bg-background-dark shadow-2xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
          <h2 className="font-serif text-xl font-bold dark:text-white">Your Order</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
              <span className="material-symbols-outlined text-6xl">shopping_basket</span>
              <p className="font-medium italic text-stone-text dark:text-white">Your cart is currently empty.</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 border border-stone-200 dark:border-stone-700 rounded-full text-sm font-bold"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${item.selectedOption}-${idx}`} className="flex gap-4 group">
                <div className="size-20 rounded-xl overflow-hidden shrink-0 border border-stone-100 dark:border-stone-800">
                  <img src={item.image} alt={item.name} className="size-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-stone-text dark:text-white truncate pr-2">{item.name}</h3>
                      {item.selectedOption && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-0.5">
                          {item.selectedOption}
                        </span>
                      )}
                    </div>
                    <button onClick={() => onRemove(item.id, item.selectedOption)} className="text-stone-300 hover:text-red-500">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                  <p className="text-xs text-stone-light/70 dark:text-stone-500 mb-3 whitespace-nowrap">RM {formatPrice(item.price)} each</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-stone-50 dark:bg-stone-900 rounded-lg p-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.selectedOption, -1)}
                        className="size-6 flex items-center justify-center text-stone-400 hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[14px]">remove</span>
                      </button>
                      <span className="w-8 text-center text-xs font-bold dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.selectedOption, 1)}
                        className="size-6 flex items-center justify-center text-stone-400 hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                      </button>
                    </div>
                    <span className="text-[13px] font-bold dark:text-white ml-auto whitespace-nowrap">
                        RM {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
            <div className="flex justify-between items-center mb-6">
              <span className="text-stone-light/70 dark:text-stone-500 font-bold uppercase tracking-wider text-[10px]">Total Amount</span>
              <span className="text-xl font-serif font-bold dark:text-white whitespace-nowrap">RM {formatPrice(total)}</span>
            </div>
            <button 
                onClick={onCheckout}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined">shopping_cart_checkout</span>
              Checkout with WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
