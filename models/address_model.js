const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);
