
import React, { useState } from 'react';

interface LoginProps {
    onLogin: (password: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username !== 'admin') {
            setError('Invalid username');
            return;
        }
        if (onLogin(password)) {
            setError('');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-[32px] shadow-2xl p-10 border border-stone-100 dark:border-stone-800">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-stone-text dark:text-white">Admin Login</h2>
                    <p className="text-stone-light dark:text-stone-500 mt-2 text-sm font-medium">Manage your café menu & settings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 dark:text-white transition-all outline-none"
                            placeholder="admin"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 dark:text-white transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-4 flex items-center gap-3">
                            <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                            <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px] active:translate-y-0"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
