const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER (sign up)
router.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashed });

    return res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // simple JWT token (optional)
    const token = jwt.sign(
      { userId: user._id },
      "secret_icyco_key", // TODO: .env me daal sakti ho aage
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
