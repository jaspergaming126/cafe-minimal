import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, CategoryConfig } from '../types';
import { PRODUCTS, CATEGORIES, THEME_CONFIG, SOCIAL_CONFIG, ADDRESS_CONFIG } from '../constants';

// Types for database responses
export interface ThemeConfig {
    primary_color: string;
    brand_name_color: string;
    font_family: string;
}

export interface SocialConfig {
    instagram: string;
    facebook: string;
}

export interface AddressConfig {
    address_text: string;
    maps_url: string;
}

// Transform database product to app Product type
function transformProduct(dbProduct: any): Product {
    return {
        id: dbProduct.id,
        name: dbProduct.name,
        description: dbProduct.description,
        price: parseFloat(dbProduct.price),
        secondaryPrice: dbProduct.secondary_price ? parseFloat(dbProduct.secondary_price) : undefined,
        image: dbProduct.image || undefined,
        category: dbProduct.category,
        isFeatured: dbProduct.is_featured,
        isVisible: dbProduct.is_visible,
        availableOptions: dbProduct.available_options || undefined,
    };
}

// Transform database category to app CategoryConfig type
function transformCategory(dbCategory: any): CategoryConfig {
    return {
        id: dbCategory.id,
        label: dbCategory.label,
    };
}

// Fetch all visible products
export async function fetchProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured) {
        console.log('Using fallback product data');
        return PRODUCTS.filter(p => p.isVisible !== false);
    }

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_visible', true)
            .order('name');

        if (error) {
            console.error('Error fetching products:', error);
            return PRODUCTS.filter(p => p.isVisible !== false);
        }

        return (data || []).map(transformProduct);
    } catch (err) {
        console.error('Failed to fetch products:', err);
        return PRODUCTS.filter(p => p.isVisible !== false);
    }
}

// Fetch all categories
export async function fetchCategories(): Promise<CategoryConfig[]> {
    if (!isSupabaseConfigured) {
        console.log('Using fallback category data');
        return CATEGORIES;
    }

    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order');

        if (error) {
            console.error('Error fetching categories:', error);
            return CATEGORIES;
        }

        return (data || []).map(transformCategory);
    } catch (err) {
        console.error('Failed to fetch categories:', err);
        return CATEGORIES;
    }
}

// Fetch theme configuration
export async function fetchThemeConfig(): Promise<typeof THEME_CONFIG> {
    if (!isSupabaseConfigured) {
        return THEME_CONFIG;
    }

    try {
        const { data, error } = await supabase
            .from('theme_config')
            .select('*')
            .single();

        if (error || !data) {
            return THEME_CONFIG;
        }

        return {
            primaryColor: data.primary_color || THEME_CONFIG.primaryColor,
            brandNameColor: data.brand_name_color || THEME_CONFIG.brandNameColor,
            fontFamily: data.font_family || THEME_CONFIG.fontFamily,
        };
    } catch (err) {
        console.error('Failed to fetch theme config:', err);
        return THEME_CONFIG;
    }
}

// Fetch social configuration
export async function fetchSocialConfig(): Promise<typeof SOCIAL_CONFIG> {
    if (!isSupabaseConfigured) {
        return SOCIAL_CONFIG;
    }

    try {
        const { data, error } = await supabase
            .from('social_config')
            .select('*')
            .single();

        if (error || !data) {
            return SOCIAL_CONFIG;
        }

        return {
            instagram: data.instagram || SOCIAL_CONFIG.instagram,
            facebook: data.facebook || SOCIAL_CONFIG.facebook,
        };
    } catch (err) {
        console.error('Failed to fetch social config:', err);
        return SOCIAL_CONFIG;
    }
}

// Fetch address configuration
export async function fetchAddressConfig(): Promise<typeof ADDRESS_CONFIG> {
    if (!isSupabaseConfigured) {
        return ADDRESS_CONFIG;
    }

    try {
        const { data, error } = await supabase
            .from('address_config')
            .select('*')
            .single();

        if (error || !data) {
            return ADDRESS_CONFIG;
        }

        return {
            text: data.address_text || ADDRESS_CONFIG.text,
            mapsUrl: data.maps_url || ADDRESS_CONFIG.mapsUrl,
        };
    } catch (err) {
        console.error('Failed to fetch address config:', err);
        return ADDRESS_CONFIG;
    }
}

// Fetch all config at once
export async function fetchAllConfig() {
    const [theme, social, address] = await Promise.all([
        fetchThemeConfig(),
        fetchSocialConfig(),
        fetchAddressConfig(),
    ]);

    return { theme, social, address };
}
