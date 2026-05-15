const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login for vendors
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const vendor = await Vendor.findOne({ email });
        if (!vendor) return res.status(400).json({ msg: 'Vendor not found' });

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: vendor._id, role: 'vendor' } };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, vendor: { id: vendor._id, name: vendor.name, role: 'vendor' } });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Setup default vendor (for testing)
router.post('/setup', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('vendor123', salt);
        
        let vendor = await Vendor.findOne({ email: 'vendor@store.com' });
        
        if (vendor) {
            vendor.password = hashedPassword;
            await vendor.save();
            return res.json({ msg: 'Vendor password refreshed: vendor@store.com / vendor123' });
        }

        const testVendor = new Vendor({
            name: 'Premium Supplier Co.',
            email: 'vendor@store.com',
            password: hashedPassword,
            logo: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
            description: 'A trusted partner providing high-quality retail products.',
            website: 'https://example.com'
        });

        await testVendor.save();
        res.json({ msg: 'Vendor created: vendor@store.com / vendor123' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all vendors (Public)
router.get('/', async (req, res) => {
    try {
        const vendors = await Vendor.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(vendors);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add vendor (Admin)
router.post('/', auth, upload.single('logo'), async (req, res) => {
    try {
        const { name, description, website, email, password } = req.body;
        if (!req.file) return res.status(400).json({ msg: 'Logo is required' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newVendor = new Vendor({
            name,
            description,
            website,
            email,
            password: hashedPassword,
            logo: `/uploads/${req.file.filename}`
        });

        const vendor = await newVendor.save();
        res.json(vendor);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete vendor (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Vendor.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Vendor removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
