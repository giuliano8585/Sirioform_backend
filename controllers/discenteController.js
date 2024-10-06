const Discente = require('../models/Discente');

// Funzione per creare un nuovo discente
const createDiscente = async (req, res) => {
  const { nome, cognome, codiceFiscale, indirizzo, città, regione, email, telefono,patentNumber } = req.body;
  console.log('user id',req?.user)
  try {
    const newDiscente = new Discente({
      nome,
      cognome,
      codiceFiscale,
      indirizzo,
      città,
      regione,
      email,
      telefono,
      patentNumber,
      userId: req.user.id,
    });
    await newDiscente.save();
    res.status(201).json(newDiscente);
  } catch (error) {
    console.log("error 500",error);
    res.status(500).json({ message: 'Errore durante la creazione del discente' });
  }
};

// Funzione per ottenere tutti i discenti
const getUserDiscenti = async (req, res) => {
  try {
    const discenti = await Discente.find({ userId: req.user.id }).populate('userId'); // Trova tutti i discenti associati all'utente
    res.status(200).json(discenti);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei discenti' });
  }
};
const getAllDiscenti = async (req, res) => {
  try {
    const discenti = await Discente.find().populate('userId'); // Trova tutti i discenti associati all'utente
    console.log('discenti: ', discenti);
    res.status(200).json(discenti);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei discenti' });
  }
};

module.exports = { createDiscente, getAllDiscenti,getUserDiscenti };  // Esporta entrambe le funzioni
