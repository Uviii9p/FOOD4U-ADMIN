const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all items (Public)
router.get('/', async (req, res) => {
    try {
        const items = await Item.find({ isActive: true })
            .populate('category', 'name')
            .populate('vendor', 'name logo')
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get items for the logged-in user (Admin sees all, Vendor sees theirs)
router.get('/managed', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'vendor') {
            query = { vendor: req.user.id };
        }
        const items = await Item.find(query)
            .populate('category', 'name')
            .populate('vendor', 'name')
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add new item
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, cost, category, stock } = req.body;
        console.log('Adding item:', { name, price, category });

        if (!req.file) {
            console.log('Add Item Error: No image provided');
            return res.status(400).json({ msg: 'Image is required' });
        }

        // If it's a vendor, they MUST be the owner. If admin, they might specify a vendor.
        let vendorId = req.user.role === 'vendor' ? req.user.id : req.body.vendor;
        
        // Fallback for Admin if no vendor is specified
        if (!vendorId && req.user.role === 'admin') {
            const Vendor = require('../models/Vendor');
            const firstVendor = await Vendor.findOne();
            if (firstVendor) {
                vendorId = firstVendor._id;
                console.log('Admin added item: Defaulting to first vendor:', firstVendor.name);
            }
        }

        if (!vendorId) {
            console.log('Add Item Error: No vendor ID found');
            return res.status(400).json({ msg: 'Vendor ID is required' });
        }

        const newItem = new Item({
            name,
            description,
            price,
            cost,
            category,
            vendor: vendorId,
            stock,
            image: `/uploads/${req.file.filename}`
        });

        const item = await newItem.save();
        console.log('Item saved successfully:', item._id);
        res.json(item);
    } catch (err) {
        console.error('Add Item Exception:', err);
        res.status(500).send('Server Error: ' + err.message);
    }
});

// Update item
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        let item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        // Check ownership
        if (req.user.role === 'vendor' && item.vendor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const { name, description, price, cost, category, stock, isActive } = req.body;
        
        const updates = { name, description, price, cost, category, stock, isActive };
        if (req.file) updates.image = `/uploads/${req.file.filename}`;

        item = await Item.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
        res.json(item);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        if (req.user.role === 'vendor' && item.vendor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        await Item.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Item removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
