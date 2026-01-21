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

export interface AppConfig {
    brand_name: string;
    show_logo: boolean;
    logo_url?: string;
    hero_message: string;
    show_hero_message: boolean;
    hero_image: string;
    font_size_base: number;
    footer_text: string;
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
        sortOrder: dbCategory.sort_order,
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
    const [theme, social, address, app] = await Promise.all([
        fetchThemeConfig(),
        fetchSocialConfig(),
        fetchAddressConfig(),
        fetchAppConfig(),
    ]);

    return { theme, social, address, app };
}

// Admin API Functions

// Products
export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
        .from('products')
        .insert([{
            id: (crypto as any).randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            name: product.name,
            description: product.description,
            price: product.price,
            secondary_price: product.secondaryPrice,
            image: product.image,
            category: product.category,
            is_featured: product.isFeatured || false,
            is_visible: product.isVisible ?? true,
            available_options: product.availableOptions
        }])
        .select()
        .single();
    if (error) {
        console.error('Error creating product:', error);
        if (error.code === '42501') {
            console.error('PROMPT: Permission denied. Please ensure RLS policies are applied for admin writes.');
        }
        console.error('Payload:', product);
        return null;
    }
    return transformProduct(data);
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
    if (!isSupabaseConfigured) return null;
    const updateData: any = {};
    if (product.name !== undefined) updateData.name = product.name;
    if (product.description !== undefined) updateData.description = product.description;
    if (product.price !== undefined) updateData.price = product.price;
    if (product.secondaryPrice !== undefined) updateData.secondary_price = product.secondaryPrice;
    if (product.image !== undefined) updateData.image = product.image;
    if (product.category !== undefined) updateData.category = product.category;
    if (product.isFeatured !== undefined) updateData.is_featured = product.isFeatured;
    if (product.isVisible !== undefined) updateData.is_visible = product.isVisible;
    if (product.availableOptions !== undefined) updateData.available_options = product.availableOptions;

    const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
    if (error) {
        console.error('Error updating product:', error);
        if (error.code === '42501') {
            console.error('PROMPT: Permission denied. Please ensure RLS policies are applied for admin writes.');
        }
        console.error('ID:', id, 'Payload:', updateData);
        return null;
    }
    return transformProduct(data);
}

export async function deleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
        console.error('Error deleting product:', error);
        return false;
    }
    return true;
}

export async function fetchAllProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured) return PRODUCTS;
    const { data, error } = await supabase.from('products').select('*').order('name');
    if (error) return PRODUCTS;
    return (data || []).map(transformProduct);
}

// Categories
export async function createCategory(label: string, id: string): Promise<CategoryConfig | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from('categories').insert([{ id, label }]).select().single();
    if (error) return null;
    return transformCategory(data);
}

export async function updateCategory(id: string, label: string): Promise<CategoryConfig | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from('categories').update({ label }).eq('id', id).select().single();
    if (error) return null;
    return transformCategory(data);
}

export async function deleteCategory(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
        console.error('Error deleting category:', error);
        return false;
    }
    return true;
}

export async function updateCategoryOrder(categories: CategoryConfig[]): Promise<boolean> {
    if (!isSupabaseConfigured) return false;

    const updates = categories.map((cat, index) => ({
        id: cat.id,
        label: cat.label,
        sort_order: index
    }));

    const { error } = await supabase.from('categories').upsert(updates);

    if (error) {
        console.error('Error updating category order:', error);
        return false;
    }
    return true;
}

// Configuration
export async function fetchAppConfig(): Promise<AppConfig> {
    if (!isSupabaseConfigured) {
        return {
            brand_name: 'Café Minimal',
            show_logo: true,
            logo_url: undefined,
            hero_message: 'Slow moments, fast memories.',
            show_hero_message: true,
            hero_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAgKYCGlRnEUypygIPNNU1z94BlZS-Dg4sP7WXICTk63X58y31l4hiGB3Ve6NLxNYV6HOu7GvZbvzGt5ggyeZ4vhckjaGdIywe9PtQdTwyBDqFXrbxDRP9ChDAYjRaX3a1CMopGDvlQhujG4K_eWvuElvWiaDyoX00E6mImijxecDGsQRetkqc-p2V7QWwgo_Oj-9Xyy4asklRhteUtgpYLfhwCPbfacwvMOTuJPksQTffIxI2Z54f1OdC9Wi93pBFlME50nBcLAY',
            font_size_base: 16,
            footer_text: '© 2026 Café Minimal. All rights reserved.'
        };
    }

    const { data, error } = await supabase.from('app_config').select('*').single();
    if (error || !data) {
        // Fallback to defaults or theme_config if app_config doesn't exist
        return {
            brand_name: 'Café Minimal',
            show_logo: true,
            logo_url: undefined,
            hero_message: 'Slow moments, fast memories.',
            show_hero_message: true,
            hero_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAgKYCGlRnEUypygIPNNU1z94BlZS-Dg4sP7WXICTk63X58y31l4hiGB3Ve6NLxNYV6HOu7GvZbvzGt5ggyeZ4vhckjaGdIywe9PtQdTwyBDqFXrbxDRP9ChDAYjRaX3a1CMopGDvlQhujG4K_eWvuElvWiaDyoX00E6mImijxecDGsQRetkqc-p2V7QWwgo_Oj-9Xyy4asklRhteUtgpYLfhwCPbfacwvMOTuJPksQTffIxI2Z54f1OdC9Wi93pBFlME50nBcLAY',
            font_size_base: 16,
            footer_text: '© 2026 Café Minimal. All rights reserved.'
        };
    }
    return {
        brand_name: data.brand_name,
        show_logo: data.show_logo,
        logo_url: data.logo_url,
        hero_message: data.hero_message,
        show_hero_message: data.show_hero_message,
        hero_image: data.hero_image,
        font_size_base: data.font_size_base,
        footer_text: data.footer_text || '© 2026 Café Minimal. All rights reserved.'
    };
}

export async function updateAppConfig(config: Partial<AppConfig>): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const { error } = await supabase.from('app_config').upsert({ id: 1, ...config });
    return !error;
}

export async function updateThemeConfig(config: { primaryColor?: string; brandNameColor?: string; fontFamily?: string }): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const updateData: any = {};
    if (config.primaryColor) updateData.primary_color = config.primaryColor;
    if (config.brandNameColor) updateData.brand_name_color = config.brandNameColor;
    if (config.fontFamily) updateData.font_family = config.fontFamily;

    const { error } = await supabase.from('theme_config').upsert({ id: 1, ...updateData });
    return !error;
}

export async function updateSocialConfig(config: { instagram?: string; facebook?: string }): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const { error } = await supabase.from('social_config').upsert({ id: 1, ...config });
    return !error;
}

export async function updateAddressConfig(config: { text?: string; mapsUrl?: string }): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const updateData: any = {};
    if (config.text) updateData.address_text = config.text;
    if (config.mapsUrl) updateData.maps_url = config.mapsUrl;

    const { error } = await supabase.from('address_config').upsert({ id: 1, ...updateData });
    return !error;
}
