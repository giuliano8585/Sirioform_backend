const mongoose = require('mongoose');

const giornataSchema = new mongoose.Schema({
  dataInizio: { type: Date, required: true },
  dataFine: { type: Date, required: true },
  oraInizio: { type: String, required: true },
  oraFine: { type: String, required: true },
});

const courseSchema = new mongoose.Schema({
  tipologia: { type: String, required: true },
  città: { type: String, required: true },   
  via: { type: String, required: true },
  numeroDiscenti: { type: Number, required: true },
  istruttore: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],   
  direttoreCorso:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sanitario', required: true }], 
  giornate: [giornataSchema], 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
}, {
  timestamps: true 
});

module.exports = mongoose.model('Course', courseSchema);
