import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Save, Info } from 'lucide-react';
import { extractImageUrl } from '../../utils/urlHelper';

const ManageAbout = () => {
  const [about, setAbout] = useState({
    title: '',
    subtitle: '',
    description: '',
    mission: '',
    vision: '',
    image: '',
    experienceYears: 10
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await api.get('/about');
      if (res.data) setAbout(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch About content');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    
    // Auto-extract real URL if it's the image field
    if (name === 'image' && value.includes('google.com/imgres')) {
      const extracted = extractImageUrl(value);
      if (extracted !== value) {
        finalValue = extracted;
        toast.info('Direct image link extracted from Google search!');
      }
    }
    
    setAbout({ ...about, [name]: name === 'experienceYears' ? parseInt(finalValue) || 0 : finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/about', about);
      toast.success('About section updated successfully');
    } catch (err) {
      toast.error('Failed to update About section');
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage About Us</h1>
            <p className="text-gray-500 text-sm">Update the information displayed on your About page</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
        >
          <Save className="w-5 h-5 mr-2" /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">Main Content</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                <input
                  type="text"
                  name="title"
                  value={about.title}
                  onChange={handleChange}
                  placeholder="e.g. About Sujal Food Shop"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={about.subtitle}
                  onChange={handleChange}
                  placeholder="e.g. Quality and Freshness Since Day One"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Description</label>
              <textarea
                name="description"
                value={about.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                placeholder="Describe your story and values..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={about.experienceYears}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={about.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <p className="mt-2 text-xs text-amber-600 font-medium flex items-start gap-1">
                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Use a direct image link (ends in .jpg or .png). Avoid Google Search page links.
                </p>
              </div>
            </div>

            {about.image && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img 
                    src={about.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/800x450?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">Mission & Vision</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Our Mission</label>
              <textarea
                name="mission"
                value={about.mission}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                placeholder="What is your primary goal?"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Our Vision</label>
              <textarea
                name="vision"
                value={about.vision}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                placeholder="Where do you see the business in the future?"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAbout;
