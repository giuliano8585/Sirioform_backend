const express = require('express');
const multer = require('multer');
const {
  createCommunication,
  getCommunications,
  deleteCommunication,
  updateCommunication,
} = require('../controllers/communicationController');
const upload = require('../middleware/upload');
const isAdmin = require('../middleware/isAdmin');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  auth,
  isAdmin,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  createCommunication
);
router.get('/', auth, getCommunications);
router.patch(
  '/:id',
  auth,
  isAdmin,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  updateCommunication
);
router.delete('/:id', auth, isAdmin, deleteCommunication);

module.exports = router;
