const User = require('../models/User');

exports.getAllSirioform = async (req, res) => {
  try {
    const sirioform = await User.find({ isActive: true,role:'sirioform' }).populate('sanitarios');
    res.json(sirioform);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};