import { useState, useEffect } from 'react';
import { Product, CategoryConfig } from '../types';
import {
    fetchProducts,
    fetchCategories,
    fetchThemeConfig,
    fetchSocialConfig,
    fetchAddressConfig,
    fetchAllConfig
} from '../services/api';
import { PRODUCTS, CATEGORIES, THEME_CONFIG, SOCIAL_CONFIG, ADDRESS_CONFIG } from '../constants';

// Hook for fetching products
export function useProducts() {
    const [products, setProducts] = useState<Product[]>(PRODUCTS.filter(p => p.isVisible !== false));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        fetchProducts()
            .then(data => {
                if (isMounted) {
                    setProducts(data);
                }
            })
            .catch(err => {
                if (isMounted) {
                    setError(err);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { products, loading, error };
}

// Hook for fetching categories
export function useCategories() {
    const [categories, setCategories] = useState<CategoryConfig[]>(CATEGORIES);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        fetchCategories()
            .then(data => {
                if (isMounted) {
                    setCategories(data);
                }
            })
            .catch(err => {
                if (isMounted) {
                    setError(err);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { categories, loading, error };
}

// Hook for fetching theme configuration
export function useThemeConfig() {
    const [themeConfig, setThemeConfig] = useState(THEME_CONFIG);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        fetchThemeConfig()
            .then(data => {
                if (isMounted) {
                    setThemeConfig(data);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { themeConfig, loading };
}

// Hook for fetching social configuration
export function useSocialConfig() {
    const [socialConfig, setSocialConfig] = useState(SOCIAL_CONFIG);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        fetchSocialConfig()
            .then(data => {
                if (isMounted) {
                    setSocialConfig(data);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { socialConfig, loading };
}

// Hook for fetching address configuration
export function useAddressConfig() {
    const [addressConfig, setAddressConfig] = useState(ADDRESS_CONFIG);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        fetchAddressConfig()
            .then(data => {
                if (isMounted) {
                    setAddressConfig(data);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { addressConfig, loading };
}

// Combined hook for all app data
export function useAppData() {
    const { products, loading: productsLoading, error: productsError } = useProducts();
    const { categories, loading: categoriesLoading } = useCategories();
    const { themeConfig, loading: themeLoading } = useThemeConfig();

    const loading = productsLoading || categoriesLoading || themeLoading;

    return {
        products,
        categories,
        themeConfig,
        loading,
        error: productsError,
    };
}
