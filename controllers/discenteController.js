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

const updateDiscente = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    const updatedDiscente = await Discente.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true } 
    );

    if (!updatedDiscente) {
      return res.status(404).json({ message: 'Discente non trovato' });
    }

    res.status(200).json(updatedDiscente);
  } catch (error) {
    console.error("Errore durante l'aggiornamento del discente:", error);
    res.status(500).json({ message: 'Errore durante aggiornamento del discente' });
  }
};

// Funzione per ottenere tutti i discenti
const getUserDiscentiById = async (req, res) => {
  const { id } = req.params;
  try {
    const discenti = await Discente.findOne({ _id:id }).populate('userId'); // Trova tutti i discenti associati all'utente
    res.status(200).json(discenti);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei discenti' });
  }
};
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
    const discenti = await Discente.find().populate('userId'); 
    console.log('discenti: ', discenti);
    res.status(200).json(discenti);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei discenti' });
  }
};

module.exports = { createDiscente, getAllDiscenti,getUserDiscenti,updateDiscente,getUserDiscentiById };  // Esporta entrambe le funzioni
