
import React, { useState, useEffect } from 'react';
import { Product, CategoryConfig, ProductOption } from '../types';
import { fetchAllProducts, fetchCategories, createProduct, updateProduct, deleteProduct } from '../services/api';
import { uploadImages } from '../services/storage';

const MenuManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<CategoryConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (isRefresh = false) => {
        if (!isRefresh && (products.length === 0 || categories.length === 0)) {
            setLoading(true);
        }
        const [p, c] = await Promise.all([fetchAllProducts(), fetchCategories()]);
        setProducts(p);
        setCategories(c.filter(cat => cat.id !== 'all'));
        setLoading(false);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const success = await deleteProduct(id);
            if (success) loadData(true);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        if (editingProduct.id) {
            const result = await updateProduct(editingProduct.id, editingProduct);
            if (!result) {
                alert('Failed to update product. Please check your connection or console.');
                return;
            }
        } else {
            const result = await createProduct(editingProduct as Omit<Product, 'id'>);
            if (!result) {
                alert('Failed to create product. Please check your connection or console.');
                return;
            }
        }
        setIsModalOpen(false);
        loadData(true);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        const urls = await uploadImages(Array.from(e.target.files));
        if (urls.length > 0) {
            setEditingProduct({ ...editingProduct, image: urls[0] }); // Just take the first one for now
        }
        setUploading(false);
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-text dark:text-white">Menu Items</h2>
                    <p className="text-sm text-stone-light dark:text-stone-500 mt-1">Add, edit or remove food and drinks from your café.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProduct({
                            name: '',
                            description: '',
                            price: 0,
                            category: categories[0]?.id || 'coffee',
                            isVisible: true,
                            availableOptions: []
                        });
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all text-sm md:text-base"
                >
                    <span className="material-symbols-outlined">add</span>
                    <span>Add New Item</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Desktop View (Table) */}
                    <div className="hidden md:block bg-white dark:bg-stone-900 rounded-[32px] border border-stone-100 dark:border-stone-800 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-stone-50/50 dark:bg-stone-800/30 border-b border-stone-100 dark:border-stone-800">
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500">Item</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500">Category</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500">Price</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/20 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                {product.image ? (
                                                    <img src={product.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-stone-300 dark:text-stone-600">image</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-stone-text dark:text-white capitalize">{product.name}</div>
                                                    <div className="text-xs text-stone-light dark:text-stone-500 line-clamp-1 mt-0.5">{product.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-light dark:text-stone-400">
                                                {categories.find(c => c.id === product.category)?.label || product.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 font-bold text-primary">RM{product.price.toFixed(2)}</td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-light hover:bg-primary/10 hover:text-primary transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-light hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-xl">delete</span>
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
                        {products.map((product) => (
                            <div key={product.id} className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-100 dark:border-stone-800 space-y-4">
                                <div className="flex items-center gap-4">
                                    {product.image ? (
                                        <img src={product.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-stone-400">image</span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-stone-text dark:text-white truncate">{product.name}</h4>
                                            <span className="text-primary font-bold">RM{product.price.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-stone-light dark:text-stone-500 line-clamp-1">{product.description}</p>
                                        <div className="mt-2">
                                            <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded-full text-[9px] font-bold uppercase tracking-wider text-stone-light dark:text-stone-400">
                                                {categories.find(c => c.id === product.category)?.label || product.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2 border-t border-stone-50 dark:border-stone-800">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 h-11 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-center justify-center gap-2 text-stone-text dark:text-white font-bold text-sm"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex-1 h-11 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center justify-center gap-2 text-red-600 font-bold text-sm"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full h-full md:h-auto md:max-w-2xl bg-white dark:bg-stone-900 md:rounded-[32px] shadow-2xl overflow-hidden border border-stone-100 dark:border-stone-800 animate-in zoom-in-95 duration-200 flex flex-col">
                        <div className="p-6 md:p-8 border-b border-stone-50 dark:border-stone-800 flex justify-between items-center shrink-0">
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-text dark:text-white">
                                {editingProduct?.id ? 'Edit Item' : 'New Menu Item'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6 overflow-y-auto hide-scrollbar flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingProduct?.name || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 dark:text-white transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Category</label>
                                    <select
                                        required
                                        value={editingProduct?.category || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                        className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 dark:text-white transition-all outline-none appearance-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editingProduct?.description || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 dark:text-white transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-stone-50 dark:border-stone-800">
                                <div className="flex justify-between items-center px-1">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500">Pricing & Options</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-stone-light">Multiple Prices</span>
                                        <label className="relative inline-flex items-center cursor-pointer scale-75">
                                            <input
                                                type="checkbox"
                                                checked={!!editingProduct?.secondaryPrice}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        // Enable multiple options
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            secondaryPrice: editingProduct?.price || 0,
                                                            availableOptions: editingProduct?.availableOptions?.length ? editingProduct.availableOptions : ['Hot', 'Cold']
                                                        });
                                                    } else {
                                                        // Disable multiple options
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            secondaryPrice: undefined,
                                                            availableOptions: editingProduct?.availableOptions?.slice(0, 1) || []
                                                        });
                                                    }
                                                }}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-primary rounded-full"></div>
                                        </label>
                                    </div>
                                </div>

                                {!editingProduct?.secondaryPrice ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-stone-light/60 ml-1">Option Name (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Regular"
                                                value={editingProduct?.availableOptions?.[0] || ''}
                                                onChange={(e) => {
                                                    const opts = [...(editingProduct?.availableOptions || [])];
                                                    opts[0] = e.target.value;
                                                    setEditingProduct({ ...editingProduct, availableOptions: opts.filter(o => o !== '') });
                                                }}
                                                className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-stone-light/60 ml-1">Price (RM)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={editingProduct?.price || 0}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                                className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Visible</label>
                                            <div className="flex items-center h-[52px]">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={editingProduct?.isVisible ?? true}
                                                        onChange={(e) => setEditingProduct({ ...editingProduct, isVisible: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-primary rounded-full"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 p-4 bg-stone-50/50 dark:bg-stone-800/30 rounded-2xl border border-stone-100 dark:border-stone-800">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-stone-light/60 ml-1">Option 1 Name (e.g. Hot)</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={editingProduct?.availableOptions?.[0] || ''}
                                                    onChange={(e) => {
                                                        const opts = [...(editingProduct?.availableOptions || [])];
                                                        opts[0] = e.target.value;
                                                        setEditingProduct({ ...editingProduct, availableOptions: opts });
                                                    }}
                                                    className="w-full bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-stone-light/60 ml-1">Price 1 (RM)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    value={editingProduct?.price || 0}
                                                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                                    className="w-full bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 p-4 bg-stone-50/50 dark:bg-stone-800/30 rounded-2xl border border-stone-100 dark:border-stone-800">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-stone-light/60 ml-1">Option 2 Name (e.g. Cold)</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={editingProduct?.availableOptions?.[1] || ''}
                                                    onChange={(e) => {
                                                        const opts = [...(editingProduct?.availableOptions || [])];
                                                        opts[1] = e.target.value;
                                                        setEditingProduct({ ...editingProduct, availableOptions: opts });
                                                    }}
                                                    className="w-full bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-stone-light/60 ml-1">Price 2 (RM)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    value={editingProduct?.secondaryPrice || 0}
                                                    onChange={(e) => setEditingProduct({ ...editingProduct, secondaryPrice: parseFloat(e.target.value) })}
                                                    className="w-full bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Visible</label>
                                            <div className="flex items-center h-[52px]">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={editingProduct?.isVisible ?? true}
                                                        onChange={(e) => setEditingProduct({ ...editingProduct, isVisible: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-primary rounded-full"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-light/60 dark:text-stone-500 ml-1">Image {uploading && <span className="text-primary animate-pulse ml-2 text-[10px]">Uploading...</span>}</label>
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <input
                                        type="text"
                                        placeholder="Image URL"
                                        value={editingProduct?.image || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                        className="w-full sm:flex-1 bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 dark:text-white transition-all outline-none"
                                    />
                                    <label className="w-full sm:w-auto cursor-pointer bg-stone-100 dark:bg-stone-800 h-[52px] px-6 rounded-2xl flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-all font-bold text-xs shrink-0">
                                        Upload
                                        <input type="file" multiple className="hidden" onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-4 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="order-2 sm:order-1 flex-1 px-6 py-4 rounded-2xl font-bold bg-stone-50 dark:bg-stone-800 text-stone-light hover:text-stone-text dark:hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="order-1 sm:order-2 flex-[2] px-6 py-4 rounded-2xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all"
                                >
                                    Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManagement;
