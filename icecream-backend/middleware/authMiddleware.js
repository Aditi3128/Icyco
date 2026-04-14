const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protects routes by validating the Bearer token and loading the user.
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let decoded;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const token = authHeader.split(' ')[1];
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }

  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  next();
});

module.exports = { protect };
