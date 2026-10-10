const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    coupon_code: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);
