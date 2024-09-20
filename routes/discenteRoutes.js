const express = require('express');
const { createDiscente, getAllDiscenti } = require('../controllers/discenteController'); 
const auth = require('../middleware/auth');
const router = express.Router();

// create Discente api
router.post('/', auth, createDiscente);

// Rotta GET per ottenere tutti i discenti
router.get('/', auth, getAllDiscenti);  

module.exports = router;
