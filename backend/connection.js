const mongoose = require('mongoose');

// async function connectDB(url) {
//     return mongoose.connect(url);
// }

async function connectDB(url) {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1); // Stop server if DB connection fails
    }
}

module.exports = { connectDB };