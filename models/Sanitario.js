const mongoose = require('mongoose');

const SanitarioSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fiscalCode: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }
});

module.exports = mongoose.model('Sanitario', SanitarioSchema);

