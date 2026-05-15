const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    storeName: { type: String, default: 'Sujal Food Shop' },
    address: { type: String, default: 'Main Bazaar, City Center' },
    phone: { type: String, default: '+91 98765 43210' },
    email: { type: String, default: 'hello@sujalfoodshop.com' },
    hours: { type: String, default: 'Open 24/7' },
    mapsLink: { type: String, default: '' },
    socialLinks: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' }
    },
    heroTagline: { type: String, default: 'Freshness Delivered to Your Doorstep' },
    aboutText: { type: String, default: 'Your neighborhood destination for the freshest produce, quality meats, and daily essentials.' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
