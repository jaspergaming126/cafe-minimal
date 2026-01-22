
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const tabs = [
        { id: 'menu' as Tab, label: 'Menu Items', icon: 'restaurant_menu' },
        { id: 'categories' as Tab, label: 'Categories', icon: 'category' },
        { id: 'config' as Tab, label: 'App Config', icon: 'settings' },
        { id: 'social' as Tab, label: 'Social & Links', icon: 'link' },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const handleTabClick = (tabId: Tab) => {
        setActiveTab(tabId);
        closeSidebar();
    };

    return (
        <div className="flex h-screen overflow-hidden relative">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">coffee</span>
                    </div>
                    <h1 className="font-serif font-bold text-lg">Admin</h1>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                    aria-label="Toggle Menu"
                >
                    <span className="material-symbols-outlined text-stone-text dark:text-white">
                        {isSidebarOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-30 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800 flex flex-col transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                <div className="p-8 border-b border-stone-50 dark:border-stone-800/50 hidden md:block">
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

                {/* Mobile sidebar header */}
                <div className="p-6 border-b border-stone-50 dark:border-stone-800/50 md:hidden flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">coffee</span>
                        </div>
                        <h1 className="font-serif font-bold text-lg">Admin</h1>
                    </div>
                    <button onClick={closeSidebar}>
                        <span className="material-symbols-outlined text-stone-light">close</span>
                    </button>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
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
            <main className="flex-1 overflow-y-auto bg-stone-50/50 dark:bg-stone-950/20 p-4 md:p-10 pt-20 md:pt-10">
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
