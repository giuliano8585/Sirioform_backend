const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { createProduct, getProduct } = require('../controllers/productController');

// Rotta per la creazione di un nuovo prodotto (solo per amministratori)
router.post('/', auth, isAdmin,createProduct);

// Rotta per ottenere tutti i prodotti
router.get('/', getProduct);

module.exports = router;
