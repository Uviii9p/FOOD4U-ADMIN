import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { Plus, Edit2, Trash2, Package, IndianRupee, Eye, EyeOff, Image as ImageIcon, Search, AlertCircle, TrendingUp, FileDown } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const ManageItems = () => {
  const { admin } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', description: '', price: '', cost: '', category: '', vendor: '', stock: '', image: null 
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchCategories();
    if (admin?.role === 'admin') fetchVendors();
  }, [admin]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: items.length,
    lowStock: items.filter(i => i.stock > 0 && i.stock < 10).length,
    outOfStock: items.filter(i => i.stock === 0).length
  };

  const fetchItems = async () => {
    try {
      const res = await api.get('/items/managed');
      setItems(res.data);
    } catch (err) {
      toast.error('Failed to fetch items');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendors');
      setVendors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) data.append(key, formData[key]);
    });

    try {
      if (editingId) {
        await api.put(`/items/${editingId}`, data);
        toast.success('Item updated');
      } else {
        await api.post('/items', data);
        toast.success('Item added');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', cost: '', category: '', vendor: '', stock: '', image: null });
      fetchItems();
    } catch (err) {
      toast.error('Error saving item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      toast.success('Product successfully removed');
      setDeleteConfirmId(null);
      fetchItems();
    } catch (err) {
      toast.error('Could not delete product. Please try again.');
    }
  };

  const handleExport = () => {
    const data = items.map(i => `${i.name},${i.price},${i.stock}`).join('\n');
    const blob = new Blob([`Name,Price,Stock\n${data}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_export.csv';
    a.click();
    toast.success('Inventory exported to CSV');
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({ 
      name: item.name, 
      description: item.description, 
      price: item.price, 
      cost: item.cost || '', 
      category: item.category?._id || item.category, 
      vendor: item.vendor?._id || item.vendor || '',
      stock: item.stock,
      image: null 
    });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary flex items-center tracking-tight">
            <Package className="mr-4 text-accent w-10 h-10" /> 
            {admin?.role === 'vendor' ? 'Product Inventory' : 'Global Inventory'}
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Control your stock, pricing, and market presence.</p>
        </div>
        <div className="flex flex-wrap gap-3">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search inventory..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/50 transition-all w-64 shadow-sm font-medium"
                />
            </div>
            <button 
                onClick={() => setShowCost(!showCost)}
                className={`p-3.5 rounded-2xl border transition-all ${showCost ? 'bg-accent/10 border-accent text-accent shadow-lg shadow-accent/10' : 'bg-white border-gray-100 text-gray-400'}`}
                title={showCost ? "Hide Cost Price" : "Show Cost Price"}
            >
                {showCost ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
            <button 
                onClick={handleExport}
                className="p-3.5 rounded-2xl border border-gray-100 bg-white text-gray-500 hover:text-accent hover:border-accent transition-all shadow-sm"
                title="Export Inventory (CSV)"
            >
                <FileDown size={22} />
            </button>
            <button
                onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', description: '', price: '', cost: '', category: '', vendor: '', stock: '', image: null });
                    setIsModalOpen(true);
                }}
                className="bg-primary text-white px-8 py-3.5 rounded-2xl flex items-center hover:bg-accent shadow-xl shadow-primary/10 transition-all font-black uppercase tracking-widest text-xs"
            >
                <Plus className="w-5 h-5 mr-2" /> New Product
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mr-4">
                <Package className="text-blue-500" size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Products</p>
                <p className="text-2xl font-black text-primary">{stats.total}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mr-4">
                <AlertCircle className="text-amber-500" size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Low Stock</p>
                <p className="text-2xl font-black text-amber-600">{stats.lowStock}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mr-4">
                <TrendingUp className="text-red-500" size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Out of Stock</p>
                <p className="text-2xl font-black text-red-600">{stats.outOfStock}</p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 font-bold text-gray-600 text-xs uppercase tracking-widest">Product</th>
                <th className="px-6 py-5 font-bold text-gray-600 text-xs uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 font-bold text-gray-600 text-xs uppercase tracking-widest">Pricing</th>
                <th className="px-6 py-5 font-bold text-gray-600 text-xs uppercase tracking-widest">Stock</th>
                {admin?.role === 'admin' && <th className="px-6 py-5 font-bold text-gray-600 text-xs uppercase tracking-widest">Vendor</th>}
                <th className="px-6 py-5 font-bold text-gray-600 text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(filteredItems || []).map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                        {item.image && <img src={`http://localhost:5001${item.image}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-tighter">
                      {item.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 flex items-center">
                        <IndianRupee size={12} className="mr-0.5" />{item.price}
                      </span>
                      {showCost && (
                        <span className="text-[10px] text-red-400 font-bold flex items-center">
                          COST: <IndianRupee size={10} className="ml-1 mr-0.5" />{item.cost || 0}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-bold ${(item.stock || 0) < 10 ? 'text-red-500' : 'text-green-600'}`}>
                      {item.stock || 0} in units
                    </div>
                  </td>
                  {admin?.role === 'admin' && (
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {item.vendor?.name || 'System'}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => openEditModal(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => setDeleteConfirmId(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!items || items.length === 0) && (
            <div className="p-20 text-center text-gray-400">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-medium">No products found in your inventory.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl animate-fade-in overflow-y-auto max-h-[95vh]">
            <h2 className="text-3xl font-black mb-8 text-primary">{editingId ? 'Refine Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                    placeholder="Enter item name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>

                {admin?.role === 'admin' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Vendor</label>
                    <select
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                      required
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                    >
                      <option value="">Select Vendor</option>
                      {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock Level</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Selling Price (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="w-full px-12 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cost Price (₹) <span className="text-[10px] text-accent uppercase ml-1">Private</span></label>
                  <div className="relative">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="w-full px-12 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                  placeholder="Describe your product..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                <div className="relative group overflow-hidden bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-accent transition-colors p-8 text-center">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        required={!editingId}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-1">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-300 group-hover:text-accent transition-colors" />
                        <div className="flex text-sm text-gray-600">
                            <span className="relative cursor-pointer rounded-md font-bold text-accent">Upload a file</span>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all">Discard</button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-10 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-accent/30 hover:scale-105 active:scale-95 transition-all disabled:bg-gray-300"
                >
                  {loading ? 'Processing...' : (editingId ? 'Update Item' : 'Release Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Custom Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl animate-fade-in border border-gray-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="text-red-500 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black mb-3 text-primary text-center">Final Removal?</h2>
            <p className="text-gray-500 text-center mb-8 font-medium">This action will permanently delete the product from Sujal Food Shop inventory. This cannot be undone.</p>
            <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDelete(deleteConfirmId)} 
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
                >
                  Confirm Delete
                </button>
                <button 
                  onClick={() => setDeleteConfirmId(null)} 
                  className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Keep Product
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItems;
