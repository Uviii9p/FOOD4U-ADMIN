const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');
const auth = require('../middleware/authMiddleware');

// Get home content
router.get('/', async (req, res) => {
    try {
        let content = await HomeContent.findOne();
        if (!content) {
            content = new HomeContent();
            await content.save();
        }
        res.json(content);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update home content
router.put('/', auth, async (req, res) => {
    try {
        let content = await HomeContent.findOne();
        if (!content) {
            content = new HomeContent(req.body);
        } else {
            content = Object.assign(content, req.body);
        }
        await content.save();
        res.json(content);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
