const express = require('express');
const router = express.Router();
const { createKit, getKits } = require('../controllers/kitsController');
const upload = require('../middleware/upload');

router.post('/create',  upload.fields([{ name: 'profileImage', maxCount: 1 }]), createKit);
router.get('/', getKits);

module.exports = router;

