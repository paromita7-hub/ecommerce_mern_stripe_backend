// middleware/authMiddleware.js
// ---------------------------------------------
// Middleware to protect routes that require
// a logged-in user. It validates the JWT token.
// ---------------------------------------------

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  try {
    // Expect token in Authorization header as: "Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (minus password) to request object
      req.user = await User.findById(decoded.id).select("-password");

      return next();
    }

    // If no token found
    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = protect;
