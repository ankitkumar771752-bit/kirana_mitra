const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      default: null,
    },
    delivery_partner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryPartner',
      default: null,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    payment_method: {
      type: String,
      default: '',
    },
    deliveryAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
