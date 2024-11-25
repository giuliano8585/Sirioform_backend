const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Kit' },
      quantity: { type: Number, default: 6 },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
