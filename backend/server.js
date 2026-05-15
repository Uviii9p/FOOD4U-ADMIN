require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/home', require('./routes/homeContent'));
app.use('/api/about', require('./routes/about'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/items', require('./routes/items'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/retail_store';
const connectDB = async () => {
    try {
        // Reduced timeout for faster fallback
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000
        });
        console.log('MongoDB Connected to local database');
    } catch (err) {
        console.log('Local MongoDB not found or timed out. Attempting in-memory MongoDB...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log('In-memory MongoDB Connected!');
        } catch (memErr) {
            console.error('Failed to start in-memory MongoDB:', memErr.message);
            console.log('Running in MOCK MODE (No database connection)');
            // We can still start the server, but DB calls will fail unless we mock them.
        }
        
        // Auto-seed for demonstration
        try {
            const Category = require('./models/Category');
            const Item = require('./models/Item');
            const Vendor = require('./models/Vendor');
            const count = await Category.countDocuments().catch(() => 0);
        if (count === 0) {
            console.log('Seeding Sujal Food Shop data...');
            
            const Gallery = require('./models/Gallery');
            const Admin = require('./models/Admin');
            const bcrypt = require('bcryptjs');

            // Create default admin
            const salt = await bcrypt.genSalt(10);
            const hashedAdminPassword = await bcrypt.hash('admin123', salt);
            const admin = new Admin({
                email: 'admin@sujalfoodshop.com',
                password: hashedAdminPassword
            });
            await admin.save();
            console.log('Default Admin Created: admin@sujalfoodshop.com / admin123');

            // Create a default vendor
            const hashedVendorPassword = await bcrypt.hash('vendor123', salt);
            const vendor = new Vendor({
                name: 'Fresh Farms Ltd.',
                email: 'vendor@sujalfoodshop.com',
                password: hashedVendorPassword,
                logo: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
                description: 'Supplying fresh local produce daily.'
            });
            await vendor.save();
            console.log('Default Vendor Created: vendor@sujalfoodshop.com / vendor123');

            const cats = await Category.insertMany([
                { name: 'Fresh Produce', description: 'Farm-fresh fruits and vegetables.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop' },
                { name: 'Bakery & Dairy', description: 'Freshly baked bread and pure dairy products.', image: 'https://images.unsplash.com/photo-1550586678-f7225f03c44b?q=80&w=1974&auto=format&fit=crop' }
            ]);
            await Item.insertMany([
                { name: 'Organic Red Apples', description: 'Crispy and sweet organic red apples from the orchard.', price: 120, category: cats[0]._id, vendor: vendor._id, stock: 50, image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=2070&auto=format&fit=crop' },
                { name: 'Whole Wheat Bread', description: 'Freshly baked nutritious whole wheat bread.', price: 45, category: cats[1]._id, vendor: vendor._id, stock: 30, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop' },
                { name: 'Farm Fresh Milk', description: 'Pure, pasteurized farm fresh milk (1 Liter).', price: 65, category: cats[1]._id, vendor: vendor._id, stock: 100, image: 'https://images.unsplash.com/photo-1550586678-f7225f03c44b?q=80&w=1974&auto=format&fit=crop' }
            ]);

            await Gallery.insertMany([
                { imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2069&auto=format&fit=crop', caption: 'Our Shop Front' },
                { imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop', caption: 'Fresh Produce Aisle' },
                { imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=1974&auto=format&fit=crop', caption: 'Quality Selection' }
            ]);
            console.log('Seeding complete.');
        }
    }
};
connectDB();

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
