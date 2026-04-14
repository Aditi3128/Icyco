const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Populates product details for cart items and returns the cart document.
 */
const getPopulatedCart = (userId) =>
  Cart.findOne({ user: userId }).populate('items.product', 'name price image discount');

/**
 * Calculates the total cart value using each product's discounted price.
 */
const calculateCartTotal = (items) =>
  Number(
    items
      .reduce((sum, item) => sum + (item.product?.discountedPrice || 0) * item.quantity, 0)
      .toFixed(2)
    );

/**
 * Normalizes incoming quantity values so cart writes always stay valid.
 */
const normalizeQuantity = (quantity) => {
  const parsed = Number(quantity);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
};

/**
 * Sends a consistent cart response payload.
 */
const sendCartResponse = (res, cart) => {
  const items = cart?.items || [];
  res.status(200).json({ success: true, items, total: calculateCartTotal(items) });
};

/**
 * Gets the authenticated user's cart with populated product data.
 */
const getCart = asyncHandler(async (req, res) => {
  const cart = await getPopulatedCart(req.user._id);

  if (!cart) {
    res.status(200).json({ success: true, items: [], total: 0 });
    return;
  }

  sendCartResponse(res, cart);
});

/**
 * Adds a product to the user's cart or increases quantity if it already exists.
 */
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const qty = normalizeQuantity(quantity);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(404);
    throw new Error('Product not found');
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const item = cart.items.find((entry) => entry.product.toString() === productId);
  if (item) item.quantity += qty;
  else cart.items.push({ product: productId, quantity: qty });

  await cart.save();
  console.log(`Cart updated for user: ${req.user.email}`);
  sendCartResponse(res, await getPopulatedCart(req.user._id));
});

/**
 * Updates a cart item's quantity or removes it if the new quantity is below 1.
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return sendCartResponse(res, { items: [] });

  const quantity = Number(req.body.quantity);
  cart.items = cart.items.filter((item) => {
    if (item.product.toString() !== req.params.productId) return true;
    if (quantity >= 1) item.quantity = quantity;
    return quantity >= 1;
  });

  await cart.save();
  sendCartResponse(res, await getPopulatedCart(req.user._id));
});

/**
 * Removes a single product from the authenticated user's cart.
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return sendCartResponse(res, { items: [] });

  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
  await cart.save();
  sendCartResponse(res, await getPopulatedCart(req.user._id));
});

/**
 * Deletes the entire cart document for the authenticated user.
 */
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  console.log(`Cart cleared for user: ${req.user.email}`);
  res.status(200).json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
