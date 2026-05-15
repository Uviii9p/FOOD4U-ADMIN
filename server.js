const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve frontend files directly
app.use('/uploads', express.static(path.join(__dirname, 'assets', 'uploads')));

const SECRET = 'lumina_super_secret_key_2026';

// Initialize DB structure if not exists
const dbFile = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({
        adminHash: bcrypt.hashSync('admin123', 8), // default password
        gallery: [],
        categories: [
            { id: 'cat-1', name: 'Fresh Groceries', desc: 'Farm-fresh produce' },
            { id: 'cat-2', name: 'Fashion & Apparel', desc: 'Trending clothing' }
        ],
        offers: [],
        messages: [
            { id: 'msg-1', name: 'John Doe', email: 'john@example.com', message: 'Do you have vegan options?', read: false }
        ],
        settings: {
            storeName: 'Lumina Retail',
            address: '123 Premium Retail Boulevard, Metropolis City, 10001',
            phone: '+1 (555) 123-4567',
            email: 'hello@luminaretail.com',
            hours: 'Mon - Sun: 9:00 AM - 10:00 PM',
            tagline: 'Experience Shopping Like Never Before',
            intro: 'Welcome to Lumina Retail, your ultimate destination for high-quality groceries...'
        }
    }, null, 2));
}

const getDb = () => JSON.parse(fs.readFileSync(dbFile, 'utf8'));
const saveDb = (data) => fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'assets', 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only images are allowed'));
    }
});

// Middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        jwt.verify(token, SECRET);
        next();
    } catch (e) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// --- ROUTES --- //

// Auth
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = getDb();
    // Simplified: any email, just check password against hash
    if (bcrypt.compareSync(password, db.adminHash)) {
        const token = jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Dashboard Stats
app.get('/api/stats', authenticate, (req, res) => {
    const db = getDb();
    res.json({
        galleryCount: db.gallery.length,
        categoriesCount: db.categories.length,
        offersCount: db.offers.length,
        unreadMessages: db.messages.filter(m => !m.read).length
    });
});

// Gallery
app.get('/api/gallery', authenticate, (req, res) => res.json(getDb().gallery));
app.post('/api/gallery', authenticate, upload.single('image'), (req, res) => {
    const db = getDb();
    const newImg = { id: 'img-' + Date.now(), url: '/assets/uploads/' + req.file.filename, filename: req.file.filename };
    db.gallery.push(newImg);
    saveDb(db);
    res.json(newImg);
});
app.delete('/api/gallery/:id', authenticate, (req, res) => {
    const db = getDb();
    db.gallery = db.gallery.filter(i => i.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
});

// Categories
app.get('/api/categories', authenticate, (req, res) => res.json(getDb().categories));
app.post('/api/categories', authenticate, (req, res) => {
    const db = getDb();
    const item = { id: 'cat-' + Date.now(), ...req.body };
    db.categories.push(item);
    saveDb(db);
    res.json(item);
});
app.delete('/api/categories/:id', authenticate, (req, res) => {
    const db = getDb();
    db.categories = db.categories.filter(c => c.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
});

// Offers
app.get('/api/offers', authenticate, (req, res) => res.json(getDb().offers));
app.post('/api/offers', authenticate, (req, res) => {
    const db = getDb();
    const item = { id: 'off-' + Date.now(), ...req.body };
    db.offers.push(item);
    saveDb(db);
    res.json(item);
});
app.delete('/api/offers/:id', authenticate, (req, res) => {
    const db = getDb();
    db.offers = db.offers.filter(o => o.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
});

// Messages
app.get('/api/messages', authenticate, (req, res) => res.json(getDb().messages));
app.delete('/api/messages/:id', authenticate, (req, res) => {
    const db = getDb();
    db.messages = db.messages.filter(m => m.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
});

// Settings
app.get('/api/settings', authenticate, (req, res) => res.json(getDb().settings));
app.put('/api/settings', authenticate, (req, res) => {
    const db = getDb();
    db.settings = { ...db.settings, ...req.body };
    saveDb(db);
    res.json(db.settings);
});

// Start
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
