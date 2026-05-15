import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary">Our Categories</h1>
          <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">Browse through our wide range of high-quality products available in-store.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map(category => (
            <div key={category._id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300">
              <div className="h-64 overflow-hidden">
                <img 
                  src={category.image?.startsWith('http') ? category.image : `http://localhost:5001${category.image}`} 
                  alt={category.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-3">{category.name}</h3>
                <p className="text-gray-600 leading-relaxed">{category.description}</p>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">No categories found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
