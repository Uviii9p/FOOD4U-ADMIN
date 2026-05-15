const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
    title: { type: String, default: 'About Sujal Food Shop' },
    subtitle: { type: String, default: 'Quality and Freshness Since Day One' },
    description: { type: String, default: 'We are committed to providing our community with the freshest local produce and high-quality grocery essentials. Our journey started with a simple mission: to make healthy, fresh food accessible to everyone.' },
    mission: { type: String, default: 'To serve our customers with integrity and provide the highest quality products at fair prices.' },
    vision: { type: String, default: 'To be the most trusted local grocery partner for every household in our community.' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2069&auto=format&fit=crop' },
    experienceYears: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('About', AboutSchema);
