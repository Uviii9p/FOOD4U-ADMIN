import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { ShoppingBag, ShieldCheck, Clock } from 'lucide-react';

const About = () => {
  const [settings, setSettings] = useState(null);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    api.get('/settings').then(res => setSettings(res.data)).catch(console.error);
    api.get('/about').then(res => setAbout(res.data)).catch(console.error);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full -ml-32 -mb-32 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            {about?.title || `About ${settings?.storeName || 'Sujal Food Shop'}`}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto font-medium">
            {about?.subtitle || settings?.aboutText || "Quality and Freshness Since Day One"}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
              <img 
                src={about?.image || "https://images.unsplash.com/photo-1590159445100-349f99738804?q=80&w=1974&auto=format&fit=crop"} 
                alt="Our Story" 
                className="rounded-[3rem] shadow-2xl w-full h-auto object-cover aspect-[4/5] relative z-10" 
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1590159445100-349f99738804?q=80&w=1974&auto=format&fit=crop";
                }}
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl z-20 hidden md:block">
                <div className="text-4xl font-black text-primary">{about?.experienceYears || 10}+</div>
                <div className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Years Experience</div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-black uppercase tracking-widest mb-6">Our Story</div>
              <h2 className="text-4xl md:text-5xl font-black text-primary mb-8 leading-tight">Bringing Freshness to Your Table</h2>
              <p className="text-gray-600 mb-8 text-xl leading-relaxed">
                {about?.description || "Started with a mission to provide easy access to healthy and fresh food, Sujal Food Shop has become a cornerstone of the community. We believe that good health starts with good food."}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-primary mb-3">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed italic">
                    "{about?.mission || "To serve our customers with integrity and provide the highest quality products at fair prices."}"
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-primary mb-3">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed italic">
                    "{about?.vision || "To be the most trusted local grocery partner for every household in our community."}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100">
              <ShoppingBag className="w-16 h-16 text-accent mx-auto mb-6" />
              <h3 className="text-xl font-bold text-primary mb-4">Always Fresh</h3>
              <p className="text-gray-600">We source our produce daily to ensure the highest level of freshness and nutrition.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100">
              <ShieldCheck className="w-16 h-16 text-accent mx-auto mb-6" />
              <h3 className="text-xl font-bold text-primary mb-4">Pure Quality</h3>
              <p className="text-gray-600">No compromises on quality. We only stock brands and products that meet our high standards.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100">
              <Clock className="w-16 h-16 text-accent mx-auto mb-6" />
              <h3 className="text-xl font-bold text-primary mb-4">Fast Service</h3>
              <p className="text-gray-600">Quick checkouts and friendly service to make your shopping experience smooth and efficient.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
