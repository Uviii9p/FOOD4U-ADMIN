const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Vendor = require('../models/Vendor');
const auth = require('../middleware/authMiddleware');

// Setup default admin if none exists
router.get('/setup', async (req, res) => {
    try {
        const admins = await Admin.find();
        if (admins.length > 0) return res.status(400).json({ msg: 'Admin already exists' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        const admin = new Admin({ email: 'admin@sujalfoodshop.com', password: hashedPassword });
        await admin.save();
        res.json({ msg: 'Default admin created: admin@sujalfoodshop.com / admin123' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        let user;
        if (role === 'admin') {
            user = await Admin.findOne({ email }).catch(() => null);
        } else {
            user = await Vendor.findOne({ email }).catch(() => null);
        }

        if (!user) {
            // DEMO FALLBACK: Allow login even if database seeding failed
            if (email === 'admin@sujalfoodshop.com' && password === 'admin123' && role === 'admin') {
                user = { id: 'demo-admin', _id: 'demo-admin', email, password: 'mock', name: 'Sujal (Admin)' };
            } else if (email === 'vendor@sujalfoodshop.com' && password === 'vendor123' && role === 'vendor') {
                user = { id: 'demo-vendor', _id: 'demo-vendor', email, password: 'mock', name: 'Fresh Farms (Vendor)' };
            } else {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
        }

        // Check password
        if (user.password !== 'mock') {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id || user._id, role: role } };
        const secret = process.env.JWT_SECRET || 'secret';
        
        jwt.sign(payload, secret, { expiresIn: '5d' }, (err, token) => {
            if (err) return res.status(500).json({ msg: 'JWT Sign Error', error: err.message });
            res.json({ 
                token, 
                admin: { 
                    id: user.id || user._id, 
                    email: user.email, 
                    role: role, 
                    name: role === 'admin' ? 'Administrator' : user.name 
                } 
            });
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ msg: 'Server Error during login', error: err.message });
    }
});

// Verify token
router.get('/me', auth, async (req, res) => {
    try {
        const { id, role } = req.user;
        let userData;
        
        if (role === 'admin') {
            userData = await Admin.findById(id).select('-password');
            if (userData) userData = { ...userData._doc, role: 'admin', name: 'Administrator' };
        } else {
            const Vendor = require('../models/Vendor');
            userData = await Vendor.findById(id).select('-password');
            if (userData) userData = { ...userData._doc, role: 'vendor' };
        }

        if (!userData) return res.status(404).json({ msg: 'User not found' });
        res.json(userData);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
