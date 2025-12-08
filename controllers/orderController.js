// controllers/orderController.js
// ---------------------------------------------
// Handles order creation using Stripe, listing
// orders for the logged-in user, and refund
// request updates. Webhook handles the actual
// 'refunded' status.
// ---------------------------------------------

const Stripe = require("stripe");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/orders/create-checkout-session
// Create a Stripe PaymentIntent and an order with status "pending"
exports.createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body; // items: [{ productId, quantity }]
    const userId = req.user._id;

    // Fetch product info and compute total amount
    const productIds = items.map((it) => it.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    let totalAmount = 0;
    const orderItems = [];

    items.forEach((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId
      );
      if (!product) return;

      const quantity = item.quantity || 1;

      // Assuming product.price is already in smallest currency unit
      totalAmount += product.price * quantity;

      orderItems.push({
        product: product._id,
        quantity
      });
    });

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        userId: userId.toString()
      }
    });

    // Create order in DB with status "pending"
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      stripePaymentIntentId: paymentIntent.id,
      status: "pending"
    });

    // Return clientSecret to frontend to confirm payment
    return res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id
    });
  } catch (error) {
    console.error("Create checkout session error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/orders/my-orders
// Get orders for logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/orders/request-refund/:orderId
// User requests refund for a specific order
exports.requestRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    // Find the order, ensure it belongs to current user and is paid
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "paid") {
      return res
        .status(400)
        .json({ message: "Only paid orders can request refund" });
    }

    // Mark order as "refund_requested" and store reason
    order.status = "refund_requested";
    order.refundReason = reason || "No reason provided";
    await order.save();

    // In a real system, you might call Stripe's refunds API here
    // or have an admin dashboard. For demo, we assume Stripe
    // refund is triggered separately, and webhook will mark as refunded.

    return res.json({ message: "Refund requested", order });
  } catch (error) {
    console.error("Request refund error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
