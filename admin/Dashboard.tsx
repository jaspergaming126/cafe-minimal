
import React, { useState } from 'react';
import MenuManagement from './MenuManagement';
import ConfigManagement from './ConfigManagement';
import SocialManagement from './SocialManagement';
import CategoryManagement from './CategoryManagement';

interface DashboardProps {
    onLogout: () => void;
}

type Tab = 'menu' | 'categories' | 'config' | 'social';

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('menu');

    const tabs = [
        { id: 'menu' as Tab, label: 'Menu Items', icon: 'restaurant_menu' },
        { id: 'categories' as Tab, label: 'Categories', icon: 'category' },
        { id: 'config' as Tab, label: 'App Config', icon: 'settings' },
        { id: 'social' as Tab, label: 'Social & Links', icon: 'link' },
    ];

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800 flex flex-col">
                <div className="p-8 border-b border-stone-50 dark:border-stone-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">coffee</span>
                        </div>
                        <div>
                            <h1 className="font-serif font-bold text-xl leading-tight">Admin</h1>
                            <p className="text-[10px] uppercase tracking-widest text-stone-light/60 font-bold">CRÈME.ge</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-medium ${activeTab === tab.id
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-stone-light hover:bg-stone-50 dark:hover:bg-stone-800/50 hover:text-stone-text dark:hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                            <span className="text-sm">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-stone-50 dark:border-stone-800/50">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-stone-light hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all font-medium"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <span className="text-sm">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-stone-50/50 dark:bg-stone-950/20 p-10">
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'menu' && <MenuManagement />}
                    {activeTab === 'categories' && <CategoryManagement />}
                    {activeTab === 'config' && <ConfigManagement />}
                    {activeTab === 'social' && <SocialManagement />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
