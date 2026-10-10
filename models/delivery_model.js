const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);