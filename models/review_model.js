const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
