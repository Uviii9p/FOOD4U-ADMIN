import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { ShoppingCart, Search, Filter, IndianRupee, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../utils/urlHelper';

const Items = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        api.get('/items'),
        api.get('/categories')
      ]);
      setItems(itemsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category?._id === selectedCategory || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-[#1a1a1a] text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">Fresh Collection</h1>
          <p className="text-gray-400 text-xl md:text-2xl max-w-2xl font-medium">Quality groceries and fresh produce sourced directly from the best local farms.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            <button 
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${selectedCategory === 'All' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
            >
              All Products
            </button>
            {categories.map(cat => (
              <button 
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${selectedCategory === cat._id ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-[1.5rem] shadow-sm outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-[2.5rem] p-4 h-[400px] animate-pulse shadow-sm">
                <div className="w-full h-56 bg-slate-100 rounded-3xl mb-6"></div>
                <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-3 mx-2"></div>
                <div className="h-4 bg-slate-100 rounded-full w-1/2 mx-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map(item => (
              <div key={item._id} className="group bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-accent/10 transition-all duration-700 border border-transparent hover:border-accent/10 relative">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-5 right-5 px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm border border-gray-100">
                    {item.category?.name}
                  </div>
                </div>

                <div className="px-2 text-center">
                  <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-accent transition-colors">{item.name}</h3>
                  <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed px-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Store Price</span>
                        <span className="text-2xl font-black text-primary flex items-center">
                            <IndianRupee size={18} className="mr-0.5 text-accent" />{item.price}
                        </span>
                    </div>
                    <button 
                        onClick={() => addToCart(item)}
                        className="h-14 px-6 bg-primary group-hover:bg-accent text-white rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl shadow-primary/10 group-hover:shadow-accent/30 font-bold text-sm tracking-widest uppercase"
                    >
                        Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-dashed border-slate-200">
            <Package className="w-20 h-20 mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Products Found</h3>
            <p className="text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
