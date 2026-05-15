const mongoose = require('mongoose');
const Category = require('./models/Category');
const Item = require('./models/Item');
const Vendor = require('./models/Vendor');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/retail_store';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data (optional, but good for a fresh start with the new brand)
        await Category.deleteMany({});
        await Item.deleteMany({});
        await Vendor.deleteMany({});

        // Create a system vendor
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('vendor123', salt);
        const systemVendor = new Vendor({
            name: 'Kashi Artisans',
            email: 'vendor@dharmadristi.com',
            password: hashedPassword,
            logo: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
            description: 'Traditional artisans from the heart of Varanasi.',
            website: 'https://dharmadristi.com'
        });
        await systemVendor.save();

        // Create Categories
        const categories = [
            { 
                name: 'Sacred Idols', 
                description: 'Divine sculptures crafted from brass, stone, and wood.',
                image: 'https://images.unsplash.com/photo-1603566023894-3996162a8627?q=80&w=1974&auto=format&fit=crop'
            },
            { 
                name: 'Pooja Essentials', 
                description: 'Everything you need for your daily rituals and ceremonies.',
                image: 'https://images.unsplash.com/photo-1561489413-985b06da5bee?q=80&w=2070&auto=format&fit=crop'
            },
            { 
                name: 'Spiritual Decor', 
                description: 'Elegant artifacts to bring peace and serenity to your home.',
                image: 'https://images.unsplash.com/photo-1518218146747-d576a40a6b82?q=80&w=2072&auto=format&fit=crop'
            }
        ];
        const savedCategories = await Category.insertMany(categories);

        // Create Items
        const items = [
            {
                name: 'Brass Ganesha Statue',
                description: 'Handcrafted antique finish brass Ganesha idol for prosperity and wisdom.',
                price: 2499,
                cost: 1200,
                category: savedCategories[0]._id,
                vendor: systemVendor._id,
                stock: 15,
                image: 'https://images.unsplash.com/photo-1567591974584-f20041c647dd?q=80&w=2070&auto=format&fit=crop'
            },
            {
                name: 'Sandalwood Incense Set',
                description: 'Pure Mysore sandalwood incense sticks for a calming spiritual atmosphere.',
                price: 450,
                cost: 150,
                category: savedCategories[1]._id,
                vendor: systemVendor._id,
                stock: 100,
                image: 'https://images.unsplash.com/photo-1596753139352-78d91c78f99e?q=80&w=2070&auto=format&fit=crop'
            },
            {
                name: 'Copper Kalash',
                description: 'Traditional hammered copper kalash for sacred water storage and pooja.',
                price: 899,
                cost: 400,
                category: savedCategories[1]._id,
                vendor: systemVendor._id,
                stock: 25,
                image: 'https://images.unsplash.com/photo-1621360841013-c7683c659ec6?q=80&w=2076&auto=format&fit=crop'
            },
            {
                name: 'Terracotta Diya Set',
                description: 'Hand-painted terracotta diyas (pack of 6) for festivals and daily prayer.',
                price: 299,
                cost: 80,
                category: savedCategories[2]._id,
                vendor: systemVendor._id,
                stock: 50,
                image: 'https://images.unsplash.com/photo-1571243156023-108a735e8081?q=80&w=2070&auto=format&fit=crop'
            }
        ];
        await Item.insertMany(items);

        console.log('Dharma Dristi seed data created successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
}

seed();
