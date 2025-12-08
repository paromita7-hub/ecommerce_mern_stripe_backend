// config/db.js
// ---------------------------------------
// This file handles the MongoDB connection
// using Mongoose. It reads the connection
// string from environment variables.
// ---------------------------------------

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from .env
    await mongoose.connect(process.env.MONGO_URI, {
      // Options are optional with newer Mongoose;
      // keeping minimal for simplicity.
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDB;
