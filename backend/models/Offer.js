const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    expiryDate: { type: Date },
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);
