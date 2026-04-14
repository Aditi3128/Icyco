const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Regular', 'Gelato', 'Sorbet', 'Frozen Yogurt', 'Vegan'],
    },
    image: { type: String, required: true },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Computes the discounted price rounded to 2 decimal places.
 */
productSchema.virtual('discountedPrice').get(function discountedPrice() {
  const discounted = this.price - (this.price * this.discount) / 100;
  return Number(discounted.toFixed(2));
});

module.exports = mongoose.model('Product', productSchema);
