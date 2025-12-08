// models/Product.js
// ---------------------------------------------
// Product model: represents items that are
// displayed on the storefront and can be
// added to cart and purchased.
// ---------------------------------------------

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true }, // in smallest currency unit or normal; we handle in code
    imageUrl: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
