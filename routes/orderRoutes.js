const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { getAllOrders, getProdottiAcquistati,createOrderController,getUserOrders } = require('../controllers/orderController'); // Importa getProdottiAcquistati


// Route to create an order
router.post('/', auth,createOrderController );

// Route to get user-specific orders
router.get('/', auth,getUserOrders);

// Route to get all orders (admin only)
router.get('/admin/orders', auth, isAdmin, getAllOrders);

// Nuova rotta per ottenere i prodotti acquistati
router.get('/acquistati', auth, getProdottiAcquistati); 

module.exports = router;
