const mongoose = require('mongoose');
require('dotenv').config();
const HomeContent = require('./models/HomeContent');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/retail_store';

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        const content = await HomeContent.findOne();
        console.log(JSON.stringify(content, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
