// routes/productRoutes.js
// ---------------------------------------------
// Routes for reading and seeding products.
// ---------------------------------------------

const express = require("express");
const {
  getProducts,
  seedProducts
} = require("../controllers/productController");

const router = express.Router();

// GET /api/products
router.get("/", getProducts);

// POST /api/products/seed (optional, for development)
router.post("/seed", seedProducts);

module.exports = router;
