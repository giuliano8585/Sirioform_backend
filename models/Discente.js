const mongoose = require('mongoose');

const discenteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  codiceFiscale: { type: String, required: true,unique:true },
  indirizzo: { type: String, required: true },
  città: { type: String, required: true },
  regione: { type: String, required: true },
  email: { type: String, required: true,unique:true },
  telefono: { type: String, required: true },
  patentNumber: { type: [String] },
  dateOfBirth: { type: Date, required: true },
  placeOfBirth: { type: String, required: true },
  province: { type: String, required: true },
  residenceIn: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  zipCode: { type: String, required: true },
  gender: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Discente', discenteSchema);
