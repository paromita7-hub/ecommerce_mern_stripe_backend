// models/Order.js
// ---------------------------------------------
// Order model: stores purchased products,
// payment info, status, and refund details.
// ---------------------------------------------

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true, default: 1 }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    stripePaymentIntentId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "refund_requested", "refunded"],
      default: "pending"
    },
    // Optional reason for refund
    refundReason: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
