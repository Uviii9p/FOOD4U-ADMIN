import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import api from '../utils/api';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (err) {
        console.error('Failed to fetch settings for footer', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-primary text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-black mb-4">Sujal<span className="text-accent">FoodShop</span></h3>
            <p className="text-gray-400 mb-4">{settings?.tagline || 'Fresh groceries, quality produce, and daily essentials delivered with love.'}</p>
            <div className="flex space-x-4">
              <a href={settings?.socialLinks?.facebook || "#"} className="text-gray-400 hover:text-white transition-colors">Facebook</a>
              <a href={settings?.socialLinks?.instagram || "#"} className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              <a href={settings?.socialLinks?.twitter || "#"} className="text-gray-400 hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Our Sacred Story</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-white transition-colors">Collections</Link></li>
              <li><Link to="/items" className="text-gray-400 hover:text-white transition-colors">The Shop</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-white transition-colors">Divine Vibe</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-accent shrink-0" />
                <span className="text-gray-400">{settings?.address || 'Varanasi, Uttar Pradesh, India'}</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-accent shrink-0" />
                <span className="text-gray-400">{settings?.phone || '+91 98765 43210'}</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-accent shrink-0" />
                <span className="text-gray-400">{settings?.email || 'blessings@dharmadristi.com'}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {settings?.storeName || 'Dharma Dristi'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
