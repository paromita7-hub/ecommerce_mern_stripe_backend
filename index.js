// server.js
// ---------------------------------------------
// Entry point of the backend server.
// Sets up Express, connects to MongoDB,
// configures middleware, and mounts routes.
// Also configures Stripe webhook raw body.
// ---------------------------------------------

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const connectDB = require("./config/db");

// Import route files
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS: allow frontend URL
app.use(
  cors({
    origin: "https://fancy-croissant-691625.netlify.app",
    credentials: true
  })
);

// Stripe webhooks require the raw body.
// So for that specific route, we handle before JSON parsing.
app.use(
  "/api/webhook/stripe",
  bodyParser.raw({ type: "application/json" }),
  (req, res, next) => {
    // Save raw body buffer for Stripe signature verification
    req.rawBody = req.body;
    next();
  }
);

// For all other routes, parse JSON normally
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/webhook", webhookRoutes);

// Simple health check route
app.get("/", (req, res) => {
  res.send("E-commerce backend is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
