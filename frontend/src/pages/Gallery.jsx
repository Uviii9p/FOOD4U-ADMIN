import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { X } from 'lucide-react';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    api.get('/gallery').then(res => setImages(res.data)).catch(console.error);
  }, []);

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary">Store Gallery</h1>
          <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">Take a virtual tour of our beautifully designed aisles and premium sections.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <div 
              key={image._id} 
              className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
              onClick={() => setSelectedImage(image.imageUrl)}
            >
              <img 
                src={image.imageUrl?.startsWith('http') ? image.imageUrl : `http://localhost:5001${image.imageUrl}`} 
                alt="Store Gallery" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-opacity flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 font-medium tracking-wider">VIEW</span>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">Gallery is currently quiet</p>
                <p className="text-gray-500 mt-2">We'll be adding fresh photos of our shop very soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-8 right-8 text-white hover:text-gray-300" onClick={() => setSelectedImage(null)}>
            <X size={32} />
          </button>
          <img src={`http://localhost:5001${selectedImage}`} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default Gallery;
