
import React, { useState, useEffect } from 'react';
import { fetchAppConfig, fetchThemeConfig, updateAppConfig, updateThemeConfig, AppConfig, ThemeConfig } from '../services/api';
import { uploadToR2 } from '../services/r2';
import { isSupabaseConfigured } from '../lib/supabase';

const ConfigManagement: React.FC = () => {
    const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
    const [themeConfig, setThemeConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [app, theme] = await Promise.all([fetchAppConfig(), fetchThemeConfig()]);
        setAppConfig(app);
        setThemeConfig(theme);
        setLoading(false);
    };

    const handleAppSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!appConfig) return;

        if (!isSupabaseConfigured) {
            alert('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your deployment environment variables.');
            return;
        }

        setSaving(true);
        const success = await updateAppConfig(appConfig);
        setSaving(false);
        if (success) {
            alert('Identity settings saved successfully!');
        } else {
            alert('Failed to save Identity settings. Please ensure you have run Migration 004.');
        }
    };

    const handleThemeSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!themeConfig) return;

        if (!isSupabaseConfigured) {
            alert('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your deployment environment variables.');
            return;
        }

        setSaving(true);
        const success = await updateThemeConfig({
            primaryColor: themeConfig.primaryColor,
            brandNameColor: themeConfig.brandNameColor,
            fontFamily: themeConfig.fontFamily
        });
        setSaving(false);
        if (success) {
            alert('Theme settings saved successfully!');
        } else {
            alert('Failed to save Theme settings. Please ensure Migration 004 is applied.');
        }
    };

    const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        const url = await uploadToR2(e.target.files[0]);
        if (url) {
            setAppConfig({ ...appConfig!, hero_image: url });
        }
        setUploading(false);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        const url = await uploadToR2(e.target.files[0]);
        if (url) {
            setAppConfig({ ...appConfig!, logo_url: url });
        }
        setUploading(false);
    };

    if (loading) return <div className="flex justify-center py-20 animate-pulse text-stone-light">Loading configurations...</div>;

    return (
        <div className="space-y-12 pb-20">
            <section className="space-y-6">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-stone-text dark:text-white">App Appearance</h2>
                    <p className="text-stone-light dark:text-stone-500 mt-1">Customize the visuals and identity of your café app.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Identity & Content */}
                    <div className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-100 dark:border-stone-800 space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">storefront</span>
                            Identity
                        </h3>

                        <form onSubmit={handleAppSave} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Shop Name</label>
                                <input
                                    type="text"
                                    value={appConfig?.brand_name || ''}
                                    onChange={(e) => setAppConfig({ ...appConfig!, brand_name: e.target.value })}
                                    className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 dark:text-white transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Logo</label>
                                <div className="flex items-center gap-6 p-4 bg-stone-50/50 dark:bg-stone-800/30 rounded-2xl">
                                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-center overflow-hidden shrink-0">
                                        {appConfig?.logo_url ? (
                                            <img src={appConfig.logo_url} className="w-full h-full object-contain" alt="Logo" />
                                        ) : (
                                            <span className="material-symbols-outlined text-stone-300">image</span>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="inline-block bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-50 transition-all">
                                            Upload Logo
                                            <input type="file" className="hidden" onChange={handleLogoUpload} />
                                        </label>
                                        <input
                                            type="text"
                                            value={appConfig?.logo_url || ''}
                                            onChange={(e) => setAppConfig({ ...appConfig!, logo_url: e.target.value })}
                                            placeholder="or paste URL..."
                                            className="w-full bg-transparent border-none p-0 text-[10px] text-stone-light outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Hero Message</label>
                                <input
                                    type="text"
                                    value={appConfig?.hero_message || ''}
                                    onChange={(e) => setAppConfig({ ...appConfig!, hero_message: e.target.value })}
                                    className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 dark:text-white transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Footer Text</label>
                                <input
                                    type="text"
                                    value={appConfig?.footer_text || ''}
                                    onChange={(e) => setAppConfig({ ...appConfig!, footer_text: e.target.value })}
                                    className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 dark:text-white transition-all outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-stone-50/50 dark:bg-stone-800/30 rounded-2xl">
                                <span className="text-sm font-medium">Show Logo</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={appConfig?.show_logo ?? true}
                                        onChange={(e) => setAppConfig({ ...appConfig!, show_logo: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-primary rounded-full"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-stone-50/50 dark:bg-stone-800/30 rounded-2xl">
                                <span className="text-sm font-medium">Show Hero Message</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={appConfig?.show_hero_message ?? true}
                                        onChange={(e) => setAppConfig({ ...appConfig!, show_hero_message: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-primary rounded-full"></div>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Identity Settings'}
                            </button>
                        </form>
                    </div>

                    {/* Theme & Visuals */}
                    <div className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-100 dark:border-stone-800 space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">palette</span>
                            Theme & Visuals
                        </h3>

                        <form onSubmit={handleThemeSave} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Primary Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={themeConfig?.primaryColor || '#e66e19'}
                                            onChange={(e) => setThemeConfig({ ...themeConfig!, primaryColor: e.target.value })}
                                            className="w-12 h-[52px] bg-transparent border-none rounded-xl cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={themeConfig?.primaryColor || '#e66e19'}
                                            onChange={(e) => setThemeConfig({ ...themeConfig!, primaryColor: e.target.value })}
                                            className="flex-1 bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-4 py-3.5 text-sm uppercase"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Text Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={themeConfig?.brandNameColor || '#1b130e'}
                                            onChange={(e) => setThemeConfig({ ...themeConfig!, brandNameColor: e.target.value })}
                                            className="w-12 h-[52px] bg-transparent border-none rounded-xl cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={themeConfig?.brandNameColor || '#1b130e'}
                                            onChange={(e) => setThemeConfig({ ...themeConfig!, brandNameColor: e.target.value })}
                                            className="flex-1 bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-4 py-3.5 text-sm uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Font Family</label>
                                <select
                                    value={themeConfig?.fontFamily || "'Plus Jakarta Sans', sans-serif"}
                                    onChange={(e) => setThemeConfig({ ...themeConfig!, fontFamily: e.target.value })}
                                    className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 dark:text-white transition-all outline-none appearance-none"
                                >
                                    <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Modern Sans)</option>
                                    <option value="'Playfair Display', serif">Playfair Display (Elegant Serif)</option>
                                    <option value="'Inter', sans-serif">Inter (Clean Slate)</option>
                                    <option value="'Roboto', sans-serif">Roboto (Industrial)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Base Font Size (px)</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="12"
                                        max="24"
                                        value={appConfig?.font_size_base || 16}
                                        onChange={(e) => setAppConfig({ ...appConfig!, font_size_base: parseInt(e.target.value) })}
                                        className="flex-1 accent-primary"
                                    />
                                    <span className="w-12 text-center font-bold text-lg">{appConfig?.font_size_base || 16}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full border-2 border-stone-100 dark:border-stone-800 text-stone-text dark:text-white py-4 rounded-2xl font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition-all disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Theme Visuals'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Background Image */}
                <div className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-100 dark:border-stone-800 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">image</span>
                        Background Image
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-4">
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                                {appConfig?.hero_image ? (
                                    <img src={appConfig.hero_image} className="w-full h-full object-cover" alt="Hero" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-stone-300">hide_image</span>
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <label className="w-full h-[52px] bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-all">
                                Change Background
                                <input type="file" className="hidden" onChange={handleBackgroundUpload} />
                            </label>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 ml-1">Direct Image URL</label>
                                <input
                                    type="text"
                                    value={appConfig?.hero_image || ''}
                                    onChange={(e) => setAppConfig({ ...appConfig!, hero_image: e.target.value })}
                                    className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            <p className="text-xs text-stone-light/60 italic">Recommended aspect ratio 16:9 or 21:9 for best result on wide screens.</p>
                            <button
                                onClick={handleAppSave}
                                className="bg-stone-900 dark:bg-primary text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-all hover:opacity-90 active:scale-95"
                            >
                                Apply Background
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ConfigManagement;
