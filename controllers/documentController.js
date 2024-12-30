const Document = require('../models/Document');

const createDocument = async (req, res) => {
  try {
    const { title, description } = req.body;
    const docUrl = req.files && req.files.doc && req.files.doc[0] ? `/uploads/${req.files.doc[0].filename}` : '';
    const document = new Document({ title, description, docUrl });
    await document.save();

    res
      .status(201)
      .json({ message: 'Document created successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Error creating document', error });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const docUrl = req.files && req.files.doc && req.files.doc[0] ? `/uploads/${req.files.doc[0].filename}` : null;

    const updateData = { title, description };
    if (docUrl) updateData.docUrl = docUrl;

    const document = await Document.findByIdAndUpdate(id, updateData, { new: true });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: 'Document updated successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document', error });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error });
  }
};


module.exports = { createDocument, getDocuments ,updateDocument,deleteDocument};
