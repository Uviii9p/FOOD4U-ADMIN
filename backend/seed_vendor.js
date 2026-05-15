const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Vendor = require('./models/Vendor');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/retail_store';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        
        // Check if exists
        const existing = await Vendor.findOne({ email: 'vendor@store.com' });
        if (existing) {
            console.log('Vendor already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('vendor123', salt);

        const testVendor = new Vendor({
            name: 'Premium Supplier Co.',
            email: 'vendor@store.com',
            password: hashedPassword,
            logo: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
            description: 'A trusted partner providing high-quality retail products for your store.',
            website: 'https://example.com'
        });

        await testVendor.save();
        console.log('Test vendor created: vendor@store.com / vendor123');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
