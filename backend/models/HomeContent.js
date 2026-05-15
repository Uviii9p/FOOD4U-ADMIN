const mongoose = require('mongoose');

const HomeContentSchema = new mongoose.Schema({
    heroTitle: { type: String, default: 'Freshness Delivered' },
    heroSubtitle: { type: String, default: 'Your neighborhood destination for the freshest produce, quality meats, and daily essentials.' },
    heroImage: { type: String, default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop' },
    featuresTitle: { type: String, default: 'Why Sujal Food Shop?' },
    features: [
        { 
            title: { type: String, default: 'Fresh Daily' }, 
            desc: { type: String, default: 'Handpicked fresh produce delivered every single morning.' },
            icon: { type: String, default: 'ShoppingBag' }
        },
        { 
            title: { type: String, default: 'Quality Assured' }, 
            desc: { type: String, default: 'Strict quality checks to ensure you get only the best for your family.' },
            icon: { type: String, default: 'ShieldCheck' }
        },
        { 
            title: { type: String, default: 'Open 24/7' }, 
            desc: { type: String, default: 'Convenient shopping at any time of the day or night.' },
            icon: { type: String, default: 'Clock' }
        }
    ],
    ctaTitle: { type: String, default: 'Start Your Fresh Journey' },
    ctaSubtitle: { type: String, default: 'Visit us today and experience the difference of quality and care.' }
}, { timestamps: true });

module.exports = mongoose.model('HomeContent', HomeContentSchema);
