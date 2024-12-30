const Communication = require('../models/Communication');

const createCommunication = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.files && req.files.image && req.files.image[0] ? `/uploads/${req.files.image[0].filename}` : '';
    const communication = new Communication({ title, description, imageUrl });
    await communication.save();

    res
      .status(201)
      .json({ message: 'Communication created successfully', communication });
  } catch (error) {
    res.status(500).json({ message: 'Error creating communication', error });
  }
};

const getCommunications = async (req, res) => {
  try {
    const communications = await Communication.find();
    res.status(200).json(communications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching communications', error });
  }
};

const updateCommunication = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const imageUrl = req.files && req.files.image && req.files.image[0] ? `/uploads/${req.files.image[0].filename}` : null;

    const updateData = { title, description };
    if (imageUrl) updateData.imageUrl = imageUrl;

    const communication = await Communication.findByIdAndUpdate(id, updateData, { new: true });

    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }

    res.status(200).json({ message: 'Communication updated successfully', communication });
  } catch (error) {
    res.status(500).json({ message: 'Error updating communication', error });
  }
};

const deleteCommunication = async (req, res) => {
  try {
    const { id } = req.params;
    const communication = await Communication.findByIdAndDelete(id);

    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }

    res.status(200).json({ message: 'Communication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting communication', error });
  }
};


module.exports = { createCommunication, getCommunications ,updateCommunication,deleteCommunication};
