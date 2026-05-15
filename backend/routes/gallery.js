const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all images (Public)
router.get('/', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add an image (Admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No image uploaded' });
        
        const newImage = new Gallery({
            imageUrl: `/uploads/${req.file.filename}`
        });
        const image = await newImage.save();
        res.json(image);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete an image (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Image removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
