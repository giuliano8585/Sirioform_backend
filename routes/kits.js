const express = require('express');
const router = express.Router();
const { createKit, getKits } = require('../controllers/kitsController');

router.post('/create', createKit);
router.get('/', getKits);

module.exports = router;

