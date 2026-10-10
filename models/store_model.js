const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    store_name: {
      type: String,
      trim: true,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Store', storeSchema);
