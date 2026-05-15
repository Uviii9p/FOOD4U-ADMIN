const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const Vendor = require('./models/Vendor');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/retail_store';

async function fix() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        const hashedVendorPassword = await bcrypt.hash('vendor123', salt);

        // 1. Setup Admin
        await Admin.deleteMany({ email: 'admin@test.com' }); // Remove if exists
        const admin = new Admin({
            email: 'admin@test.com',
            password: hashedPassword
        });
        await admin.save();
        console.log('✅ Admin Created: admin@test.com / admin123');

        // 2. Setup Vendor
        await Vendor.deleteMany({ email: 'vendor@test.com' }); // Remove if exists
        const vendor = new Vendor({
            name: 'Test Vendor',
            email: 'vendor@test.com',
            password: hashedVendorPassword,
            logo: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
            description: 'Test vendor account'
        });
        await vendor.save();
        console.log('✅ Vendor Created: vendor@test.com / vendor123');

        console.log('\nNow try logging in with these credentials.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fix();
