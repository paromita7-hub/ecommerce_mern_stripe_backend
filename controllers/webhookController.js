// controllers/webhookController.js
// ---------------------------------------------
// Handles Stripe webhook events to update
// order status when payment is successful
// and when a refund is processed.
// ---------------------------------------------

const Stripe = require("stripe");
const Order = require("../models/Order");

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/webhook/stripe
// Stripe webhook endpoint
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // Verify the event using Stripe's webhook secret and raw body
    event = stripe.webhooks.constructEvent(
      req.rawBody, // raw body, not parsed JSON
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event types
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        // Payment successful -> mark order as "paid"
        const paymentIntent = event.data.object;
        const order = await Order.findOne({
          stripePaymentIntentId: paymentIntent.id
        });

        if (order) {
          order.status = "paid";
          await order.save();
          console.log("Order marked as paid:", order._id.toString());
        }
        break;
      }

      case "charge.refunded": {
        // Refund processed -> mark order as "refunded"
        const charge = event.data.object;

        // PaymentIntent id is available on charge
        const paymentIntentId = charge.payment_intent;

        const order = await Order.findOne({
          stripePaymentIntentId: paymentIntentId
        });

        if (order) {
          order.status = "refunded";
          await order.save();
          console.log("Order marked as refunded:", order._id.toString());
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Respond to Stripe that the webhook was received
    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handling error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
