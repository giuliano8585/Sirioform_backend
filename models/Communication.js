const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Communication', communicationSchema);
