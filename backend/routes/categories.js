const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all categories (Public)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Setup default categories
router.post('/setup', async (req, res) => {
    try {
        const existing = await Category.find();
        if (existing.length > 0) return res.json({ msg: 'Categories already exist' });
        const defaults = [
            { name: 'Fashion', description: 'Clothing and accessories' },
            { name: 'Electronics', description: 'Tech and gadgets' },
            { name: 'Home & Living', description: 'Furniture and decor' }
        ];
        await Category.insertMany(defaults);
        res.json({ msg: 'Default categories created' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add a category (Admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new Category({
            name,
            description,
            image: req.file ? `/uploads/${req.file.filename}` : ''
        });
        const category = await newCategory.save();
        res.json(category);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete a category (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Category removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
