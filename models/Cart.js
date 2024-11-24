const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Kit' },
      quantity: { type: Number, default: 6 },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
