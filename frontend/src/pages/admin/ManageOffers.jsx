import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit2, Trash2, Power } from 'lucide-react';
import { toast } from 'react-toastify';

const ManageOffers = () => {
  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', expiryDate: '', active: true, image: null });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    const res = await api.get('/offers');
    setOffers(res.data);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('expiryDate', formData.expiryDate);
    data.append('active', formData.active);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingId) {
        await api.put(`/offers/${editingId}`, data);
        toast.success('Offer updated');
      } else {
        await api.post('/offers', data);
        toast.success('Offer added');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: '', description: '', expiryDate: '', active: true, image: null });
      fetchOffers();
    } catch (err) {
      toast.error('Error saving offer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await api.delete(`/offers/${id}`);
        toast.success('Offer deleted');
        fetchOffers();
      } catch (err) {
        toast.error('Error deleting offer');
      }
    }
  };

  const openEditModal = (offer) => {
    setEditingId(offer._id);
    setFormData({ 
      title: offer.title, 
      description: offer.description, 
      expiryDate: new Date(offer.expiryDate).toISOString().split('T')[0], 
      active: offer.active,
      image: null 
    });
    setIsModalOpen(true);
  };

  const toggleStatus = async (offer) => {
    try {
      const data = new FormData();
      data.append('title', offer.title);
      data.append('description', offer.description);
      data.append('expiryDate', offer.expiryDate);
      data.append('active', !offer.active);
      await api.put(`/offers/${offer._id}`, data);
      toast.success(`Offer ${!offer.active ? 'activated' : 'deactivated'}`);
      fetchOffers();
    } catch(err) {
      toast.error('Error updating status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Offers</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', description: '', expiryDate: '', active: true, image: null });
            setIsModalOpen(true);
          }}
          className="bg-accent text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-1" /> Add Offer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Image</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Title</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Expiry Date</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img src={`http://localhost:5001${offer.image}`} alt={offer.title} className="w-12 h-12 rounded object-cover" />
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">{offer.title}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(offer.expiryDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${offer.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {offer.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => toggleStatus(offer)} className={`${offer.active ? 'text-green-500' : 'text-gray-400'} hover:text-green-700`} title="Toggle Status">
                    <Power className="w-5 h-5 inline" />
                  </button>
                  <button onClick={() => openEditModal(offer)} className="text-blue-500 hover:text-blue-700">
                    <Edit2 className="w-5 h-5 inline" />
                  </button>
                  <button onClick={() => handleDelete(offer._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Offer' : 'Add Offer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-accent"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-accent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image {editingId && '(Leave blank to keep current)'}</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required={!editingId}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-accent text-white rounded hover:bg-blue-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOffers;
