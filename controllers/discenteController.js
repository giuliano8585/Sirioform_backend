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
      patentNumber:patentNumber==null?[]:patentNumber,
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
    const discenti = await Discente.findOne({ _id:id }).populate('userId');
    res.status(200).json(discenti);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei discenti' });
  }
};
const getUserDiscenti = async (req, res) => {
  try {
    const discenti = await Discente.find({ userId: req.user.id }).populate('userId','-password'); 
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

const updateDiscentePatentNumber = async (req, res) => {
  const { id } = req.params;
  const { patentNumber } = req.body;

  try {
    // Check if patentNumber exists in the request
    if (!patentNumber) {
      return res.status(400).json({ message: 'Il numero di patente è richiesto' });
    }

    // Find the discente and push the new patent number to the array
    const updatedDiscente = await Discente.findByIdAndUpdate(
      id,
      { $push: { patentNumber: patentNumber } },
      { new: true, runValidators: true }
    );

    if (!updatedDiscente) {
      return res.status(404).json({ message: 'Discente non trovato' });
    }

    res.status(200).json(updatedDiscente);
  } catch (error) {
    console.error("Errore durante l'aggiornamento del numero di patente:", error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del numero di patente' });
  }
};


module.exports = { createDiscente, getAllDiscenti,getUserDiscenti,updateDiscente,getUserDiscentiById ,updateDiscentePatentNumber};  // Esporta entrambe le funzioni
