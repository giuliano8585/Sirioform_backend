const Kit = require('../models/Kit');

exports.createKit = async (req, res) => {
  try {
    const { code, type, description, cost1, cost2, cost3 } = req.body;
    const newKit = new Kit({
      code,
      type,
      description,
      cost1,
      cost2,
      cost3
    });
    const savedKit = await newKit.save();
    res.json(savedKit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getKits = async (req, res) => {
  try {
    const kits = await Kit.find();
    res.json(kits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


