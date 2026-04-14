const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generates a JWT for a user id with a 30 day expiry.
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

/**
 * Registers a new user after validating input and checking email uniqueness.
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });
  console.log(`User registered: ${user.email}`);

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

/**
 * Logs in an existing user and returns profile data with a JWT.
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    },
  });
});

/**
 * Returns the authenticated user's profile without the password field.
 */
const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

module.exports = { registerUser, loginUser, getUserProfile };
