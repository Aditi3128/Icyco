require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  { name: 'Vanilla Dream', description: 'A silky vanilla ice cream made with real vanilla bean for a clean, creamy finish. It is simple, nostalgic, and perfect on its own or with warm dessert toppings.', price: 4.99, category: 'Regular', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80', discount: 10, rating: 4.5, numReviews: 18, inStock: true },
  { name: 'Chocolate Fudge', description: 'Rich chocolate ice cream swirled with glossy fudge ribbons in every scoop. It delivers a deep cocoa flavor with a decadent, melt-in-your-mouth texture.', price: 5.99, category: 'Regular', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=1200&q=80', discount: 15, rating: 4.8, numReviews: 24, inStock: true },
  { name: 'Strawberry Classic', description: 'Creamy strawberry ice cream blended with ripe berry flavor and a soft pink finish. Each bite tastes fresh, sweet, and wonderfully balanced.', price: 4.79, category: 'Regular', image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=1200&q=80', discount: 5, rating: 4.4, numReviews: 15, inStock: true },
  { name: 'Pistachio Gelato', description: 'Dense Italian-style gelato infused with roasted pistachio for a nutty, elegant taste. It is smooth, lightly sweet, and incredibly satisfying.', price: 7.49, category: 'Gelato', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=1200&q=80', discount: 12, rating: 4.7, numReviews: 21, inStock: true },
  { name: 'Hazelnut Gelato', description: 'Creamy gelato crafted with toasted hazelnut notes and a luxurious finish. It offers a roasted aroma and a velvety spoonful every time.', price: 7.99, category: 'Gelato', image: 'https://images.unsplash.com/photo-1629385701021-fcd568a74355?auto=format&fit=crop&w=1200&q=80', discount: 8, rating: 4.6, numReviews: 17, inStock: true },
  { name: 'Mango Sorbet Gelato', description: 'A fruit-forward gelato with bright mango flavor and a refreshing tropical profile. It is smooth like gelato while staying light on the palate.', price: 6.99, category: 'Gelato', image: 'https://images.unsplash.com/photo-1633934542430-0905ccb5f050?auto=format&fit=crop&w=1200&q=80', discount: 20, rating: 4.9, numReviews: 28, inStock: true },
  { name: 'Lemon Sorbet', description: 'Zesty lemon sorbet with a crisp citrus punch and icy-smooth texture. It is refreshing, bright, and ideal for hot afternoons.', price: 4.29, category: 'Sorbet', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=1200&q=80', discount: 0, rating: 4.2, numReviews: 11, inStock: true },
  { name: 'Raspberry Sorbet', description: 'A vivid raspberry sorbet bursting with berry tang and natural sweetness. It finishes cleanly and feels light with every spoonful.', price: 4.59, category: 'Sorbet', image: 'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80', discount: 10, rating: 4.3, numReviews: 14, inStock: true },
  { name: 'Blueberry Froyo', description: 'Tangy frozen yogurt blended with blueberry flavor for a creamy yet refreshing treat. It balances fruitiness and yogurt zip in a smooth scoop.', price: 5.49, category: 'Frozen Yogurt', image: 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=1200&q=80', discount: 18, rating: 4.1, numReviews: 12, inStock: true },
  { name: 'Peach Froyo', description: 'Frozen yogurt with juicy peach flavor and a soft, creamy body. It tastes bright, mellow, and perfect for a lighter dessert option.', price: 5.29, category: 'Frozen Yogurt', image: 'https://images.unsplash.com/photo-1563589173312-476d8c36b53b?auto=format&fit=crop&w=1200&q=80', discount: 7, rating: 3.9, numReviews: 9, inStock: true },
  { name: 'Mixed Berry Froyo', description: 'A lively frozen yogurt swirled with mixed berry notes for sweet-tart depth. It offers a creamy texture with a playful fruit finish.', price: 5.79, category: 'Frozen Yogurt', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80', discount: 14, rating: 4.4, numReviews: 16, inStock: true },
  { name: 'Coconut Bliss', description: 'A dairy-free coconut ice cream with a tropical aroma and smooth finish. It is creamy, light, and deeply comforting without feeling heavy.', price: 8.49, category: 'Vegan', image: 'https://images.unsplash.com/photo-1514849302-984523450cf4?auto=format&fit=crop&w=1200&q=80', discount: 25, rating: 4.8, numReviews: 19, inStock: true },
  { name: 'Almond Chocolate', description: 'Vegan chocolate ice cream layered with roasted almond flavor and a rich cocoa base. It is bold, creamy, and satisfying from first bite to last.', price: 8.99, category: 'Vegan', image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=1200&q=80', discount: 15, rating: 4.7, numReviews: 20, inStock: true },
  { name: 'Oat Milk Vanilla', description: 'A gentle oat milk vanilla scoop with a smooth texture and subtle sweetness. It is cozy, balanced, and great for anyone wanting a dairy-free classic.', price: 7.99, category: 'Vegan', image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=1200&q=80', discount: 9, rating: 4.0, numReviews: 13, inStock: true },
  { name: 'Cashew Caramel', description: 'Creamy cashew-based ice cream with ribbons of golden caramel flavor throughout. It delivers a silky mouthfeel with a warm, dessert-like finish.', price: 9.49, category: 'Vegan', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=1200&q=80', discount: 22, rating: 4.9, numReviews: 26, inStock: true },
];

/**
 * Seeds the database with sample ice cream products.
 */
const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
