// controllers/productController.js
// ---------------------------------------------
// Handles operations related to products.
// For this small app: list all products
// and seed demo products if needed.
// ---------------------------------------------

const Product = require("../models/Product");

// GET /api/products
// Return list of all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: seed some sample products
// POST /api/products/seed
exports.seedProducts = async (req, res) => {
  try {
    // Simple static product data
    const sampleProducts = [
      {
        name: "Sample T-Shirt",
        description: "A comfortable cotton t-shirt",
        price: 1999, // price in rupees (or cents) -> 19.99
        imageUrl: "https://via.placeholder.com/200"
      },
      {
        name: "Sample Hoodie",
        description: "Warm and cozy hoodie",
        price: 3999,
        imageUrl: "https://via.placeholder.com/200"
      }
    ];

    // Remove all products then insert new ones
    await Product.deleteMany({});
    const created = await Product.insertMany(sampleProducts);

    return res.json({ message: "Products seeded", products: created });
  } catch (error) {
    console.error("Seed products error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
