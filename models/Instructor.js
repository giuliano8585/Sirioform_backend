// models/Instructor.js
const mongoose = require('mongoose');

const InstructorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fiscalCode: { type: String, required: true },
  brevetNumber: { type: String, required: true },
  qualifications: { type: String, required: true },
  piva: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  sanitarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sanitario' }] // Aggiungi questo campo
});

module.exports = mongoose.model('Instructor', InstructorSchema);
