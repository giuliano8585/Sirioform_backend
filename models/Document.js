const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  docUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
