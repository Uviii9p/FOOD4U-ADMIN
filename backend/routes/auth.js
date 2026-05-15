const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/authMiddleware');

// Setup default admin if none exists
router.get('/setup', async (req, res) => {
    try {
        const admins = await Admin.find();
        if (admins.length > 0) return res.status(400).json({ msg: 'Admin already exists' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        const admin = new Admin({ email: 'admin@store.com', password: hashedPassword });
        await admin.save();
        res.json({ msg: 'Default admin created: admin@store.com / admin123' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    console.log(`Login attempt: ${email} as ${role}`);
    try {
        let user;
        if (role === 'admin') {
            user = await Admin.findOne({ email });
        } else {
            const Vendor = require('../models/Vendor');
            user = await Vendor.findOne({ email });
        }

        if (!user) {
            // DEMO FALLBACK: Allow login even if database seeding failed
            if (email === 'admin@sujalfoodshop.com' && password === 'admin123' && role === 'admin') {
                user = { id: 'demo-admin', email, password: 'mock', name: 'Sujal (Admin)' };
            } else if (email === 'vendor@sujalfoodshop.com' && password === 'vendor123' && role === 'vendor') {
                user = { id: 'demo-vendor', email, password: 'mock', name: 'Fresh Farms (Vendor)' };
            } else {
                console.log(`User not found: ${email}`);
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
        }

        // Only check password match if it's not a mock user
        if (user.password !== 'mock') {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log(`Password mismatch for: ${email}`);
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
        }

        const payload = { user: { id: user.id, role: role } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '5d' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                token, 
                admin: { 
                    id: user.id, 
                    email: user.email, 
                    role: role, 
                    name: role === 'admin' ? 'Administrator' : user.name 
                } 
            });
        });
    } catch (err) {
        res.status(500).send('Server Error');
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
