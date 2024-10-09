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
  patentNumber: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Discente', discenteSchema);
