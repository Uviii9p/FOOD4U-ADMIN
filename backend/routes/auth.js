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
    const { code, role } = req.body;
    const cleanCode = code ? code.toString().trim() : '';
    const cleanRole = role ? role.toLowerCase() : '';

    try {
        let user;
        
        // ADMIN CODE: 123
        if (cleanRole === 'admin' && cleanCode === '123') {
            user = await Admin.findOne({ email: 'admin@sujalfoodshop.com' }).catch(() => null);
            if (!user) {
                user = { id: 'demo-admin', _id: 'demo-admin', email: 'admin@sujalfoodshop.com', name: 'Sujal (Admin)' };
            }
        } 
        // VENDOR CODE: ABC
        else if (cleanRole === 'vendor' && cleanCode === 'ABC') {
            user = await Vendor.findOne({ email: 'vendor@sujalfoodshop.com' }).catch(() => null);
            if (!user) {
                user = { id: 'demo-vendor', _id: 'demo-vendor', email: 'vendor@sujalfoodshop.com', name: 'Fresh Farms (Vendor)' };
            }
        } else {
            console.log(`Verification failed for role: ${cleanRole}, code: ${cleanCode}`);
            return res.status(400).json({ msg: 'Invalid Access Code' });
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
        res.status(500).json({ msg: 'Server Error during verification', error: err.message });
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
