// routes/orderRoutes.js
// ---------------------------------------------
// Routes to create Stripe checkout session,
// list user orders, and request refund.
// ---------------------------------------------

const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createCheckoutSession,
  getMyOrders,
  requestRefund
} = require("../controllers/orderController");

const router = express.Router();

// POST /api/orders/create-checkout-session
router.post("/create-checkout-session", protect, createCheckoutSession);

// GET /api/orders/my-orders
router.get("/my-orders", protect, getMyOrders);

// POST /api/orders/request-refund/:orderId
router.post("/request-refund/:orderId", protect, requestRefund);

module.exports = router;
