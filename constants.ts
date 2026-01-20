
import { Product, CategoryConfig } from './types';

export const THEME_CONFIG = {
  primaryColor: '#e66e19', 
  brandNameColor: '#1b130e', 
  fontFamily: "'Plus Jakarta Sans', sans-serif", // Single font for the entire app
};

export const SOCIAL_CONFIG = {
  instagram: 'https://instagram.com/cafeminimal',
  facebook: 'https://facebook.com/cafeminimal_official',
};

export const ADDRESS_CONFIG = {
  text: '123 Coffee Street, Brew City, CA 90210',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=123+Coffee+Street+Brew+City+CA+90210',
};

// Edit labels here to update the UI globally
export const CATEGORIES: CategoryConfig[] = [
  { id: 'all', label: 'All' },
  { id: 'chefs-choice', label: "Chef's Selection" },
  { id: 'coffee', label: 'Coffee & Brews' },
  { id: 'tea', label: 'Premium Teas' },
  { id: 'bakery', label: 'Fresh Bakery' },
  { id: 'savory', label: 'Savory Delights' }
];

export const PRODUCTS: Product[] = [
  // --- Chef's Choice ---
  {
    id: '1',
    name: 'Avocado Toast Deluxe',
    description: 'Sourdough, poached egg, chili flakes, microgreens.',
    price: 12.50,
    category: "chefs-choice",
    isFeatured: true,
    isVisible: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhgNZN6sxvRbKYzO7U-L46qzyfiwhIzv03rqKP6Mqn0t2jv4kydFQJWRbdJuqUrTZxX1g88OoqEyKzS-5-0_y3p_UnHi3jez2XGZJi1ZcM-y2pMenHNTTPwRQpzGrfF6s-zwezhJwx9pIkVEz_CEFY4aEyfiaUwbpCSoyzp3Gn6ulDN_bbEZbrBBkoklwAXWuPzu5RFkkGtIqoesctmyjqdz7GR5CezJqNmGd2oY_EOVhxFsPS7wLC-dtJN1lSQIwGbrDpdd5Qu6U',
  },
  {
    id: 'cc-2',
    name: 'Matcha Soufflé Pancakes',
    description: 'Light and airy matcha-infused pancakes served with fresh seasonal berries and pure maple syrup.',
    price: 14.50,
    category: "chefs-choice",
    isFeatured: true,
    isVisible: true,
    image: 'https://images.unsplash.com/photo-1575853121743-60c24f0a7502?q=80&w=800&auto=format&fit=crop',
  },

  // --- Coffee ---
  {
    id: '2',
    name: 'Classic Cappuccino',
    description: 'Rich espresso with steamed milk foam and a dusting of cocoa.',
    price: 4.50,
    secondaryPrice: 5.00,
    category: 'coffee',
    availableOptions: ['Hot', 'Cold'],
    isVisible: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfZtX3kigxcZSfKJ00K38sMx0TijUdAvJBUb4Yw9XbFXYS3XjGmHtVYLiUsim4s87ztdX_JM3cKG9blTalf3P9gyM66e5Tx-lOb0BOpgeT2-ue2xxWTm3ADvbYvsxzuruYHNItvIm171v5gYB-R6Xdsvv8mCHNwfC9Vu5aR_Ej6kJrbwkpY4u0Xui1MgPrkscbLNQtZs6QY8SrNajbpcicSzZ7OTIBuqxg7biwpv0OcvGLBR5QSwI8E6Y8NVXuwO4XCHA8bosl1Kc',
  },
  {
    id: 'c-3',
    name: 'Piccolo Latte',
    description: 'A "little" latte made with a restricted double shot of espresso.',
    price: 4.80,
    category: 'coffee',
    availableOptions: ['Hot'],
    isVisible: true,
  },
  {
    id: 'c-4',
    name: 'Flat White',
    description: 'Espresso with microfoam (steamed milk with small, fine bubbles).',
    price: 4.50,
    category: 'coffee',
    availableOptions: ['Hot', 'Cold'],
    isVisible: true,
  },
  {
    id: 'c-6',
    name: 'Spanish Latte',
    description: 'Creamy espresso-based drink sweetened with condensed milk.',
    price: 5.50,
    category: 'coffee',
    availableOptions: ['Hot', 'Cold'],
    isVisible: true,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
  },

  // --- Tea ---
  {
    id: 't-3',
    name: 'Chamomile Bliss',
    description: 'Soothing caffeine-free herbal infusion with honey notes.',
    price: 3.50,
    category: 'tea',
    availableOptions: ['Hot'],
    isVisible: true,
  },
  {
    id: 't-4',
    name: 'Earl Grey Reserve',
    description: 'Classic black tea infused with double bergamot and blue cornflowers.',
    price: 4.50,
    category: 'tea',
    isVisible: true,
  },
  {
    id: 't-5',
    name: 'Hojicha Latte',
    description: 'Roasted green tea with a nutty, smoky flavor and velvety milk.',
    price: 5.50,
    category: 'tea',
    availableOptions: ['Hot', 'Cold'],
    isVisible: true,
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4586c55c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 't-6',
    name: 'Oolong Milk Tea',
    description: 'Robust oolong tea leaves blended with creamy milk and cane sugar.',
    price: 5.00,
    category: 'tea',
    availableOptions: ['Hot', 'Cold'],
    isVisible: true,
  },

  // --- Bakery ---
  {
    id: 'b-1',
    name: 'Pain au Chocolat',
    description: 'French dark chocolate wrapped in 81 layers of buttery dough.',
    price: 4.25,
    category: 'bakery',
    isVisible: true,
    image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'b-2',
    name: 'Classic Butter Croissant',
    description: 'Traditional flaky, crescent-shaped pastry made with premium butter.',
    price: 3.80,
    category: 'bakery',
    isVisible: true,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'b-3',
    name: 'Almond Croissant',
    description: 'Twice-baked with almond frangipane and topped with toasted flakes.',
    price: 4.90,
    category: 'bakery',
    isVisible: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'b-4',
    name: 'Blueberry Crumble Muffin',
    description: 'Bursting with fresh blueberries and topped with a brown sugar streusel.',
    price: 3.50,
    category: 'bakery',
    isVisible: true,
  },
  {
    id: 'b-5',
    name: 'Cinnamon Swirl Roll',
    description: 'Soft brioche dough with Ceylon cinnamon and cream cheese glaze.',
    price: 4.50,
    category: 'bakery',
    isVisible: true,
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'b-6',
    name: 'Lemon Poppyseed Scone',
    description: 'Crumbly, buttery scone with fresh lemon zest and poppyseeds.',
    price: 3.90,
    category: 'bakery',
    isVisible: true,
  },

  // --- Savory ---
  {
    id: 's-1',
    name: 'Smoked Salmon Bagel',
    description: 'Everything bagel, cream cheese, capers, red onion, dill.',
    price: 11.50,
    category: 'savory',
    isVisible: true,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's-2',
    name: 'Classic Chicken Sandwich',
    description: 'Grilled chicken breast with avocado, lettuce, and herb mayo.',
    price: 10.50,
    category: 'savory',
    isVisible: true,
  },
  {
    id: 's-3',
    name: 'Roasted Veggie Wrap',
    description: 'Hummus, roasted peppers, zucchini, and spinach in a whole wheat wrap.',
    price: 9.00,
    category: 'savory',
    isVisible: true,
  },
  {
    id: 's-4',
    name: 'Beef & Mushroom Pie',
    description: 'Slow-cooked beef and button mushrooms in a rich gravy.',
    price: 8.50,
    category: 'savory',
    isVisible: true,
    image: 'https://images.unsplash.com/photo-1604467731651-40479f649808?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's-5',
    name: 'Crystal Prawn Dumplings',
    description: 'Translucent skins filled with whole succulent prawns and bamboo shoots.',
    price: 12.00,
    secondaryPrice: 14.50,
    availableOptions: ['Steamed', 'Baked'],
    category: 'savory',
    isVisible: true,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's-8',
    name: 'BBQ Chicken Bao',
    description: 'Soft white buns with honey-glazed BBQ chicken filling.',
    price: 6.00,
    secondaryPrice: 7.20,
    availableOptions: ['Steamed', 'Baked'],
    category: 'savory',
    isVisible: true,
  },
  {
    id: 's-9',
    name: 'Curry Puff Trio',
    description: 'Crispy pastry filled with spiced potato, chicken, and egg.',
    price: 4.50,
    secondaryPrice: 5.50,
    availableOptions: ['Steamed', 'Baked'],
    category: 'savory',
    isVisible: true,
  }
];
