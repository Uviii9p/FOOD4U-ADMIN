const mongoose = require('mongoose');
const Item = require('./models/Item');
const Category = require('./models/Category');
const Vendor = require('./models/Vendor');

async function check() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/sujalfoodshop_demo'); // Wait, the server uses in-memory.
        // This script won't work for in-memory unless I run it in the same process.
        console.log("Can't check in-memory DB from separate process.");
    } catch (err) {
        console.error(err);
    }
}
check();
