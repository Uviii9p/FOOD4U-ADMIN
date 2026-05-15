const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all offers (Public)
router.get('/', async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json(offers);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add an offer (Admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, expiryDate, active } = req.body;
        const newOffer = new Offer({
            title,
            description,
            expiryDate,
            active: active === 'true' || active === true,
            image: req.file ? `/uploads/${req.file.filename}` : ''
        });
        const offer = await newOffer.save();
        res.json(offer);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update an offer (Admin)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, expiryDate, active } = req.body;
        const updates = {
            title,
            description,
            expiryDate,
            active: active === 'true' || active === true
        };

        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
        }

        const offer = await Offer.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        );

        if (!offer) return res.status(404).json({ msg: 'Offer not found' });
        res.json(offer);
    } catch (err) {
        console.error('Update Offer Error:', err);
        res.status(500).send('Server Error');
    }
});

// Delete an offer (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) return res.status(404).json({ msg: 'Offer not found' });
        res.json({ msg: 'Offer removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
