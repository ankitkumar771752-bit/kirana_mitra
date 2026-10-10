const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    vehicle_number: {
      type: String,
      default: '',
    },
    is_available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
