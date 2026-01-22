
import React, { useState, useEffect } from 'react';
import { fetchSocialConfig, fetchAddressConfig, updateSocialConfig, updateAddressConfig } from '../services/api';

const SocialManagement: React.FC = () => {
    const [social, setSocial] = useState({ instagram: '', facebook: '' });
    const [address, setAddress] = useState({ text: '', mapsUrl: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [s, a] = await Promise.all([fetchSocialConfig(), fetchAddressConfig()]);
        setSocial(s);
        setAddress(a);
        setLoading(false);
    };

    const handleSocialSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const success = await updateSocialConfig(social);
        setSaving(false);
        if (success) {
            alert('Social links saved successfully!');
        } else {
            alert('Failed to save social links. Please check your connection.');
        }
    };

    const handleAddressSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const success = await updateAddressConfig(address);
        setSaving(false);
        if (success) {
            alert('Address saved successfully!');
        } else {
            alert('Failed to save address. Please check your connection.');
        }
    };

    if (loading) return <div className="flex justify-center py-20 animate-pulse text-stone-light">Loading contacts...</div>;

    return (
        <div className="space-y-8 md:space-y-12">
            <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-text dark:text-white">Social & Links</h2>
                <p className="text-sm text-stone-light dark:text-stone-500 mt-1">Manage your online presence and store location.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Social Media */}
                <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 md:p-8 border border-stone-100 dark:border-stone-800 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">public</span>
                        Social Media
                    </h3>

                    <form onSubmit={handleSocialSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Instagram Link</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 font-bold">@</span>
                                <input
                                    type="text"
                                    value={social.instagram}
                                    onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                                    className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl pl-10 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Facebook Link</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-sm">facebook</span>
                                <input
                                    type="text"
                                    value={social.facebook}
                                    onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                                    className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl pl-10 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-stone-900 dark:bg-primary text-white py-4 rounded-2xl font-bold shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Social Links'}
                        </button>
                    </form>
                </div>

                {/* Physical Address */}
                <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 md:p-8 border border-stone-100 dark:border-stone-800 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                        Store Address
                    </h3>

                    <form onSubmit={handleAddressSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Address Text</label>
                            <textarea
                                rows={2}
                                value={address.text}
                                onChange={(e) => setAddress({ ...address, text: e.target.value })}
                                className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                                placeholder="123 Coffee St, Brew City"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Google Maps URL</label>
                            <input
                                type="text"
                                value={address.mapsUrl}
                                onChange={(e) => setAddress({ ...address, mapsUrl: e.target.value })}
                                className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                                placeholder="https://goo.gl/maps/..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-stone-900 dark:bg-primary text-white py-4 rounded-2xl font-bold shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Address'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SocialManagement;
