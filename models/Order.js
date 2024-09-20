const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      progressiveNumbers: { type: [String], required: true }
    }
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

orderSchema.methods.getOrderDetails = function() {
  console.log("Getting order details for order ID:", this._id); // Log
  return {
    userId: this.userId,
    orderItems: this.orderItems,
    totalPrice: this.totalPrice,
    createdAt: this.createdAt
  };
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
