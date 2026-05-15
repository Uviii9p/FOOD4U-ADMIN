const express = require('express');
const router = express.Router();
const About = require('../models/About');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/about
// @desc    Get about content
router.get('/', async (req, res) => {
    try {
        let about = await About.findOne();
        if (!about) {
            about = new About();
            await about.save();
        }
        res.json(about);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/about
// @desc    Update about content
router.put('/', auth, async (req, res) => {
    try {
        const about = await About.findOneAndUpdate({}, req.body, { 
            new: true, 
            upsert: true,
            setDefaultsOnInsert: true 
        });
        res.json(about);
    } catch (err) {
        console.error('About update error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;
