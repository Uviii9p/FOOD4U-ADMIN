import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';
import { extractImageUrl } from '../../utils/urlHelper';

const ManageHome = () => {
  const [content, setContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    featuresTitle: '',
    features: [
      { title: '', desc: '', icon: 'ShoppingBag' },
      { title: '', desc: '', icon: 'ShieldCheck' },
      { title: '', desc: '', icon: 'Clock' }
    ],
    ctaTitle: '',
    ctaSubtitle: ''
  });
  const [settings, setSettings] = useState({
    phone: '',
    address: '',
    mapsLink: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [homeRes, settingsRes] = await Promise.all([
        api.get('/home'),
        api.get('/settings')
      ]);
      
      if (homeRes.data) {
        setContent({
          heroTitle: homeRes.data.heroTitle || '',
          heroSubtitle: homeRes.data.heroSubtitle || '',
          heroImage: homeRes.data.heroImage || '',
          featuresTitle: homeRes.data.featuresTitle || 'Why Choose Us',
          features: homeRes.data.features || [
            { title: '', desc: '', icon: 'ShoppingBag' },
            { title: '', desc: '', icon: 'ShieldCheck' },
            { title: '', desc: '', icon: 'Clock' }
          ],
          ctaTitle: homeRes.data.ctaTitle || '',
          ctaSubtitle: homeRes.data.ctaSubtitle || ''
        });
      }
      
      if (settingsRes.data) {
        setSettings({
          phone: settingsRes.data.phone || '',
          address: settingsRes.data.address || '',
          mapsLink: settingsRes.data.mapsLink || '',
          email: settingsRes.data.email || ''
        });
      }
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Promise.all([
        api.put('/home', content),
        api.put('/settings', settings)
      ]);
      toast.success('All details updated successfully');
    } catch (err) {
      toast.error('Failed to update details');
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Auto-extract real URL if it's an image field
    if (name === 'heroImage' && value.includes('google.com/imgres')) {
      const extracted = extractImageUrl(value);
      if (extracted !== value) {
        value = extracted;
        toast.info('Direct image link extracted from Google search!');
      }
    }
    
    setContent({ ...content, [name]: value });
  };

  const handleSettingsChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...content.features];
    newFeatures[index][field] = value;
    setContent({ ...content, features: newFeatures });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-8 text-primary">Customize Home Page</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-primary flex items-center">
            <span className="bg-accent/10 text-accent p-2 rounded-lg mr-2 text-sm">1</span>
            Hero Content
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
              <input
                type="text"
                name="heroTitle"
                value={content.heroTitle}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description Subtitle</label>
              <textarea
                name="heroSubtitle"
                value={content.heroSubtitle}
                onChange={handleChange}
                rows="2"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
              <input
                type="text"
                name="heroImage"
                value={content.heroImage}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-primary flex items-center">
            <span className="bg-accent/10 text-accent p-2 rounded-lg mr-2 text-sm">2</span>
            Features Section
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
            <input
              type="text"
              name="featuresTitle"
              value={content.featuresTitle}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.features.map((feature, index) => (
              <div key={index} className="p-4 border border-dashed rounded-xl bg-gray-50/50">
                <h3 className="font-bold mb-3 text-xs text-accent uppercase tracking-wider">Feature Block {index + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                    <textarea
                      value={feature.desc}
                      onChange={(e) => handleFeatureChange(index, 'desc', e.target.value)}
                      rows="3"
                      className="w-full p-2 text-sm border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-primary flex items-center">
            <span className="bg-accent/10 text-accent p-2 rounded-lg mr-2 text-sm">3</span>
            Quick Store Details (Shown on Home/Footer)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleSettingsChange}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleSettingsChange}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleSettingsChange}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link (for "Get Directions" button)</label>
              <input
                type="text"
                name="mapsLink"
                value={settings.mapsLink}
                onChange={handleSettingsChange}
                placeholder="https://goo.gl/maps/..."
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-primary flex items-center">
            <span className="bg-accent/10 text-accent p-2 rounded-lg mr-2 text-sm">4</span>
            Bottom CTA Section
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Heading</label>
              <input
                type="text"
                name="ctaTitle"
                value={content.ctaTitle}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Description</label>
              <textarea
                name="ctaSubtitle"
                value={content.ctaSubtitle}
                onChange={handleChange}
                rows="2"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="flex items-center px-12 py-4 bg-accent text-white rounded-xl font-bold shadow-xl shadow-accent/20 hover:bg-blue-600 transition-all transform hover:scale-105 active:scale-95"
          >
            <Save size={20} className="mr-2" />
            Save All Home Page Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageHome;
