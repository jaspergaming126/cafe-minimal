
export type CategoryId = string;

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  sortOrder?: number;
}

export type ProductOption = string;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  secondaryPrice?: number; // Price for the second option (e.g., Baked or Cold)
  image?: string; // Optional image
  category: CategoryId;
  isFeatured?: boolean;
  availableOptions?: ProductOption[];
  isVisible?: boolean; // New property to toggle visibility
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedOption?: ProductOption;
}
