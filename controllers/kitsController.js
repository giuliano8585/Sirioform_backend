const Kit = require('../models/Kit');
const path = require('path');
const fs = require('fs');

exports.createKit = async (req, res) => {
  try {
    const { code, type,isRefreshKit, description, cost1, cost2, cost3 } = req.body;
    const newKit = new Kit({
      code,
      type,
      isRefreshKit,
      description,
      cost1,
      cost2,
      cost3,
      profileImage: req.files['profileImage']? req.files['profileImage'][0].path: '',
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

// Update Kit (PATCH)
exports.updateKit = async (req, res) => {
  try {
    const { id } = req.params;
    const kit = await Kit.findById(id);
    if (!kit) {
      return res.status(404).json({ error: 'Kit non trovato.' });
    }
    const fieldsToUpdate = ['code', 'type','isRefreshKit', 'description', 'cost1', 'cost2', 'cost3'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        kit[field] = req.body[field];
      }
    });
    if (req.files && req.files['profileImage'] && req.files['profileImage'][0]) {
      if (kit.profileImage) {
        const oldImagePath = path.join(__dirname, '..', kit.profileImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Errore nella cancellazione dell\'immagine precedente:', err);
          }
        });
      }
      kit.profileImage = req.files['profileImage'][0].path;
    }

    const updatedKit = await kit.save();
    res.json(updatedKit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Kit (DELETE)
exports.deleteKit = async (req, res) => {
  try {
    const { id } = req.params;
    const kit = await Kit.findById(id);
    if (!kit) {
      return res.status(404).json({ error: 'Kit non trovato.' });
    }

    // Delete the image file if it exists
    if (kit.profileImage) {
      const imagePath = path.join(__dirname, '..', kit.profileImage);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Errore nella cancellazione dell\'immagine:', err);
        }
      });
    }

    await Kit.deleteOne({ _id: id });
    res.json({ message: 'Kit eliminato con successo.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Kit by ID (GET)
exports.getKitById = async (req, res) => {
  try {
    const { id } = req.params;
    const kit = await Kit.findById(id);
    if (!kit) {
      return res.status(404).json({ error: 'Kit non trovato.' });
    }
    res.json(kit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};