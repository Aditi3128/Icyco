const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/Product');

/**
 * Builds a MongoDB filter object based on product query params.
 */
const buildProductFilter = ({ category, search }) => {
  const filter = {};

  if (category) {
    filter.category = new RegExp(`^${category}$`, 'i');
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  return filter;
};

/**
 * Builds a sort object from the API sort query param.
 */
const buildSortOption = (sort) => {
  if (sort === 'price_asc') return { price: 1 };
  if (sort === 'price_desc') return { price: -1 };
  if (sort === 'rating') return { rating: -1 };
  return { createdAt: -1 };
};

/**
 * Gets all products with optional filtering, sorting, and pagination.
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 8, 1);
  const filter = buildProductFilter(req.query);
  const sortOption = buildSortOption(req.query.sort);

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: total === 0 ? 0 : Math.ceil(total / limit),
    data: products,
  });
});

/**
 * Gets a single product by its MongoDB id.
 */
const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(404);
    throw new Error('Product not found');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({ success: true, data: product });
});

/**
 * Searches products by name and description using a case-insensitive regex.
 */
const searchProducts = asyncHandler(async (req, res) => {
  const query = (req.query.q || '').trim();
  const filter = query
    ? {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      }
    : {};

  const products = await Product.find(filter).sort({ rating: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

module.exports = { getAllProducts, getProductById, searchProducts };
