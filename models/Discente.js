const mongoose = require('mongoose');

const discenteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  codiceFiscale: { type: String, required: true },
  indirizzo: { type: String, required: true },
  città: { type: String, required: true },
  regione: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Discente', discenteSchema);
