// routes/webhookRoutes.js
// ---------------------------------------------
// Stripe webhook route. This route must use
// raw body, so we handle it specially in
// server.js.
// ---------------------------------------------

const express = require("express");
const { handleStripeWebhook } = require("../controllers/webhookController");

const router = express.Router();

// POST /api/webhook/stripe
router.post("/stripe", handleStripeWebhook);

module.exports = router;
