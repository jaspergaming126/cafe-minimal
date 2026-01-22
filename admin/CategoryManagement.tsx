import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory, updateCategoryOrder } from '../services/api';
import { CategoryConfig } from '../types';

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<CategoryConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Partial<CategoryConfig> | null>(null);
    const [saving, setSaving] = useState(false);
    const [ordering, setOrdering] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
        setLoading(false);
    };

    const handleAdd = () => {
        setEditingCategory({ id: '', label: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (category: CategoryConfig) => {
        setEditingCategory({ ...category });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category? This will affect products assigned to it.')) {
            const success = await deleteCategory(id);
            if (success) {
                loadData();
            } else {
                alert('Failed to delete category.');
            }
        }
    };

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        if (ordering) return;
        const newCategories = [...categories];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newCategories.length) return;

        // Swap
        [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];

        // Optimistic update
        setCategories(newCategories);
        setOrdering(true);

        const success = await updateCategoryOrder(newCategories);
        if (!success) {
            alert('Failed to update order. Refreshing...');
            loadData();
        }
        setOrdering(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !editingCategory.id || !editingCategory.label) {
            alert('Please fill in both ID and Label.');
            return;
        }

        setSaving(true);
        let result;

        // Distinguished by whether the ID was already in our list when we started
        const isExisting = categories.some(c => c.id === editingCategory.id);

        if (isExisting) {
            // Update existing
            result = await updateCategory(editingCategory.id, editingCategory.label);
        } else {
            // Creating new - check for collision
            const collision = categories.some(c => c.id === editingCategory.id);
            if (collision) {
                alert('A category with this ID already exists.');
                setSaving(false);
                return;
            }
            result = await createCategory(editingCategory.label, editingCategory.id);
        }

        setSaving(false);
        if (result) {
            setIsModalOpen(false);
            loadData();
        } else {
            alert('Failed to save category. Check console for errors.');
        }
    };

    if (loading) return <div className="flex justify-center py-20 animate-pulse text-stone-light">Loading categories...</div>;

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-text dark:text-white">Menu Categories</h2>
                    <p className="text-sm text-stone-light dark:text-stone-500 mt-1">Organize your offerings into sections.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95 text-sm md:text-base"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Category
                </button>
            </div>

            <div className="space-y-4">
                {/* Desktop View (Table) */}
                <div className="hidden md:block bg-white dark:bg-stone-900 rounded-[32px] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50/50 dark:bg-stone-800/30 border-b border-stone-100 dark:border-stone-800">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-light/60">ID (Slug)</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-light/60">Label</th>
                                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-stone-light/60">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50 dark:divide-stone-800/50">
                            {categories.map((category, index) => (
                                <tr key={category.id} className="group hover:bg-stone-50/40 dark:hover:bg-stone-800/20 transition-colors">
                                    <td className="px-8 py-4">
                                        <code className="bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded text-xs font-mono text-primary">{category.id}</code>
                                    </td>
                                    <td className="px-8 py-4 font-medium text-stone-text dark:text-white">{category.label}</td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl mr-2">
                                                <button
                                                    onClick={() => handleMove(index, 'up')}
                                                    disabled={index === 0 || ordering}
                                                    className="p-2 text-stone-400 hover:text-primary hover:bg-white dark:hover:bg-stone-700 rounded-l-xl transition-all disabled:opacity-30 disabled:hover:text-stone-400 disabled:hover:bg-transparent"
                                                    title="Move Up"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                                                </button>
                                                <div className="w-[1px] h-4 bg-stone-200 dark:bg-stone-700"></div>
                                                <button
                                                    onClick={() => handleMove(index, 'down')}
                                                    disabled={index === categories.length - 1 || ordering}
                                                    className="p-2 text-stone-400 hover:text-primary hover:bg-white dark:hover:bg-stone-700 rounded-r-xl transition-all disabled:opacity-30 disabled:hover:text-stone-400 disabled:hover:bg-transparent"
                                                    title="Move Down"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="p-2 text-stone-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View (Cards) */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {categories.map((category, index) => (
                        <div key={category.id} className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-100 dark:border-stone-800 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-stone-text dark:text-white leading-tight">{category.label}</h4>
                                    <code className="text-[10px] font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded mt-1 inline-block">{category.id}</code>
                                </div>
                                <div className="flex items-center bg-stone-50 dark:bg-stone-800 rounded-lg">
                                    <button
                                        onClick={() => handleMove(index, 'up')}
                                        disabled={index === 0 || ordering}
                                        className="p-1.5 text-stone-400 disabled:opacity-20"
                                    >
                                        <span className="material-symbols-outlined text-lg">arrow_upward</span>
                                    </button>
                                    <div className="w-[1px] h-4 bg-stone-200 dark:bg-stone-700"></div>
                                    <button
                                        onClick={() => handleMove(index, 'down')}
                                        disabled={index === categories.length - 1 || ordering}
                                        className="p-1.5 text-stone-400 disabled:opacity-20"
                                    >
                                        <span className="material-symbols-outlined text-lg">arrow_downward</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-stone-50 dark:border-stone-800">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="flex-1 h-10 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-center justify-center gap-2 text-stone-text dark:text-white font-bold text-xs"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="flex-1 h-10 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center justify-center gap-2 text-red-600 font-bold text-xs"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative bg-white dark:bg-stone-900 w-full max-w-lg rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-10">
                            <h3 className="text-xl md:text-2xl font-serif font-bold mb-6 md:mb-8 text-stone-text dark:text-white">
                                {categories.some(c => c.id === editingCategory?.id) ? 'Edit Category' : 'New Category'}
                            </h3>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Category ID (Slug)</label>
                                    <input
                                        type="text"
                                        required
                                        disabled={categories.some(c => c.id === editingCategory?.id)}
                                        value={editingCategory?.id || ''}
                                        onChange={(e) => setEditingCategory({ ...editingCategory!, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        placeholder="e.g. espresso-drinks"
                                        className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none disabled:opacity-50 dark:text-white"
                                    />
                                    <p className="text-[10px] text-stone-light/60 ml-1 italic">Short identifier used in settings (e.g. coffee, bakery).</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Label (Display Name)</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingCategory?.label || ''}
                                        onChange={(e) => setEditingCategory({ ...editingCategory!, label: e.target.value })}
                                        placeholder="e.g. Espresso Drinks"
                                        className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                                    />
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="order-2 sm:order-1 flex-1 px-6 py-4 rounded-2xl font-bold text-stone-light hover:bg-stone-50 dark:hover:bg-stone-800 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="order-1 sm:order-2 flex-1 bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
