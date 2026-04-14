/*
 ICE CREAM API - ENDPOINTS REFERENCE
 ─────────────────────────────────────────────────────
 PRODUCTS
   GET  /api/products                     Get all products
   GET  /api/products?category=Gelato     Filter by category
   GET  /api/products?search=mango        Search by name
   GET  /api/products?sort=price_asc      Sort low to high
   GET  /api/products?sort=price_desc     Sort high to low
   GET  /api/products?page=1&limit=8      Pagination
   GET  /api/products/search?q=vanilla    Full search
   GET  /api/products/:id                 Single product

 USERS
   POST /api/users/register               Register user
   POST /api/users/login                  Login user
   GET  /api/users/profile                Get profile (auth)

 CART (all require Authorization: Bearer <token>)
   GET    /api/cart                       Get user cart
   POST   /api/cart                       Add item to cart
   PUT    /api/cart/:productId            Update quantity
   DELETE /api/cart/:productId            Remove item
   DELETE /api/cart                       Clear entire cart
*/

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const cateringRoutes = require('./routes/cateringRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Ice Cream API is running...' });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/catering', cateringRoutes);
app.use('/api/ai-chat', aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
