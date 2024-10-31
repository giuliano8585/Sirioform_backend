const Discente = require('../models/Discente');
const Order = require('../models/Order');

// Funzione per creare un nuovo discente
const createDiscente = async (req, res) => {
  const {
    nome,
    cognome,
    codiceFiscale,
    indirizzo,
    città,
    regione,
    email,
    telefono,
    patentNumber,
  } = req.body;
  console.log('user id', req?.user);
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
      patentNumber: patentNumber == null ? [] : patentNumber,
      userId: req.user.id,
    });
    await newDiscente.save();
    res.status(201).json(newDiscente);
  } catch (error) {
    console.log('error 500', error);
    res
      .status(500)
      .json({ message: 'Errore durante la creazione del discente' });
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
    res
      .status(500)
      .json({ message: 'Errore durante aggiornamento del discente' });
  }
};

// Funzione per ottenere tutti i discenti
const getUserDiscentiById = async (req, res) => {
  const { id } = req.params;
  try {
    const discenti = await Discente.findOne({ _id: id }).populate('userId');
    res.status(200).json(discenti);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Errore durante il recupero dei discenti' });
  }
};
const getUserDiscenti = async (req, res) => {
  try {
    const discenti = await Discente.find({ userId: req.user.id }).populate(
      'userId',
      '-password'
    );
    res.status(200).json(discenti);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Errore durante il recupero dei discenti' });
  }
};
const getAllDiscenti = async (req, res) => {
  try {
    const discenti = await Discente.find().populate('userId');
    console.log('discenti: ', discenti);
    res.status(200).json(discenti);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Errore durante il recupero dei discenti' });
  }
};

const updateDiscentePatentNumber = async (req, res) => {
  const { id } = req.params;
  const { patentNumber } = req.body;

  try {
    // Check if patentNumber exists in the request
    if (!patentNumber) {
      return res
        .status(400)
        .json({ message: 'Il numero di patente è richiesto' });
    }

    // Find the kit type based on the given patent number
    const order = await Order.findOne({
      'orderItems.progressiveNumbers': patentNumber,
    }).populate('orderItems.productId');

    if (!order) {
      return res
        .status(404)
        .json({ message: 'Kit non trovato per il numero di patente fornito' });
    }
    console.log('order: ', order);
    console.log('orderItems: ', order?.orderItems);

    // Extract the type of kit associated with the given patent number
    const kitType = order.orderItems.find((item) =>
      item.progressiveNumbers.includes(patentNumber)
    ).productId.type;

    console.log('kitType: ', kitType);
    // Fetch the discente and check if they already have a patent number for the same type
    const discente = await Discente.findById(id);
    if (!discente) {
      return res.status(404).json({ message: 'Discente non trovato' });
    }
    console.log('discente: ', discente);

    const hasMatchingPatentNumber = order.orderItems.some((orderItem) => {
      return orderItem.progressiveNumbers.some((number) =>
        discente.patentNumber.includes(number)
      );
    });
    console.log('hasMatchingPatentNumber: ', hasMatchingPatentNumber);

    if (hasMatchingPatentNumber) {
      return res.status(400).json({
        message: `Il discente ha già un numero di patente per il tipo di kit ${kitType}`,
      });
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
    console.error(
      "Errore durante l'aggiornamento del numero di patente:",
      error
    );
    res.status(500).json({
      message: "Errore durante l'aggiornamento del numero di patente",
    });
  }
};

module.exports = {
  createDiscente,
  getAllDiscenti,
  getUserDiscenti,
  updateDiscente,
  getUserDiscentiById,
  updateDiscentePatentNumber,
}; // Esporta entrambe le funzioni
