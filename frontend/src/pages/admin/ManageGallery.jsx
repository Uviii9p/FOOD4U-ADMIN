import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await api.get('/gallery');
    setImages(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Please select an image");
    
    const data = new FormData();
    data.append('image', imageFile);

    try {
      await api.post('/gallery', data);
      toast.success('Image uploaded');
      setIsModalOpen(false);
      setImageFile(null);
      fetchImages();
    } catch (err) {
      toast.error('Error uploading image');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await api.delete(`/gallery/${id}`);
        toast.success('Image deleted');
        fetchImages();
      } catch (err) {
        toast.error('Error deleting image');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Gallery</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-1" /> Upload Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img._id} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <img src={`http://localhost:5001${img.imageUrl}`} alt="Gallery" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button onClick={() => handleDelete(img._id)} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Image</label>
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  accept="image/*"
                  required
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-accent text-white rounded hover:bg-blue-600">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
