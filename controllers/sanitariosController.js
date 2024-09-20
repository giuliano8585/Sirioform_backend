const Sanitario = require('../models/Sanitario');

exports.createSanitario = async (req, res) => {
  const { firstName, lastName, fiscalCode, address, city, region, email, phone } = req.body;

  try {
    const newSanitario = new Sanitario({
      firstName,
      lastName,
      fiscalCode,
      address,
      city,
      region,
      email,
      phone
    });

    await newSanitario.save();
    res.status(201).json(newSanitario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllSanitarios = async (req, res) => {
  try {
    const sanitarios = await Sanitario.find();
    res.json(sanitarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

