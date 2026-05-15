const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/authMiddleware');

// Submit a message (Public)
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        res.json({ msg: 'Message sent successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all messages (Admin)
router.get('/', auth, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete a message (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Message removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
