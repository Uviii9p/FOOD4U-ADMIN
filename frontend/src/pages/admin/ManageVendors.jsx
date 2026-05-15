import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Globe, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', website: '', email: '', password: '', logo: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendors');
      setVendors(res.data);
    } catch (err) {
      toast.error('Failed to fetch vendors');
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.logo) return toast.error("Vendor logo is required");
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('website', formData.website);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('logo', formData.logo);

    try {
      await api.post('/vendors', data);
      toast.success('Vendor added successfully');
      setIsModalOpen(false);
      setFormData({ name: '', description: '', website: '', email: '', password: '', logo: null });
      fetchVendors();
    } catch (err) {
      toast.error('Error adding vendor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this vendor?')) {
      try {
        await api.delete(`/vendors/${id}`);
        toast.success('Vendor removed');
        fetchVendors();
      } catch (err) {
        toast.error('Error removing vendor');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage Vendors</h1>
          <p className="text-gray-500 mt-1">Manage the brands and suppliers featured on your site.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent text-white px-6 py-3 rounded-xl flex items-center hover:bg-blue-600 shadow-lg shadow-accent/20 transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" /> Add New Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <div key={vendor._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
            <button 
              onClick={() => handleDelete(vendor._id)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                <img src={`http://localhost:5001${vendor.logo}`} alt={vendor.name} className="w-full h-full object-contain p-2" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary">{vendor.name}</h3>
                <p className="text-xs text-gray-400 truncate max-w-[150px]">{vendor.email}</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
              {vendor.description || "No description provided."}
            </p>
            
            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
              {vendor.website ? (
                <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-accent text-xs flex items-center hover:underline font-semibold">
                  <Globe size={14} className="mr-1" /> WEBSITE
                </a>
              ) : <span></span>}
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full uppercase font-bold tracking-tighter">Authorized Partner</span>
            </div>
          </div>
        ))}
        
        {vendors.length === 0 && (
          <div className="col-span-full bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No vendors added yet. Start by adding your first partner!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6 text-primary">Add New Vendor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Samsung"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-accent transition-all"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50 mt-4">
                <div className="col-span-2">
                  <p className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Login Credentials</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Login Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="vendor@email.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-accent transition-all"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Set Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-50 mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-accent transition-all"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor Logo</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium">Cancel</button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-2.5 bg-accent text-white rounded-xl font-bold hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {loading ? 'Adding...' : 'Create Vendor Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVendors;
