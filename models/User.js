// models/User.js
// ----------------------------------------
// User model: stores customer details
// and hashed passwords for authentication.
// ----------------------------------------

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Pre-save hook to hash password before saving (robust try/catch)
userSchema.pre("save", async function (next) {
  try {
    // Only hash if the password is modified/new
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    // ensure next is called with error so Mongoose knows something failed
    return typeof next === "function" ? next(err) : Promise.reject(err);
  }
});
// Method to compare entered password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
