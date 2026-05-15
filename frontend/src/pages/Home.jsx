import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Clock, MapPin, Search } from 'lucide-react';
import api from '../utils/api';
import { getImageUrl } from '../utils/urlHelper';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [homeContent, setHomeContent] = useState(null);
  const [settings, setSettings] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, offRes, homeRes, setRes, venRes] = await Promise.all([
          api.get('/categories'),
          api.get('/offers'),
          api.get('/home'),
          api.get('/settings'),
          api.get('/vendors')
        ]);
        setCategories(catRes.data.slice(0, 3));
        setOffers(offRes.data.filter(o => o.active).slice(0, 3));
        setHomeContent(homeRes.data);
        setSettings(setRes.data);
        setVendors(venRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={homeContent?.heroImage || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop"} 
            alt="Fresh Produce" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 max-w-5xl px-4">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 animate-fade-in-up leading-tight">
            {homeContent?.heroTitle || "Freshness Delivered"}
          </h1>
          <p className="text-xl md:text-3xl text-gray-100 mb-10 max-w-3xl mx-auto font-medium">
            {homeContent?.heroSubtitle || "Your neighborhood destination for the freshest produce, quality meats, and daily essentials."}
          </p>
          <Link to="/items" className="inline-flex items-center px-10 py-5 bg-accent text-white font-bold rounded-full hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-xl shadow-accent/20">
            Start Shopping <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary">
              {homeContent?.featuresTitle || "Why Sujal Food Shop?"}
            </h2>
            <div className="w-24 h-1.5 bg-accent mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(homeContent?.features || [
              { title: 'Fresh Daily', desc: 'Handpicked fresh produce delivered every single morning.', icon: 'ShoppingBag' },
              { title: 'Quality Assured', desc: 'Strict quality checks to ensure you get only the best for your family.', icon: 'ShieldCheck' },
              { title: 'Open 24/7', desc: 'Convenient shopping at any time of the day or night.', icon: 'Clock' }
            ]).map((feature, idx) => {
              const Icon = { ShoppingBag, ShieldCheck, Clock }[feature.icon] || ShoppingBag;
              return (
                <div key={idx} className="group p-10 text-center bg-gray-50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500 shadow-sm">
                  <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                    <Icon className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary">Shop by Category</h2>
              <div className="w-24 h-1 bg-accent mt-4"></div>
            </div>
            <Link to="/categories" className="text-accent font-semibold hover:underline flex items-center">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => (
              <div key={category._id} className="group relative rounded-2xl overflow-hidden shadow-lg h-80">
                <img src={getImageUrl(category.image)} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-gray-300 line-clamp-2">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendors/Partners Section Removed */}

      {/* Newsletter */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-[3.5rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 max-w-xl text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Stay Fresh with Our Updates</h2>
                    <p className="text-gray-400 text-lg font-medium">Subscribe to our newsletter and get the latest updates on fresh arrivals, special deals, and healthy recipes.</p>
                </div>
                <div className="relative z-10 w-full max-w-md">
                    <form className="flex flex-col sm:flex-row gap-4">
                        <input 
                            type="email" 
                            placeholder="Your email address" 
                            className="flex-grow px-8 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                        />
                        <button className="px-10 py-5 bg-accent text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-accent/20">
                            Join Now
                        </button>
                    </form>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-6 text-center md:text-left">We promise not to spam you. Ever.</p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black text-primary mb-8 tracking-tight">
            {homeContent?.ctaTitle || "Ready to Experience Freshness?"}
          </h2>
          <p className="text-xl text-gray-500 mb-12 font-medium">
            {homeContent?.ctaSubtitle || "Visit our store today and discover a world of quality products."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a 
              href={settings?.mapsLink || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-12 py-5 bg-accent text-white font-black rounded-[2rem] hover:bg-emerald-600 transition-all flex items-center shadow-2xl shadow-accent/30"
            >
              <MapPin className="mr-2" /> Get Directions
            </a>
            <a 
              href={`tel:${settings?.phone || "+919876543210"}`} 
              className="px-12 py-5 bg-white border-4 border-primary text-primary font-black rounded-[2rem] hover:bg-primary hover:text-white transition-all flex items-center shadow-lg shadow-primary/10"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
